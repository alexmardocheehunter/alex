const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");

initializeApp();

const brevoApiKey = defineSecret("BREVO_API_KEY");
const chariowApiKey = defineSecret("CHARIOW_API_KEY");
const REGION = "europe-west1";
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";
const CHARIOW_API_URL = process.env.CHARIOW_API_URL || "https://api.chariow.com/v1/products";

function setCors(response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
}

function jsonError(response, status, message) {
  return response.status(status).json({ message });
}

exports.subscribeNewsletter = onRequest(
  { region: REGION, secrets: [brevoApiKey], timeoutSeconds: 15, memory: "256MiB" },
  async (request, response) => {
    setCors(response);
    if (request.method === "OPTIONS") return response.status(204).send("");
    if (request.method !== "POST") return jsonError(response, 405, "Méthode non autorisée.");

    const firstName = String(request.body?.firstName || "").trim().slice(0, 80);
    const email = String(request.body?.email || "").trim().toLowerCase().slice(0, 254);
    const sourcePage = String(request.body?.sourcePage || "unknown").trim().slice(0, 100);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError(response, 400, "Veuillez fournir une adresse email valide.");
    }

    const firestore = getFirestore();
    const leadRef = await firestore.collection("newsletter").add({
      firstName: firstName || "Abonné",
      email,
      source: sourcePage,
      createdAt: FieldValue.serverTimestamp(),
      brevoStatus: "pending",
    });

    const listId = Number(process.env.BREVO_LIST_ID);
    const apiKey = brevoApiKey.value();
    if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
      await leadRef.update({ brevoStatus: "not_configured" });
      return jsonError(response, 503, "La newsletter est temporairement indisponible.");
    }

    try {
      const brevoResponse = await fetch(BREVO_CONTACTS_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email,
          listIds: [listId],
          updateEnabled: true,
          attributes: { PRENOM: firstName || "Abonné", SOURCE: sourcePage },
        }),
      });

      if (!brevoResponse.ok) {
        throw new Error(`Brevo returned ${brevoResponse.status}`);
      }

      await leadRef.update({ brevoStatus: "synced", syncedAt: FieldValue.serverTimestamp() });
      return response.status(201).json({ ok: true });
    } catch (error) {
      console.error("Brevo synchronization failed", error);
      await leadRef.update({ brevoStatus: "error" });
      return jsonError(response, 502, "La synchronisation de votre inscription a échoué.");
    }
  }
);

function normalizeCourse(product) {
  const pricing = product.pricing || {};
  const currentPrice = pricing.current_price || pricing.currentPrice || {};
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  return {
    id: String(product.id || product.slug),
    slug: String(product.slug || product.id),
    name: product.name || "Formation",
    category: product.category || "Formation",
    description: product.description || "Formation pratique orientée résultats.",
    priceFormatted: currentPrice.formatted || pricing.formatted || "Sur la page Chariow",
    priceAmount: Number(currentPrice.amount || currentPrice.value || 0),
    currency: currentPrice.currency || pricing.currency || "XOF",
    isPopular: Boolean(product.is_popular || product.isPopular),
    lessonsCount: Number(product.lessons_count || product.lessonsCount || 0),
    duration: product.duration || "À votre rythme",
    level: product.level || "Tous niveaux",
    chariowUrl: product.url || product.checkout_url || `https://chariow.com/${product.slug || product.id}`,
    benefits,
  };
}

exports.listCourses = onRequest(
  { region: REGION, secrets: [chariowApiKey], timeoutSeconds: 15, memory: "256MiB" },
  async (request, response) => {
    setCors(response);
    if (request.method === "OPTIONS") return response.status(204).send("");
    if (request.method !== "GET") return jsonError(response, 405, "Méthode non autorisée.");

    const apiKey = chariowApiKey.value();
    if (!apiKey) return response.status(200).json({ courses: [] });

    try {
      const url = new URL(CHARIOW_API_URL);
      url.searchParams.set("type", "course");
      url.searchParams.set("per_page", "100");
      const chariowResponse = await fetch(url, {
        headers: { accept: "application/json", authorization: `Bearer ${apiKey}` },
      });
      if (!chariowResponse.ok) throw new Error(`Chariow returned ${chariowResponse.status}`);
      const payload = await chariowResponse.json();
      const products = Array.isArray(payload) ? payload : payload.data || payload.products || [];
      return response.status(200).json({ courses: products.map(normalizeCourse) });
    } catch (error) {
      console.error("Chariow synchronization failed", error);
      return jsonError(response, 502, "Le catalogue Chariow est temporairement indisponible.");
    }
  }
);

export interface NewsletterSubscription {
  firstName: string;
  email: string;
  sourcePage: string;
}

export async function subscribeToNewsletter(input: NewsletterSubscription) {
  let response: Response;
  try {
    response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Impossible de contacter le serveur. Vérifie ta connexion puis réessaie.");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    console.error("Unexpected newsletter response", { contentType, text: text.slice(0, 300) });
    throw new Error("Réponse serveur invalide. Vérifie la configuration Firebase Hosting.");
  }
  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || payload.success !== true) {
    throw new Error(payload.message || "Inscription impossible pour le moment.");
  }

  return payload;
}

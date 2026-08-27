import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const BREVO_TEST_KEY = env.BREVO_API_KEY || env.VITE_BREVO_API_KEY || process.env.BREVO_API_KEY || "";
  const BREVO_TEST_LIST_ID = Number(env.BREVO_LIST_ID || "9");

  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "brevo-dev-proxy",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith("/api/newsletter")) return next();
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.statusCode = 204;
            res.end();
            return;
          }
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, message: "Méthode non autorisée." }));
            return;
          }
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", async () => {
            try {
              const { firstName = "", email = "", sourcePage = "localhost" } = body ? JSON.parse(body) : {};
              const cleanEmail = String(email).trim().toLowerCase();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, message: "Veuillez fournir une adresse email valide." }));
                return;
              }
              const r = await fetch("https://api.brevo.com/v3/contacts", {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "api-key": BREVO_TEST_KEY,
                },
                body: JSON.stringify({
                  email: cleanEmail,
                  listIds: [BREVO_TEST_LIST_ID],
                  updateEnabled: true,
                  forceMerge: true,
                  attributes: { PRENOM: String(firstName).trim() || "Abonné", SOURCE: String(sourcePage).trim() || "localhost" },
                }),
              });
              const txt = await r.text();
              if (!r.ok) {
                console.log("[dev-proxy] Brevo error", r.status, txt.slice(0, 400));
                res.statusCode = r.status === 409 ? 409 : r.status === 401 ? 503 : 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, message: r.status === 409 ? "Cet email est déjà inscrit." : `Brevo ${r.status}: ${txt.slice(0,200)}` }));
                return;
              }
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, message: "Inscription confirmée ! Vérifie ta boîte mail. (dev-proxy)" }));
            } catch (e) {
              console.error("[dev-proxy] error", e);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, message: "Erreur proxy dev: " + String(e) }));
            }
          });
        });
      },
    },
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
};
});

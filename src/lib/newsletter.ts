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

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message || "Inscription impossible pour le moment.");
  }

  return payload;
}

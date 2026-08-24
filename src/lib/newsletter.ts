export interface NewsletterSubscription {
  firstName: string;
  email: string;
  sourcePage: string;
}

export async function subscribeToNewsletter(input: NewsletterSubscription) {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message || "Inscription impossible pour le moment.");
  }
}

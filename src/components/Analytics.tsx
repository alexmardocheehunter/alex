import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
}

export default function Analytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  useEffect(() => {
    if (measurementId && !document.querySelector(`script[data-ga="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.dataset.ga = measurementId;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { anonymize_ip: true });
    }

    let scroll75Sent = false;
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (!scroll75Sent && scrollable > 0 && window.scrollY / scrollable >= 0.75) {
        scroll75Sent = true;
        trackEvent("scroll_75", { page_path: window.location.pathname });
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("a,button");
      if (!target) return;
      const link = target instanceof HTMLAnchorElement ? target : null;
      if (link?.href.includes("wa.me")) trackEvent("click_whatsapp", { link_url: link.href });
      if (target.dataset.cta) trackEvent("cta_click", { cta_name: target.dataset.cta });
    };
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      const formName = form.dataset.trackForm;
      if (formName) trackEvent("submit_form", { form_name: formName });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, [measurementId]);

  return null;
}

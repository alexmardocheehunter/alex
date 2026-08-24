import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { StaticRouter } from "react-router";
import HomePage from "./App";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterBlock from "./components/NewsletterBlock";
import Breadcrumbs from "./components/Breadcrumbs";
import Analytics from "./components/Analytics";
import { Seo } from "./seo";
import AboutPage from "./pages/AboutPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogListPage from "./pages/BlogListPage";
import FormationsPage from "./pages/FormationsPage";
import NewsletterPage from "./pages/NewsletterPage";
import { ContactPage, MethodPage, ServicesPage, StoriesPage } from "./pages/BusinessPages";

function PageEffects() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.body.classList.add("loaded");

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const hash = location.hash.slice(1);
    const scrollToHash = hash
      ? window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 80)
      : undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("in"));
      return () => {
        if (scrollToHash) window.clearTimeout(scrollToHash);
        document.body.classList.remove("loaded");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    elements.forEach((element) => observer.observe(element));

    return () => {
      if (scrollToHash) window.clearTimeout(scrollToHash);
      observer.disconnect();
      document.body.classList.remove("loaded");
    };
  }, [location.pathname, location.hash]);

  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isNewsletterPage = location.pathname === "/newsletter";
  const isArticlePage = location.pathname.startsWith("/blog/");

  return (
    <>
      <PageEffects />
      <Seo />
      <Analytics />
      <Header />
      <main>
        <Breadcrumbs />
        {children}
      </main>
      {!isNewsletterPage && !isArticlePage && <NewsletterBlock sourcePage={location.pathname.replace(/\//g, "_") || "home"} />}
      <Footer />
    </>
  );
}

export function AppRoutes() {
  return (
    <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/histoires" element={<StoriesPage />} />
          <Route path="/methode" element={<MethodPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function AppContent() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export function StaticApp({ location }: { location: string }) {
  return (
    <StaticRouter location={location}>
      <AppContent />
    </StaticRouter>
  );
}

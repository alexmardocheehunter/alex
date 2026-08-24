import { renderToString } from "react-dom/server";
import { BLOG_ARTICLES } from "./data/blogArticles";
import { StaticApp } from "./AppRouter";

export { renderSeoHead } from "./seo";
export { BLOG_ARTICLES } from "./data/blogArticles";

export const PRERENDER_ROUTES = [
  "/",
  "/histoires",
  "/methode",
  "/services",
  "/a-propos",
  "/contact",
  "/blog",
  ...BLOG_ARTICLES.map((article) => `/blog/${article.slug}`),
  "/formations",
  "/newsletter",
];

export function render(url: string) {
  return renderToString(<StaticApp location={url} />);
}

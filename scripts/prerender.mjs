import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_ARTICLES, PRERENDER_ROUTES, render, renderSeoHead } from "../.prerender/entry-server.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = await readFile(join(dist, "index.html"), "utf8");

const publicPages = PRERENDER_ROUTES.map((pathname) => {
  const body = render(pathname);
  const html = template
    .replace("<div id=\"root\"></div>", `<div id="root">${body}</div>`)
    .replace("<!-- SEO_HEAD -->", renderSeoHead(pathname));
  return { pathname, html };
});

for (const { pathname, html } of publicPages) {
  const output = pathname === "/" ? join(dist, "index.html") : join(dist, pathname.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, "utf8");
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PRERENDER_ROUTES.map((pathname) => {
    const priority = pathname === "/" ? "1.0" : pathname.startsWith("/blog/") ? "0.7" : "0.8";
    return `  <url><loc>https://alexmardochee.web.app${pathname}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
  }),
  "</urlset>",
].join("\n");
await writeFile(join(dist, "sitemap.xml"), `${sitemap}\n`, "utf8");

const articleLinks = BLOG_ARTICLES
  .map((article) => `- [${article.title}](https://alexmardochee.web.app/blog/${article.slug})`)
  .join("\n");
const llms = `# Alex Mardochée — Automatisation & IA pour PME à Abidjan

> J'automatise les commandes, stocks, relances, factures et réponses clients WhatsApp des entreprises ivoiriennes. Du concret, zéro jargon. Basé à Abidjan, Côte d'Ivoire.

## Pages principales

- [Accueil](https://alexmardochee.web.app/)
- [Histoires clients](https://alexmardochee.web.app/histoires)
- [Méthode](https://alexmardochee.web.app/methode)
- [Services](https://alexmardochee.web.app/services)
- [À propos](https://alexmardochee.web.app/a-propos)
- [Contact](https://alexmardochee.web.app/contact)
- [Formations](https://alexmardochee.web.app/formations)

## Articles

${articleLinks}
`;
await writeFile(join(dist, "llms.txt"), llms, "utf8");

console.log(`Prerendered ${publicPages.length} pages, sitemap.xml and llms.txt`);

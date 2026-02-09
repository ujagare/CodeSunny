import fs from "node:fs";
import path from "node:path";

const sitemapPath = path.resolve(process.cwd(), "public", "sitemap.xml");

if (!fs.existsSync(sitemapPath)) {
  console.error("sitemap.xml not found at public/sitemap.xml");
  process.exit(1);
}

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const dateStr = `${yyyy}-${mm}-${dd}`;

const content = fs.readFileSync(sitemapPath, "utf8");
const updated = content.replace(
  /<lastmod>\\d{4}-\\d{2}-\\d{2}<\\/lastmod>/g,
  `<lastmod>${dateStr}</lastmod>`
);

if (content === updated) {
  console.warn("No <lastmod> tags updated.");
} else {
  fs.writeFileSync(sitemapPath, updated, "utf8");
  console.log(`Updated lastmod dates to ${dateStr}`);
}

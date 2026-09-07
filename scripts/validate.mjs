import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const cssFiles = [
  "css/main.css",
  "css/settings/tokens.css",
  "css/base/fonts.css",
  "css/base/reset.css",
  "css/layout/container.css",
  "css/layout/section.css",
  "css/components/header.css",
  "css/components/navigation.css",
  "css/components/section-heading.css",
  "css/components/button.css",
  "css/components/tech-card.css",
  "css/components/signal-strip.css",
  "css/components/value-card.css",
  "css/components/history-carousel.css",
  "css/components/status-list.css",
  "css/components/agenda-preview.css",
  "css/components/badge.css",
  "css/components/speaker-schedule.css",
  "css/components/sponsor-marquee.css",
  "css/components/audience-list.css",
  "css/components/accordion.css",
  "css/components/newsletter-card.css",
  "css/components/footer.css",
  "css/sections/hero.css",
  "css/sections/about.css",
  "css/sections/antecedents.css",
  "css/sections/event-status.css",
  "css/sections/agenda.css",
  "css/sections/speakers.css",
  "css/sections/audience.css",
  "css/sections/sponsors.css",
  "css/sections/faq.css",
  "css/sections/newsletter.css",
  "css/utilities/accessibility.css",
  "css/pages/error.css"
];

const jsFiles = [
  "js/modules/current-year.js",
  "js/modules/faq.js",
  "js/modules/header-scroll.js",
  "js/modules/mobile-menu.js",
  "js/modules/sponsor-marquee.js",
  "js/modules/history-carousel.js",
  "js/modules/speaker-story.js",
  "js/modules/hero-title-reveal.js"
];

const requiredFiles = [
  "index.html",
  "404.html",
  ...cssFiles,
  ...jsFiles,
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "fonts/Geist-Variable.woff2",
  "assets/images/brand/logo-catec.png",
  "assets/images/antecedentes/seminario-internacional.png",
  "assets/images/antecedentes/programming-contest.png",
  "assets/images/speakers/speaker-28.jpeg",
  "assets/images/speakers/p4.jpg",
  "assets/images/sponsors/patrocinadores3.png",
  "assets/images/sponsors/patrocinadores4.png",
  "assets/images/sponsors/patrocinadores9.png",
  "assets/images/sponsors/PollosYParillasLiderChiken.jpg",
  "assets/images/sponsors/logo ok.jpg",
  "assets/images/sponsors/JimenaVelasquezBeautyStudio.JPG"
];

const failures = [];
const html = readFileSync("index.html", "utf8");

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Falta el archivo requerido: ${file}`);
}

const checks = [
  [/<html lang="es-PE">/, "Falta el idioma es-PE"],
  [/<title>[^<]+<\/title>/, "Falta el título SEO"],
  [/name="description"/, "Falta la descripción SEO"],
  [/rel="canonical"/, "Falta la URL canónica"],
  [/property="og:title"/, "Faltan metadatos Open Graph"],
  [/type="application\/ld\+json"/, "Faltan datos estructurados"],
  [/<h1[\s>]/, "Falta el encabezado H1"],
  [/href="\.\/css\/main\.css"/, "No se enlazó css/main.css"],
  [/src="\.\/js\/modules\/header-scroll\.js"/, "No se enlazó el módulo del header"]
];

for (const [pattern, message] of checks) {
  if (!pattern.test(html)) failures.push(message);
}

const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
if (h1Count !== 1) failures.push(`Se esperaba un H1 y se encontraron ${h1Count}`);

for (const match of html.matchAll(/<(?:a|link)[^>]+href="([^"]+)"/g)) {
  const reference = match[1];
  if (reference.startsWith("#")) {
    const id = reference.slice(1);
    if (id && !new RegExp(`id=["']${id}["']`).test(html)) {
      failures.push(`Ancla sin destino: ${reference}`);
    }
  }
  if (reference.startsWith("./")) {
    const file = reference.slice(2).split("#")[0];
    if (file && !existsSync(file)) failures.push(`Referencia local inexistente: ${reference}`);
  }
}

for (const cssFile of cssFiles) {
  const css = readFileSync(cssFile, "utf8");
  const openingBraces = (css.match(/{/g) ?? []).length;
  const closingBraces = (css.match(/}/g) ?? []).length;

  if (openingBraces !== closingBraces) {
    failures.push(
      `${cssFile}: ${openingBraces} llaves abiertas y ${closingBraces} cerradas`
    );
  }

  for (const match of css.matchAll(/@import\s+url\(["']([^"']+)["']\)/g)) {
    const importedFile = resolve(dirname(cssFile), match[1]);
    if (!existsSync(importedFile)) failures.push(`Import CSS inexistente: ${match[1]}`);
  }
}

for (const jsFile of jsFiles) {
  const javascript = readFileSync(jsFile, "utf8");

  for (const match of javascript.matchAll(/from\s+["']([^"']+)["']/g)) {
    const importedFile = resolve(dirname(jsFile), match[1]);
    if (!existsSync(importedFile)) failures.push(`Import JS inexistente: ${match[1]}`);
  }
}

for (const match of html.matchAll(/<(?:img|script)[^>]+src="([^"]+)"/g)) {
  const reference = match[1];
  if (reference.startsWith("./")) {
    const file = reference.slice(2);
    if (!existsSync(file)) failures.push(`Recurso local inexistente: ${reference}`);
  }
}

for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try {
    JSON.parse(match[1]);
  } catch (error) {
    failures.push(`JSON-LD inválido: ${error.message}`);
  }
}

try {
  JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
} catch (error) {
  failures.push(`Manifest inválido: ${error.message}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Validación completada: estructura, SEO y recursos locales correctos.");

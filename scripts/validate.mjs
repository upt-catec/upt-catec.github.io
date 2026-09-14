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
  "css/components/value-card.css",
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
  "css/sections/registrations.css",
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
  "js/modules/speaker-story.js",
  "js/modules/registration-tilt.js",
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
  "assets/images/banners/BANNER_EVENTO_JUEGO_2026_II.pdf",
  "assets/images/banners/BANNER_IX_PROGRAMMING_CONTEST_EPIS_2026_II.jpeg",
  "assets/images/banners/BANNER_IX_PROGRAMMING_CONTEST_EPIS_2026_II_A4.pdf",
  "assets/images/banners/CATEC_2BANNER CATEC_2026_II_Corregido.pdf",
  "assets/images/banners/CATEC_2BANNER CATEC_2026_II_Corregido.png",
  "assets/images/banners/banner-evento-juego.png",
  "assets/images/speakers/carlos-garcia-vezzoso.jpeg",
  "assets/images/speakers/jorge-pacora-silva.png",
  "assets/images/speakers/luis-fernandez-vizcarra.jpg",
  "assets/images/speakers/marcelo-martinez.jpg",
  "assets/images/speakers/rafael-gonzalez-otoya.jpeg",
  "assets/images/speakers/Thomas Arturo Sorza Sierra.jpg",
  "assets/documents/speakers/carlos-garcia-vezzoso.pdf",
  "assets/documents/speakers/jorge-pacora-silva.pdf",
  "assets/documents/speakers/luis-fernandez-vizcarra.pdf",
  "assets/documents/speakers/marcelo-martinez.pdf",
  "assets/documents/speakers/rafael-gonzalez-otoya.pdf",
  "assets/documents/speakers/thomas-sorza-sierra.pdf",
  "assets/images/sponsors/Ady_y_ke_tortas.jpg",
  "assets/images/sponsors/Comercial_Ruby.png",
  "assets/images/sponsors/Gigantografia_America.jpeg",
  "assets/images/sponsors/JimenaVelasquezBeautyStudio.JPG",
  "assets/images/sponsors/la_lecheria.png",
  "assets/images/sponsors/logo zheros express.jpg",
  "assets/images/sponsors/logo-Farmacia-Maria-de-los-Angeles.jpg",
  "assets/images/sponsors/Logo-Helados-Artika.jpg",
  "assets/images/sponsors/LOGOTIPO JUSTINA_page-0001.jpg",
  "assets/images/sponsors/logo_maquera_matizados.jpg",
  "assets/images/sponsors/MISTIKAT.jpeg",
  "assets/images/sponsors/Multiservicios_ElChino_.png",
  "assets/images/sponsors/Panadex.jpg",
  "assets/images/sponsors/PollosYParillasLiderChiken.jpg",
  "assets/images/sponsors/Princess_Decoraciones_y_Detalles.jpeg",
  "assets/images/sponsors/pronta pizza.jpeg",
  "assets/images/sponsors/Sauna el Eden del Cono Sur.jpeg",
  "assets/images/sponsors/shugaa salón de té.jpeg",
  "assets/images/sponsors/trilogiadelsabor.jpeg"
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

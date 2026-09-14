# CATEC 2026-II

Sitio oficial de CATEC 2026-II, evento académico y tecnológico organizado por estudiantes de la Escuela Profesional de Ingeniería de Sistemas de la Universidad Privada de Tacna.

## Desarrollo local

El sitio no requiere instalar dependencias. Puede abrirse directamente, aunque es preferible servirlo con un servidor HTTP local:

```bash
npx serve .
```

También puede utilizarse la extensión Live Server de Visual Studio Code.

Para ejecutar la validación local de estructura y SEO:

```bash
node scripts/validate.mjs
```

## Estructura del frontend

El proyecto mantiene HTML, CSS y JavaScript vanilla, organizados por responsabilidad:

```text
assets/
├── documents/
│   └── speakers/      # CV y documentos fuente de los ponentes
└── images/
    ├── antecedentes/  # Material visual de ediciones anteriores
    ├── brand/         # Logotipos e identidad
    ├── speakers/      # Fotografías de ponentes
    └── sponsors/      # Logotipos de patrocinadores
css/
├── base/          # Normalización de elementos HTML
├── components/    # Una hoja por componente visual reutilizable
├── layout/        # Contenedores y estructura común de secciones
├── pages/         # Estilos exclusivos de una página
├── sections/      # Una hoja por sección de la portada
├── settings/      # Variables de diseño
├── utilities/     # Accesibilidad y ayudas globales
└── main.css       # Punto de entrada y orden de la cascada
js/
└── modules/       # Un script independiente por comportamiento
```

Los archivos HTML solo enlazan los puntos de entrada. Para agregar una sección o componente,
cree su archivo en la carpeta correspondiente e impórtelo desde `css/main.css`; para agregar
un comportamiento, añada un script autocontenido en `js/modules/` y enlácelo con `defer`.
Las adaptaciones responsive viven junto a cada componente para mantener todos sus estilos
encapsulados en un solo lugar.

## Publicación

El flujo `.github/workflows/deploy-pages.yml` publica automáticamente el sitio al enviar un tag de versión como `v1.0.0`. También puede ejecutarse manualmente desde GitHub Actions.

En GitHub se debe seleccionar **Settings → Pages → Source → GitHub Actions**.

La URL esperada es:

```text
https://srg-cp.github.io/catec-epis/
```

## Información pendiente

Antes de solicitar indexación en Google deben reemplazarse los textos provisionales con información confirmada:

- Fecha y horario.
- Modalidad y dirección.
- Enlace y condiciones de inscripción.
- Agenda completa.
- Ponentes y biografías.
- Redes sociales oficiales.
- Datos estructurados `Event`.
- Imagen horizontal para compartir en redes sociales.

## Cambio a dominio personalizado

Si se adquiere un dominio, deben actualizarse todas las apariciones de `https://srg-cp.github.io/catec-epis/` en:

- `index.html`
- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- `404.html`

También se debe añadir el archivo `CNAME` con el dominio definitivo y configurarlo en GitHub Pages.

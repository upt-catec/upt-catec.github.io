<div align="center">

# CATEC 2026-II

Sitio web oficial del evento de capacitación tecnológica organizado por la
Escuela Profesional de Ingeniería de Sistemas de la Universidad Privada de Tacna.

[![Sitio web](https://img.shields.io/badge/Sitio_web-upt--catec.github.io-6C63FF?style=for-the-badge&logo=githubpages&logoColor=white)](https://upt-catec.github.io/)
[![GitHub](https://img.shields.io/badge/GitHub-srg--cp-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/srg-cp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)

</div>

## Acerca del proyecto

La web reúne la información de CATEC 2026-II en una experiencia responsive, accesible y
optimizada para dispositivos móviles. Presenta el evento, sus actividades, agenda, ponentes,
inscripciones, ubicación, antecedentes y patrocinadores.

El proyecto está construido con tecnologías web nativas, sin frameworks ni dependencias de
ejecución, para ofrecer una carga rápida y facilitar su mantenimiento.

## Características

- Diseño responsive para escritorio, tablet y móvil.
- Navegación adaptable con desplazamiento entre secciones.
- Agenda interactiva organizada por actividades.
- Perfiles y documentos informativos de los ponentes.
- Material gráfico y documentos descargables del evento.
- Animaciones progresivas y componentes interactivos en JavaScript.
- Optimización SEO mediante canonical, Open Graph, Twitter Cards y JSON-LD.
- `robots.txt`, sitemap, manifest y página 404 personalizada.
- Validación automática de estructura, recursos locales y metadatos.
- Despliegue automatizado mediante GitHub Actions y GitHub Pages.

## Tecnologías

- HTML5 semántico.
- CSS3 modular con variables de diseño.
- JavaScript modular.
- GitHub Actions.
- GitHub Pages.

## Estructura

```text
.
├── .github/workflows/    # Automatización del despliegue
├── assets/
│   ├── documents/        # Documentos de los ponentes
│   └── images/           # Identidad, banners, ponentes y patrocinadores
├── css/
│   ├── base/             # Estilos base y tipografías
│   ├── components/       # Componentes reutilizables
│   ├── layout/           # Estructura general
│   ├── sections/         # Estilos de cada sección
│   ├── settings/         # Variables y tokens visuales
│   └── utilities/        # Utilidades y accesibilidad
├── fonts/                # Fuentes locales
├── js/modules/           # Comportamientos e interacciones
├── scripts/validate.mjs  # Validación del sitio
├── 404.html
├── index.html
├── manifest.webmanifest
├── robots.txt
└── sitemap.xml
```

## Ejecución local

No es necesario instalar dependencias. Puede utilizarse cualquier servidor HTTP local:

```bash
npx serve .
```

Después, abre la dirección indicada por el servidor en el navegador. También puede utilizarse
Live Server desde Visual Studio Code.

## Validación

Para comprobar la estructura, los recursos, los metadatos SEO y los datos estructurados:

```bash
node scripts/validate.mjs
```

Una ejecución correcta muestra:

```text
Validación completada: estructura, SEO y recursos locales correctos.
```

## Despliegue

La rama `master` se publica automáticamente mediante el workflow de GitHub Pages. El despliegue
también puede iniciarse manualmente desde la pestaña **Actions** del repositorio.

**Sitio oficial:** [upt-catec.github.io](https://upt-catec.github.io/)

## Licencia

Los recursos gráficos, fotografías, documentos e identidad visual pertenecen a sus respectivos
autores y a la organización de CATEC EPIS UPT.

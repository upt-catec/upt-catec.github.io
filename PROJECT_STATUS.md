# Estado del proyecto CATEC 2026-II

Última actualización: 2 de septiembre de 2026.

## Objetivo

Crear desde cero la web oficial de CATEC 2026-II y publicarla mediante GitHub Pages, con prioridad en SEO para que la edición actual aparezca por encima de ediciones anteriores al buscar CATEC, CATEC UPT o CATEC Tacna.

## Decisiones tomadas

- Tecnologías: HTML, CSS y JavaScript vanilla.
- Sin frameworks ni dependencias.
- Repositorio: `srg-cp/catec-epis`.
- URL provisional: `https://srg-cp.github.io/catec-epis/`.
- Dominio considerado: `catec-upt.site`.
- Si se compra un dominio, GitHub Pages seguirá siendo el alojamiento.
- No se inventarán fechas, ponentes, modalidades o enlaces antes de su confirmación.
- La dirección visual usa azul marino, violeta y cian brillante, inspirados en las piezas gráficas institucionales de CATEC y EPIS.

## Estado actual

La primera versión funcional ya está creada e incluye:

- Portada responsive.
- Navegación de escritorio y móvil.
- Sección acerca de CATEC.
- Estado e información del evento.
- Agenda provisional.
- Ponentes provisionales.
- Público objetivo.
- Preguntas frecuentes.
- Bloque para futuros canales oficiales.
- Footer institucional.
- Página 404.
- Metadatos SEO, canonical y Open Graph.
- Datos estructurados `WebSite` y `Organization`.
- `robots.txt` y `sitemap.xml`.
- Manifest.
- Flujo de despliegue con GitHub Actions.
- Script local de validación.

## Archivos importantes

- `index.html`: contenido, SEO y estructura principal.
- `css/main.css`: punto de entrada de los estilos modulares.
- `css/components/`: estilos de componentes reutilizables.
- `css/sections/`: estilos separados por sección de la portada.
- `js/modules/`: scripts independientes para menú móvil, encabezado, año actual y preguntas frecuentes.
- `robots.txt`: instrucciones para buscadores.
- `sitemap.xml`: mapa del sitio.
- `manifest.webmanifest`: configuración del sitio instalable.
- `404.html`: página de error.
- `.github/workflows/deploy-pages.yml`: publicación automática.
- `scripts/validate.mjs`: validación local.
- `README.md`: instrucciones del proyecto.
- `assets/images/`: imágenes organizadas por marca, ponentes, patrocinadores y antecedentes.

## Validación

Ejecutar:

```bash
node scripts/validate.mjs
```

Último resultado:

```text
Validación completada: estructura, SEO y recursos locales correctos.
```

## Información pendiente

Antes de publicar e indexar se necesita confirmar:

- Fecha y horario del evento.
- Lugar y modalidad.
- Enlace de inscripción y costo.
- Agenda completa.
- Ponentes, cargos, organizaciones, fotografías y temas.
- Redes sociales oficiales.
- Docente y equipo organizador que deben figurar en la web.
- Patrocinadores o colaboradores.
- Dominio definitivo.
- Imagen horizontal de alta resolución para Google y redes sociales.

## Próximos pasos

1. Revisar visualmente la primera versión en el navegador.
2. Ajustar diseño según las preferencias del equipo.
3. Incorporar la información oficial confirmada.
4. Añadir datos estructurados `Event` con fecha, lugar e inscripción reales.
5. Decidir entre dominio propio y URL de GitHub Pages.
6. Actualizar canonical, sitemap, robots, manifest y Open Graph si cambia el dominio.
7. Hacer commit y push a la rama `master`, y crear un tag de versión para publicar.
8. En GitHub, seleccionar `Settings → Pages → Source → GitHub Actions`.
9. Verificar la web en Google Search Console y enviar el sitemap.
10. Conseguir enlaces desde las redes oficiales y, si es posible, desde `upt.edu.pe`.

## Nota SEO

Las páginas de ediciones anteriores pertenecen a otros estudiantes y no se pueden redirigir. La estrategia para superarlas será combinar contenido actualizado de CATEC 2026-II, buen SEO técnico, datos estructurados y enlaces desde canales institucionales actuales.

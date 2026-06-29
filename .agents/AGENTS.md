# Reglas del Proyecto: Criadero Noble Cachorro

Este archivo define las directrices y restricciones de desarrollo para mantener la coherencia del sitio web.

## Arquitectura y Estructura
*   **Sitio Estático**: El sitio web es puramente estático (HTML, CSS y JS clásicos en la raíz del proyecto). No se deben reintroducir bundlers, dependencias npm o bases de datos a menos que el usuario lo pida explícitamente.
*   **Rutas de Recursos**: Todos los recursos (imágenes, favicons, etc.) se almacenan en la carpeta `/assets` en la raíz.
*   **Páginas Legales**: Las páginas `politicas-privacidad.html` y `terminos-condiciones.html` se encuentran en el directorio raíz. Cualquier cambio en el menú o pie de página debe mantener los enlaces a estas páginas de forma visible.

## Directrices de Diseño y Firma
*   **Firma del Autor**: El pie de página (`footer-bottom`) debe destacar de forma central y prominente la autoría: *"Diseñado con ❤️ por @rameseba"*, enlazando directamente a `https://rameseba.com`.
*   **Identidad Visual**: El logotipo principal es circular transparente y debe mantenerse escalado adecuadamente en pantallas móviles y de escritorio. El favicon oficial es el diseño de la patita dorada en formato SVG/ICO.

## Despliegue
*   **Cloudflare Pages**: El sitio se despliega en producción mediante el comando `npx wrangler pages deploy . --project-name noble-cachorro --branch main` apuntando a la raíz del espacio de trabajo.

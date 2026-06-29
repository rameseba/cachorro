# Reglas del Proyecto: Criadero Noble Cachorro

Este archivo define las directrices de desarrollo para mantener la coherencia del sitio web.

## Arquitectura y Estructura
*   **Stack**: Aplicación **Next.js** (App Router, TypeScript, React) con backend **Convex** y despliegue en **Vercel**. (Antes era un sitio estático; migrado para incorporar un panel admin / editor web.)
*   **Backend (Convex)**: El contenido editable (catálogo, reseñas, configuración) vive en Convex.
    *   Deployments: dev `charming-hound-930`, prod `bright-kiwi-819`.
    *   `convex/schema.ts`: tablas `products`, `reviews`, `siteConfig`, `sessions`.
    *   `convex/public.ts`: queries públicas (`listProducts`, `listReviews`, `getSiteConfig`).
    *   `convex/admin.ts`: auth por contraseña (token de sesión), CRUD y `generateUploadUrl` (Convex File Storage).
    *   `convex/seed.ts`: `seedAll` siembra los datos iniciales.
    *   La contraseña del admin es el secreto `ADMIN_PASSWORD` en Convex (`npx convex env set ADMIN_PASSWORD ...`).
*   **Frontend**:
    *   `app/page.tsx`: sitio público (lee de Convex con `useQuery`). Soporta preview en vivo vía `postMessage` (`NOBLE_PREVIEW_UPDATE`) para el editor.
    *   `app/admin/`: panel admin. `login/` (contraseña), `editar-web/` (editor con pestañas Productos/Reseñas/Configuración + iframe de preview en vivo + guardar + subir imágenes).
    *   `app/politicas-privacidad/`, `app/terminos-condiciones/`: páginas legales. Mantener sus enlaces visibles en el footer.
    *   `app/globals.css`: estilos (portados del antiguo `style.css`).
*   **Recursos**: imágenes y favicons en `public/assets/`.

## Directrices de Diseño y Firma
*   **Firma del Autor**: El pie de página debe destacar de forma central: *"Diseñado con ❤️ por @rameseba"*, enlazando a `https://rameseba.com`.
*   **Identidad Visual**: Logo circular transparente, escalado en móvil y escritorio. Favicon: patita dorada (SVG/ICO).
*   **Diseño**: Cualquier cambio debe respetar el diseño premium existente (paleta marrón/crema, fuentes Outfit + Inter).

## Despliegue
*   **Vercel**: El sitio se despliega en Vercel. Build command: `npx convex deploy --cmd 'next build'`.
*   **Env vars (Vercel)**: `NEXT_PUBLIC_CONVEX_URL` (prod), `CONVEX_DEPLOY_KEY` (prod).
*   **Dominio**: `criaderonoblecachorro.com` (+ `www`). DNS gestionado en Cloudflare apuntando a Vercel.
*   **Convex local (dev)**: `.env.local` con `CONVEX_DEPLOY_KEY` (dev) y `NEXT_PUBLIC_CONVEX_URL` (dev). Nunca commitear `.env.local`.

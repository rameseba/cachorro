/**
 * Dominio del sitio en un solo lugar, para no repetirlo literal en cada
 * archivo que lo necesite (`layout.tsx` ya lo usa como `metadataBase`).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://criaderonoblecachorro.com";

import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site";

/**
 * El sitio es de una sola página pública más las dos legales. No hay fichas
 * individuales que listar: los cachorros viven dentro de la portada.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/terminos-condiciones`, lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politicas-privacidad`, lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
  ];
}

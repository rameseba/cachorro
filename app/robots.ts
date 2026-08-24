import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site";

/**
 * El sitio no tenía `robots.txt` ni `sitemap.xml`: los buscadores —y los
 * agentes de IA, que son un canal de venta declarado— tenían que descubrirlo
 * todo a ciegas, y nada impedía que el panel `/admin` terminara indexado.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

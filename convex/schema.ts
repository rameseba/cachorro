import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Esquema Convex para Criadero Noble Cachorro.
export default defineSchema({
  // Catálogo de cachorros y alimentos (antes hardcodeado en app.js: PRODUCTS).
  products: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("pequena"),
      v.literal("grande"),
      v.literal("alimento"),
    ),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    description: v.string(),
    // Imagen: o una URL estática (/assets/..) o un archivo en Convex Storage.
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    alt: v.optional(v.string()),
    hasKcc: v.boolean(),
    isPuppy: v.boolean(),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_order", ["order"])
    .index("by_category", ["category"]),

  // Reseñas "Clientes Felices" (antes DEFAULT_CLIENT_PHOTOS).
  reviews: defineTable({
    name: v.string(),
    date: v.optional(v.string()),
    feedback: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    order: v.number(),
    active: v.boolean(),
  }).index("by_order", ["order"]),

  // Configuración global del sitio (singleton key='global').
  siteConfig: defineTable({
    key: v.string(),
    whatsappNumber: v.string(),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    aboutText: v.optional(v.string()),
    // Contenido editable de todas las secciones (ver app/lib/defaultContent.ts).
    content: v.optional(v.any()),
    // Logos editables (Convex Storage). Si no hay, se usan los estáticos en /assets.
    logoStorageId: v.optional(v.id("_storage")),
    logoLightStorageId: v.optional(v.id("_storage")),
  }).index("by_key", ["key"]),

  // Sesiones del panel admin (login con contraseña única → token).
  sessions: defineTable({
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});

import { mutation, query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

const SESSION_MS = 1000 * 60 * 60 * 8; // 8 horas

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function requireSesion(ctx: QueryCtx | MutationCtx, token: string) {
  const s = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!s || s.expiresAt < Date.now()) {
    throw new Error("Sesión inválida o expirada. Vuelve a iniciar sesión.");
  }
  return s;
}

// ---------------------------------------------------------------------------
// Autenticación
// ---------------------------------------------------------------------------
export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const P = process.env.ADMIN_PASSWORD;
    if (!P) {
      throw new Error("Panel no configurado (falta ADMIN_PASSWORD en Convex).");
    }
    if (password !== P) return { ok: false as const };
    const token = newToken();
    await ctx.db.insert("sessions", { token, expiresAt: Date.now() + SESSION_MS });
    return { ok: true as const, token };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const s = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (s) await ctx.db.delete(s._id);
  },
});

export const sesionValida = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const s = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    return Boolean(s && s.expiresAt >= Date.now());
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSesion(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------
const productFields = {
  name: v.string(),
  category: v.union(
    v.literal("pequena"),
    v.literal("grande"),
    v.literal("alimento"),
  ),
  price: v.number(),
  originalPrice: v.optional(v.number()),
  description: v.string(),
  imageUrl: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  alt: v.optional(v.string()),
  hasKcc: v.boolean(),
  isPuppy: v.boolean(),
};

export const listProductsAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSesion(ctx, token);
    const items = await ctx.db.query("products").withIndex("by_order").collect();
    return Promise.all(
      items.map(async (p) => ({
        ...p,
        resolvedImage: p.imageStorageId
          ? await ctx.storage.getUrl(p.imageStorageId)
          : (p.imageUrl ?? null),
      })),
    );
  },
});

export const createProduct = mutation({
  args: { token: v.string(), ...productFields, active: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireSesion(ctx, args.token);
    const { token, active, ...rest } = args;
    const all = await ctx.db.query("products").collect();
    const maxOrder = all.reduce((m, p) => Math.max(m, p.order), -1);
    return await ctx.db.insert("products", {
      ...rest,
      order: maxOrder + 1,
      active: active ?? true,
    });
  },
});

export const updateProduct = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(
      v.union(v.literal("pequena"), v.literal("grande"), v.literal("alimento")),
    ),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.union(v.number(), v.null())),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    alt: v.optional(v.string()),
    hasKcc: v.optional(v.boolean()),
    isPuppy: v.optional(v.boolean()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireSesion(ctx, args.token);
    const { token, id, originalPrice, ...rest } = args;
    const patch: Record<string, unknown> = { ...rest };
    // Permite limpiar originalPrice pasando null.
    if (originalPrice === null) patch.originalPrice = undefined;
    else if (originalPrice !== undefined) patch.originalPrice = originalPrice;
    await ctx.db.patch(id, patch);
  },
});

export const deleteProduct = mutation({
  args: { token: v.string(), id: v.id("products") },
  handler: async (ctx, { token, id }) => {
    await requireSesion(ctx, token);
    const p = await ctx.db.get(id);
    if (p?.imageStorageId) await ctx.storage.delete(p.imageStorageId);
    await ctx.db.delete(id);
  },
});

export const reorderProducts = mutation({
  args: { token: v.string(), orderedIds: v.array(v.id("products")) },
  handler: async (ctx, { token, orderedIds }) => {
    await requireSesion(ctx, token);
    await Promise.all(
      orderedIds.map((id, i) => ctx.db.patch(id, { order: i })),
    );
  },
});

// ---------------------------------------------------------------------------
// Reseñas
// ---------------------------------------------------------------------------
export const listReviewsAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSesion(ctx, token);
    const items = await ctx.db.query("reviews").withIndex("by_order").collect();
    return Promise.all(
      items.map(async (r) => ({
        ...r,
        resolvedImage: r.imageStorageId
          ? await ctx.storage.getUrl(r.imageStorageId)
          : (r.imageUrl ?? null),
      })),
    );
  },
});

export const createReview = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    date: v.optional(v.string()),
    feedback: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireSesion(ctx, args.token);
    const { token, active, ...rest } = args;
    const all = await ctx.db.query("reviews").collect();
    const maxOrder = all.reduce((m, r) => Math.max(m, r.order), -1);
    return await ctx.db.insert("reviews", {
      ...rest,
      order: maxOrder + 1,
      active: active ?? true,
    });
  },
});

export const updateReview = mutation({
  args: {
    token: v.string(),
    id: v.id("reviews"),
    name: v.optional(v.string()),
    date: v.optional(v.string()),
    feedback: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireSesion(ctx, args.token);
    const { token, id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteReview = mutation({
  args: { token: v.string(), id: v.id("reviews") },
  handler: async (ctx, { token, id }) => {
    await requireSesion(ctx, token);
    const r = await ctx.db.get(id);
    if (r?.imageStorageId) await ctx.storage.delete(r.imageStorageId);
    await ctx.db.delete(id);
  },
});

// ---------------------------------------------------------------------------
// Configuración del sitio
// ---------------------------------------------------------------------------
export const updateContent = mutation({
  args: { token: v.string(), content: v.any() },
  handler: async (ctx, { token, content }) => {
    await requireSesion(ctx, token);
    const existing = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { content });
    } else {
      await ctx.db.insert("siteConfig", {
        key: "global",
        whatsappNumber: "56929581205",
        content,
      });
    }
  },
});

// Guarda una imagen del sitio (logo, logo claro del footer o banner) subida a Storage.
export const updateLogo = mutation({
  args: {
    token: v.string(),
    slot: v.union(
      v.literal("main"),
      v.literal("light"),
      v.literal("hero"),
      v.literal("traslado"),
    ),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { token, slot, storageId }) => {
    await requireSesion(ctx, token);
    const field =
      slot === "main"
        ? "logoStorageId"
        : slot === "light"
          ? "logoLightStorageId"
          : slot === "hero"
            ? "heroImageStorageId"
            : "trasladoImageStorageId";
    const existing = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { [field]: storageId });
    } else {
      await ctx.db.insert("siteConfig", {
        key: "global",
        whatsappNumber: "56929581205",
        [field]: storageId,
      });
    }
  },
});

export const updateSiteConfig = mutation({
  args: {
    token: v.string(),
    whatsappNumber: v.optional(v.string()),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    aboutText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireSesion(ctx, args.token);
    const { token, ...fields } = args;
    const existing = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("siteConfig", {
        key: "global",
        whatsappNumber: fields.whatsappNumber ?? "56929581205",
        heroTitle: fields.heroTitle,
        heroSubtitle: fields.heroSubtitle,
        aboutText: fields.aboutText,
      });
    }
  },
});

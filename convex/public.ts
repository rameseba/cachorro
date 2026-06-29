import { query } from "./_generated/server";
import { QueryCtx } from "./_generated/server";

// Resuelve la URL de imagen: prioriza el archivo en Convex Storage; si no, la URL estática.
async function resolveImage(
  ctx: QueryCtx,
  doc: { imageStorageId?: string | null; imageUrl?: string | null },
): Promise<string | null> {
  if (doc.imageStorageId) {
    const url = await ctx.storage.getUrl(doc.imageStorageId as any);
    if (url) return url;
  }
  return doc.imageUrl ?? null;
}

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("products").withIndex("by_order").collect();
    const active = items.filter((p) => p.active);
    return Promise.all(
      active.map(async (p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        description: p.description,
        image: await resolveImage(ctx, p),
        alt: p.alt ?? p.name,
        hasKcc: p.hasKcc,
        isPuppy: p.isPuppy,
      })),
    );
  },
});

export const listReviews = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("reviews").withIndex("by_order").collect();
    const active = items.filter((r) => r.active);
    return Promise.all(
      active.map(async (r) => ({
        id: r._id,
        name: r.name,
        date: r.date ?? "",
        feedback: r.feedback,
        image: await resolveImage(ctx, r),
      })),
    );
  },
});

export const getSiteConfig = query({
  args: {},
  handler: async (ctx) => {
    const cfg = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    return {
      whatsappNumber: cfg?.whatsappNumber ?? "56929581205",
      heroTitle: cfg?.heroTitle ?? null,
      heroSubtitle: cfg?.heroSubtitle ?? null,
      aboutText: cfg?.aboutText ?? null,
    };
  },
});

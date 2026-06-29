import { mutation } from "./_generated/server";

// Datos migrados desde el sitio estático original (app.js: PRODUCTS).
const PRODUCTS = [
  { name: "Beagle", category: "pequena", price: 300000, description: "Cariñosos, sociables e inteligentes. Excelentes compañeros para jugar con niños.", imageUrl: "/assets/beagle.png", alt: "Cachorro Beagle saludable", hasKcc: true, isPuppy: true },
  { name: "Bichón Maltés", category: "pequena", price: 400000, description: "Pelaje blanco sedoso, carácter alegre y juguetón. Hipoalergénico ideal para departamentos.", imageUrl: "/assets/maltes.png", alt: "Cachorro Bichón Maltés blanco", hasKcc: true, isPuppy: true },
  { name: "Chihuahua", category: "pequena", price: 400000, description: "Valientes y de tamaño de bolsillo. Gran personalidad, leales y de larga expectativa de vida.", imageUrl: "/assets/chihuahua.png", alt: "Cachorro Chihuahua juguetón", hasKcc: true, isPuppy: true },
  { name: "Cocker Spaniel", category: "pequena", price: 300000, description: "Carácter dulce y orejas largas caídas. Muy activos, dóciles y apegados a su familia.", imageUrl: "/assets/cocker.png", alt: "Cachorro Cocker Spaniel bronce", hasKcc: true, isPuppy: true },
  { name: "Dachshund (Salchicha)", category: "pequena", price: 300000, description: "Cuerpo alargado y patas cortas simpático. Valiente, vivaz y protector de su hogar.", imageUrl: "/assets/dachshund.png", alt: "Cachorro Dachshund miniatura", hasKcc: true, isPuppy: true },
  { name: "Golden Retriever", category: "grande", price: 400000, description: "Leales, pacientes y obedientes. Inteligencia superior y carácter sumamente familiar.", imageUrl: "/assets/golden.png", alt: "Cachorro Golden Retriever sonriendo", hasKcc: true, isPuppy: true },
  { name: "Husky Siberiano", category: "grande", price: 500000, description: "Elegante apariencia lobuna, enérgicos y con hermosos ojos azules. Gran temperamento.", imageUrl: "/assets/husky.png", alt: "Cachorro Husky Siberiano de ojos celestes", hasKcc: true, isPuppy: true },
  { name: "Pastor Alemán", category: "grande", price: 380000, description: "Fuertes, inteligentes y protectores. Guardianes de nacimiento y muy obedientes.", imageUrl: "/assets/pastor.png", alt: "Cachorro Pastor Alemán mirando alerta", hasKcc: true, isPuppy: true },
  { name: "Pomerania", category: "pequena", price: 750000, description: "Fluffy, minúsculos y con abundante pelaje naranja. Gran energía en un cuerpo compacto.", imageUrl: "/assets/pomerania.png", alt: "Cachorro Pomerania toy esponjoso", hasKcc: true, isPuppy: true },
  { name: "Shih Tzu", category: "pequena", price: 450000, description: "Calmados, afectuosos y de gran pelaje. Excelentes para compañía y vida tranquila.", imageUrl: "/assets/shih_tzu.png", alt: "Cachorro Shih Tzu tierno", hasKcc: true, isPuppy: true },
  { name: "Yorkshire Terrier", category: "pequena", price: 400000, description: "Compactos, valientes y muy despiertos. Hermoso pelaje azul acero y dorado.", imageUrl: "/assets/yorkshire.png", alt: "Cachorro Yorkshire Terrier miniatura", hasKcc: true, isPuppy: true },
  { name: "Poodle Toy", category: "pequena", price: 400000, description: "Altamente inteligentes, no mudan pelaje (hipoalergénicos). Sociables y leales.", imageUrl: "/assets/poodle.png", alt: "Cachorro Poodle Toy apricot", hasKcc: true, isPuppy: true },
  { name: "Brit Care Hipoalergénico Puppy 3 kg", category: "alimento", price: 19990, originalPrice: 25990, description: "Fórmula premium de cordero y arroz para cachorros con estómagos sensibles.", imageUrl: "/assets/brit_puppy.png", alt: "Saco Brit Care Puppy", hasKcc: false, isPuppy: false },
  { name: "ProPlan Puppy Razas Pequeñas 3 kg", category: "alimento", price: 19990, originalPrice: 25990, description: "Nutrición específica para soportar el rápido metabolismo de cachorros pequeños.", imageUrl: "/assets/proplan_puppy.png", alt: "Saco ProPlan Puppy", hasKcc: false, isPuppy: false },
  { name: "ProPlan Puppy Razas Pequeñas 7,5 kg", category: "alimento", price: 45990, originalPrice: 54990, description: "Saco mediano de ProPlan para cachorros. Promueve el desarrollo cerebral y de la vista.", imageUrl: "/assets/proplan_puppy_large.png", alt: "Saco ProPlan Puppy Grande", hasKcc: false, isPuppy: false },
] as const;

const REVIEWS = [
  { name: "Familia Silva Aravena", date: "Hace 2 semanas", feedback: "¡Felices con nuestra pequeña Beagle en su nuevo hogar! Excelente crianza y atención de Criadero Noble Cachorro.", imageUrl: "/assets/beagle.png" },
  { name: "Javiera y Tomás", date: "Hace 1 mes", feedback: "Gracias por esta bolita de pelos hermosa (Pomerania). Llegó súper sana, activa y llena de amor.", imageUrl: "/assets/pomerania.png" },
  { name: "Andrés Muñoz", date: "Hace 3 días", feedback: "El nuevo guardián y compañero de mi hijo (Golden). Muy obediente, dócil y se adaptó muy rápido.", imageUrl: "/assets/golden.png" },
] as const;

// Inserta los datos iniciales. Idempotente: no hace nada si ya hay productos.
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) {
      return { ok: true, skipped: true, message: "Ya hay datos; no se sembró nada." };
    }

    let order = 0;
    for (const p of PRODUCTS) {
      await ctx.db.insert("products", { ...p, order: order++, active: true });
    }

    order = 0;
    for (const r of REVIEWS) {
      await ctx.db.insert("reviews", { ...r, order: order++, active: true });
    }

    const cfg = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (!cfg) {
      await ctx.db.insert("siteConfig", {
        key: "global",
        whatsappNumber: "56929581205",
      });
    }

    return {
      ok: true,
      skipped: false,
      products: PRODUCTS.length,
      reviews: REVIEWS.length,
    };
  },
});

"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteContent, withDefaults } from "@/app/lib/defaultContent";

// ---------------------------------------------------------------------------
// Tipos y helpers
// ---------------------------------------------------------------------------
type Product = {
  id: string;
  name: string;
  category: "pequena" | "grande" | "alimento";
  price: number;
  originalPrice: number | null;
  description: string;
  image: string | null;
  alt: string;
  hasKcc: boolean;
  isPuppy: boolean;
};

type Review = {
  id: string;
  name: string;
  date: string;
  feedback: string;
  image: string | null;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

type Toast = { id: number; message: string; type: "info" | "success" | "danger" };

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n);
}

const FoodBagSVG = () => (
  <svg
    className="product-img-svg"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", padding: 20, background: "#faf7f2" }}
  >
    <path d="M25 80 L75 80 L65 25 L35 25 Z" fill="#d9a05b" stroke="#8c6239" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M35 25 L50 15 L65 25 Z" fill="#8c6239" stroke="#8c6239" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#8c6239" strokeWidth="2" />
    <path d="M44 48 C44 44 47 42 50 42 C53 42 56 44 56 48 C56 52 50 58 50 58 C50 58 44 52 44 48 Z" fill="#8c6239" />
    <circle cx="48" cy="46" r="1.5" fill="#ffffff" />
    <circle cx="52" cy="46" r="1.5" fill="#ffffff" />
    <rect x="35" y="68" width="30" height="6" rx="2" fill="#8c6239" />
  </svg>
);

const CART_KEY = "noblecachorro_cart";

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function Home() {
  const rawProducts = (useQuery(api.public.listProducts) ?? []) as Product[];
  const rawReviews = (useQuery(api.public.listReviews) ?? []) as Review[];
  const rawConfig = useQuery(api.public.getSiteConfig);

  // Preview en vivo: el editor (/admin) inyecta cambios sin guardar vía postMessage.
  const [preview, setPreview] = useState<{
    products?: Product[];
    reviews?: Review[];
    config?: typeof rawConfig;
  } | null>(null);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e?.data?.type === "NOBLE_PREVIEW_UPDATE") {
        setPreview(e.data.payload ?? null);
      }
    }
    window.addEventListener("message", onMsg);
    // Avisar al editor que el iframe está listo para recibir actualizaciones.
    try {
      window.parent?.postMessage({ type: "NOBLE_PREVIEW_READY" }, "*");
    } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const products = preview?.products ?? rawProducts;
  const reviews = preview?.reviews ?? rawReviews;
  const config = preview?.config ?? rawConfig;
  const whatsappNumber = config?.whatsappNumber ?? "56929581205";
  const C: SiteContent = withDefaults(config?.content);
  const logo = (config as { logo?: string })?.logo ?? "/assets/logo.png";
  const logoLight = (config as { logoLight?: string })?.logoLight ?? "/assets/logo-light.png";
  const heroImage = (config as { heroImage?: string })?.heroImage ?? "/assets/hero_dog.png";
  const trasladoImage = (config as { trasladoImage?: string | null })?.trasladoImage ?? null;

  // Modo preview dentro del editor: resalta secciones y avisa al panel al hacer click.
  const [previewMode, setPreviewMode] = useState(false);
  useEffect(() => {
    const inIframe = window.self !== window.top;
    setPreviewMode(inIframe);
    if (inIframe) document.body.classList.add("preview-mode");
    return () => document.body.classList.remove("preview-mode");
  }, []);

  const secProps = (key: string) =>
    previewMode
      ? {
          "data-edit-section": key,
          onClick: () => {
            try {
              window.parent?.postMessage(
                { type: "NOBLE_PREVIEW_CLICK_SECTION", section: key },
                "*",
              );
            } catch {}
          },
        }
      : {};

  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pequena" | "grande" | "alimento">("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartPop, setCartPop] = useState(false);

  // Cargar estado persistido (solo en cliente, evita mismatch de hidratación).
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
  }, [cartOpen]);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  // --- Carrito ---
  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 }];
    });
    showToast(`¡${p.name} añadido al carrito!`, "success");
    setCartPop(true);
    setTimeout(() => setCartPop(false), 450);
  };

  const removeFromCart = (id: string) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    showToast(`${item ? item.name : "Producto"} eliminado del carrito.`, "info");
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast("Carrito de compras vaciado.", "danger");
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const checkoutCart = () => {
    if (cart.length === 0) return;
    let message = "¡Hola Criadero Noble Cachorro! 🐾\n";
    message += "Me gustaría realizar un pedido de los siguientes cachorros/alimentos:\n\n";
    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      message += `• *${item.quantity}x ${item.name}* - ${formatPrice(item.price)} c/u (Subtotal: ${formatPrice(subtotal)})\n`;
    });
    message += `\n*Total estimado: ${formatPrice(totalAmount)}*\n\n`;
    message += "Quedo atento a la confirmación de la disponibilidad y los detalles de envío/retiro. ¡Muchas gracias! 🐶";
    showToast("Abriendo WhatsApp para procesar tu pedido...", "success");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const messageContent = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    let msg = "¡Hola Criadero Noble Cachorro! 🐾\n";
    msg += "Quiero realizar una consulta de crianza o disponibilidad:\n\n";
    msg += `*Nombre:* ${name}\n*Teléfono:* ${phone}\n*Consulta:* ${messageContent}\n\n`;
    msg += "Agradezco tu asesoría.";
    showToast("Abriendo WhatsApp para enviar mensaje...", "success");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    form.reset();
  };

  // --- Catálogo filtrado ---
  const filtered = products.filter((p) => {
    const matchesFilter = filter === "all" || p.category === filter;
    const q = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const closeMobile = () => setMobileNavOpen(false);

  return (
    <>
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type} show`}>
            <i
              className={
                t.type === "success"
                  ? "fa-solid fa-circle-check"
                  : t.type === "danger"
                    ? "fa-solid fa-circle-exclamation"
                    : "fa-solid fa-info-circle"
              }
            />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Cabecera */}
      <header className={`header${scrolled ? " scrolled" : ""}`} id="main-header">
        <div className="header-container container">
          <a href="#" className="logo" aria-label="Criadero Noble Cachorro - Página de inicio" {...secProps("logo")}>
            <img src={logo} alt="Noble Cachorro Logo" className="logo-img" id="logo-branding" width={96} height={96} />
            <span className="logo-text sr-only">Noble Cachorro</span>
          </a>
          <nav className="nav" id="desktop-nav" aria-label="Menú principal de navegación">
            <ul className="nav-list">
              <li><a href="#inicio" className="nav-link active">Inicio</a></li>
              <li><a href="#nosotros" className="nav-link">Sobre Nosotros</a></li>
              <li><a href="#garantias" className="nav-link">Garantías</a></li>
              <li><a href="#servicios" className="nav-link">Servicios</a></li>
              <li><a href="#traslado" className="nav-link">Traslado</a></li>
              <li><a href="#tienda" className="nav-link">Cachorros y Tienda</a></li>
              <li><a href="#clientes-felices" className="nav-link">Clientes Felices</a></li>
              <li><a href="#faq" className="nav-link">Preguntas Frecuentes</a></li>
              <li><a href="#contacto" className="nav-link">Contacto</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button className={`cart-btn${cartPop ? " cart-pop" : ""}`} id="cart-toggle" aria-label={`Ver carrito de compras. ${totalItems} productos añadidos.`} onClick={() => setCartOpen(true)}>
              <i className="fa-solid fa-shopping-basket" aria-hidden="true"></i>
              <span className="cart-badge" id="cart-badge-count">{totalItems}</span>
            </button>
            <button className="mobile-nav-toggle" id="mobile-nav-toggle-btn" aria-label="Abrir menú de navegación" onClick={() => setMobileNavOpen(true)}>
              <i className="fa-solid fa-bars" id="menu-icon-bars" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div className={`mobile-nav${mobileNavOpen ? " open" : ""}`} id="mobile-nav-menu" aria-hidden={!mobileNavOpen}>
        <div className="mobile-nav-overlay" id="mobile-nav-overlay" onClick={closeMobile}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <a href="#" className="logo" style={{ gap: 8 }} onClick={closeMobile}>
              <img src={logo} alt="Noble Cachorro Logo" className="logo-img" style={{ height: 76 }} width={76} height={76} />
              <span className="mobile-logo-text sr-only">Noble Cachorro</span>
            </a>
            <button className="mobile-nav-close" id="mobile-nav-close-btn" aria-label="Cerrar menú de navegación" onClick={closeMobile}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
          <nav className="mobile-menu" aria-label="Menú de navegación móvil">
            <ul>
              <li><a href="#inicio" className="mobile-nav-link" onClick={closeMobile}>Inicio</a></li>
              <li><a href="#nosotros" className="mobile-nav-link" onClick={closeMobile}>Sobre Nosotros</a></li>
              <li><a href="#garantias" className="mobile-nav-link" onClick={closeMobile}>Garantías</a></li>
              <li><a href="#servicios" className="mobile-nav-link" onClick={closeMobile}>Servicios</a></li>
              <li><a href="#traslado" className="mobile-nav-link" onClick={closeMobile}>Traslado de Mascota</a></li>
              <li><a href="#tienda" className="mobile-nav-link" onClick={closeMobile}>Cachorros y Tienda</a></li>
              <li><a href="#clientes-felices" className="mobile-nav-link" onClick={closeMobile}>Clientes Felices</a></li>
              <li><a href="#faq" className="mobile-nav-link" onClick={closeMobile}>Preguntas Frecuentes</a></li>
              <li><a href="#contacto" className="mobile-nav-link" onClick={closeMobile}>Contacto</a></li>
            </ul>
          </nav>
          <div className="mobile-nav-footer">
            <p>Criando con amor y responsabilidad desde 2017.</p>
            <div className="social-links-mobile">
              <a href={C.contacto.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href={C.contacto.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href={C.contacto.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              <a href={C.contacto.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </div>

      <main>
        {/* Hero */}
        <section className="hero" id="inicio" aria-labelledby="hero-title" {...secProps("hero")}>
          <div className="hero-container container">
            <div className="hero-content">
              <div className="badge-premium"><i className="fa-solid fa-certificate"></i> Crianza Responsable y Certificada</div>
              <h1 className="hero-title" id="hero-title">{C.hero.title}</h1>
              <p className="hero-subtitle" id="hero-subtitle">{C.hero.subtitle}</p>
              <div className="hero-actions">
                <a href="#tienda" className="btn btn-primary" id="btn-hero-explore">Explorar Cachorros</a>
                <a href={`https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20recibir%20asesoría%20sobre%20los%20cachorros%20disponibles.`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" id="btn-hero-consult">
                  <i className="fa-brands fa-whatsapp"></i> Hablar con Asesor
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><span className="stat-num">9+</span><span className="stat-desc">Años de Crianza</span></div>
                <div className="stat-item"><span className="stat-num">300+</span><span className="stat-desc">Familias Felices</span></div>
                <div className="stat-item"><span className="stat-num">100%</span><span className="stat-desc">Amor &amp; Cuidado</span></div>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="hero-image-bg"></div>
              <img src={heroImage} alt="Hermosos cachorros criados por Noble Cachorro listos para su nuevo hogar" className="hero-img" width={600} height={520} />
            </div>
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section className="about section-padding" id="nosotros" aria-labelledby="about-title" {...secProps("nosotros")}>
          <div className="container grid-about">
            <div className="about-images">
              <div className="about-image-main"><img src="/assets/poodle.png" alt="Cachorro Poodle criado en Angol" className="about-img-1" loading="lazy" width={300} height={300} /></div>
              <div className="about-image-sub"><img src="/assets/pomerania.png" alt="Cachorro Pomerania jugando" className="about-img-2" loading="lazy" width={220} height={220} /></div>
              <div className="experience-card"><span className="exp-number">9+</span><span className="exp-text">Años de Amor Canino</span></div>
            </div>
            <div className="about-content">
              <div className="section-tag">Conócenos</div>
              <h2 className="section-title" id="about-title">{C.about.title}</h2>
              <p className="about-text" id="about-text-main">{C.about.text}</p>
              <p className="about-text-secondary" id="about-text-sub">{C.about.textSecondary}</p>
              <ul className="about-features">
                {C.about.features.map((f, i) => (
                  <li key={i}><i className="fa-solid fa-shield-dog"></i> {f}</li>
                ))}
              </ul>
              <a href="#contacto" className="btn btn-outline" id="btn-about-visit">Visítanos en el Criadero</a>
            </div>
          </div>
        </section>

        {/* Garantías */}
        <section className="garantias section-padding" id="garantias" aria-labelledby="garantias-title" {...secProps("garantias")}>
          <div className="container text-center">
            <div className="section-tag">{C.garantias.tag}</div>
            <h2 className="section-title" id="garantias-title">{C.garantias.title}</h2>
            <p className="section-subtitle">{C.garantias.subtitle}</p>
            <div className="garantias-grid">
              {C.garantias.cards.map((card, i) => (
                <div className="garantia-card" key={i}>
                  <div className="garantia-icon"><i className={card.icon}></i></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="servicios section-padding" id="servicios" aria-labelledby="servicios-title" {...secProps("servicios")}>
          <div className="container text-center">
            <div className="section-tag">{C.servicios.tag}</div>
            <h2 className="section-title" id="servicios-title">{C.servicios.title}</h2>
            <p className="section-subtitle">{C.servicios.subtitle}</p>
            <div className="servicios-grid">
              {C.servicios.cards.map((card, i) => (
                <div className="servicio-card" key={i}>
                  <div className="servicio-icon"><i className={card.icon}></i></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traslado de la Mascota */}
        <section className="traslado section-padding" id="traslado" aria-labelledby="traslado-title" {...secProps("traslado")}>
          <div className="container">
            <div className="traslado-header">
              <div className="section-tag">{C.traslado.tag}</div>
              <h2 className="section-title" id="traslado-title">{C.traslado.title}</h2>
              <p className="section-subtitle">{C.traslado.intro}</p>
            </div>
            <div className="traslado-body">
              {trasladoImage && (
                <div className="traslado-image">
                  <img src={trasladoImage} alt="Traslado seguro de cachorros del Criadero Noble Cachorro" loading="lazy" />
                </div>
              )}
              <div className="traslado-steps">
                {C.traslado.steps.map((step, i) => (
                  <div className="traslado-step" key={i}>
                    <div className="traslado-step-num">{i + 1}</div>
                    <div className="traslado-step-body">
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="traslado-note">{C.traslado.note}</p>
            <div className="traslado-cta text-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Criadero Noble Cachorro! 🐾 Quiero coordinar el traslado de mi cachorro. ¿Me ayudan con el proceso?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="fa-brands fa-whatsapp"></i> {C.traslado.cta}
              </a>
            </div>
          </div>
        </section>

        {/* Tienda */}
        <section className="tienda section-padding" id="tienda" aria-labelledby="tienda-title" {...secProps("productos")}>
          <div className="container">
            <div className="text-center">
              <div className="section-tag">Catálogo</div>
              <h2 className="section-title" id="tienda-title">Elige a tu Compañero Ideal</h2>
              <p className="section-subtitle">Cachorros saludables criados bajo altos estándares veterinarios. Filtra por tamaño o busca tu raza favorita.</p>
            </div>
            <div className="catalog-filters">
              <div className="search-wrapper">
                <label htmlFor="catalog-search" className="sr-only">Buscar por nombre de raza o producto</label>
                <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
                <input type="search" id="catalog-search" className="search-input" placeholder="Buscar raza o producto..." aria-label="Buscar productos" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="filter-buttons" role="group" aria-label="Filtros de catálogo">
                <button className={`filter-btn${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>Todos</button>
                <button className={`filter-btn${filter === "pequena" ? " active" : ""}`} onClick={() => setFilter("pequena")}>Razas Pequeñas</button>
                <button className={`filter-btn${filter === "grande" ? " active" : ""}`} onClick={() => setFilter("grande")}>Razas Grandes</button>
                <button className={`filter-btn${filter === "alimento" ? " active" : ""}`} onClick={() => setFilter("alimento")}>Alimento &amp; Accesorios</button>
              </div>
            </div>
            <div className="products-grid" id="products-catalog-grid">
              {filtered.length === 0 ? (
                <div className="no-products text-center" style={{ gridColumn: "1 / -1", padding: "60px 0" }}>
                  <i className="fa-solid fa-paw" style={{ fontSize: "3rem", color: "var(--secondary)", marginBottom: 16 }}></i>
                  <p style={{ fontSize: "1.15rem", color: "var(--text-muted)" }}>No encontramos cachorros o productos que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                filtered.map((p) => (
                  <article className="product-card" data-id={p.id} key={p.id}>
                    <div className="product-image-wrapper">
                      {p.category === "alimento" ? (
                        <span className="badge-tag alimento">Alimento</span>
                      ) : (
                        <span className="badge-tag">{p.category === "pequena" ? "Razas Pequeñas" : "Razas Grandes"}</span>
                      )}
                      {p.hasKcc && (
                        <div className="badge-kcc" title="Certificado de Pureza Kennel Club Chile">
                          <i className="fa-solid fa-certificate" aria-hidden="true"></i> KCC
                        </div>
                      )}
                      {p.image ? (
                        <img src={p.image} alt={p.alt} className="product-img" loading="lazy" width={280} height={280} />
                      ) : (
                        <FoodBagSVG />
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{p.name}</h3>
                      <p className="product-description">{p.description}</p>
                      <div className="product-footer">
                        <div className="product-price">
                          <span className="price-label">Valor aproximado</span>
                          <div>
                            <span className="price-value">{formatPrice(p.price)}</span>
                            {p.originalPrice && (
                              <span className="price-original" style={{ textDecoration: "line-through", fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: 6 }}>
                                {formatPrice(p.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="add-to-cart-btn" aria-label={`Agregar ${p.name} al carrito`} onClick={() => addToCart(p)}>
                          <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Clientes Felices */}
        <section className="clientes-felices section-padding" id="clientes-felices" aria-labelledby="clientes-title" {...secProps("resenas")}>
          <div className="container">
            <div className="text-center">
              <div className="section-tag">Comunidad</div>
              <h2 className="section-title" id="clientes-title">Clientes Felices</h2>
              <p className="section-subtitle">Compartimos la alegría y emoción de las familias al recibir a sus cachorros de Criadero Noble Cachorro.</p>
            </div>
            <div className="clients-grid" id="clients-photos-grid">
              {reviews.map((photo) => (
                <div className="client-card" key={photo.id}>
                  <div className="client-img-wrapper">
                    {photo.image && <img src={photo.image} alt="Cliente feliz recibiendo cachorro" className="client-img" loading="lazy" width={280} height={210} />}
                  </div>
                  <div className="client-card-body">
                    <p className="client-feedback">{photo.feedback}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                      <span className="client-name">{photo.name}</span>
                      <span className="client-date">{photo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq section-padding" id="faq" aria-labelledby="faq-title" {...secProps("faq")}>
          <div className="container faq-container">
            <div className="text-center">
              <div className="section-tag">{C.faq.tag}</div>
              <h2 className="section-title" id="faq-title">{C.faq.title}</h2>
              <p className="section-subtitle">{C.faq.subtitle}</p>
            </div>
            <div className="accordion" id="faq-accordion">
              {C.faq.items.map((item, i) => (
                <div className={`accordion-item${faqOpen === i ? " active" : ""}`} key={i}>
                  <button className="accordion-header" aria-expanded={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <span>{item.q}</span>
                    <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </button>
                  <div className="accordion-content" hidden={faqOpen !== i}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="contacto section-padding" id="contacto" aria-labelledby="contacto-title" {...secProps("contacto")}>
          <div className="container grid-contacto">
            <div className="contacto-info">
              <div className="section-tag">{C.contacto.tag}</div>
              <h2 className="section-title text-left" id="contacto-title">{C.contacto.title}</h2>
              <p className="contacto-description">{C.contacto.description}</p>
              <div className="info-items">
                <div className="info-item"><i className="fa-solid fa-map-location-dot" aria-hidden="true"></i><div><h3>Ubicación</h3><p id="contact-address">{C.contacto.address}</p></div></div>
                <div className="info-item"><i className="fa-solid fa-clock" aria-hidden="true"></i><div><h3>Atención Presencial</h3><p>{C.contacto.hours}</p></div></div>
                <div className="info-item"><i className="fa-solid fa-paper-plane" aria-hidden="true"></i><div><h3>Contacto Online</h3><p>{C.contacto.online}</p></div></div>
              </div>
              <div className="social-links">
                <a href={C.contacto.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href={C.contacto.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href={C.contacto.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
                <a href={C.contacto.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              </div>
              <div className="contacto-map">
                <iframe
                  title="Ubicación del criadero en Google Maps"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(C.contacto.address)}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="contacto-card">
              <h3>Envíanos un Mensaje</h3>
              <p>Te responderemos por correo o directamente por WhatsApp en unos minutos.</p>
              <form id="contact-form" className="contact-form" onSubmit={handleContact}>
                <div className="form-group"><label htmlFor="contact-name">Nombre Completo</label><input type="text" id="contact-name" name="name" required placeholder="Ej. Juan Pérez" /></div>
                <div className="form-group"><label htmlFor="contact-phone">Teléfono / WhatsApp</label><input type="tel" id="contact-phone" name="phone" required placeholder="Ej. +56 9 1234 5678" /></div>
                <div className="form-group"><label htmlFor="contact-message">¿Qué raza o producto te interesa?</label><textarea id="contact-message" name="message" rows={4} required placeholder="Ej. Estoy interesado en un cachorro Pastor Alemán..."></textarea></div>
                <button type="submit" className="btn btn-primary btn-block" id="btn-submit-contact">Enviar por WhatsApp</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Carrito lateral */}
      <aside className={`cart-drawer${cartOpen ? " open" : ""}`} id="cart-drawer" aria-hidden={!cartOpen} role="dialog" aria-labelledby="cart-title">
        <div className="cart-drawer-overlay" onClick={() => setCartOpen(false)}></div>
        <div className="cart-drawer-content">
          <div className="cart-drawer-header">
            <h2 id="cart-title"><i className="fa-solid fa-shopping-basket"></i> Tu Carrito</h2>
            <button className="cart-drawer-close" aria-label="Cerrar carrito de compras" onClick={() => setCartOpen(false)}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
          <div className="cart-drawer-items" id="cart-items-container">
            {cart.length === 0 ? (
              <div className="cart-empty-message">
                <i className="fa-solid fa-shopping-basket" aria-hidden="true"></i>
                <p>Tu carrito está vacío.</p>
                <span style={{ fontSize: "0.85rem", marginTop: 8 }}>¡Añade un cachorro o alimento para comenzar tu pedido!</span>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-img-placeholder" style={{ width: 70, height: 70, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf7f2", borderRadius: "var(--border-radius-sm)", border: "1px solid rgba(140, 98, 57, 0.1)" }}>
                      <i className="fa-solid fa-bag-shopping" style={{ color: "var(--primary)" }}></i>
                    </div>
                  )}
                  <div className="cart-item-details">
                    <div>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-control" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button className="qty-btn" aria-label="Disminuir cantidad" onClick={() => changeQuantity(item.id, -1)}>-</button>
                        <span className="qty-value" aria-live="polite">{item.quantity}</span>
                        <button className="qty-btn" aria-label="Aumentar cantidad" onClick={() => changeQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="remove-item-btn" aria-label={`Eliminar ${item.name} del carrito`} onClick={() => removeFromCart(item.id)}>
                        <i className="fa-solid fa-trash-can" aria-hidden="true"></i> Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-drawer-footer">
            <div className="cart-total-row"><span>Subtotal</span><span id="cart-total-amount">{formatPrice(totalAmount)}</span></div>
            <p className="cart-delivery-note"><i className="fa-solid fa-truck-fast"></i> El despacho se coordina tras la compra.</p>
            <button className="btn btn-primary btn-block btn-checkout" disabled={cart.length === 0} onClick={checkoutCart}>
              <i className="fa-brands fa-whatsapp"></i> Completar Pedido por WhatsApp
            </button>
            {cart.length > 0 && <button className="btn btn-text btn-block" onClick={clearCart}>Vaciar Carrito</button>}
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="footer" {...secProps("footer")}>
        <div className="container grid-footer">
          <div className="footer-brand">
            <div className="footer-logo"><img src={logoLight} alt="Noble Cachorro Logo" className="footer-logo-img" width={140} height={140} /><span className="sr-only">Noble Cachorro</span></div>
            <p className="footer-description">{C.footer.description}</p>
          </div>
          <div className="footer-links">
            <h3>Enlaces Útiles</h3>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#nosotros">Sobre Nosotros</a></li>
              <li><a href="#garantias">Garantías y Certificados</a></li>
              <li><a href="#tienda">Catálogo de Cachorros</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Documentación</h3>
            <ul>
              <li><a href="#garantias">Certificado KCC</a></li>
              <li><a href="#garantias">Calendario Vacunas</a></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          <div className="footer-contacto">
            <h3>Contacto</h3>
            <p><i className="fa-solid fa-phone"></i> <span id="footer-phone">{C.footer.phone}</span></p>
            <p><i className="fa-solid fa-envelope"></i> <span id="footer-email">{C.footer.email}</span></p>
            <p><i className="fa-solid fa-location-dot"></i> <span id="footer-address">{C.footer.address}</span></p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-content">
            <div className="footer-copyright-legal">
              <p>{C.footer.copyright}</p>
              <div className="footer-legal-links">
                <a href="/politicas-privacidad">Políticas de Privacidad</a>
                <span className="separator">•</span>
                <a href="/terminos-condiciones">Términos y Condiciones</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}


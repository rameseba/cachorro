"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../useAdmin";
import { DEFAULT_CONTENT, SiteContent, withDefaults } from "@/app/lib/defaultContent";

type Cat = "pequena" | "grande" | "alimento";

const SECTIONS: { key: string; label: string; hint: string }[] = [
  { key: "productos", label: "Productos", hint: "Catálogo de cachorros y alimentos" },
  { key: "resenas", label: "Reseñas", hint: "Clientes felices" },
  { key: "hero", label: "Portada (Hero)", hint: "Título y subtítulo principal" },
  { key: "nosotros", label: "Sobre Nosotros", hint: "Texto y características" },
  { key: "garantias", label: "Garantías", hint: "Las 4 tarjetas" },
  { key: "servicios", label: "Servicios", hint: "Tarjetas de servicios" },
  { key: "traslado", label: "Traslado de Mascota", hint: "Proceso paso a paso + foto" },
  { key: "faq", label: "Preguntas (FAQ)", hint: "Preguntas frecuentes" },
  { key: "contacto", label: "Contacto", hint: "Dirección, horarios y redes" },
  { key: "footer", label: "Pie de página", hint: "Descripción y datos" },
  { key: "logo", label: "Logo", hint: "Imagen del logo (cabecera y footer)" },
  { key: "legales", label: "Páginas legales", hint: "Privacidad y términos" },
  { key: "config", label: "WhatsApp", hint: "Número de contacto" },
];

// Campo de texto reutilizable
function Field({ label, value, onChange, area, ph }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; ph?: string }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {area ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph} />
      )}
    </div>
  );
}

export default function Editor() {
  const router = useRouter();
  const { token, setToken, loaded } = useAdminToken();
  const valid = useQuery(api.admin.sesionValida, token ? { token } : "skip");

  useEffect(() => {
    if (loaded && !token) router.replace("/admin/login");
  }, [loaded, token, router]);
  useEffect(() => {
    if (valid === false) {
      setToken(null);
      router.replace("/admin/login");
    }
  }, [valid, setToken, router]);

  const [panelView, setPanelView] = useState<"list" | "section">("list");
  const [section, setSection] = useState<string>("productos");

  const openSection = (key: string) => {
    setSection(key);
    setPanelView("section");
  };

  // --- Datos del servidor ---
  const products = useQuery(api.admin.listProductsAdmin, token ? { token } : "skip");
  const reviews = useQuery(api.admin.listReviewsAdmin, token ? { token } : "skip");
  const config = useQuery(api.public.getSiteConfig);

  // --- Mutations ---
  const createProduct = useMutation(api.admin.createProduct);
  const updateProduct = useMutation(api.admin.updateProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const createReview = useMutation(api.admin.createReview);
  const updateReview = useMutation(api.admin.updateReview);
  const deleteReview = useMutation(api.admin.deleteReview);
  const updateSiteConfig = useMutation(api.admin.updateSiteConfig);
  const updateContent = useMutation(api.admin.updateContent);
  const updateLogo = useMutation(api.admin.updateLogo);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);

  // --- Estado editable ---
  const [pEdits, setPEdits] = useState<Record<string, Record<string, unknown>>>({});
  const [rEdits, setREdits] = useState<Record<string, Record<string, unknown>>>({});
  const [whatsapp, setWhatsapp] = useState("");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const loadedRef = useRef(false);
  const [savedFlag, setSavedFlag] = useState<string | null>(null);

  useEffect(() => {
    if (config && !loadedRef.current) {
      setWhatsapp(config.whatsappNumber ?? "");
      setContent(withDefaults(config.content));
      loadedRef.current = true;
    }
  }, [config]);

  const flash = (msg: string) => {
    setSavedFlag(msg);
    setTimeout(() => setSavedFlag(null), 2000);
  };

  // Helper para editar el objeto content de forma inmutable
  const upd = (fn: (c: SiteContent) => void) =>
    setContent((prev) => {
      const n = structuredClone(prev);
      fn(n);
      return n;
    });

  const saveContent = async () => {
    await updateContent({ token: token!, content });
    flash("Contenido guardado");
  };

  const pVal = (p: any, f: string) => (pEdits[p._id]?.[f] ?? p[f]);
  const rVal = (r: any, f: string) => (rEdits[r._id]?.[f] ?? r[f]);

  // --- Preview en vivo ---
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const previewPayload = useMemo(() => {
    const mappedProducts = (products ?? []).map((p: any) => ({
      id: p._id,
      name: pVal(p, "name"),
      category: pVal(p, "category"),
      price: Number(pVal(p, "price")) || 0,
      originalPrice: (pVal(p, "originalPrice") as number) ?? null,
      description: pVal(p, "description"),
      image: p.resolvedImage ?? null,
      alt: pVal(p, "alt") ?? pVal(p, "name"),
      hasKcc: Boolean(pVal(p, "hasKcc")),
      isPuppy: Boolean(pVal(p, "isPuppy")),
      weight: (pVal(p, "weight") as string) ?? null,
      height: (pVal(p, "height") as string) ?? null,
      lifespan: (pVal(p, "lifespan") as string) ?? null,
      coat: (pVal(p, "coat") as string) ?? null,
      temperament: (pVal(p, "temperament") as string) ?? null,
      characteristics: (pVal(p, "characteristics") as string) ?? null,
    }));
    const mappedReviews = (reviews ?? []).map((r: any) => ({
      id: r._id,
      name: rVal(r, "name"),
      date: rVal(r, "date") ?? "",
      feedback: rVal(r, "feedback"),
      image: r.resolvedImage ?? null,
    }));
    return {
      products: mappedProducts,
      reviews: mappedReviews,
      config: {
        whatsappNumber: whatsapp || "56929581205",
        content,
        logo: config?.logo ?? "/assets/logo.png",
        logoLight: config?.logoLight ?? "/assets/logo-light.png",
        heroImage: (config as { heroImage?: string })?.heroImage ?? "/assets/hero_dog.png",
        trasladoImage: (config as { trasladoImage?: string | null })?.trasladoImage ?? null,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, reviews, pEdits, rEdits, whatsapp, content, config]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e?.data?.type === "NOBLE_PREVIEW_READY") setIframeReady(true);
      if (e?.data?.type === "NOBLE_PREVIEW_CLICK_SECTION" && e.data.section) {
        openSection(e.data.section);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    if (!iframeReady) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "NOBLE_PREVIEW_UPDATE", payload: previewPayload },
      "*",
    );
  }, [iframeReady, previewPayload]);

  async function uploadImage(file: File): Promise<string> {
    const url = await generateUploadUrl({ token: token! });
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    return storageId;
  }

  if (!loaded || !token) return null;

  const current = SECTIONS.find((s) => s.key === section);

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1>
          <img src="/assets/logo.png" alt="" style={{ height: 30, width: 30 }} /> Editor Web
        </h1>
        <div className="admin-topbar-actions">
          {savedFlag && <span className="admin-saved">✓ {savedFlag}</span>}
          <a className="admin-btn admin-btn-ghost admin-btn-sm" href="/" target="_blank" rel="noreferrer">Ver sitio ↗</a>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setToken(null); router.replace("/admin/login"); }}>Salir</button>
        </div>
      </div>

      <div className="admin-body">
        <div className="admin-panel">
          {panelView === "list" ? (
            <div>
              <p className="admin-hint-top">Elige una sección para editar. También puedes hacer <strong>click en una sección del preview</strong> → se abre aquí.</p>
              {SECTIONS.map((s) => (
                <button key={s.key} className="admin-section-row" onClick={() => openSection(s.key)}>
                  <span className="admin-section-row-label">{s.label}</span>
                  <span className="admin-section-row-hint">{s.hint}</span>
                  <span className="admin-section-row-arrow">›</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="admin-section-head">
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPanelView("list")}>‹ Secciones</button>
                <strong>{current?.label}</strong>
              </div>

              {/* ----- PRODUCTOS ----- */}
              {section === "productos" && (
                <div>
                  <div className="admin-section-title">
                    <span>Catálogo ({products?.length ?? 0})</span>
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={async () => { await createProduct({ token, name: "Nuevo producto", category: "pequena", price: 0, description: "Descripción del producto.", hasKcc: true, isPuppy: true }); flash("Producto añadido"); }}>+ Añadir</button>
                  </div>
                  {(products ?? []).map((p: any) => (
                    <div className="admin-card" key={p._id}>
                      <div className="admin-card-row">
                        {p.resolvedImage ? <img className="admin-thumb" src={p.resolvedImage} alt="" /> : <div className="admin-thumb" />}
                        <div style={{ flex: 1 }}>
                          <Field label="Nombre" value={pVal(p, "name") as string} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], name: v } }))} />
                          <div className="admin-field-row">
                            <div className="admin-field">
                              <label>Categoría</label>
                              <select value={pVal(p, "category") as Cat} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], category: e.target.value } }))}>
                                <option value="pequena">Raza Pequeña</option>
                                <option value="grande">Raza Grande</option>
                                <option value="alimento">Alimento</option>
                              </select>
                            </div>
                            <div className="admin-field">
                              <label>Precio</label>
                              <input type="number" value={pVal(p, "price") as number} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], price: Number(e.target.value) } }))} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Field label="Descripción" area value={pVal(p, "description") as string} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], description: v } }))} />
                      <div className="admin-field-row">
                        <div className="admin-field">
                          <label>Precio antes (opcional)</label>
                          <input type="number" value={(pVal(p, "originalPrice") as number) ?? ""} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], originalPrice: e.target.value === "" ? null : Number(e.target.value) } }))} />
                        </div>
                      </div>
                      <details className="admin-ficha">
                        <summary>Ficha informativa del cachorro</summary>
                        <div className="admin-field-row">
                          <Field label="Peso" value={(pVal(p, "weight") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], weight: v } }))} ph="Ej. 3 - 5 kg" />
                          <Field label="Estatura promedio" value={(pVal(p, "height") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], height: v } }))} ph="Ej. 25 - 30 cm" />
                        </div>
                        <div className="admin-field-row">
                          <Field label="Esperanza de vida" value={(pVal(p, "lifespan") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], lifespan: v } }))} ph="Ej. 12 - 15 años" />
                          <Field label="Tipo de pelaje" value={(pVal(p, "coat") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], coat: v } }))} ph="Ej. Doble capa, largo" />
                        </div>
                        <Field label="Temperamento" value={(pVal(p, "temperament") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], temperament: v } }))} ph="Ej. Dócil, juguetón, leal" />
                        <Field label="Características / descripción completa" area value={(pVal(p, "characteristics") as string) ?? ""} onChange={(v) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], characteristics: v } }))} ph="Información relevante del cachorro para su ficha." />
                      </details>
                      <div className="admin-card-actions">
                        <label className="admin-checkbox"><input type="checkbox" checked={Boolean(pVal(p, "hasKcc"))} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], hasKcc: e.target.checked } }))} /> KCC</label>
                        <label className="admin-checkbox"><input type="checkbox" checked={Boolean(pVal(p, "active"))} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], active: e.target.checked } }))} /> Visible</label>
                        <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                          Imagen
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateProduct({ token, id: p._id, imageStorageId: storageId as any }); flash("Imagen actualizada"); e.target.value = ""; }} />
                        </label>
                        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={async () => { const ed = pEdits[p._id] ?? {}; await updateProduct({ token, id: p._id, ...(ed as any) }); setPEdits((s) => { const n = { ...s }; delete n[p._id]; return n; }); flash("Producto guardado"); }}>Guardar</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { if (!confirm(`¿Eliminar "${pVal(p, "name")}"?`)) return; await deleteProduct({ token, id: p._id }); flash("Producto eliminado"); }}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ----- RESEÑAS ----- */}
              {section === "resenas" && (
                <div>
                  <div className="admin-section-title">
                    <span>Reseñas ({reviews?.length ?? 0})</span>
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={async () => { await createReview({ token, name: "Cliente Feliz", date: "Reciente", feedback: "¡Gracias por nuestro cachorro!" }); flash("Reseña añadida"); }}>+ Añadir</button>
                  </div>
                  {(reviews ?? []).map((r: any) => (
                    <div className="admin-card" key={r._id}>
                      <div className="admin-card-row">
                        {r.resolvedImage ? <img className="admin-thumb" src={r.resolvedImage} alt="" /> : <div className="admin-thumb" />}
                        <div style={{ flex: 1 }}>
                          <div className="admin-field-row">
                            <Field label="Nombre" value={rVal(r, "name") as string} onChange={(v) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], name: v } }))} />
                            <Field label="Fecha" value={(rVal(r, "date") as string) ?? ""} onChange={(v) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], date: v } }))} />
                          </div>
                        </div>
                      </div>
                      <Field label="Comentario" area value={rVal(r, "feedback") as string} onChange={(v) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], feedback: v } }))} />
                      <div className="admin-card-actions">
                        <label className="admin-checkbox"><input type="checkbox" checked={Boolean(rVal(r, "active"))} onChange={(e) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], active: e.target.checked } }))} /> Visible</label>
                        <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                          Imagen
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateReview({ token, id: r._id, imageStorageId: storageId as any }); flash("Imagen actualizada"); e.target.value = ""; }} />
                        </label>
                        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={async () => { const ed = rEdits[r._id] ?? {}; await updateReview({ token, id: r._id, ...(ed as any) }); setREdits((s) => { const n = { ...s }; delete n[r._id]; return n; }); flash("Reseña guardada"); }}>Guardar</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { if (!confirm("¿Eliminar esta reseña?")) return; await deleteReview({ token, id: r._id }); flash("Reseña eliminada"); }}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ----- HERO ----- */}
              {section === "hero" && (
                <div className="admin-card">
                  <Field label="Título" area value={content.hero.title} onChange={(v) => upd((c) => { c.hero.title = v; })} />
                  <Field label="Subtítulo" area value={content.hero.subtitle} onChange={(v) => upd((c) => { c.hero.subtitle = v; })} />
                  <div className="admin-field">
                    <label>Imagen de portada (banner principal)</label>
                    <div className="admin-card-row">
                      <img className="admin-thumb" src={(config as any)?.heroImage ?? "/assets/hero_dog.png"} alt="Banner" style={{ background: "#faf7f2" }} />
                      <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                        Cambiar imagen
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateLogo({ token: token!, slot: "hero", storageId: storageId as any }); flash("Banner actualizado"); e.target.value = ""; }} />
                      </label>
                    </div>
                  </div>
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- NOSOTROS ----- */}
              {section === "nosotros" && (
                <div className="admin-card">
                  <Field label="Título" value={content.about.title} onChange={(v) => upd((c) => { c.about.title = v; })} />
                  <Field label="Texto principal" area value={content.about.text} onChange={(v) => upd((c) => { c.about.text = v; })} />
                  <Field label="Texto secundario" area value={content.about.textSecondary} onChange={(v) => upd((c) => { c.about.textSecondary = v; })} />
                  <label className="admin-field"><label>Características</label></label>
                  {content.about.features.map((f, i) => (
                    <div className="admin-field-row" key={i}>
                      <Field label={`#${i + 1}`} value={f} onChange={(v) => upd((c) => { c.about.features[i] = v; })} />
                      <button className="admin-btn admin-btn-danger admin-btn-sm" style={{ alignSelf: "flex-end", marginBottom: 10 }} onClick={() => upd((c) => { c.about.features.splice(i, 1); })}>✕</button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => upd((c) => { c.about.features.push("Nueva característica"); })}>+ Característica</button>
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- GARANTIAS ----- */}
              {section === "garantias" && (
                <div>
                  <div className="admin-card">
                    <Field label="Etiqueta" value={content.garantias.tag} onChange={(v) => upd((c) => { c.garantias.tag = v; })} />
                    <Field label="Título" value={content.garantias.title} onChange={(v) => upd((c) => { c.garantias.title = v; })} />
                    <Field label="Subtítulo" area value={content.garantias.subtitle} onChange={(v) => upd((c) => { c.garantias.subtitle = v; })} />
                  </div>
                  {content.garantias.cards.map((card, i) => (
                    <div className="admin-card" key={i}>
                      <Field label={`Tarjeta ${i + 1} — Título`} value={card.title} onChange={(v) => upd((c) => { c.garantias.cards[i].title = v; })} />
                      <Field label="Texto" area value={card.text} onChange={(v) => upd((c) => { c.garantias.cards[i].text = v; })} />
                    </div>
                  ))}
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- SERVICIOS ----- */}
              {section === "servicios" && (
                <div>
                  <div className="admin-card">
                    <Field label="Etiqueta" value={content.servicios.tag} onChange={(v) => upd((c) => { c.servicios.tag = v; })} />
                    <Field label="Título" value={content.servicios.title} onChange={(v) => upd((c) => { c.servicios.title = v; })} />
                    <Field label="Subtítulo" area value={content.servicios.subtitle} onChange={(v) => upd((c) => { c.servicios.subtitle = v; })} />
                  </div>
                  {content.servicios.cards.map((card, i) => (
                    <div className="admin-card" key={i}>
                      <Field label={`Servicio ${i + 1} — Título`} value={card.title} onChange={(v) => upd((c) => { c.servicios.cards[i].title = v; })} />
                      <Field label="Texto" area value={card.text} onChange={(v) => upd((c) => { c.servicios.cards[i].text = v; })} />
                      <Field label="Ícono (clase Font Awesome)" value={card.icon} onChange={(v) => upd((c) => { c.servicios.cards[i].icon = v; })} ph="fa-solid fa-paw" />
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => upd((c) => { c.servicios.cards.splice(i, 1); })}>Eliminar servicio</button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => upd((c) => { c.servicios.cards.push({ icon: "fa-solid fa-paw", title: "Nuevo servicio", text: "Descripción del servicio." }); })}>+ Servicio</button>
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- TRASLADO ----- */}
              {section === "traslado" && (
                <div>
                  <div className="admin-card">
                    <Field label="Etiqueta" value={content.traslado.tag} onChange={(v) => upd((c) => { c.traslado.tag = v; })} />
                    <Field label="Título" value={content.traslado.title} onChange={(v) => upd((c) => { c.traslado.title = v; })} />
                    <Field label="Introducción" area value={content.traslado.intro} onChange={(v) => upd((c) => { c.traslado.intro = v; })} />
                    <div className="admin-field">
                      <label>Foto del traslado (tu imagen)</label>
                      <div className="admin-card-row">
                        {(config as any)?.trasladoImage ? <img className="admin-thumb" src={(config as any).trasladoImage} alt="Traslado" /> : <div className="admin-thumb" />}
                        <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                          Subir foto
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateLogo({ token: token!, slot: "traslado", storageId: storageId as any }); flash("Foto del traslado actualizada"); e.target.value = ""; }} />
                        </label>
                      </div>
                    </div>
                  </div>
                  {content.traslado.steps.map((step, i) => (
                    <div className="admin-card" key={i}>
                      <Field label={`Paso ${i + 1} — Título`} value={step.title} onChange={(v) => upd((c) => { c.traslado.steps[i].title = v; })} />
                      <Field label="Texto" area value={step.text} onChange={(v) => upd((c) => { c.traslado.steps[i].text = v; })} />
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => upd((c) => { c.traslado.steps.splice(i, 1); })}>Eliminar paso</button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => upd((c) => { c.traslado.steps.push({ title: "Nuevo paso", text: "Descripción del paso." }); })}>+ Paso</button>
                  <div className="admin-card">
                    <Field label="Nota final" area value={content.traslado.note} onChange={(v) => upd((c) => { c.traslado.note = v; })} />
                    <Field label="Texto del botón (CTA)" value={content.traslado.cta} onChange={(v) => upd((c) => { c.traslado.cta = v; })} />
                  </div>
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- FAQ ----- */}
              {section === "faq" && (
                <div>
                  <div className="admin-card">
                    <Field label="Etiqueta" value={content.faq.tag} onChange={(v) => upd((c) => { c.faq.tag = v; })} />
                    <Field label="Título" value={content.faq.title} onChange={(v) => upd((c) => { c.faq.title = v; })} />
                    <Field label="Subtítulo" area value={content.faq.subtitle} onChange={(v) => upd((c) => { c.faq.subtitle = v; })} />
                  </div>
                  {content.faq.items.map((item, i) => (
                    <div className="admin-card" key={i}>
                      <Field label={`Pregunta ${i + 1}`} value={item.q} onChange={(v) => upd((c) => { c.faq.items[i].q = v; })} />
                      <Field label="Respuesta" area value={item.a} onChange={(v) => upd((c) => { c.faq.items[i].a = v; })} />
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => upd((c) => { c.faq.items.splice(i, 1); })}>Eliminar pregunta</button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => upd((c) => { c.faq.items.push({ q: "Nueva pregunta", a: "Respuesta." }); })}>+ Pregunta</button>
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- CONTACTO ----- */}
              {section === "contacto" && (
                <div className="admin-card">
                  <Field label="Etiqueta" value={content.contacto.tag} onChange={(v) => upd((c) => { c.contacto.tag = v; })} />
                  <Field label="Título" value={content.contacto.title} onChange={(v) => upd((c) => { c.contacto.title = v; })} />
                  <Field label="Descripción" area value={content.contacto.description} onChange={(v) => upd((c) => { c.contacto.description = v; })} />
                  <Field label="Dirección" value={content.contacto.address} onChange={(v) => upd((c) => { c.contacto.address = v; })} />
                  <Field label="Horario" value={content.contacto.hours} onChange={(v) => upd((c) => { c.contacto.hours = v; })} />
                  <Field label="Contacto online" value={content.contacto.online} onChange={(v) => upd((c) => { c.contacto.online = v; })} />
                  <Field label="Facebook (URL)" value={content.contacto.social.facebook} onChange={(v) => upd((c) => { c.contacto.social.facebook = v; })} />
                  <Field label="Instagram (URL)" value={content.contacto.social.instagram} onChange={(v) => upd((c) => { c.contacto.social.instagram = v; })} />
                  <Field label="TikTok (URL)" value={content.contacto.social.tiktok} onChange={(v) => upd((c) => { c.contacto.social.tiktok = v; })} />
                  <Field label="WhatsApp (URL)" value={content.contacto.social.whatsapp} onChange={(v) => upd((c) => { c.contacto.social.whatsapp = v; })} />
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- FOOTER ----- */}
              {section === "footer" && (
                <div className="admin-card">
                  <Field label="Descripción" area value={content.footer.description} onChange={(v) => upd((c) => { c.footer.description = v; })} />
                  <Field label="Teléfono" value={content.footer.phone} onChange={(v) => upd((c) => { c.footer.phone = v; })} />
                  <Field label="Email" value={content.footer.email} onChange={(v) => upd((c) => { c.footer.email = v; })} />
                  <Field label="Dirección" value={content.footer.address} onChange={(v) => upd((c) => { c.footer.address = v; })} />
                  <Field label="Copyright" value={content.footer.copyright} onChange={(v) => upd((c) => { c.footer.copyright = v; })} />
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- LOGO ----- */}
              {section === "logo" && (
                <div>
                  <p className="admin-hint-top">Sube imágenes PNG con fondo transparente. Se actualizan al instante en el sitio.</p>
                  <div className="admin-card">
                    <div className="admin-section-title"><span>Logo principal (cabecera y menú)</span></div>
                    <div className="admin-card-row">
                      <img className="admin-thumb" src={(config as any)?.logo ?? "/assets/logo.png"} alt="Logo principal" style={{ background: "#faf7f2" }} />
                      <label className="admin-btn admin-btn-primary admin-btn-sm" style={{ cursor: "pointer" }}>
                        Cambiar logo
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateLogo({ token: token!, slot: "main", storageId: storageId as any }); flash("Logo actualizado"); e.target.value = ""; }} />
                      </label>
                    </div>
                  </div>
                  <div className="admin-card">
                    <div className="admin-section-title"><span>Logo del pie de página (versión clara)</span></div>
                    <div className="admin-card-row">
                      <img className="admin-thumb" src={(config as any)?.logoLight ?? "/assets/logo-light.png"} alt="Logo footer" style={{ background: "#2c2420" }} />
                      <label className="admin-btn admin-btn-primary admin-btn-sm" style={{ cursor: "pointer" }}>
                        Cambiar logo
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const storageId = await uploadImage(f); await updateLogo({ token: token!, slot: "light", storageId: storageId as any }); flash("Logo actualizado"); e.target.value = ""; }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ----- LEGALES ----- */}
              {section === "legales" && (
                <div>
                  {(["privacy", "terms"] as const).map((dk) => (
                    <div className="admin-card" key={dk}>
                      <div className="admin-section-title"><span>{dk === "privacy" ? "Políticas de Privacidad" : "Términos y Condiciones"}</span></div>
                      <Field label="Título" value={content.legal[dk].title} onChange={(v) => upd((c) => { c.legal[dk].title = v; })} />
                      <Field label="Última actualización" value={content.legal[dk].updated} onChange={(v) => upd((c) => { c.legal[dk].updated = v; })} />
                      <Field label="Introducción" area value={content.legal[dk].intro} onChange={(v) => upd((c) => { c.legal[dk].intro = v; })} />
                      {content.legal[dk].sections.map((s, i) => (
                        <div className="admin-card" key={i} style={{ background: "#fff" }}>
                          <Field label={`Sección ${i + 1} — Título`} value={s.heading} onChange={(v) => upd((c) => { c.legal[dk].sections[i].heading = v; })} />
                          <Field label="Texto" area value={s.body} onChange={(v) => upd((c) => { c.legal[dk].sections[i].body = v; })} />
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => upd((c) => { c.legal[dk].sections.splice(i, 1); })}>Eliminar sección</button>
                        </div>
                      ))}
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => upd((c) => { c.legal[dk].sections.push({ heading: "Nueva sección", body: "Texto." }); })}>+ Sección</button>
                    </div>
                  ))}
                  <ContentSave onSave={saveContent} />
                </div>
              )}

              {/* ----- CONFIG (WhatsApp) ----- */}
              {section === "config" && (
                <div className="admin-card">
                  <Field label="WhatsApp (solo números, con código país)" value={whatsapp} onChange={setWhatsapp} ph="56929581205" />
                  <div className="admin-card-actions">
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={async () => { await updateSiteConfig({ token, whatsappNumber: whatsapp || "56929581205" }); flash("WhatsApp guardado"); }}>Guardar WhatsApp</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-preview">
          <iframe ref={iframeRef} src="/" title="Vista previa del sitio" />
        </div>
      </div>
    </div>
  );
}

function ContentSave({ onSave }: { onSave: () => void }) {
  return (
    <div className="admin-card-actions" style={{ marginTop: 14 }}>
      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={onSave}>Guardar cambios</button>
    </div>
  );
}

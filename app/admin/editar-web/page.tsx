"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../useAdmin";

type Section = "productos" | "resenas" | "config";
type Cat = "pequena" | "grande" | "alimento";

export default function Editor() {
  const router = useRouter();
  const { token, setToken, loaded } = useAdminToken();
  const valid = useQuery(api.admin.sesionValida, token ? { token } : "skip");

  // --- Guard de sesión ---
  useEffect(() => {
    if (loaded && !token) router.replace("/admin/login");
  }, [loaded, token, router]);
  useEffect(() => {
    if (valid === false) {
      setToken(null);
      router.replace("/admin/login");
    }
  }, [valid, setToken, router]);

  const [section, setSection] = useState<Section>("productos");

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
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);

  // --- Ediciones locales en curso ---
  const [pEdits, setPEdits] = useState<Record<string, Record<string, unknown>>>({});
  const [rEdits, setREdits] = useState<Record<string, Record<string, unknown>>>({});
  const [cfgForm, setCfgForm] = useState({
    whatsappNumber: "",
    heroTitle: "",
    heroSubtitle: "",
    aboutText: "",
  });
  const [savedFlag, setSavedFlag] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setCfgForm({
        whatsappNumber: config.whatsappNumber ?? "",
        heroTitle: config.heroTitle ?? "",
        heroSubtitle: config.heroSubtitle ?? "",
        aboutText: config.aboutText ?? "",
      });
    }
  }, [config]);

  const flash = (msg: string) => {
    setSavedFlag(msg);
    setTimeout(() => setSavedFlag(null), 2000);
  };

  // Valor mostrado = edición local o valor del servidor
  const pVal = (p: any, f: string) => (pEdits[p._id]?.[f] ?? p[f]);
  const rVal = (r: any, f: string) => (rEdits[r._id]?.[f] ?? r[f]);

  // --- Preview en vivo (iframe) ---
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
        whatsappNumber: cfgForm.whatsappNumber || "56929581205",
        heroTitle: cfgForm.heroTitle || null,
        heroSubtitle: cfgForm.heroSubtitle || null,
        aboutText: cfgForm.aboutText || null,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, reviews, pEdits, rEdits, cfgForm]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e?.data?.type === "NOBLE_PREVIEW_READY") setIframeReady(true);
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

  // --- Subida de imagen ---
  async function uploadImage(file: File): Promise<string> {
    const url = await generateUploadUrl({ token: token! });
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await res.json();
    return storageId;
  }

  if (!loaded || !token) return null;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1>
          <img src="/assets/logo.png" alt="" style={{ height: 30, width: 30 }} /> Editor Web
        </h1>
        <div className="admin-topbar-actions">
          {savedFlag && <span className="admin-saved">✓ {savedFlag}</span>}
          <a className="admin-btn admin-btn-ghost admin-btn-sm" href="/" target="_blank" rel="noreferrer">
            Ver sitio ↗
          </a>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => {
              setToken(null);
              router.replace("/admin/login");
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div className="admin-body">
        <div className="admin-panel">
          <div className="admin-tabs">
            <button className={`admin-tab${section === "productos" ? " active" : ""}`} onClick={() => setSection("productos")}>
              Productos
            </button>
            <button className={`admin-tab${section === "resenas" ? " active" : ""}`} onClick={() => setSection("resenas")}>
              Reseñas
            </button>
            <button className={`admin-tab${section === "config" ? " active" : ""}`} onClick={() => setSection("config")}>
              Configuración
            </button>
          </div>

          {/* ---------------- PRODUCTOS ---------------- */}
          {section === "productos" && (
            <div>
              <div className="admin-section-title">
                <span>Catálogo ({products?.length ?? 0})</span>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={async () => {
                    await createProduct({
                      token,
                      name: "Nuevo producto",
                      category: "pequena",
                      price: 0,
                      description: "Descripción del producto.",
                      hasKcc: true,
                      isPuppy: true,
                    });
                    flash("Producto añadido");
                  }}
                >
                  + Añadir
                </button>
              </div>

              {(products ?? []).map((p: any) => (
                <div className="admin-card" key={p._id}>
                  <div className="admin-card-row">
                    {p.resolvedImage ? (
                      <img className="admin-thumb" src={p.resolvedImage} alt="" />
                    ) : (
                      <div className="admin-thumb" />
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="admin-field">
                        <label>Nombre</label>
                        <input value={pVal(p, "name") as string} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], name: e.target.value } }))} />
                      </div>
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
                  <div className="admin-field">
                    <label>Descripción</label>
                    <textarea rows={2} value={pVal(p, "description") as string} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], description: e.target.value } }))} />
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Precio antes (opcional)</label>
                      <input type="number" value={(pVal(p, "originalPrice") as number) ?? ""} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], originalPrice: e.target.value === "" ? null : Number(e.target.value) } }))} />
                    </div>
                  </div>
                  <div className="admin-card-actions">
                    <label className="admin-checkbox">
                      <input type="checkbox" checked={Boolean(pVal(p, "hasKcc"))} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], hasKcc: e.target.checked } }))} /> KCC
                    </label>
                    <label className="admin-checkbox">
                      <input type="checkbox" checked={Boolean(pVal(p, "active"))} onChange={(e) => setPEdits((s) => ({ ...s, [p._id]: { ...s[p._id], active: e.target.checked } }))} /> Visible
                    </label>
                    <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                      Imagen
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const storageId = await uploadImage(f);
                          await updateProduct({ token, id: p._id, imageStorageId: storageId as any });
                          flash("Imagen actualizada");
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={async () => {
                        const ed = pEdits[p._id] ?? {};
                        await updateProduct({ token, id: p._id, ...(ed as any) });
                        setPEdits((s) => {
                          const n = { ...s };
                          delete n[p._id];
                          return n;
                        });
                        flash("Producto guardado");
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={async () => {
                        if (!confirm(`¿Eliminar "${pVal(p, "name")}"?`)) return;
                        await deleteProduct({ token, id: p._id });
                        flash("Producto eliminado");
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------------- RESEÑAS ---------------- */}
          {section === "resenas" && (
            <div>
              <div className="admin-section-title">
                <span>Reseñas ({reviews?.length ?? 0})</span>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={async () => {
                    await createReview({ token, name: "Cliente Feliz", date: "Reciente", feedback: "¡Gracias por nuestro cachorro!" });
                    flash("Reseña añadida");
                  }}
                >
                  + Añadir
                </button>
              </div>

              {(reviews ?? []).map((r: any) => (
                <div className="admin-card" key={r._id}>
                  <div className="admin-card-row">
                    {r.resolvedImage ? <img className="admin-thumb" src={r.resolvedImage} alt="" /> : <div className="admin-thumb" />}
                    <div style={{ flex: 1 }}>
                      <div className="admin-field-row">
                        <div className="admin-field">
                          <label>Nombre</label>
                          <input value={rVal(r, "name") as string} onChange={(e) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], name: e.target.value } }))} />
                        </div>
                        <div className="admin-field">
                          <label>Fecha</label>
                          <input value={(rVal(r, "date") as string) ?? ""} onChange={(e) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], date: e.target.value } }))} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label>Comentario</label>
                    <textarea rows={2} value={rVal(r, "feedback") as string} onChange={(e) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], feedback: e.target.value } }))} />
                  </div>
                  <div className="admin-card-actions">
                    <label className="admin-checkbox">
                      <input type="checkbox" checked={Boolean(rVal(r, "active"))} onChange={(e) => setREdits((s) => ({ ...s, [r._id]: { ...s[r._id], active: e.target.checked } }))} /> Visible
                    </label>
                    <label className="admin-btn admin-btn-ghost admin-btn-sm" style={{ cursor: "pointer" }}>
                      Imagen
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const storageId = await uploadImage(f);
                          await updateReview({ token, id: r._id, imageStorageId: storageId as any });
                          flash("Imagen actualizada");
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={async () => {
                        const ed = rEdits[r._id] ?? {};
                        await updateReview({ token, id: r._id, ...(ed as any) });
                        setREdits((s) => {
                          const n = { ...s };
                          delete n[r._id];
                          return n;
                        });
                        flash("Reseña guardada");
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={async () => {
                        if (!confirm("¿Eliminar esta reseña?")) return;
                        await deleteReview({ token, id: r._id });
                        flash("Reseña eliminada");
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------------- CONFIG ---------------- */}
          {section === "config" && (
            <div>
              <div className="admin-section-title"><span>Configuración del sitio</span></div>
              <div className="admin-card">
                <div className="admin-field">
                  <label>WhatsApp (solo números, con código país)</label>
                  <input value={cfgForm.whatsappNumber} onChange={(e) => setCfgForm((c) => ({ ...c, whatsappNumber: e.target.value }))} placeholder="56929581205" />
                </div>
                <div className="admin-field">
                  <label>Título del Hero</label>
                  <input value={cfgForm.heroTitle} onChange={(e) => setCfgForm((c) => ({ ...c, heroTitle: e.target.value }))} placeholder="(vacío = texto por defecto)" />
                </div>
                <div className="admin-field">
                  <label>Subtítulo del Hero</label>
                  <textarea rows={2} value={cfgForm.heroSubtitle} onChange={(e) => setCfgForm((c) => ({ ...c, heroSubtitle: e.target.value }))} placeholder="(vacío = texto por defecto)" />
                </div>
                <div className="admin-field">
                  <label>Texto &quot;Sobre Nosotros&quot;</label>
                  <textarea rows={3} value={cfgForm.aboutText} onChange={(e) => setCfgForm((c) => ({ ...c, aboutText: e.target.value }))} placeholder="(vacío = texto por defecto)" />
                </div>
                <div className="admin-card-actions">
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={async () => {
                      await updateSiteConfig({
                        token,
                        whatsappNumber: cfgForm.whatsappNumber || "56929581205",
                        heroTitle: cfgForm.heroTitle || undefined,
                        heroSubtitle: cfgForm.heroSubtitle || undefined,
                        aboutText: cfgForm.aboutText || undefined,
                      });
                      flash("Configuración guardada");
                    }}
                  >
                    Guardar configuración
                  </button>
                </div>
              </div>
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

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DEFAULT_CONTENT, SiteContent } from "./defaultContent";

export function LegalView({ docKey }: { docKey: "privacy" | "terms" }) {
  const config = useQuery(api.public.getSiteConfig);
  const C: SiteContent = (config?.content as SiteContent) ?? DEFAULT_CONTENT;
  const doc = C.legal[docKey];

  return (
    <>
      <header className="header" style={{ backgroundColor: "rgba(250, 247, 242, 0.95)", boxShadow: "var(--glass-shadow)" }}>
        <div className="container navbar">
          <a href="/" className="logo">
            <img src={(config as { logo?: string })?.logo ?? "/assets/logo.png"} alt="Logo Criadero Noble Cachorro" className="logo-img" style={{ height: 64, width: 64 }} />
          </a>
          <a href="/" className="btn btn-outline" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>Volver al Inicio</a>
        </div>
      </header>

      <main className="legal-page">
        <div className="container">
          <article className="legal-card">
            <h1>{doc.title}</h1>
            <p><strong>Última actualización:</strong> {doc.updated}</p>
            <p>{doc.intro}</p>
            {doc.sections.map((s, i) => (
              <div key={i}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
              </div>
            ))}
          </article>
        </div>
      </main>

      <footer className="footer" style={{ paddingTop: 40, paddingBottom: 40, textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "#9d9489", fontSize: "0.85rem" }}>{C.footer.copyright} Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

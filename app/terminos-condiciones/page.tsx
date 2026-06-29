import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Criadero Noble Cachorro",
};

export default function TerminosCondiciones() {
  return (
    <>
      <header className="header" style={{ backgroundColor: "rgba(250, 247, 242, 0.95)", boxShadow: "var(--glass-shadow)" }}>
        <div className="container navbar">
          <a href="/" className="logo">
            <img src="/assets/logo.png" alt="Logo Criadero Noble Cachorro" className="logo-img" style={{ height: 64, width: 64 }} />
          </a>
          <a href="/" className="btn btn-outline" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>Volver al Inicio</a>
        </div>
      </header>

      <main className="legal-page">
        <div className="container">
          <div className="back-btn-container">
            <a href="/" className="back-btn">← Volver al Inicio</a>
          </div>
          <article className="legal-card">
            <h1>Términos y Condiciones</h1>
            <p><strong>Última actualización:</strong> 29 de junio de 2026</p>
            <p>Bienvenido al sitio web oficial de <strong>Criadero Noble Cachorro</strong>. Al navegar e interactuar con este sitio, aceptas cumplir y estar sujeto a los siguientes Términos y Condiciones de uso.</p>

            <h2>1. Crianza Responsable y Certificados</h2>
            <p>En Criadero Noble Cachorro estamos dedicados a la crianza responsable y ética:</p>
            <ul>
              <li>Todos nuestros cachorros de raza pura se entregan con microchip e inscritos con su certificado oficial de origen del <strong>Kennel Club Chile (KCC)</strong>.</li>
              <li>Los cachorros se entregan únicamente después de cumplir con el período recomendado de destete (mínimo 60 días de vida).</li>
            </ul>

            <h2>2. Garantía de Salud</h2>
            <p>Ofrecemos garantías completas de salud para cada cachorro entregado:</p>
            <ul>
              <li><strong>Carnet Veterinario Oficial:</strong> Todos los cachorros se entregan con su carnet veterinario al día, incluyendo vacunas y desparasitaciones correspondientes a su edad.</li>
              <li><strong>Garantía de Salud:</strong> Entregamos una garantía de salud por escrito contra enfermedades virales infectocontagiosas durante los primeros 10 días tras la entrega, y de anomalías congénitas detectables.</li>
            </ul>

            <h2>3. Proceso de Cotización y Compra</h2>
            <p>El sitio web funciona como un catálogo digital e interactivo:</p>
            <ul>
              <li>Puedes agregar cachorros, alimentos y accesorios al carrito de compra.</li>
              <li>Al hacer clic en &quot;Finalizar Compra vía WhatsApp&quot;, se generará automáticamente un mensaje con tu selección. La compra final, el pago y los detalles del despacho se coordinarán de forma directa y personalizada con nuestro personal oficial.</li>
              <li>Los despachos de cachorros y alimentos a Santiago, Concepción, Temuco y otras ciudades de Chile se planifican de manera segura bajo estrictas normas de bienestar animal.</li>
            </ul>

            <h2>4. Derechos de Propiedad Intelectual</h2>
            <p>El logotipo oficial de Criadero Noble Cachorro, las fotos de cachorros propios, las imágenes de alimentos de marca y los textos del sitio son propiedad del criadero o se utilizan bajo licencia legal. Queda prohibida la reproducción parcial o total del contenido sin autorización previa.</p>

            <h2>5. Limitación de Responsabilidad</h2>
            <p>El criadero se reserva el derecho de rechazar la venta de un cachorro si se considera que el futuro hogar no cumple con las condiciones óptimas para el bienestar, felicidad y cuidado responsable de la mascota.</p>
          </article>
        </div>
      </main>

      <footer className="footer" style={{ paddingTop: 40, paddingBottom: 40, textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "#9d9489", fontSize: "0.85rem" }}>Copyright © 2026 Criadero Noble Cachorro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de Privacidad | Criadero Noble Cachorro",
};

export default function PoliticasPrivacidad() {
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
            <h1>Políticas de Privacidad</h1>
            <p><strong>Última actualización:</strong> 29 de junio de 2026</p>
            <p>En <strong>Criadero Noble Cachorro</strong>, nos tomamos muy en serio la privacidad de nuestros clientes y visitantes. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas a través de nuestro sitio web.</p>

            <h2>1. Información que Recopilamos</h2>
            <p>Recopilamos información personal únicamente cuando realizas consultas o compras directas por medio de nuestros canales oficiales (como WhatsApp o formularios integrados):</p>
            <ul>
              <li><strong>Datos de contacto:</strong> Nombre completo, número de teléfono (WhatsApp), correo electrónico.</li>
              <li><strong>Datos de compra:</strong> Información relacionada con los accesorios, alimentos o cachorros seleccionados para cotización.</li>
              <li><strong>Fotografías de clientes:</strong> Con tu consentimiento previo, publicamos fotos de cachorros entregados en nuestra sección &quot;Clientes Felices&quot;.</li>
            </ul>

            <h2>2. Uso de la Información</h2>
            <p>La información recopilada se utiliza exclusivamente para los siguientes fines:</p>
            <ul>
              <li>Procesar tus cotizaciones, consultas e iniciar el contacto de compra vía WhatsApp.</li>
              <li>Brindar soporte post-venta, recomendaciones de alimentación y asesoría de salud veterinaria.</li>
              <li>Personalizar y mejorar tu experiencia de usuario en nuestro sitio web.</li>
            </ul>

            <h2>3. Protección de tus Datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas razonables para proteger tu información personal contra accesos no autorizados, pérdidas o alteraciones. No vendemos, alquilamos ni compartimos tu información personal con terceros bajo ninguna circunstancia.</p>

            <h2>4. Tus Derechos</h2>
            <p>Puedes solicitar en cualquier momento la rectificación o eliminación de tus datos de contacto de nuestros registros. Si eres cliente y deseas que retiremos tu fotografía de la galería pública &quot;Clientes Felices&quot;, puedes escribirnos directamente a nuestro correo de contacto o WhatsApp, y la eliminaremos de forma inmediata.</p>

            <h2>5. Contacto</h2>
            <p>Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos a través de:</p>
            <ul>
              <li><strong>Correo electrónico:</strong> contacto@noblecachorro.cl</li>
              <li><strong>WhatsApp:</strong> +56 9 2958 1205</li>
            </ul>
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

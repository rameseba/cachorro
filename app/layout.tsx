import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://criaderonoblecachorro.com"),
  title: "Criadero Noble Cachorro | Venta de Cachorros de Raza Pura en Chile",
  description:
    "Criadero Noble Cachorro en Angol, Chile. Crianza responsable de cachorros saludables de raza pura con certificado KCC, vacunas al día y envío a gran parte del país.",
  keywords:
    "criadero noble cachorro, noble cachorro, venta de cachorros, perros de raza pura chile, kennel club chile, kcc, cachorros angol, comprar perro chile",
  authors: [{ name: "Criadero Noble Cachorro" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://criaderonoblecachorro.com/",
    title: "Criadero Noble Cachorro | Venta de Cachorros de Raza Pura en Chile",
    description:
      "Encuentra tu compañero ideal. Cachorros saludables, criados en un entorno natural y responsable con entrega garantizada.",
    images: ["/assets/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Criadero Noble Cachorro | Venta de Cachorros de Raza Pura en Chile",
    description:
      "Crianza responsable en Angol, Chile. Cachorros de razas pequeñas y grandes, certificados y con carnet veterinario.",
    images: ["/assets/og-image.png"],
  },
};

export const viewport = {
  themeColor: "#8c6239",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}

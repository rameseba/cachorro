// Contenido editable por defecto del sitio. El panel admin sobrescribe esto
// guardando un objeto `content` en siteConfig (Convex). El sitio público y el
// editor usan estos valores como fallback cuando un campo no está definido.

export type GarantiaCard = { icon: string; title: string; text: string };
export type ServicioCard = { icon: string; title: string; text: string };
export type TrasladoStep = { title: string; text: string };
export type FaqItem = { q: string; a: string };
export type LegalSection = { heading: string; body: string };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export type SiteContent = {
  hero: { title: string; subtitle: string };
  about: { title: string; text: string; textSecondary: string; features: string[] };
  garantias: { tag: string; title: string; subtitle: string; cards: GarantiaCard[] };
  servicios: { tag: string; title: string; subtitle: string; cards: ServicioCard[] };
  traslado: { tag: string; title: string; intro: string; note: string; steps: TrasladoStep[]; cta: string };
  faq: { tag: string; title: string; subtitle: string; items: FaqItem[] };
  contacto: {
    tag: string;
    title: string;
    description: string;
    address: string;
    mapCoords: string;
    hours: string;
    online: string;
    social: { facebook: string; instagram: string; tiktok: string; whatsapp: string };
  };
  footer: {
    description: string;
    phone: string;
    email: string;
    address: string;
    copyright: string;
  };
  legal: { privacy: LegalDoc; terms: LegalDoc };
};

// Combina el contenido guardado con los valores por defecto, de modo que las
// secciones nuevas (añadidas después de un guardado anterior) no rompan el render.
// El merge es de 2 niveles: cada sección (hero, contacto, etc.) se combina campo a
// campo con su default, así un campo nuevo dentro de una sección ya guardada
// (ej. contacto.mapCoords) sigue recibiendo su valor por defecto en vez de quedar
// undefined solo porque la sección completa ya existía en el contenido guardado.
function mergeSection<T>(def: T, stored: unknown): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return def;
  return { ...def, ...(stored as Partial<T>) };
}

export function withDefaults(stored: unknown): SiteContent {
  if (!stored || typeof stored !== "object") return DEFAULT_CONTENT;
  const s = stored as Partial<SiteContent>;
  return {
    hero: mergeSection(DEFAULT_CONTENT.hero, s.hero),
    about: mergeSection(DEFAULT_CONTENT.about, s.about),
    garantias: mergeSection(DEFAULT_CONTENT.garantias, s.garantias),
    servicios: mergeSection(DEFAULT_CONTENT.servicios, s.servicios),
    traslado: mergeSection(DEFAULT_CONTENT.traslado, s.traslado),
    faq: mergeSection(DEFAULT_CONTENT.faq, s.faq),
    contacto: mergeSection(DEFAULT_CONTENT.contacto, s.contacto),
    footer: mergeSection(DEFAULT_CONTENT.footer, s.footer),
    legal: mergeSection(DEFAULT_CONTENT.legal, s.legal),
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "El nuevo integrante de tu familia te espera aquí",
    subtitle:
      "Somos Criadero Noble Cachorro, ubicados en el hermoso entorno natural de Angol, Chile. Criamos cachorros saludables, socializados y con un estándar de pureza garantizado para alegrar tu hogar.",
  },
  about: {
    title: "Somos más que un criadero, somos una gran familia",
    text:
      "Con más de 9 años de experiencia, nuestro criadero en Angol, Chile, se ha convertido en un referente de crianza consciente y responsable. Nos encontramos en Villa Cutipay (Parcela 7), rodeados de aire puro, vegetación y espacios acondicionados exclusivamente para el óptimo desarrollo físico y social de nuestros cachorros.",
    textSecondary:
      "Nuestro enfoque es simple: priorizar la salud y el temperamento de cada ejemplar. No entregamos simples mascotas; entregamos compañeros de vida saludables, equilibrados y llenos de amor.",
    features: [
      "Entorno natural ideal para estimulación temprana.",
      "Instalaciones higiénicas y climatizadas.",
      "Transparencia absoluta en el origen de los cachorros.",
    ],
  },
  garantias: {
    tag: "Transparencia",
    title: "Nuestras Garantías de Crianza Responsable",
    subtitle:
      "Para garantizar una adopción y compra responsable, exigimos y entregamos la siguiente documentación formal en cada proceso:",
    cards: [
      { icon: "fa-solid fa-ribbon", title: "Certificado KCC", text: "Registro oficial del Kennel Club Chile que acredita formalmente la pureza de la raza, procedencia y árbol genealógico del cachorro." },
      { icon: "fa-solid fa-file-medical", title: "Carnet de Vacunas", text: "Documento médico firmado y timbrado por nuestro médico veterinario de cabecera, detallando desparasitaciones y vacunas al día." },
      { icon: "fa-solid fa-gift", title: "Kit Inicial de Regalo", text: "Te regalamos 2 kg de alimento premium de la marca Bil-Jac para asegurar una transición de dieta segura y sin estrés estomacal." },
      { icon: "fa-solid fa-truck-moving", title: "Despacho Especializado", text: "Contamos con el único vehículo adaptado, climatizado y con jaulas de seguridad del país, haciendo despachos semanales directos." },
    ],
  },
  servicios: {
    tag: "Lo que ofrecemos",
    title: "Nuestros Servicios",
    subtitle: "Crianza de calidad, traslados seguros y asesoría experta. Te acompañamos antes, durante y después de la llegada de tu cachorro.",
    cards: [
      { icon: "fa-solid fa-hand-holding-heart", title: "Asesoría en la crianza", text: "Acompañamiento profesional y personalizado en cada etapa: adaptación, alimentación, salud y educación de tu cachorro." },
      { icon: "fa-solid fa-house-chimney-window", title: "Guía de primeros días en casa", text: "Te ayudamos a preparar un espacio seguro y a recibir a tu cachorro sin estrés durante sus primeros días en el hogar." },
      { icon: "fa-solid fa-truck-medical", title: "Traslado seguro de tu mascota", text: "Único criadero con vehículo adaptado para mascotas: viajes semanales puerta a puerta con seguimiento en tiempo real." },
      { icon: "fa-solid fa-bowl-food", title: "Plan de alimentación", text: "Tabla personalizada según peso y edad, con recomendaciones para una transición de alimento segura y gradual." },
      { icon: "fa-solid fa-stethoscope", title: "Salud y control veterinario", text: "Calendario de vacunas, desparasitación y señales de alerta para mantener a tu cachorro sano y feliz." },
      { icon: "fa-solid fa-paw", title: "Educación inicial", text: "Guía de entrenamiento de baño, socialización y manejo de mordidas y juegos para un cachorro equilibrado." },
    ],
  },
  traslado: {
    tag: "Servicio Exclusivo",
    title: "Su Tranquilidad es Nuestra Prioridad: Traslado Seguro",
    intro: "Garantizamos un proceso de reubicación seguro, ético y libre de estrés. Contamos con protocolos especializados para cachorros pequeños y grandes, asegurando que cada compañero llegue a su nuevo hogar en óptimas condiciones de salud y con el mismo buen temperamento con el que fue criado.",
    note: "Aseguramos transparencia total desde la reserva hasta la entrega, ya sea para razas pequeñas o grandes. Recuerda que también puedes venir a buscar tu cachorro directo a nuestro criadero.",
    steps: [
      { title: "Reserva del cachorro", text: "Una vez seleccionada la raza y el cachorro, formalizas la reserva. En este punto se definen las necesidades específicas del traslado." },
      { title: "Elección del día de traslado", text: "Coordinamos juntos la fecha ideal, respetando los tiempos de cuarentena y documentación, y procurando condiciones climáticas óptimas. Nuestro móvil canino sale cada 7 días." },
      { title: "Envío de documentación", text: "Te enviamos toda la documentación oficial del cachorro (certificado de salud, vacunas y registro) antes del viaje, para tu revisión y preparación." },
      { title: "Seguimiento constante", text: "Sigue a tu cachorro en todo momento con el número de seguimiento que te entregamos. Estarás informado de su estado en tiempo real." },
      { title: "Recepción y bienvenida", text: "¡Prepárate para recibir al nuevo integrante de la familia! Te damos instrucciones precisas sobre la llegada al punto de entrega y los primeros cuidados." },
      { title: "Recuerdo y cierre", text: "Una vez concretada la entrega, celebramos este gran momento con una foto junto a tu nuevo compañero." },
    ],
    cta: "Coordinar mi traslado por WhatsApp",
  },
  faq: {
    tag: "Resolviendo Dudas",
    title: "Preguntas Frecuentes",
    subtitle: "Todo lo que necesitas saber antes de dar la bienvenida a tu nuevo mejor amigo.",
    items: [
      { q: "¿Qué documentos entregan con el cachorro?", a: "Entregamos el Certificado KCC (Kennel Club de Chile), el carnet de vacunas y desparasitaciones al día firmado por un veterinario colegiado, una guía de cuidados del cachorro y un kit inicial de alimento de 2 kg." },
      { q: "¿Realizan envíos a domicilio en otras regiones?", a: "Sí, somos el único criadero en Chile con un vehículo propio totalmente adaptado para el traslado cómodo y seguro de mascotas. Realizamos viajes semanales a Santiago, Valparaíso, Concepción y gran parte del país." },
      { q: "¿Puedo visitar el criadero de forma presencial?", a: "¡Por supuesto! Estaremos encantados de recibirte en nuestras instalaciones ubicadas en Villa Cutipay (Parcela 7) en Angol. Por motivos de bioseguridad para los cachorros más pequeños, las visitas presenciales deben coordinarse previamente de Lunes a Viernes de 09:00 a 16:00 hrs." },
      { q: "¿Qué garantía de salud ofrecen?", a: "Ofrecemos una garantía de salud post-entrega de 10 días contra enfermedades virales comunes (como parvovirus o distemper), y garantizamos de por vida la pureza genética de raza mediante la entrega de su pedigree KCC." },
    ],
  },
  contacto: {
    tag: "Ubicación y Horarios",
    title: "¿Listo para dar el paso? Contáctanos",
    description: "Ubicados en un entorno verde y limpio, perfecto para el desarrollo de los cachorros. Escríbenos o visítanos.",
    address: "Villa Cutipay, Parcela 7, Angol, Chile",
    mapCoords: "-38.4517623,-71.8888067",
    hours: "Lunes a Viernes de 09:00 a 16:00 hrs",
    online: "Soporte por WhatsApp 24/7 para emergencias de crianza.",
    social: {
      facebook: "https://www.facebook.com/share/1DGGsDNWYv/?mibextid=wwXIfr",
      instagram: "https://www.instagram.com/noble_cachorro?igsh=MWJ2ZjNoanczNm1mMw%3D%3D&utm_source=qr",
      tiktok: "https://www.tiktok.com/@noble_cachorro?_r=1&_t=ZS-97bR4TiGKAu",
      whatsapp: "https://wa.me/56929581205",
    },
  },
  footer: {
    description: "Criadero premium de razas pequeñas y grandes en Chile. Comprometidos con el bienestar, salud y la crianza responsable.",
    phone: "+56 9 2958 1205",
    email: "contacto@noblecachorro.cl",
    address: "Angol, Región de la Araucanía, Chile",
    copyright: "Copyright © 2026 Criadero Noble Cachorro.",
  },
  legal: {
    privacy: {
      title: "Políticas de Privacidad",
      updated: "29 de junio de 2026",
      intro: "En Criadero Noble Cachorro, nos tomamos muy en serio la privacidad de nuestros clientes y visitantes. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas a través de nuestro sitio web.",
      sections: [
        { heading: "1. Información que Recopilamos", body: "Recopilamos información personal únicamente cuando realizas consultas o compras directas por medio de nuestros canales oficiales (como WhatsApp o formularios integrados): datos de contacto (nombre, teléfono, correo), datos de compra y, con tu consentimiento, fotografías de clientes para la sección Clientes Felices." },
        { heading: "2. Uso de la Información", body: "La información se utiliza para procesar tus cotizaciones y consultas vía WhatsApp, brindar soporte post-venta y asesoría veterinaria, y personalizar tu experiencia en el sitio." },
        { heading: "3. Protección de tus Datos", body: "Implementamos medidas de seguridad razonables para proteger tu información. No vendemos, alquilamos ni compartimos tu información personal con terceros bajo ninguna circunstancia." },
        { heading: "4. Tus Derechos", body: "Puedes solicitar en cualquier momento la rectificación o eliminación de tus datos. Si deseas que retiremos tu fotografía de la galería Clientes Felices, escríbenos y la eliminaremos de inmediato." },
        { heading: "5. Contacto", body: "Para preguntas sobre esta Política, escríbenos a contacto@noblecachorro.cl o por WhatsApp al +56 9 2958 1205." },
      ],
    },
    terms: {
      title: "Términos y Condiciones",
      updated: "29 de junio de 2026",
      intro: "Bienvenido al sitio web oficial de Criadero Noble Cachorro. Al navegar e interactuar con este sitio, aceptas cumplir y estar sujeto a los siguientes Términos y Condiciones de uso.",
      sections: [
        { heading: "1. Crianza Responsable y Certificados", body: "Todos nuestros cachorros de raza pura se entregan con microchip e inscritos con su certificado oficial del Kennel Club Chile (KCC), y únicamente después de cumplir el período de destete (mínimo 60 días de vida)." },
        { heading: "2. Garantía de Salud", body: "Todos los cachorros se entregan con su carnet veterinario al día. Entregamos una garantía de salud por escrito contra enfermedades virales infectocontagiosas durante los primeros 10 días y de anomalías congénitas detectables." },
        { heading: "3. Proceso de Cotización y Compra", body: "El sitio funciona como catálogo digital interactivo. Al finalizar la compra vía WhatsApp se genera un mensaje con tu selección; el pago y el despacho se coordinan de forma directa con nuestro personal oficial bajo estrictas normas de bienestar animal." },
        { heading: "4. Derechos de Propiedad Intelectual", body: "El logotipo, las fotos de cachorros propios, las imágenes de marca y los textos del sitio son propiedad del criadero o se usan bajo licencia. Queda prohibida su reproducción parcial o total sin autorización previa." },
        { heading: "5. Limitación de Responsabilidad", body: "El criadero se reserva el derecho de rechazar la venta de un cachorro si considera que el futuro hogar no cumple las condiciones óptimas para el bienestar y cuidado responsable de la mascota." },
      ],
    },
  },
};

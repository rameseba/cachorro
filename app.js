/* ==========================================================================
   Criadero Noble Cachorro - Lógica de Negocio y Galería Interactiva
   ========================================================================== */

// Lista de Productos (Cachorros y Alimentos)
const PRODUCTS = [
  {
    id: "beagle",
    name: "Beagle",
    category: "pequena",
    price: 300000,
    description: "Cariñosos, sociables e inteligentes. Excelentes compañeros para jugar con niños.",
    image: "assets/beagle.png",
    alt: "Cachorro Beagle saludable",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "bichon-maltes",
    name: "Bichón Maltés",
    category: "pequena",
    price: 400000,
    description: "Pelaje blanco sedoso, carácter alegre y juguetón. Hipoalergénico ideal para departamentos.",
    image: "assets/maltes.png",
    alt: "Cachorro Bichón Maltés blanco",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "chihuahua",
    name: "Chihuahua",
    category: "pequena",
    price: 400000,
    description: "Valientes y de tamaño de bolsillo. Gran personalidad, leales y de larga expectativa de vida.",
    image: "assets/chihuahua.png",
    alt: "Cachorro Chihuahua juguetón",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "cocker-spaniel",
    name: "Cocker Spaniel",
    category: "pequena",
    price: 300000,
    description: "Carácter dulce y orejas largas caídas. Muy activos, dóciles y apegados a su familia.",
    image: "assets/cocker.png",
    alt: "Cachorro Cocker Spaniel bronce",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "dachshund",
    name: "Dachshund (Salchicha)",
    category: "pequena",
    price: 300000,
    description: "Cuerpo alargado y patas cortas simpático. Valiente, vivaz y protector de su hogar.",
    image: "assets/dachshund.png",
    alt: "Cachorro Dachshund miniatura",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "golden-retriever",
    name: "Golden Retriever",
    category: "grande",
    price: 400000,
    description: "Leales, pacientes y obedientes. Inteligencia superior y carácter sumamente familiar.",
    image: "assets/golden.png",
    alt: "Cachorro Golden Retriever sonriendo",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "husky-siberiano",
    name: "Husky Siberiano",
    category: "grande",
    price: 500000,
    description: "Elegante apariencia lobuna, enérgicos y con hermosos ojos azules. Gran temperamento.",
    image: "assets/husky.png",
    alt: "Cachorro Husky Siberiano de ojos celestes",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "pastor-aleman",
    name: "Pastor Alemán",
    category: "grande",
    price: 380000,
    description: "Fuertes, inteligentes y protectores. Guardianes de nacimiento y muy obedientes.",
    image: "assets/pastor.png",
    alt: "Cachorro Pastor Alemán mirando alerta",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "pomerania",
    name: "Pomerania",
    category: "pequena",
    price: 750000,
    description: "Fluffy, minúsculos y con abundante pelaje naranja. Gran energía en un cuerpo compacto.",
    image: "assets/pomerania.png",
    alt: "Cachorro Pomerania toy esponjoso",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "shih-tzu",
    name: "Shih Tzu",
    category: "pequena",
    price: 450000,
    description: "Calmados, afectuosos y de gran pelaje. Excelentes para compañía y vida tranquila.",
    image: "assets/shih_tzu.png",
    alt: "Cachorro Shih Tzu tierno",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "yorkshire",
    name: "Yorkshire Terrier",
    category: "pequena",
    price: 400000,
    description: "Compactos, valientes y muy despiertos. Hermoso pelaje azul acero y dorado.",
    image: "assets/yorkshire.png",
    alt: "Cachorro Yorkshire Terrier miniatura",
    hasKcc: true,
    isPuppy: true
  },
  {
    id: "poodle-toy",
    name: "Poodle Toy",
    category: "pequena",
    price: 400000,
    description: "Altamente inteligentes, no mudan pelaje (hipoalergénicos). Sociables y leales.",
    image: "assets/poodle.png",
    alt: "Cachorro Poodle Toy apricot",
    hasKcc: true,
    isPuppy: true
  },
  // Alimentos Premium (Representación en SVG para evitar imágenes rotas)
  {
    id: "alimento-brit-3kg",
    name: "Brit Care Hipoalergénico Puppy 3 kg",
    category: "alimento",
    price: 19990,
    originalPrice: 25990,
    description: "Fórmula premium de cordero y arroz para cachorros con estómagos sensibles.",
    image: "assets/brit_puppy.png",
    alt: "Saco Brit Care Puppy",
    hasKcc: false,
    isPuppy: false
  },
  {
    id: "alimento-proplan-3kg",
    name: "ProPlan Puppy Razas Pequeñas 3 kg",
    category: "alimento",
    price: 19990,
    originalPrice: 25990,
    description: "Nutrición específica para soportar el rápido metabolismo de cachorros pequeños.",
    image: "assets/proplan_puppy.png",
    alt: "Saco ProPlan Puppy",
    hasKcc: false,
    isPuppy: false
  },
  {
    id: "alimento-proplan-7kg",
    name: "ProPlan Puppy Razas Pequeñas 7,5 kg",
    category: "alimento",
    price: 45990,
    originalPrice: 54990,
    description: "Saco mediano de ProPlan para cachorros. Promueve el desarrollo cerebral y de la vista.",
    image: "assets/proplan_puppy_large.png",
    alt: "Saco ProPlan Puppy Grande",
    hasKcc: false,
    isPuppy: false
  }
];

// Fotos de clientes iniciales (por defecto)
const DEFAULT_CLIENT_PHOTOS = [
  {
    id: "default-1",
    name: "Familia Silva Aravena",
    date: "Hace 2 semanas",
    feedback: "¡Felices con nuestra pequeña Beagle en su nuevo hogar! Excelente crianza y atención de Criadero Noble Cachorro.",
    image: "assets/beagle.png",
    isDefault: true
  },
  {
    id: "default-2",
    name: "Javiera y Tomás",
    date: "Hace 1 mes",
    feedback: "Gracias por esta bolita de pelos hermosa (Pomerania). Llegó súper sana, activa y llena de amor.",
    image: "assets/pomerania.png",
    isDefault: true
  },
  {
    id: "default-3",
    name: "Andrés Muñoz",
    date: "Hace 3 días",
    feedback: "El nuevo guardián y compañero de mi hijo (Golden). Muy obediente, dócil y se adaptó muy rápido.",
    image: "assets/golden.png",
    isDefault: true
  }
];

// Estado de la Aplicación (Carrito & Fotos Clientes)
let cart = JSON.parse(localStorage.getItem('noblecachorro_cart')) || [];
let customerPhotos = JSON.parse(localStorage.getItem('noblecachorro_customer_photos')) || [];

// Elementos del DOM
const productsGrid = document.getElementById('products-catalog-grid');
const searchInput = document.getElementById('catalog-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const cartDrawerClose = document.getElementById('cart-drawer-close');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartBadgeCount = document.getElementById('cart-badge-count');
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
const cartClearBtn = document.getElementById('cart-clear-btn');
const mainHeader = document.getElementById('main-header');
const mobileNavToggleBtn = document.getElementById('mobile-nav-toggle-btn');
const mobileNavMenu = document.getElementById('mobile-nav-menu');
const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const contactForm = document.getElementById('contact-form');

// Elementos de la galería de clientes
const clientsPhotosGrid = document.getElementById('clients-photos-grid');
const btnTriggerUpload = document.getElementById('btn-trigger-upload');
const customerPhotoInput = document.getElementById('customer-photo-input');

// Variables de estado de filtrado
let currentFilter = 'all';
let searchQuery = '';

// Teléfono oficial de WhatsApp
const whatsappNumber = "56929581205";

// Sistema de Toast Notifications
let toastContainer;

function initToastContainer() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'info') {
  if (!toastContainer) initToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-info-circle"></i>';
  if (type === 'success') {
    icon = '<i class="fa-solid fa-circle-check"></i>';
  } else if (type === 'danger') {
    icon = '<i class="fa-solid fa-circle-exclamation"></i>';
  }
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  // Activar la clase para deslizar
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Desvanecer y remover después de 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// ==========================================================================
// 1. Inicialización y Renderizado
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initToastContainer();
  renderCatalog();
  updateCartUI();
  setupEventListeners();
  setupFAQAccordion();
  renderClientsGallery();
});

// Función para formatear precios en pesos chilenos
function formatPrice(number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(number);
}

// Retorna un SVG hermoso de un saco de comida si el producto no tiene imagen
function getFoodBagSVG() {
  return `
    <svg class="product-img-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; padding: 20px; background: #faf7f2;">
      <path d="M25 80 L75 80 L65 25 L35 25 Z" fill="#d9a05b" stroke="#8c6239" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M35 25 L50 15 L65 25 Z" fill="#8c6239" stroke="#8c6239" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#8c6239" stroke-width="2"/>
      <path d="M44 48 C44 44 47 42 50 42 C53 42 56 44 56 48 C56 52 50 58 50 58 C50 58 44 52 44 48 Z" fill="#8c6239"/>
      <circle cx="48" cy="46" r="1.5" fill="#ffffff"/>
      <circle cx="52" cy="46" r="1.5" fill="#ffffff"/>
      <rect x="35" y="68" width="30" height="6" rx="2" fill="#8c6239"/>
      <text x="50" y="73" fill="#ffffff" font-size="4.5" font-family="'Outfit', sans-serif" font-weight="bold" text-anchor="middle">PREMIUM</text>
    </svg>
  `;
}

// Renderizar catálogo con filtros aplicados
function renderCatalog() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products text-center" style="grid-column: 1 / -1; padding: 60px 0;">
        <i class="fa-solid fa-paw" style="font-size: 3rem; color: var(--secondary); margin-bottom: 16px;"></i>
        <p style="font-size: 1.15rem; color: var(--text-muted);">No encontramos cachorros o productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }
  
  filteredProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    let badgeHtml = '';
    if (product.category === 'alimento') {
      badgeHtml = `<span class="badge-tag alimento">Alimento</span>`;
    } else {
      const sizeTag = product.category === 'pequena' ? 'Razas Pequeñas' : 'Razas Grandes';
      badgeHtml = `<span class="badge-tag">${sizeTag}</span>`;
    }
    
    const kccBadgeHtml = product.hasKcc ? `
      <div class="badge-kcc" title="Certificado de Pureza Kennel Club Chile">
        <i class="fa-solid fa-certificate" aria-hidden="true"></i> KCC
      </div>
    ` : '';
    
    let priceHtml = `<span class="price-value">${formatPrice(product.price)}</span>`;
    if (product.originalPrice) {
      priceHtml = `
        <span class="price-value">${formatPrice(product.price)}</span>
        <span class="price-original" style="text-decoration: line-through; font-size: 0.85rem; color: var(--text-muted); margin-left: 6px;">
          ${formatPrice(product.originalPrice)}
        </span>
      `;
    }
    
    const mediaHtml = product.image ? 
      `<img src="${product.image}" alt="${product.alt}" class="product-img" loading="lazy" width="280" height="280">` : 
      getFoodBagSVG();
    
    card.innerHTML = `
      <div class="product-image-wrapper">
        ${badgeHtml}
        ${kccBadgeHtml}
        ${mediaHtml}
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-label">Valor aproximado</span>
            <div>${priceHtml}</div>
          </div>
          <button class="add-to-cart-btn" aria-label="Agregar ${product.name} al carrito" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
    
    productsGrid.appendChild(card);
  });
}

// ==========================================================================
// 2. Control de Carrito de Compras
// ==========================================================================

window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartUI();
  showToast(`¡${product.name} añadido al carrito!`, 'success');
  
  if (cartToggle) {
    cartToggle.classList.add('cart-pop');
    setTimeout(() => {
      cartToggle.classList.remove('cart-pop');
    }, 450);
  }
};

window.removeFromCart = function(productId) {
  const item = cart.find(i => i.id === productId);
  const itemName = item ? item.name : "Producto";
  
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast(`${itemName} eliminado del carrito.`, 'info');
};

window.changeQuantity = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
};

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCart();
  updateCartUI();
  showToast('Carrito de compras vaciado.', 'danger');
}

function saveCart() {
  localStorage.setItem('noblecachorro_cart', JSON.stringify(cart));
}

function updateCartUI() {
  if (!cartItemsContainer || !cartTotalAmount || !cartBadgeCount) return;
  
  cartItemsContainer.innerHTML = '';
  let totalItemsCount = 0;
  let totalAmount = 0;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-shopping-basket" aria-hidden="true"></i>
        <p>Tu carrito está vacío.</p>
        <span style="font-size: 0.85rem; margin-top: 8px;">¡Añade un cachorro o alimento para comenzar tu pedido!</span>
      </div>
    `;
    cartCheckoutBtn.disabled = true;
    cartClearBtn.style.display = 'none';
  } else {
    cartCheckoutBtn.disabled = false;
    cartClearBtn.style.display = 'block';
    
    cart.forEach(item => {
      totalItemsCount += item.quantity;
      totalAmount += item.price * item.quantity;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      
      const mediaHtml = item.image ? 
        `<img src="${item.image}" alt="${item.name}" class="cart-item-img">` : 
        `<div class="cart-item-img-placeholder" style="width: 70px; height: 70px; display:flex; align-items:center; justify-content:center; background:#faf7f2; border-radius: var(--border-radius-sm); border: 1px solid rgba(140, 98, 57, 0.1);"><i class="fa-solid fa-bag-shopping" style="color:var(--primary);"></i></div>`;
      
      itemElement.innerHTML = `
        ${mediaHtml}
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-price">${formatPrice(item.price)}</span>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-control" role="group" aria-label="Cantidad de ${item.name}">
              <button class="qty-btn" aria-label="Disminuir cantidad" onclick="changeQuantity('${item.id}', -1)">-</button>
              <span class="qty-value" aria-live="polite">${item.quantity}</span>
              <button class="qty-btn" aria-label="Aumentar cantidad" onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="remove-item-btn" aria-label="Eliminar ${item.name} del carrito" onclick="removeFromCart('${item.id}')">
              <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Quitar
            </button>
          </div>
        </div>
      `;
      
      cartItemsContainer.appendChild(itemElement);
    });
  }
  
  cartTotalAmount.textContent = formatPrice(totalAmount);
  cartBadgeCount.textContent = totalItemsCount;
  cartToggle.setAttribute('aria-label', `Ver carrito de compras. ${totalItemsCount} productos añadidos.`);
}

// ==========================================================================
// 3. Integración con WhatsApp (Checkout)
// ==========================================================================

function checkoutCart() {
  if (cart.length === 0) return;
  
  let totalAmount = 0;
  let message = "¡Hola Criadero Noble Cachorro! 🐾\n";
  message += "Me gustaría realizar un pedido de los siguientes cachorros/alimentos:\n\n";
  
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    message += `• *${item.quantity}x ${item.name}* - ${formatPrice(item.price)} c/u (Subtotal: ${formatPrice(subtotal)})\n`;
    totalAmount += subtotal;
  });
  
  message += `\n*Total estimado: ${formatPrice(totalAmount)}*\n\n`;
  message += "Quedo atento a la confirmación de la disponibilidad y los detalles de envío/retiro. ¡Muchas gracias! 🐶";
  
  showToast('Abriendo WhatsApp para procesar tu pedido...', 'success');
  
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value;
  const messageContent = document.getElementById('contact-message').value;
  
  let contactMessage = "¡Hola Criadero Noble Cachorro! 🐾\n";
  contactMessage += "Quiero realizar una consulta de crianza o disponibilidad:\n\n";
  contactMessage += `*Nombre:* ${name}\n`;
  contactMessage += `*Teléfono:* ${phone}\n`;
  contactMessage += `*Consulta:* ${messageContent}\n\n`;
  contactMessage += "Agradezco tu asesoría.";
  
  showToast('Abriendo WhatsApp para enviar mensaje...', 'success');
  
  const encodedText = encodeURIComponent(contactMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  contactForm.reset();
}

// ==========================================================================
// 4. Lógica de Galería "Clientes Felices" (Persistencia Local)
// ==========================================================================

function renderClientsGallery() {
  if (!clientsPhotosGrid) return;
  
  clientsPhotosGrid.innerHTML = '';
  const allPhotos = [...customerPhotos, ...DEFAULT_CLIENT_PHOTOS];
  
  allPhotos.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'client-card';
    
    const deleteButtonHtml = !photo.isDefault ? `
      <button class="delete-photo-btn" aria-label="Eliminar foto subida" onclick="deleteClientPhoto('${photo.id}')">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
      </button>
    ` : '';
    
    card.innerHTML = `
      ${deleteButtonHtml}
      <div class="client-img-wrapper">
        <img src="${photo.image}" alt="Cliente feliz recibiendo cachorro" class="client-img" loading="lazy" width="280" height="210">
      </div>
      <div class="client-card-body">
        <p class="client-feedback">${photo.feedback}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
          <span class="client-name">${photo.name}</span>
          <span class="client-date">${photo.date}</span>
        </div>
      </div>
    `;
    
    clientsPhotosGrid.appendChild(card);
  });
}

window.deleteClientPhoto = function(photoId) {
  customerPhotos = customerPhotos.filter(photo => photo.id !== photoId);
  localStorage.setItem('noblecachorro_customer_photos', JSON.stringify(customerPhotos));
  renderClientsGallery();
  showToast('Foto de cliente eliminada.', 'danger');
};

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast('Por favor selecciona un archivo de imagen válido.', 'danger');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64Image = event.target.result;
    
    const clientName = prompt("Ingresa el nombre del cliente o familia:", "Familia Feliz");
    if (clientName === null) return;
    
    const feedbackText = prompt("Ingresa un comentario o reseña:", "¡Muy felices con la entrega del cachorro!");
    if (feedbackText === null) return;
    
    const newPhoto = {
      id: "cust-" + Date.now(),
      name: clientName || "Cliente Satisfecho",
      date: "Hoy mismo",
      feedback: feedbackText || "¡Excelente experiencia!",
      image: base64Image,
      isDefault: false
    };
    
    customerPhotos.unshift(newPhoto);
    localStorage.setItem('noblecachorro_customer_photos', JSON.stringify(customerPhotos));
    renderClientsGallery();
    showToast('¡Foto de entrega subida con éxito!', 'success');
  };
  
  reader.readAsDataURL(file);
  customerPhotoInput.value = '';
}

// ==========================================================================
// 5. Listeners y Efectos UI
// ==========================================================================

function setupEventListeners() {
  // Filtro de categorías
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      currentFilter = button.getAttribute('data-filter');
      renderCatalog();
    });
  });
  
  // Barra de búsqueda en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }
  
  // Control de apertura y cierre del Carrito Lateral (Drawer)
  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      cartToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }
  
  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  
  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCart);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);
  
  // Toggles de checkout y vaciado
  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', checkoutCart);
  if (cartClearBtn) cartClearBtn.addEventListener('click', clearCart);
  
  // Lógica de carga de fotos
  if (btnTriggerUpload && customerPhotoInput) {
    btnTriggerUpload.addEventListener('click', () => {
      customerPhotoInput.click();
    });
    
    customerPhotoInput.addEventListener('change', handlePhotoUpload);
  }
  
  // Toggles Menú Móvil
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', () => {
      mobileNavMenu.classList.add('open');
      mobileNavMenu.setAttribute('aria-hidden', 'false');
      mobileNavToggleBtn.setAttribute('aria-expanded', 'true');
    });
  }
  
  const closeMobileMenu = () => {
    mobileNavMenu.classList.remove('open');
    mobileNavMenu.setAttribute('aria-hidden', 'true');
    mobileNavToggleBtn.setAttribute('aria-expanded', 'false');
  };
  
  if (mobileNavCloseBtn) mobileNavCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);
  
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
  
  // Evento formulario de contacto
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Sombra del menú de navegación al hacer Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });
}

// Acordeón interactivo para FAQs
function setupFAQAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-content').setAttribute('hidden', 'true');
        }
      });
      
      if (isExpanded) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('hidden', 'true');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.removeAttribute('hidden');
      }
    });
  });
}

// Enlace activo de navegación
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let scrollPosition = window.scrollY + 120;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPosition >= top && scrollPosition < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

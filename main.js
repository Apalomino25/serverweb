// ============================
//   DATOS DE PRODUCTOS
// ============================
const products = [
    { id: 1, name: "Smartphone", price: 599.99, image: "imagenes/productos/smartphone.jpg" },
    { id: 2, name: "Laptop", price: 999.99, image: "imagenes/productos/laptop.jpg" },
    { id: 3, name: "Auriculares", price: 149.99, image: "imagenes/productos/headphones.jpeg" },
    { id: 4, name: "Tablet", price: 399.99, image: "imagenes/productos/tablet.jpeg" },
    { id: 5, name: "Smartwatch", price: 249.99, image: "imagenes/productos/smartwatch.jpg" },
    { id: 6, name: "SSD", price: 200.99, image: "imagenes/productos/SSD.jpg" },
    { id: 7, name: "Memoria RAM", price: 150.99, image: "imagenes/productos/RAM.jpeg" },
    { id: 8, name: "Cooler CPU", price: 80.99, image: "imagenes/productos/cooler.jpeg" },
    { id: 9, name: "Teclado gamer", price: 70.99, image: "imagenes/productos/teclado.jpg" },
    { id: 10, name: "Mouse gamer", price: 50.99, image: "imagenes/productos/mouse.jpg" },
    { id: 11, name: "Cooler Externo", price: 150.99, image: "imagenes/productos/cooler_externo.jpg" },
    { id: 12, name: "Camara de Seguridad", price: 90.99, image: "imagenes/productos/camara_seguridad.jpg" },
    { id: 13, name: "Case", price: 150.99, image: "imagenes/productos/case_pc.jpeg" },
    { id: 14, name: "Mando PC", price: 120.99, image: "imagenes/productos/mando.jpeg" },
    { id: 15, name: "Fuente de Poder", price: 80.99, image: "imagenes/productos/fuente_poder.jpg" },
    { id: 16, name: "Webcam", price: 50.99, image: "imagenes/productos/webcam.jpg" },
    { id: 17, name: "Mousepad", price: 20.99, image: "imagenes/productos/mousepad.jpg" },
    { id: 18, name: "Cargador Laptop", price: 120.99, image: "imagenes/productos/cargado_laptop.jpg" },
    { id: 19, name: "Silla gamer", price: 600.99, image: "imagenes/productos/silla_gamer.jpg" },
    { id: 20, name: "USB", price: 10.99, image: "imagenes/productos/usb.jpg" },
];

// ============================
// VARIABLES GLOBALES
// ============================
let cart = [];
let recognition = null;
let speechSynth = window.speechSynthesis;

// ============================
// INICIALIZACIÓN
// ============================
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    initializeVoiceRecognition();
});

// ============================
// MOSTRAR PRODUCTOS
// ============================
function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" class="product-image" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Añadir al Carrito</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// ============================
// EVENTOS
// ============================
function setupEventListeners() {
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('readPageBtn').addEventListener('click', readPageContent);
    document.getElementById('listenBtn').addEventListener('click', toggleVoiceRecognition);
    document.getElementById('readCartBtn').addEventListener('click', readCartContent);

    document.getElementById('toggleTheme').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    document.getElementById('increaseFont').addEventListener('click', () => {
        let currentSize = parseInt(window.getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize + 2) + "px";
    });

    document.getElementById('decreaseFont').addEventListener('click', () => {
        let currentSize = parseInt(window.getComputedStyle(document.body).fontSize);
        if(currentSize > 10) document.body.style.fontSize = (currentSize - 2) + "px";
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) addToCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('remove-item')) removeFromCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('quantity-btn')) updateQuantity(parseInt(e.target.dataset.id), e.target.dataset.action);
    });

    document.getElementById('closeVoice').addEventListener('click', () => {
        document.getElementById('voiceFeedback').classList.remove('active');
    });

    const openBtn = document.getElementById("openAccessibility");
    const panel = document.getElementById("accessibilityPanel");
    const closeBtn = document.getElementById("closeAccessibility");

    if (openBtn && panel && closeBtn) {
        openBtn.addEventListener("click", () => panel.classList.add("active"));
        closeBtn.addEventListener("click", () => panel.classList.remove("active"));
    }
}

// ============================
// CARRITO
// ============================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    showNotification(`${product.name} añadido al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCart();
}

function updateQuantity(id, action) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (action === "increase") item.quantity++;
    if (action === "decrease" && item.quantity > 1) item.quantity--;
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    cartCount.textContent = totalItems;

    cartItems.innerHTML = cart.length === 0 ? "<p>Tu carrito está vacío</p>" : "";

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        cartItems.appendChild(div);
    });

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

function showNotification(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `position: fixed; top: 20px; right: 20px; background: var(--secondary-color); color: #fff; padding: 1rem; border-radius: 4px; z-index: 1001; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// ============================
// ACCESIBILIDAD
// ============================
async function readPageContent() {
    speechSynth.cancel();
    await speakAsync("Bienvenido a nuestra tienda tecnológica, el lugar donde la tecnología es real para todos, sin barreras.");
    await speakAsync("¿Deseas que lea el catálogo de productos?");
    const respuestaInicial = await listenAsync();

    if (respuestaInicial.includes("sí") || respuestaInicial.includes("si") || respuestaInicial.includes("claro")) {
        await leerProductos();
    } else {
        await speakAsync("De acuerdo, no leeré el catálogo.");
    }
}

async function leerProductos() {
    let stopReading = false;

    for (let index = 0; index < products.length; index++) {
        if (stopReading) break;
        const product = products[index];
        const texto = `Producto ${index + 1}: ${product.name}, precio $${product.price.toFixed(2)}. ¿Deseas añadirlo al carrito?`;
        await speakAsync(texto);

        const respuesta = await listenAsync();

        if (respuesta.includes("detente") || respuesta.includes("stop")) {
            stopReading = true;
            await speakAsync("Has detenido la lectura. ¿Deseas leer el carrito?");
            const cartAnswer = await listenAsync();
            if (cartAnswer.includes("si") || cartAnswer.includes("por supuesto") || cartAnswer.includes("claro")) {
                readCartContent();
            } else {
                await speakAsync("De acuerdo, finalizando la lectura.");
            }
            break;
        }

        if (respuesta.includes("sí") || respuesta.includes("si") || respuesta.includes("claro")) {
            addToCart(product.id);
            await speakAsync(`${product.name} añadido al carrito`);
        } else {
            await speakAsync(`No se añadió ${product.name}`);
        }
    }

    if (!stopReading) {
        await speakAsync("He terminado de leer todos los productos.");
    }
}

function speakAsync(text) {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.onend = resolve;
        speechSynth.speak(utterance);
    });
}

function listenAsync() {
    return new Promise((resolve) => {
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            resolve(transcript);
        };
        recognition.start();
    });
}

function readCartContent() {
    speechSynth.cancel();
    let text = cart.length === 0 ? "Tu carrito está vacío." : `Tienes ${cart.length} productos en el carrito. Total: ${cart.reduce((s,i)=>s+i.price*i.quantity,0).toFixed(2)} dólares.`;
    speak(text);
}

function speak(text) {
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-ES';
    speechSynth.speak(ut);
}

function initializeVoiceRecognition() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        updateVoiceFeedback("Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        document.getElementById('listenBtn').classList.add('listening');
        updateVoiceFeedback("Escuchando...");
    };

    recognition.onerror = (e) => updateVoiceFeedback("Error: " + e.error);
    recognition.onend = () => document.getElementById('listenBtn').classList.remove('listening');

    recognition.onresult = normalVoiceCommands;
}

function toggleVoiceRecognition() {
    if (!recognition) return;
    const btn = document.getElementById('listenBtn');
    btn.classList.contains('listening') ? recognition.stop() : recognition.start();
}

function updateVoiceFeedback(text) {
    const vf = document.getElementById('voiceFeedback');
    const vt = document.getElementById('voiceText');
    vt.textContent = text;
    vf.classList.add('active');
}

function normalVoiceCommands(e) {
    const cmd = e.results[0][0].transcript.toLowerCase();
    updateVoiceFeedback(`Dijiste: ${cmd}`);

    let response = "";

    if (cmd.includes("ayuda")) {
        response = "Puedes agregar productos, ver carrito, vaciar carrito, escuchar la página o el carrito.";
    }

}
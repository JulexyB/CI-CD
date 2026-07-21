// ====== CREDENCIALES DE PAYPHONE (App tipo WEB, Payphone Developer) ======
const TOKEN_PAYPHONE = 'ZoeK82XRvBobojUFvwSdbmRJWwRVT4JJVpWeM6sXOauICJodbzHl0uEsH_RdBLxB4_pSNzwvLT1zO_AVIlgr1Bdo_xoJ6jCwvL216i7_1Vdt7DwFdCZLKUYkbtSdDZWy5gORuB77aN7MXSXo5Ru675CnPrXRbYckwHjZ6fKJxW_ougqI03eJYh9Hh4JAKGMstbaz5LDzWDtZsPNzWWYT4j-nbJTuTJu7lD8YtsNaSwXD0VBVLPLUYQQ7kMzKJwFFO0YwsgkChZq3wTgUFNEUpUZzAxto1VVJLYrZAf5uewVjjLX---kBXVyyK5w9KNAOYx6uqrXE6QSZ8AKWiCZtHNeiNFs';
const STORE_ID_PAYPHONE = '02908629-8bfa-4f30-a3ea-4811490881d1';

// ====== CATÁLOGO SIMPLE DE LA TIENDA DE ROPA ======
const productos = [
  { id: 1, nombre: 'Camiseta Oversize', precio: 18.99,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=220&fit=crop' },
  { id: 2, nombre: 'Jean Mom Fit', precio: 34.50,
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=220&fit=crop' },
  { id: 3, nombre: 'Chaqueta Bomber', precio: 54.00,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=220&fit=crop' },
  { id: 4, nombre: 'Hoodie Unisex', precio: 27.50,
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=220&fit=crop' }
];

let productoSeleccionado = productos[0];
let cantidad = 1;

// ====== RENDERIZAR CATÁLOGO (tarjetas con imagen) ======
function renderCatalogo() {
  const catalogo = document.getElementById('catalogo');
  catalogo.innerHTML = productos.map(p => `
    <div class="producto-wrap ${p.id === productoSeleccionado.id ? 'seleccionado' : ''}">
      <div class="producto ${p.id === productoSeleccionado.id ? 'seleccionado' : ''}" onclick="seleccionarProducto(${p.id})">
        <img src="${p.img}" alt="${p.nombre}"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22220%22%3E%3Crect fill=%22%23eee%22 width=%22300%22 height=%22220%22/%3E%3C/svg%3E'">
        <div class="info">
          <div class="nombre">${p.nombre}</div>
          <div class="precio">$${p.precio.toFixed(2)}</div>
        </div>
      </div>
      <div class="check-badge">✓</div>
    </div>
  `).join('');
  renderResumen();
}

function seleccionarProducto(id) {
  productoSeleccionado = productos.find(p => p.id === id);
  cantidad = 1; // reiniciar cantidad al cambiar de prenda
  renderCatalogo();
  // Si el usuario cambia de producto, se debe regenerar el botón de pago
  document.getElementById('pp-button').innerHTML = '';
}

function cambiarCantidad(delta) {
  cantidad = Math.max(1, Math.min(10, cantidad + delta));
  renderResumen();
  document.getElementById('pp-button').innerHTML = '';
}

// ====== CÁLCULO DE MONTOS (en centavos), IVA 15% ======
// -> Ahora vive en cart-calc.js (se incluye antes que este archivo en index.html)

// ====== RENDERIZAR TARJETA DE RESUMEN + SELECTOR DE CANTIDAD ======
function renderResumen() {
  const { amount, amountWithTax, tax } = calcularMontos(productoSeleccionado.precio, cantidad);

  document.getElementById('resumenCard').innerHTML = `
    <div class="resumen-top">
      <img src="${productoSeleccionado.img}" alt="${productoSeleccionado.nombre}">
      <div>
        <div class="resumen-nombre">${productoSeleccionado.nombre}</div>
        <div class="resumen-precio-unit">$${productoSeleccionado.precio.toFixed(2)} c/u</div>
      </div>
      <div class="cantidad-control">
        <button type="button" onclick="cambiarCantidad(-1)">−</button>
        <span>${cantidad}</span>
        <button type="button" onclick="cambiarCantidad(1)">+</button>
      </div>
    </div>

    <div class="desglose">
      <div class="fila"><span>Base (${cantidad} ud.)</span><span>$${(amountWithTax / 100).toFixed(2)}</span></div>
      <div class="fila"><span>IVA (15%)</span><span>$${(tax / 100).toFixed(2)}</span></div>
      <div class="fila total"><span>Total</span><span>$${(amount / 100).toFixed(2)}</span></div>
    </div>
  `;
}

// ====== BOTÓN "PAGAR": RENDERIZA LA CAJITA DE PAGOS ======
document.getElementById('btnPagar').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const documentId = document.getElementById('documentId').value.trim();

  if (!nombre || !email || !telefono || !documentId) {
    alert('Por favor completa todos los datos antes de pagar.');
    return;
  }

  const { amount, amountWithTax, tax } = calcularMontos(productoSeleccionado.precio, cantidad);
  const clientTransactionId = 'ROPA-' + Date.now();

  // Limpiar el contenedor antes de volver a renderizar (evita botones duplicados)
  document.getElementById('pp-button').innerHTML = '';

  new PPaymentButtonBox({
    token: TOKEN_PAYPHONE,
    storeId: STORE_ID_PAYPHONE,
    clientTransactionId: clientTransactionId,
    amount: amount,                 // total en centavos
    amountWithTax: amountWithTax,   // base sujeta a impuesto
    tax: tax,                       // IVA 15%
    service: 0,
    tip: 0,
    currency: 'USD',
    reference: `Compra: ${cantidad}x ${productoSeleccionado.nombre}`,
    phoneNumber: '+593' + telefono.replace(/\D/g, ''),
    email: email,
    documentId: documentId,
    lang: 'es',
    defaultMethod: 'card',
    timeZone: -5
  }).render('pp-button');

  console.log('🧾 Cajita de Pagos renderizada para:', cantidad, 'x', productoSeleccionado.nombre, '| clientTransactionId:', clientTransactionId);
});

// ====== INICIALIZAR ======
renderCatalogo();

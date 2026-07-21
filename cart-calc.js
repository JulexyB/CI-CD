// ====== LÓGICA PURA DE CÁLCULO DEL CARRITO (IVA 15%) ======
// Extraída de app.js para poder probarla sin necesidad de un navegador.
// Se incluye en index.html ANTES de app.js:
//   <script src="cart-calc.js"></script>
//   <script src="app.js"></script>

function calcularMontos(precioUnitario, cant) {
  const amountWithTax = Math.round(precioUnitario * cant * 100); // base sin impuesto, en centavos
  const tax = Math.round(amountWithTax * 0.15);                  // IVA 15%
  const amount = amountWithTax + tax;                             // total a cobrar
  return { amount, amountWithTax, tax };
}

// Exporta la función para Node (tests con `node --test`),
// y la deja disponible como global en el navegador (sin usar módulos ES).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcularMontos };
}

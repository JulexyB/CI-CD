const { test } = require('node:test');
const assert = require('node:assert');
const { calcularMontos } = require('../cart-calc.js');

test('un producto individual calcula base, IVA y total correctamente', () => {
  const { amount, amountWithTax, tax } = calcularMontos(10, 1);
  assert.strictEqual(amountWithTax, 1000); // $10.00 en centavos
  assert.strictEqual(tax, 150);            // 15% de 1000
  assert.strictEqual(amount, 1150);
});

test('varios productos suman correctamente', () => {
  const { amount, amountWithTax, tax } = calcularMontos(18.99, 3);
  assert.strictEqual(amountWithTax, 5697);
  assert.strictEqual(tax, 855);
  assert.strictEqual(amount, 6552);
});

test('el IVA calculado corresponde al 15% del monto gravado', () => {
  const { amountWithTax, tax } = calcularMontos(54, 2);
  assert.strictEqual(tax, Math.round(amountWithTax * 0.15));
});

test('cantidad cero retorna todos los totales en cero', () => {
  const { amount, amountWithTax, tax } = calcularMontos(20, 0);
  assert.strictEqual(amount, 0);
  assert.strictEqual(amountWithTax, 0);
  assert.strictEqual(tax, 0);
});

import { mountChrome, Bag, fmt, esc } from './store.js';
import { mountSearch } from './search.js';

mountChrome(); mountSearch();
const $ = (s) => document.querySelector(s);
const form = $('[data-form]');
function totals() {
  const items = Bag.items(); const sub = Bag.subtotal();
  const express = form.ship.value === 'express';
  const ship = express ? 9.95 : Bag.shipping(sub);
  $('[data-ship-std]').textContent = Bag.shipping(sub) ? '4,95 €' : 'Kostenlos';
  $('[data-mini]').innerHTML = items.map((i) => `<div class="ml"><img src="${esc(i.thumb)}" alt=""><div><span class="upper">${esc(i.name)}</span><span class="muted t-s">${esc(i.color)}${i.size !== 'Einheitsgröße' ? ` · ${esc(i.size)}` : ''} · ${i.qty} Stk.</span></div><span>${fmt(i.price * i.qty)}</span></div>`).join('') || '<p class="muted">Dein Warenkorb ist leer.</p>';
  $('[data-sub]').textContent = fmt(sub); $('[data-ship-cost]').textContent = ship ? fmt(ship) : 'Kostenlos'; $('[data-total]').textContent = fmt(sub + ship);
  form.querySelector('[type="submit"]').disabled = !items.length;
  return { items, sub, ship };
}
totals();
form.addEventListener('change', totals);
form.addEventListener('input', (e) => { const f = e.target.closest('.field'); if (f && f.classList.contains('is-invalid') && e.target.checkValidity()) { f.classList.remove('is-invalid'); const h = f.querySelector('.hint'); h.classList.remove('err'); h.textContent = e.target.name === 'zip' ? '5 Ziffern' : e.target.name === 'email' ? 'Für die Bestellbestätigung' : ' '; } });
window.addEventListener('store:change', totals);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const MSG = { fn: 'Bitte Vornamen angeben.', ln: 'Bitte Nachnamen angeben.', street: 'Bitte Straße und Hausnummer angeben.', zip: 'Bitte fünf Ziffern angeben.', city: 'Bitte Ort angeben.', email: 'Bitte gültige E-Mail angeben.' };
  let first = null;
  form.querySelectorAll('.field input').forEach((inp) => {
    const field = inp.closest('.field'); const hint = field.querySelector('.hint');
    const ok = inp.checkValidity();
    field.classList.toggle('is-invalid', !ok);
    if (!ok) { hint.textContent = MSG[inp.name] || 'Bitte ausfüllen.'; hint.classList.add('err'); first = first || inp; }
    else if (hint.classList.contains('err')) { hint.textContent = inp.name === 'zip' ? '5 Ziffern' : inp.name === 'email' ? 'Für die Bestellbestätigung' : ' '; hint.classList.remove('err'); }
  });
  if (first) { first.focus(); return; }
  const { items, sub, ship } = totals(); if (!items.length) return;
  const order = { number: 'CH-' + Date.now().toString(36).toUpperCase().slice(-7), items, sub, ship, total: sub + ship, pay: form.pay.value, shipMethod: form.ship.value, name: `${form.fn.value} ${form.ln.value}`, address: `${form.street.value}, ${form.zip.value} ${form.city.value}`, email: form.email.value, at: new Date().toISOString() };
  try { sessionStorage.setItem('chiemsee-store-order', JSON.stringify(order)); } catch {}
  Bag.clear();
  location.href = '/confirmation.html';
});

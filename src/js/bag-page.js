import { mountChrome, Bag, fmt, esc, productUrl } from './store.js';
import { mountSearch } from './search.js';

mountChrome(); mountSearch();
const $ = (s) => document.querySelector(s);
function render() {
  const items = Bag.items();
  $('[data-n]').textContent = items.length ? `(${Bag.count()})` : '';
  $('[data-full]').hidden = !items.length; $('[data-empty]').hidden = !!items.length;
  $('[data-lines]').innerHTML = items.map((i) => `
    <div class="line" data-line="${esc(i.id)}|${esc(i.slug)}|${esc(i.size)}">
      <a href="${productUrl({ id: i.id }, { slug: i.slug })}"><img src="${esc(i.thumb)}" alt="${esc(i.name)}"></a>
      <div class="line-info">
        <a class="upper" href="${productUrl({ id: i.id }, { slug: i.slug })}">${esc(i.name)}</a>
        <div>${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>
        <div class="line-ctrl">
          <div class="qty"><button type="button" data-qty="-1" aria-label="Weniger">−</button><span>${i.qty}</span><button type="button" data-qty="1" aria-label="Mehr">+</button></div>
          <span>${fmt(i.price * i.qty)}</span>
        </div>
        <button type="button" class="t-s link" data-remove>Entfernen</button>
      </div>
    </div>`).join('');
  const sub = Bag.subtotal(), ship = Bag.shipping(sub);
  $('[data-sub]').textContent = fmt(sub); $('[data-ship]').textContent = ship ? fmt(ship) : 'Kostenlos'; $('[data-total]').textContent = fmt(sub + ship);
  document.querySelectorAll('[data-lines] .line').forEach((row) => {
    const [id, s, size] = row.dataset.line.split('|'); const item = items.find((i) => i.id === id && i.slug === s && i.size === size);
    row.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => Bag.setQty(id, s, size, item.qty + Number(b.dataset.qty))));
    row.querySelector('[data-remove]').addEventListener('click', () => Bag.remove(id, s, size));
  });
}
render();
window.addEventListener('store:change', render);

import{m as y,a as v,B as d,e,p as m,f as l}from"./search-Dn7CA41L.js";/* empty css                 */y();v();const n=a=>document.querySelector(a);function p(){const a=d.items();n("[data-n]").textContent=a.length?`(${d.count()})`:"",n("[data-full]").hidden=!a.length,n("[data-empty]").hidden=!!a.length,n("[data-lines]").innerHTML=a.map(t=>`
    <div class="line" data-line="${e(t.id)}|${e(t.slug)}|${e(t.size)}">
      <a href="${m({id:t.id},{slug:t.slug})}"><img src="${e(t.thumb)}" alt="${e(t.name)}"></a>
      <div class="line-info">
        <a class="upper" href="${m({id:t.id},{slug:t.slug})}">${e(t.name)}</a>
        <div>${e(t.color)}${t.size&&t.size!=="Einheitsgröße"?` · Größe ${e(t.size)}`:""}</div>
        <div class="line-ctrl">
          <div class="qty"><button type="button" data-qty="-1" aria-label="Weniger">−</button><span>${t.qty}</span><button type="button" data-qty="1" aria-label="Mehr">+</button></div>
          <span>${l(t.price*t.qty)}</span>
        </div>
        <button type="button" class="t-s link" data-remove>Entfernen</button>
      </div>
    </div>`).join("");const o=d.subtotal(),i=d.shipping(o);n("[data-sub]").textContent=l(o),n("[data-ship]").textContent=i?l(i):"Kostenlos",n("[data-total]").textContent=l(o+i),document.querySelectorAll("[data-lines] .line").forEach(t=>{const[r,c,u]=t.dataset.line.split("|"),h=a.find(s=>s.id===r&&s.slug===c&&s.size===u);t.querySelectorAll("[data-qty]").forEach(s=>s.addEventListener("click",()=>d.setQty(r,c,u,h.qty+Number(s.dataset.qty)))),t.querySelector("[data-remove]").addEventListener("click",()=>d.remove(r,c,u))})}p();window.addEventListener("store:change",p);

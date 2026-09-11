import{m as W,a as D,b as x,l as j,t as k,c as I}from"./search-Dn7CA41L.js";const z="chiemsee-intro-seen",d=5e3,m=460,p=70,L=6,N=d+m+p*L+1500,Y=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,q=()=>{try{return sessionStorage.getItem(z)==="1"}catch{return!1}},B=()=>{try{sessionStorage.setItem(z,"1")}catch{}},w={brand:"Chiemsee",word:"Fleece",cta:"Explore now"},_=[{img:"assets/campaign/promo-muetzen.jpg",cap:"Chiemsee Mützen"},{img:"assets/campaign/promo-herren-shirts.jpg",cap:"Herren Shirts &amp; Tanks"},{img:"assets/campaign/promo-damen-sweats.jpg",cap:"Damen Sweatshirts"}],y={img:"assets/campaign/fall-women-hoodie.jpg",head:"Der Herbst gehört dir.",copy:"Wenn die Tage kürzer werden und die Luft frischer wird, ist Zeit für Wärme, die mitgeht. Unsere Jacken begleiten dich durch neblige Morgen am See, über raschelndes Laub und in die ersten kalten Abende – lässig, warm und mit dem unverwechselbaren Chiemsee-Detail."},b={ig:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.6-1.6 1.5 1.5 0 0 1 1.6 1.6z"/></svg>',fb:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6A22 22 0 0 0 14.4 3C12 3 10.4 4.4 10.4 7.1v2.8H7.7V13h2.7v8z"/></svg>',yt:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'};function P(){return`
  <div class="os-strip">✨ <u>Werde Teil der Chiemsee Family</u> ✨</div>
  <div class="oldshop-scroll">
    <div class="os-hero" style="background-image:url('assets/campaign/fall-men-fleece.jpg')">
      <div class="os-follow">
        <span class="os-follow-label">Follow us</span>
        <span class="os-rule-v"></span>
        ${b.ig}${b.fb}${b.yt}
      </div>
      <div class="os-hero-copy">
        <div class="os-hero-brand">${w.brand}</div>
        <div class="os-hero-word">${w.word}</div>
        <span class="os-hero-cta">${w.cta} &nbsp;&rarr;</span>
      </div>
      <div class="os-arrows"><span>&larr;</span><span>&rarr;</span></div>
      <div class="os-dots"><span>01</span><span>02</span><b>03</b><span class="os-rule"></span></div>
    </div>

    <div class="os-promo">
      ${_.map(i=>`
        <figure>
          <img src="${i.img}" alt="" width="450" height="320">
          <figcaption>${i.cap}</figcaption>
          <div class="os-more">Explore now &rarr;</div>
        </figure>`).join("")}
    </div>

    <div class="os-band">
      <img src="${y.img}" alt="" width="960" height="340">
      <div>
        <h2>${y.head}</h2>
        <p>${y.copy}</p>
        <div class="os-links"><span>Men &rarr;</span><span>Women &rarr;</span></div>
      </div>
    </div>
  </div>

  <div class="os-head">
    <span class="os-mark">Chiemsee</span>
    <nav class="os-nav"><a>Damen</a><a>Herren</a><a>Kinder</a><a>Accessoires</a><a>Outlet</a></nav>
    <span></span>
    <span class="os-cup">Windsurf World Cup 2026</span>
  </div>`}function R(){const c=new URLSearchParams(location.search).get("intro");if(c==="0"||c!=="1"&&q())return;B();const a=document.createElement("div");a.className="oldshop",a.setAttribute("aria-hidden","true"),a.innerHTML=P();const t=document.createElement("div");t.className="os-timer",t.innerHTML=`
    <span class="os-progress"></span>
    <span class="os-timer-label">Chiemsee, neu gedacht &mdash; in <b data-count>5</b>&thinsp;s</span>
    <button class="os-skip" type="button" data-skip>Direkt zum Shop</button>`,a.appendChild(t);const n=document.createElement("div");n.className="os-wipe",n.setAttribute("aria-hidden","true"),n.innerHTML="<span></span>".repeat(L),document.body.appendChild(a);const e=document.body.style.overflow;document.body.style.overflow="hidden";let s=!1,r=0,u=0,S=!1;const h=()=>{s||(s=!0,clearTimeout(r),clearInterval(u),document.removeEventListener("keydown",M),a.remove(),document.body.style.overflow=e,window.dispatchEvent(new CustomEvent("intro:done")))};function v(){if(S||s)return;if(S=!0,clearInterval(u),Y()){a.style.transition="opacity .35s linear",a.style.opacity="0",setTimeout(h,380);return}document.body.appendChild(n);const o=[...n.children];let C=0;o.forEach((E,A)=>{let l=null;try{l=E.animate([{transform:"scaleY(0)"},{transform:"scaleY(1)"}],{duration:m,delay:A*p,easing:"cubic-bezier(.4,0,.2,1)",fill:"forwards"})}catch{E.style.transform="scaleY(1)"}const f=()=>{C+=1,!(C<o.length)&&(h(),o.forEach((g,$)=>{g.style.transformOrigin="50% 100%";try{g.animate([{transform:"scaleY(1)"},{transform:"scaleY(0)"}],{duration:m,delay:$*p,easing:"cubic-bezier(.4,0,.2,1)",fill:"forwards"})}catch{g.style.transform="scaleY(0)"}}),setTimeout(()=>n.remove(),m+p*o.length+200))};l?(l.onfinish=f,l.oncancel=f):f()})}const M=o=>{o.key==="Escape"&&v()};document.addEventListener("keydown",M),t.querySelector("[data-skip]").addEventListener("click",v);const H=t.querySelector("[data-count]"),O=Date.now();u=setInterval(()=>{const o=Math.ceil((d-(Date.now()-O))/1e3);H.textContent=String(Math.max(0,o))},250);try{t.querySelector(".os-progress").animate([{transform:"scaleX(0)"},{transform:"scaleX(1)"}],{duration:d,easing:"linear",fill:"forwards"})}catch{}setTimeout(v,d),r=setTimeout(()=>{h(),n.remove()},N)}R();W();D();x();const T=()=>innerWidth>1200||innerWidth<=760?4:3;j().then(i=>{const c=(e,s)=>i.filter(e).slice(0,s),a=e=>e.map(s=>i.find(r=>r.id===s)).filter(Boolean),t=[...a(["3326251","3326318","3326241","3326220"]),...c(e=>e.isNew,8)].filter((e,s,r)=>r.indexOf(e)===s).slice(0,T());document.querySelector('[data-row="new"]').innerHTML=t.map(e=>k(e,null,{lazy:!1})).join("");const n=[...a(["00017682","00017354","1913474","00011689"]),...i.filter(e=>e.sale)].filter((e,s,r)=>r.indexOf(e)===s).slice(0,T());document.querySelector('[data-row="sale"]').innerHTML=n.map(e=>k(e,e.variants.find(s=>s.oldPrice)||null,{lazy:!1})).join(""),I()});

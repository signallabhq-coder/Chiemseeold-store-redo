/*
 * oldshop.js — the opening frame.
 *
 * Shows chiemsee.com as it stands today, holds it for a beat, then hands over
 * to this store behind a six-column wipe.
 *
 * The hand-over is an overlay teardown, NOT a navigation. The store is already
 * mounted underneath from the first frame, so there is no page to fail to load
 * and no URL to get wrong. Three independent things can end the intro — the
 * animation finishing, a hard watchdog timer, or the viewer skipping — and all
 * three funnel through one idempotent handOver(). If any of the animation code
 * throws, the watchdog still tears the overlay down.
 *
 * Controls: Esc or the skip button ends it early. ?intro=0 skips it entirely,
 * ?intro=1 replays it. Otherwise it plays once per browser session.
 */

const SEEN_KEY = 'chiemsee-intro-seen';
const HOLD_MS = 5000; // the old shop stands
const WIPE_MS = 460; // one column's sweep
const STAGGER_MS = 70; // between columns
const COLUMNS = 6;
const WATCHDOG_MS = HOLD_MS + WIPE_MS + STAGGER_MS * COLUMNS + 1500;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const seen = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};
const markSeen = () => {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode — replay is harmless */ }
};

/* chiemsee.com's own words, kept verbatim so the frame reads as the real shop.
   Slide 01 of their hero carousel: the Fall Essentials banner, whose three-photo
   composition is baked into the 1920x920 artwork itself. */
const HERO = {
  brand: 'Chiemsee',
  word: 'Fall Essentials',
  cta: 'New in',
  img: 'assets/campaign/fall-women-hoodie.jpg'
};
const NAV = ['Damen', 'Herren', 'Kinder', 'Accessoires', 'Outlet', 'Windsurf World Cup 2026'];
const PROMOS = [
  { img: 'assets/campaign/promo-muetzen.jpg', cap: 'Chiemsee Mützen' },
  { img: 'assets/campaign/promo-herren-shirts.jpg', cap: 'Herren Shirts &amp; Tanks' },
  { img: 'assets/campaign/promo-damen-sweats.jpg', cap: 'Damen Sweatshirts' }
];
const BAND = {
  img: 'assets/campaign/fall-women-hoodie.jpg',
  head: 'Der Herbst gehört dir.',
  copy: 'Wenn die Tage kürzer werden und die Luft frischer wird, ist Zeit für Wärme, die mitgeht. Unsere Jacken begleiten dich durch neblige Morgen am See, über raschelndes Laub und in die ersten kalten Abende – lässig, warm und mit dem unverwechselbaren Chiemsee-Detail.'
};

const ICONS = {
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.6-1.6 1.5 1.5 0 0 1 1.6 1.6z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6A22 22 0 0 0 14.4 3C12 3 10.4 4.4 10.4 7.1v2.8H7.7V13h2.7v8z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>',
  /* the utility row at the right of their nav */
  search: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.3 4.7 13a4.6 4.6 0 1 1 6.5-6.5l.8.8.8-.8A4.6 4.6 0 1 1 19.3 13z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14l1 13H4zM9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>',
  gift: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.5 11h17v9.5h-17zM2.5 7.2h19V11h-19zM12 7.2v13.3"/><path d="M12 7.2S10.6 3 8.3 3a2.1 2.1 0 0 0 0 4.2zM12 7.2S13.4 3 15.7 3a2.1 2.1 0 0 1 0 4.2z"/></svg>'
};

function frameHTML() {
  return `
  <div class="os-strip">✨ <u>Werde Teil der Chiemsee Family</u> ✨</div>
  <div class="oldshop-scroll">
    <div class="os-hero" style="background-image:url('${HERO.img}')">
      <div class="os-follow">
        <span class="os-follow-label">Follow us</span>
        <span class="os-rule-v"></span>
        ${ICONS.ig}${ICONS.fb}${ICONS.yt}
      </div>
      <div class="os-hero-copy">
        <div class="os-hero-brand">${HERO.brand}</div>
        <div class="os-hero-word">${HERO.word}</div>
        <span class="os-hero-cta">${HERO.cta} &nbsp;&rarr;</span>
      </div>
      <div class="os-arrows"><span>&larr;</span><span>&rarr;</span></div>
      <div class="os-dots"><b>01</b><span class="os-rule"></span><span>02</span><span>03</span></div>
      <button class="os-gift" type="button" tabindex="-1">${ICONS.gift}<span class="os-gift-badge">1</span></button>
    </div>

    <div class="os-promo">
      ${PROMOS.map((p) => `
        <figure>
          <img src="${p.img}" alt="" width="450" height="320">
          <figcaption>${p.cap}</figcaption>
          <div class="os-more">Explore now &rarr;</div>
        </figure>`).join('')}
    </div>

    <div class="os-band">
      <img src="${BAND.img}" alt="" width="960" height="340">
      <div>
        <h2>${BAND.head}</h2>
        <p>${BAND.copy}</p>
        <div class="os-links"><span>Men &rarr;</span><span>Women &rarr;</span></div>
      </div>
    </div>
  </div>

  <div class="os-head">
    <span class="os-mark">Chiemsee</span>
    <nav class="os-nav">${NAV.map((n) => `<a>${n}</a>`).join('')}</nav>
    <span class="os-utils">${ICONS.search}${ICONS.heart}${ICONS.bag}${ICONS.user}</span>
  </div>`;
}

export function mountOldShop() {
  const params = new URLSearchParams(location.search);
  const force = params.get('intro');
  if (force === '0') return;
  if (force !== '1' && seen()) return;
  markSeen();

  const frame = document.createElement('div');
  frame.className = 'oldshop';
  frame.setAttribute('aria-hidden', 'true');
  frame.innerHTML = frameHTML();

  const bar = document.createElement('div');
  bar.className = 'os-timer';
  bar.innerHTML = `
    <span class="os-progress"></span>
    <span class="os-timer-label">Chiemsee, neu gedacht &mdash; in <b data-count>5</b>&thinsp;s</span>
    <button class="os-skip" type="button" data-skip>Direkt zum Shop</button>`;
  frame.appendChild(bar);

  const wipe = document.createElement('div');
  wipe.className = 'os-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML = '<span></span>'.repeat(COLUMNS);

  document.body.appendChild(frame);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  let done = false;
  let watchdog = 0;
  let tick = 0;
  let wiping = false;

  /* The single exit. Safe to call repeatedly and from any of the three paths. */
  const handOver = () => {
    if (done) return;
    done = true;
    clearTimeout(watchdog);
    clearInterval(tick);
    document.removeEventListener('keydown', onKey);
    frame.remove();
    document.body.style.overflow = prevOverflow;
    window.dispatchEvent(new CustomEvent('intro:done'));
  };

  function startWipe() {
    if (wiping || done) return;
    wiping = true;
    clearInterval(tick);

    if (reducedMotion()) {
      frame.style.transition = 'opacity .35s linear';
      frame.style.opacity = '0';
      setTimeout(handOver, 380);
      return;
    }

    document.body.appendChild(wipe);
    const bars = [...wipe.children];
    let covered = 0;

    bars.forEach((b, i) => {
      let anim = null;
      try {
        anim = b.animate(
          [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
          { duration: WIPE_MS, delay: i * STAGGER_MS, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
        );
      } catch {
        b.style.transform = 'scaleY(1)';
      }
      const onEnd = () => {
        covered += 1;
        if (covered < bars.length) return;
        /* Field is covered: drop the old shop, then lift the columns off the store. */
        handOver();
        bars.forEach((c, j) => {
          c.style.transformOrigin = '50% 100%';
          try {
            c.animate(
              [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }],
              { duration: WIPE_MS, delay: j * STAGGER_MS, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
            );
          } catch {
            c.style.transform = 'scaleY(0)';
          }
        });
        setTimeout(() => wipe.remove(), WIPE_MS + STAGGER_MS * bars.length + 200);
      };
      if (anim) { anim.onfinish = onEnd; anim.oncancel = onEnd; } else { onEnd(); }
    });
  }

  const onKey = (e) => { if (e.key === 'Escape') startWipe(); };
  document.addEventListener('keydown', onKey);
  bar.querySelector('[data-skip]').addEventListener('click', startWipe);

  /* Countdown label + the progress line under the bar. */
  const countEl = bar.querySelector('[data-count]');
  const started = Date.now();
  tick = setInterval(() => {
    const left = Math.ceil((HOLD_MS - (Date.now() - started)) / 1000);
    countEl.textContent = String(Math.max(0, left));
  }, 250);
  try {
    bar.querySelector('.os-progress').animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: HOLD_MS, easing: 'linear', fill: 'forwards' }
    );
  } catch { /* no Web Animations — the countdown text still tells the story */ }

  setTimeout(startWipe, HOLD_MS);

  /* Last line of defence: whatever happened above, the viewer ends up in the
     store. Also covers a tab backgrounded mid-intro, where rAF-driven
     animations never fire their finish handlers. */
  watchdog = setTimeout(() => {
    handOver();
    wipe.remove();
  }, WATCHDOG_MS);
}

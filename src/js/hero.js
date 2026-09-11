/*
 * hero.js — the campaign hero carried over from chiemsee.com.
 *
 * Three slides that advance on a timer. The switch itself is a class swap and a
 * CSS opacity transition, so advancing never depends on an animation callback
 * firing: if the transition is cut short, or the browser has no Web Animations,
 * or the tab was in the background, the next tick still lands on the right
 * slide because the timer only ever sets state.
 *
 * The clock is restarted on every manual move so a slide you just chose gets its
 * full dwell, and it is stopped while the tab is hidden — a backgrounded tab
 * throttles timers, and without this you come back to a carousel that has
 * silently skipped several slides.
 */

const DWELL_MS = 3500;

export function mountHero(root = document.querySelector('[data-hero]')) {
  if (!root) return;

  const slides = [...root.querySelectorAll('[data-slide]')];
  const dots = [...root.querySelectorAll('[data-dot]')];
  if (slides.length < 2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let i = slides.findIndex((s) => s.classList.contains('is-active'));
  if (i < 0) i = 0;
  let timer = 0;

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      /* a hidden slide's link must not be reachable by keyboard */
      const link = s.querySelector('a');
      if (link) link.tabIndex = on ? 0 : -1;
    });
    dots.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
  };

  const stop = () => { clearInterval(timer); timer = 0; };
  const start = () => {
    stop();
    if (reduced.matches) return; // auto-advance is motion; leave it to the viewer
    timer = setInterval(() => show(i + 1), DWELL_MS);
  };
  const go = (n) => { show(n); start(); };

  root.querySelector('[data-next]')?.addEventListener('click', () => go(i + 1));
  root.querySelector('[data-prev]')?.addEventListener('click', () => go(i - 1));
  dots.forEach((d, k) => d.addEventListener('click', () => go(k)));

  /* Keyboard: the carousel is a region, so arrows move between slides. */
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  });

  /* Reading the copy shouldn't race the clock. */
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  reduced.addEventListener?.('change', start);

  show(i);
  start();
}

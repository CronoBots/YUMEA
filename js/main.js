/* ============================================================
   YUMÉA Wellness — interactions
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky nav shadow on scroll ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile drawer ---- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const toggleDrawer = (open) => {
    const isOpen = open ?? !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleDrawer());
  drawer.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => toggleDrawer(false))
  );

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // gentle stagger for siblings entering together
            const delay = Math.min(i * 90, 360);
            setTimeout(() => el.classList.add('in'), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---- Falling sakura petals (light, decorative) ---- */
  if (!prefersReduced) {
    const layer = document.querySelector('.petals');
    const spawn = () => {
      const petal = document.createElement('span');
      petal.className = 'petal';
      const size = 8 + Math.random() * 12;
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = 9 + Math.random() * 9 + 's';
      petal.style.opacity = String(0.25 + Math.random() * 0.35);
      layer.appendChild(petal);
      setTimeout(() => petal.remove(), 20000);
    };
    // keep it subtle: one petal every ~2.6s, capped
    const tick = () => {
      if (layer.childElementCount < 14) spawn();
    };
    setInterval(tick, 2600);
    setTimeout(spawn, 800);
    setTimeout(spawn, 2000);
  }

  /* ---- Current year ---- */
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* ============================================================
   YUMÉA Wellness — interactions
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- État de scroll (nav + bouton retour) — throttlé via rAF, écriture DOM seulement au changement d'état ---- */
  const nav = document.getElementById('nav');
  const toTopBtn = document.getElementById('toTop');
  let lastScrolled = false, lastShow = false, ticking = false;
  const updateScrollState = () => {
    const y = window.scrollY;
    const scrolled = y > 40;
    if (scrolled !== lastScrolled) { lastScrolled = scrolled; if (nav) nav.classList.toggle('scrolled', scrolled); }
    if (toTopBtn) {
      const show = y > 600;
      if (show !== lastShow) { lastShow = show; toTopBtn.classList.toggle('show', show); }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateScrollState); }
  }, { passive: true });
  updateScrollState();

  /* ---- Mobile drawer ---- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {
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
  }

  /* ---- Smooth scroll on anchor links (JS only, so touch scrolling stays native) ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

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
  const layer = document.querySelector('.petals');
  if (!prefersReduced && layer) {
    const spawn = () => {
      const petal = document.createElement('span');
      petal.className = 'petal';
      const size = 8 + Math.random() * 12;
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = 9 + Math.random() * 9 + 's';
      petal.style.opacity = String(0.06 + Math.random() * 0.1);
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

  /* ---- Univers carousel ---- */
  const track = document.getElementById('carTrack');
  if (track) {
    const slides = Array.from(track.children);
    const prev = document.getElementById('carPrev');
    const next = document.getElementById('carNext');
    const dotsWrap = document.getElementById('carDots');

    const step = () => {
      const first = slides[0];
      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    // dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Aller au visuel ' + (i + 1));
      b.addEventListener('click', () => track.scrollTo({ left: step() * i, behavior: 'smooth' }));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);

    const update = () => {
      const idx = Math.round(track.scrollLeft / step());
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 8;
    };
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- Bouton retour en haut ---- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    // l'affichage est géré par updateScrollState (rAF) ; ici uniquement le clic
    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
    );
  }

  /* ---- Reservation module ---- */
  const resaForm = document.getElementById('resaForm');
  if (resaForm) {
    const openDays = [1, 2, 3, 4, 5]; // lundi → vendredi
    const now = new Date();

    // Highlight today + open/closed status
    const dow = now.getDay();
    document.querySelectorAll('#hoursList li').forEach((li) => {
      if (Number(li.dataset.day) === dow) li.classList.add('is-today');
    });
    const statusEl = document.getElementById('openStatus');
    if (statusEl) {
      const openNow = openDays.includes(dow) && now.getHours() >= 9 && now.getHours() < 18;
      statusEl.textContent = openNow ? 'Ouvert maintenant' : 'Fermé actuellement · sur rendez-vous';
      statusEl.classList.toggle('is-open', openNow);
    }

    // Créneaux adaptés à la durée du soin (institut ouvert 09:00 → 18:00)
    const timeSel = document.getElementById('f-time');
    const rituelSel = document.getElementById('f-rituel');
    const OPEN = 9 * 60, CLOSE = 18 * 60;
    const buildSlots = (durationMin) => {
      const dur = durationMin > 0 ? durationMin : 60;
      const lastStart = CLOSE - dur; // le soin doit se terminer avant la fermeture
      const prev = timeSel.value;
      timeSel.innerHTML = '<option value="" disabled selected>Heure…</option>';
      for (let m = OPEN; m <= lastStart; m += 30) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        const o = document.createElement('option');
        o.value = o.textContent = `${hh}:${mm}`;
        if (o.value === prev) o.selected = true;
        timeSel.appendChild(o);
      }
    };
    const selectedDuration = () => {
      const opt = rituelSel.selectedOptions[0];
      return opt ? parseInt(opt.dataset.dur || '0', 10) : 0;
    };
    rituelSel.addEventListener('change', () => buildSlots(selectedDuration()));
    buildSlots(60);

    // Date: min today, block weekends
    const dateEl = document.getElementById('f-date');
    const note = document.getElementById('resaNote');
    const pad = (n) => String(n).padStart(2, '0');
    dateEl.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const isWeekend = (val) => {
      if (!val) return false;
      const wd = new Date(val + 'T12:00:00').getDay();
      return wd === 0 || wd === 6;
    };
    const showNote = (msg) => { note.hidden = false; note.textContent = msg; };
    dateEl.addEventListener('change', () => {
      if (isWeekend(dateEl.value)) showNote("L'institut est fermé le week-end. Merci de choisir un jour du lundi au vendredi.");
      else note.hidden = true;
    });

    const val = (id) => document.getElementById(id).value.trim();
    const buildText = () =>
      `Bonjour, je souhaite réserver un rendez-vous chez YUMÉA Wellness.\n\n` +
      `• Rituel : ${val('f-rituel')}\n` +
      `• Date souhaitée : ${val('f-date')}\n` +
      `• Créneau : ${val('f-time')}\n` +
      `• Nom : ${val('f-name')}\n` +
      `• Téléphone : ${val('f-phone')}` +
      (val('f-email') ? `\n• E-mail : ${val('f-email')}` : '') +
      (val('f-msg') ? `\n• Message : ${val('f-msg')}` : '');

    const isValid = () => {
      if (!val('f-rituel') || !val('f-date') || !val('f-time') || !val('f-name') || !val('f-phone')) {
        showNote('Merci de renseigner le rituel, la date, le créneau, votre nom et votre téléphone.');
        return false;
      }
      if (isWeekend(val('f-date'))) {
        showNote("L'institut est fermé le week-end. Merci de choisir un jour du lundi au vendredi.");
        return false;
      }
      note.hidden = true;
      return true;
    };

    document.getElementById('sendWa').addEventListener('click', () => {
      if (!isValid()) return;
      window.open('https://wa.me/32498691136?text=' + encodeURIComponent(buildText()), '_blank', 'noopener');
    });
    document.getElementById('sendMail').addEventListener('click', () => {
      if (!isValid()) return;
      const subject = 'Demande de rendez-vous — ' + val('f-rituel');
      window.location.href =
        'mailto:contact@yumea-wellness.be?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildText());
    });

    // Pre-select ritual when arriving from a ritual card + adapte les créneaux
    document.querySelectorAll('[data-rituel]').forEach((a) => {
      a.addEventListener('click', () => {
        const key = a.dataset.rituel.toLowerCase();
        Array.from(rituelSel.options).forEach((o) => {
          if (o.textContent.toLowerCase().includes(key)) rituelSel.value = o.value;
        });
        buildSlots(selectedDuration());
      });
    });
  }

  /* ---- Current year ---- */
  document.querySelectorAll('#year, .js-year').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Consentement cookies + carte Google Maps différée (RGPD) ---- */
  (function cookies() {
    const KEY = 'yumea-cookie-consent'; // 'accepted' | 'refused'
    const banner = document.getElementById('cookieBanner');
    const mapFrame = document.querySelector('.map iframe[data-src]');
    const mapConsent = document.getElementById('mapConsent');

    const getChoice = () => {
      try { return localStorage.getItem(KEY); } catch (e) { return null; }
    };
    const setChoice = (v) => {
      try { localStorage.setItem(KEY, v); } catch (e) {}
    };

    const loadMap = () => {
      if (mapFrame && !mapFrame.src && mapFrame.dataset.src) {
        mapFrame.src = mapFrame.dataset.src;
      }
      if (mapConsent) mapConsent.hidden = true;
    };
    const showMapConsent = () => {
      if (mapConsent) mapConsent.hidden = false;
    };

    const apply = (choice) => {
      if (choice === 'accepted') loadMap();
      else showMapConsent();
    };

    const hideBanner = () => banner && banner.classList.remove('show');
    const showBanner = () => banner && banner.classList.add('show');

    // État initial
    const initial = getChoice();
    apply(initial);
    if (!initial) showBanner();

    // Boutons du bandeau
    const btnAccept = document.getElementById('cookieAccept');
    const btnRefuse = document.getElementById('cookieRefuse');
    if (btnAccept) btnAccept.addEventListener('click', () => { setChoice('accepted'); apply('accepted'); hideBanner(); });
    if (btnRefuse) btnRefuse.addEventListener('click', () => { setChoice('refused'); apply('refused'); hideBanner(); });

    // Bouton « Afficher la carte » dans la zone carte
    const mapBtn = document.getElementById('mapConsentBtn');
    if (mapBtn) mapBtn.addEventListener('click', () => { setChoice('accepted'); loadMap(); hideBanner(); });

    // Lien « Gérer les cookies » (pied de page)
    document.querySelectorAll('[data-cookie-prefs]').forEach((el) =>
      el.addEventListener('click', (e) => { e.preventDefault(); showBanner(); })
    );
  })();
})();

/* =========================================================
   TNSL - Site Script (cleaned up)
   Handles: slideshow/carousel, mobile nav toggle, dropdown
   menu, floating background decorations, job search form,
   newsletter form, contact form, back-to-top, smooth scroll,
   active-nav highlighting, scroll-reveal.
   Every block is null-checked so this single file is safe
   to include on every page, even if a given page doesn't
   have that particular element.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initSlideshow();
  initMobileNav();
  initDropdown();
  initLinesBackground();
  initFootballBackground();
  initNewsletterForm();
  initContactForm();
  initActiveNavHighlight();
  initBackToTop();
  initSmoothScroll();
  initScrollReveal();
});

/* ---------------------------------------------------------
   1. SLIDESHOW / CAROUSEL (#track)
--------------------------------------------------------- */
function initSlideshow() {
  const track = document.getElementById('track');
  if (!track) return;

  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('dots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      goTo(i);
      reset();
    });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); reset(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); reset(); });

  function start() {
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function reset() {
    clearInterval(timer);
    start();
  }

  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      start();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    const threshold = 40;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
      reset();
    }
  }, { passive: true });
}

/* ---------------------------------------------------------
   2. MOBILE NAV TOGGLE
--------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle') || document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navScrim = document.getElementById('navScrim');

  if (!menuToggle || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (navScrim) navScrim.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (navScrim) navScrim.classList.remove('show');
    document.body.style.overflow = '';
    document.querySelectorAll('.dropdown.open').forEach(d => {
      d.classList.remove('open');
      const t = d.querySelector('.dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (navScrim) navScrim.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) closeMenu();
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
}

/* ---------------------------------------------------------
   3. DROPDOWN MENU ("Our Services")
--------------------------------------------------------- */
function initDropdown() {
  const dropdowns = document.querySelectorAll('.dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(function (dropdown) {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      if (window.innerWidth > 900) return; // desktop uses hover/CSS
      e.preventDefault();
      const isOpen = dropdown.classList.contains('open');

      dropdowns.forEach(function (d) {
        d.classList.remove('open');
        const t = d.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth > 900) return;
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const t = dropdown.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---------------------------------------------------------
   4. ANIMATED HERO BARS (.lines-bg / #linesContainer)
--------------------------------------------------------- */
function initLinesBackground() {
  const linesContainer = document.getElementById('linesContainer');
  if (!linesContainer) return;

  const colors = ['#ef2d4f', '#ffcf78', '#3b82f6', '#7c3aed', '#fff', '#ef2d4f', '#3b82f6', '#ffcf78'];
  const count = 55;

  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.className = 'line';
    const maxH = Math.floor(Math.random() * 150) + 30;
    const dur = (Math.random() * 1.2 + 0.4).toFixed(2);
    const delay = (Math.random() * 2).toFixed(2);
    const color = colors[i % colors.length];
    line.style.cssText = `
      --max-h: ${maxH}px;
      height: ${Math.floor(maxH / 2)}px;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      background: ${color};
    `;
    linesContainer.appendChild(line);
  }
}

/* ---------------------------------------------------------
   5. FLOATING FOOTBALL BACKGROUND (#footballBg)
--------------------------------------------------------- */
function initFootballBackground() {
  const container = document.getElementById('footballBg');
  if (!container) return;

  const ICON = '⚽';
  const COUNT = 14;

  if (!document.getElementById('football-keyframes')) {
    const style = document.createElement('style');
    style.id = 'football-keyframes';
    style.textContent =
      '@keyframes football-float {' +
      '0% { transform: translateY(0) rotate(0deg); }' +
      '100% { transform: translateY(-380px) rotate(var(--spin, 360deg)); }' +
      '}';
    document.head.appendChild(style);
  }

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'football';
    el.textContent = ICON;

    const size = Math.random() * 22 + 18;       // 18px - 40px
    const left = Math.random() * 100;            // %
    const duration = Math.random() * 10 + 12;    // 12s - 22s
    const delay = Math.random() * 10;            // 0s - 10s
    const rotateDir = Math.random() > 0.5 ? 1 : -1;

    el.style.fontSize = size + 'px';
    el.style.left = left + '%';
    el.style.top = '110%';
    el.style.opacity = (Math.random() * 0.35 + 0.15).toFixed(2);
    el.style.animation =
      'football-float ' + duration + 's linear ' + delay + 's infinite';
    el.style.setProperty('--spin', rotateDir * 360 + 'deg');

    container.appendChild(el);
  }
}

/* ---------------------------------------------------------
   6. JOB SEARCH FORM (find-a-job.html)
--------------------------------------------------------- */
function handleJobSearch(event) {
  event.preventDefault();

  const keyword = document.getElementById('jobKeyword');
  const location = document.getElementById('jobLocation');

  filterJobCards(keyword ? keyword.value.trim() : '', location ? location.value.trim() : '');
}

function filterJobCards(keyword, location) {
  const cards = document.querySelectorAll('.job-card');
  if (!cards.length) return;

  const kw = keyword.toLowerCase();
  const loc = location.toLowerCase();
  let anyVisible = false;

  cards.forEach(function (card) {
    const titleEl = card.querySelector('h3');
    const metaEl = card.querySelector('.job-meta');
    const title = titleEl ? titleEl.textContent.toLowerCase() : '';
    const meta = metaEl ? metaEl.textContent.toLowerCase() : '';

    const matchesKeyword = !kw || title.includes(kw);
    const matchesLocation = !loc || meta.includes(loc);
    const visible = matchesKeyword && matchesLocation;

    card.style.display = visible ? '' : 'none';
    if (visible) anyVisible = true;
  });

  toggleNoResultsMessage(!anyVisible);
}

function toggleNoResultsMessage(show) {
  const grid = document.querySelector('.jobs-grid');
  if (!grid) return;

  let msg = document.getElementById('noJobsMessage');

  if (show) {
    if (!msg) {
      msg = document.createElement('p');
      msg.id = 'noJobsMessage';
      msg.style.textAlign = 'center';
      msg.style.gridColumn = '1 / -1';
      msg.style.color = '#5d6782';
      msg.style.fontSize = '15px';
      msg.style.padding = '20px 0';
      msg.textContent = 'No jobs found matching your search. Try different keywords or location.';
      grid.appendChild(msg);
    }
  } else if (msg) {
    msg.remove();
  }
}

/* ---------------------------------------------------------
   7. NEWSLETTER / "GET NOTIFIED" FORMS
--------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    if (input && input.value) {
      const original = button.textContent;
      button.textContent = 'Subscribed!';
      input.value = '';
      setTimeout(() => { button.textContent = original; }, 2200);
    }
  });
}

// Used via inline onsubmit="handleSub(event)" (notify bar / footer forms)
function handleSub(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"], button');

  if (!emailInput || !emailInput.value.trim()) return;

  const originalText = button ? button.textContent : '';
  if (button) {
    button.textContent = 'Subscribing...';
    button.disabled = true;
  }

  setTimeout(function () {
    if (button) button.textContent = 'Subscribed!';
    emailInput.value = '';

    setTimeout(function () {
      if (button) {
        button.textContent = originalText || 'Subscribe';
        button.disabled = false;
      }
    }, 1800);
  }, 700);
}

/* ---------------------------------------------------------
   8. CONTACT FORM (used via inline onsubmit="handleForm(event)")
--------------------------------------------------------- */
function handleForm(e) {
  e.preventDefault();
  e.target.reset();
  const successMsg = document.getElementById('successMsg');
  if (!successMsg) return;
  successMsg.classList.add('show');
  setTimeout(() => successMsg.classList.remove('show'), 4000);
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (!contactForm || !formNote) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formNote.hidden = false;
    contactForm.reset();
  });
}

/* ---------------------------------------------------------
   9. ACTIVE NAV LINK HIGHLIGHT (data-page attribute)
--------------------------------------------------------- */
function initActiveNavHighlight() {
  const currentPage = document.body.getAttribute('data-page');
  if (!currentPage) return;

  document.querySelectorAll('.nav-links a[data-page], .navbar__links > li > a[data-page]')
    .forEach(function (link) {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('is-active');
      }
    });
}

/* ---------------------------------------------------------
   10. BACK TO TOP BUTTON
--------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   11. SMOOTH ANCHOR SCROLLING
--------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ---------------------------------------------------------
   12. SCROLL-REVEAL ANIMATION
--------------------------------------------------------- */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.how-we-started__grid, .vmv__cards, .values__grid, .services__grid, .approach__grid, .diff-wheel'
  );
  if (!revealTargets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
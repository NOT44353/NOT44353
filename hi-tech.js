(() => {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function finishBootImmediate() {
    const boot = document.getElementById('bootIntro');
    if (boot) boot.remove();
    document.body.classList.add('loaded', 'boot-done');
    window.dispatchEvent(new Event('portfolio:ready'));
  }

  function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const savedTheme = localStorage.getItem('cvTheme') || 'light';
    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      if (themeMeta) {
        themeMeta.setAttribute('content', theme === 'dark' ? '#101824' : '#efece4');
      }
    };

    applyTheme(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('cvTheme', next);
        applyTheme(next);
      });
    }
  }

  function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.main-nav');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-link'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute('href')?.replace('#', '');
        const el = id ? document.getElementById(id) : null;
        return el ? { link, el } : null;
      })
      .filter(Boolean);

    const updateActiveNav = () => {
      const scrollPos = window.scrollY + 140;
      let current = sections[0];
      for (const item of sections) {
        if (item.el.offsetTop <= scrollPos) {
          current = item;
        }
      }
      navLinks.forEach((l) => l.classList.remove('active'));
      if (current) current.link.classList.add('active');
    };

    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  function injectProjectCaseStudyDrawers() {
    if (typeof PROJECT_DETAILS === 'undefined') return;
    const cards = document.querySelectorAll('.portfolio-item[data-project-id]');
    cards.forEach((card) => {
      if (card.querySelector('.project-seo-drawer')) return;
      const id = card.getAttribute('data-project-id');
      const data = PROJECT_DETAILS[id];
      if (!data) return;

      const details = document.createElement('details');
      details.className = 'project-seo-drawer';

      const challengesHtml = (data.challenges || []).map((c) => `<li>${c}</li>`).join('');
      const solutionsHtml = (data.solutions || []).map((s) => `<li>${s}</li>`).join('');
      const metricsHtml = (data.metrics || []).map((m) => `<li>${m}</li>`).join('');

      details.innerHTML = `
        <summary>Technical Summary &amp; Validated Impact</summary>
        <div class="project-seo-drawer-body">
          <strong>Key Challenges</strong>
          <ul>${challengesHtml}</ul>
          <strong>Engineering Solutions</strong>
          <ul>${solutionsHtml}</ul>
          <strong>Results &amp; Impact</strong>
          <ul>${metricsHtml}</ul>
        </div>
      `;

      const btn = card.querySelector('.btn-project-detail');
      if (btn) {
        card.insertBefore(details, btn);
      } else {
        card.appendChild(details);
      }
    });
  }

  ready(() => {
    finishBootImmediate();
    initThemeToggle();
    initMobileMenu();
    initScrollSpy();
    injectProjectCaseStudyDrawers();
  });
})();

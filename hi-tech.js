(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function initBoot() {
    const boot = document.getElementById('bootIntro');
    const linesEl = document.getElementById('bootLines');
    const bar = document.getElementById('bootBarFill');
    if (!boot || !linesEl || !bar) {
      finishBoot();
      return;
    }

    const lines = [
      { text: '> INITIALIZING SYSTEM ..............', cls: 'dim' },
      { text: '> LOAD PROFILE: THANAPAT PISAVONG (NOT44353)', cls: '' },
      { text: '> STACK: LARAVEL 12 · NEXT.JS 16 · .NET 8 · AWS · KOTLIN', cls: '' },
      { text: '> ENTERPRISE: MANHOUR · EBR · LEAFLET · TD MASTER · CAR SHARE', cls: 'dim' },
      { text: '> STATUS: ALL PRODUCTION SYSTEMS ONLINE', cls: 'ok' },
      { text: '> ACCESS GRANTED // RENDERING HUD...', cls: 'ok' }
    ];

    if (prefersReduced) {
      lines.forEach((line) => {
        const p = document.createElement('div');
        p.className = line.cls;
        p.textContent = line.text;
        linesEl.appendChild(p);
      });
      bar.style.width = '100%';
      setTimeout(finishBoot, 250);
      return;
    }

    let i = 0;
    const tick = () => {
      if (i >= lines.length) {
        bar.style.width = '100%';
        setTimeout(finishBoot, 420);
        return;
      }
      const p = document.createElement('div');
      p.className = lines[i].cls;
      p.textContent = lines[i].text;
      linesEl.appendChild(p);
      bar.style.width = `${((i + 1) / lines.length) * 100}%`;
      i += 1;
      setTimeout(tick, 280);
    };
    tick();
  }

  function finishBoot() {
    const boot = document.getElementById('bootIntro');
    if (boot) boot.classList.add('is-done');
    document.body.classList.add('loaded', 'boot-done', 'hi-tech');
    window.dispatchEvent(new Event('portfolio:ready'));
    setTimeout(() => boot && boot.remove(), 700);
  }

  function initCursor() {
    if (!isFinePointer || prefersReduced) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hasMoved = false;

    const render = () => {
      if (hasMoved) {
        rx += (x - rx) * 0.28;
        ry += (y - ry) * 0.28;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const showCursor = () => {
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    };

    const hideCursor = () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
      ring.classList.remove('is-hot', 'is-clicking');
    };

    window.addEventListener('pointermove', (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!hasMoved) {
        rx = x;
        ry = y;
        hasMoved = true;
      }
      showCursor();
    }, { passive: true });

    document.documentElement.addEventListener('mouseenter', showCursor);
    document.documentElement.addEventListener('mouseleave', hideCursor);

    window.addEventListener('pointerdown', () => ring.classList.add('is-clicking'));
    window.addEventListener('pointerup', () => ring.classList.remove('is-clicking'));

    // Handle iframe boundary so cursor cleanly hides while hovering interactive iframe
    const projectsFrame = document.getElementById('projectsFrame');
    if (projectsFrame) {
      projectsFrame.addEventListener('mouseenter', hideCursor);
      projectsFrame.addEventListener('mouseleave', showCursor);
    }

    const hotSelector = 'a, button, .projects-btn, .social-btn, .btn-main, .glass-card, .portfolio-item, .blueprint-node, .blueprint-mini-card, .profile-3d-scene, .portfolio-filter-btn, .btn-project-detail, .modal-close-btn, .language-btn, .audio-btn, .skill-btn, [role="button"]';

    document.addEventListener('pointerover', (e) => {
      if (e.target && e.target.closest && e.target.closest(hotSelector)) {
        ring.classList.add('is-hot');
      }
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      // Avoid jitter when moving between child elements inside the same hot card or button
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(hotSelector)) {
        ring.classList.remove('is-hot');
      }
    }, { passive: true });
  }

  function initHudScroll() {
    const chip = document.getElementById('hudScroll');
    if (!chip) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      chip.textContent = `SCROLL ${pct}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initReveals() {
    // Reveal sections + top-level cards only (avoid nested opacity traps)
    const targets = document.querySelectorAll(
      'section:not(.hero), .timeline-item, .portfolio-item, .tech-category, .special-item, .counter-card'
    );
    targets.forEach((el, idx) => {
      el.classList.add('hi-reveal');
      if (idx % 3 === 1) el.classList.add('delay-1');
      if (idx % 3 === 2) el.classList.add('delay-2');
    });

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  function initMagneticButtons() {
    if (!isFinePointer || prefersReduced) return;
    document.querySelectorAll('.btn-main, .projects-btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function enhanceParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nodes = Array.from({ length: 42 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(94, 200, 245, 0.55)';
        ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(44, 167, 224, ${1 - dist / 130})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('portfolio:ready', () => {
      cancelAnimationFrame(raf);
      draw();
    }, { once: true });
  }

  ready(() => {
    initBoot();
    initCursor();
    initHudScroll();
    enhanceParticles();

    window.addEventListener('portfolio:ready', () => {
      initReveals();
      initMagneticButtons();
    }, { once: true });
  });
})();

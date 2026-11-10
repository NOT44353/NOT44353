// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
  const bars = document.querySelectorAll('.progress');
  bars.forEach((bar, index) => {
    const rect = bar.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible && !bar.classList.contains('animated')) {
      bar.classList.add('animated');
      
      // Get the target width from CSS classes
      let targetWidth = '0%';
      if (bar.classList.contains('csharp')) targetWidth = '95%';
      else if (bar.classList.contains('js')) targetWidth = '92%';
      else if (bar.classList.contains('react')) targetWidth = '90%';
      else if (bar.classList.contains('kotlin')) targetWidth = '88%';
      else if (bar.classList.contains('node')) targetWidth = '88%';
      else if (bar.classList.contains('go')) targetWidth = '85%';
      else if (bar.classList.contains('php')) targetWidth = '88%';
      else if (bar.classList.contains('java')) targetWidth = '80%';
      else if (bar.classList.contains('python')) targetWidth = '75%';
      
      // Force set the width immediately and with CSS property
      bar.style.width = targetWidth;
      bar.style.setProperty('--progress-width', targetWidth);
      
      // Also set a backup with !important via CSS class
      setTimeout(() => {
        bar.style.cssText = `width: ${targetWidth} !important;`;
      }, 50 + (index * 100));
    }
  });
}

// Force animation on load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    animateSkillBars();
    // Force trigger again after a short delay
    setTimeout(animateSkillBars, 500);
  }, 100);
});

// ===== SCROLL REVEAL EFFECT =====
function revealOnScroll() {
  const elements = document.querySelectorAll('section, .timeline-item, .portfolio-item, .counter-card');
  
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible) {
      element.classList.add('reveal', 'active');
    }
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (!Number.isNaN(target)) {
      counter.textContent = target;
    }
  });
}

// ===== PARTICLE BACKGROUND =====
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(44, 167, 224, ${particle.opacity})`;
      ctx.fill();
      
      // Update position
      particle.x += particle.dx;
      particle.y += particle.dy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
    });
    
    requestAnimationFrame(drawParticles);
  }
  
  resizeCanvas();
  createParticles();
  drawParticles();
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
}

// ===== 3D PROFILE PLAYGROUND =====
function initProfile3D() {
  const scene = document.getElementById('profile3d');
  const stage = document.getElementById('profile3dStage');
  const shine = document.getElementById('profileShine');
  const canvas = document.getElementById('profileSparkCanvas');
  if (!scene || !stage) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    scene.classList.remove('is-idle');
    return;
  }

  let rafId = 0;
  let targetX = -12;
  let targetY = 8;
  let currentX = -12;
  let currentY = 8;
  let lift = 0;
  let targetLift = 0;
  let active = false;
  let flipping = false;
  let idleTimer = null;

  const setVars = () => {
    scene.style.setProperty('--ry', `${currentX.toFixed(2)}deg`);
    scene.style.setProperty('--rx', `${currentY.toFixed(2)}deg`);
    scene.style.setProperty('--lift', `${lift.toFixed(2)}px`);
  };

  const render = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    lift += (targetLift - lift) * 0.12;
    setVars();

    const settling =
      Math.abs(targetX - currentX) > 0.04 ||
      Math.abs(targetY - currentY) > 0.04 ||
      Math.abs(targetLift - lift) > 0.2;

    if (active || settling) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = 0;
    }
  };

  const startRender = () => {
    if (!rafId) rafId = requestAnimationFrame(render);
  };

  const goIdle = () => {
    scene.classList.add('is-idle');
    scene.classList.remove('is-tilting');
    stage.style.transform = '';
  };

  const wake = () => {
    scene.classList.remove('is-idle');
    scene.classList.add('is-tilting');
    clearTimeout(idleTimer);
  };

  scene.classList.add('is-idle');

  scene.addEventListener('pointerenter', () => {
    wake();
    targetLift = -8;
    startRender();
  });

  scene.addEventListener('pointermove', (e) => {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetX = (x - 0.5) * 42;
    targetY = (0.5 - y) * 32;
    targetLift = -10;
    active = true;
    wake();
    startRender();

    if (shine) {
      shine.style.setProperty('--shine-x', `${(x * 100).toFixed(1)}%`);
      shine.style.setProperty('--shine-y', `${(y * 100).toFixed(1)}%`);
    }
  });

  scene.addEventListener('pointerleave', () => {
    targetX = -12;
    targetY = 8;
    targetLift = 0;
    active = false;
    startRender();
    idleTimer = setTimeout(goIdle, 450);
  });

  // Spark particles around profile
  let burstSparks = () => {};
  if (canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let sparks = [];

  const resizeCanvas = () => {
    const rect = scene.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const makeSpark = (burst = false) => {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const angle = Math.random() * Math.PI * 2;
    const radius = burst ? 40 + Math.random() * 70 : 90 + Math.random() * 50;
    return {
      x: w / 2 + Math.cos(angle) * radius,
      y: h / 2 + Math.sin(angle) * radius * 0.75,
      vx: (Math.random() - 0.5) * (burst ? 3.2 : 0.6),
      vy: (Math.random() - 0.5) * (burst ? 3.2 : 0.6) - (burst ? 0.8 : 0),
      life: burst ? 1 : 0.35 + Math.random() * 0.65,
      decay: burst ? 0.02 + Math.random() * 0.02 : 0.003 + Math.random() * 0.004,
      size: burst ? 2 + Math.random() * 3 : 1 + Math.random() * 2
    };
  };

  burstSparks = () => {
    for (let i = 0; i < 28; i++) sparks.push(makeSpark(true));
  };

  const drawSparks = () => {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    if (sparks.length < 26) sparks.push(makeSpark(false));

    sparks = sparks.filter((s) => s.life > 0);
    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      ctx.beginPath();
      ctx.fillStyle = `rgba(94, 200, 245, ${Math.max(s.life, 0)})`;
      ctx.shadowColor = 'rgba(44, 167, 224, 0.8)';
      ctx.shadowBlur = 8;
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawSparks);
  };

  resizeCanvas();
  for (let i = 0; i < 20; i++) sparks.push(makeSpark(false));
  drawSparks();
  window.addEventListener('resize', resizeCanvas);
  }

  scene.addEventListener('click', () => {
    if (flipping) return;
    flipping = true;
    scene.classList.add('is-flipping');
    targetLift = -18;
    startRender();
    burstSparks();

    setTimeout(() => {
      scene.classList.remove('is-flipping');
      flipping = false;
      targetLift = active ? -10 : 0;
    }, 900);
  });
}

// ===== GLASS CARD HOVER EFFECT =====
function initGlassCardEffects() {
  // Disabled when hi-tech reveal/motion layer is active to avoid transform conflicts
  if (document.getElementById('bootIntro') || document.body.classList.contains('boot-done')) {
    return;
  }

  const glassCards = document.querySelectorAll('.glass-card');
  
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

// ===== PARALLAX EFFECT =====
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    parallaxLayers.forEach((layer, index) => {
      const speed = 0.1 + (index * 0.05);
      layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
  const element = document.querySelector('.hero h2');
  if (!element) return;

  const originalText = element.textContent;
  let started = false;

    const run = () => {
    if (started) return;
    started = true;
    // Keep original H2 intact in DOM for SEO crawlers and zero CLS
    element.textContent = originalText;
  };

  if (document.body.classList.contains('boot-done')) {
    setTimeout(run, 200);
  } else {
    window.addEventListener('portfolio:ready', () => setTimeout(run, 200), { once: true });
  }
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('is-visible');
    } else {
      scrollBtn.classList.remove('is-visible');
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATION =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ===== PROJECTS MODAL FUNCTIONS =====
function openProjectsModal() {
  const modal = document.getElementById('projectsModal');
  const frame = document.getElementById('projectsFrame');
  const loader = document.getElementById('projectsLoader');
  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleEscapeKey);

  if (frame) {
    if (loader) loader.hidden = false;
    frame.hidden = true;

    const loadTimeout = setTimeout(() => {
      if (loader && !loader.hidden) {
        loader.textContent = 'Failed to load. Click X and try again.';
      }
    }, 10000);

    frame.onload = () => {
      clearTimeout(loadTimeout);
      frame.hidden = false;
      if (loader) loader.hidden = true;
    };

    frame.onerror = () => {
      clearTimeout(loadTimeout);
      if (loader) loader.textContent = 'Failed to load. Click X and try again.';
    };

    frame.src = `mini-projects/index.html?t=${Date.now()}`;
  }
}

function closeProjectsModal() {
  const modal = document.getElementById('projectsModal');
  const frame = document.getElementById('projectsFrame');
  const loader = document.getElementById('projectsLoader');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', handleEscapeKey);

  if (frame) {
    frame.onload = null;
    frame.onerror = null;
    frame.src = 'about:blank';
    frame.hidden = true;
  }
  if (loader) {
    loader.hidden = true;
    loader.textContent = 'Loading Lab...';
  }
}

function handleEscapeKey(event) {
  if (event.key !== 'Escape') return;
  const frame = document.getElementById('projectsFrame');
  const modal = document.getElementById('projectsModal');
  if (!modal?.classList.contains('active')) return;

  const frameReady = frame && !frame.hidden && frame.src && !frame.src.includes('about:blank');

  if (frameReady && frame.contentWindow) {
    frame.contentWindow.postMessage({ type: 'portfolio:escape-request' }, '*');
    return;
  }
  closeProjectsModal();
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type === 'mini-projects:escape-pass') {
    closeProjectsModal();
  }
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions
  // Network particles handled by hi-tech.js when present
  if (!document.getElementById('bootIntro')) {
    initParticles();
  }
  initProfile3D();
  initGlassCardEffects();
  initParallax();
  initTypingEffect();
  initScrollToTop();
  initLazyLoading();
  
  // Add event listeners with throttling
  window.addEventListener('scroll', throttle(() => {
    animateSkillBars();
    revealOnScroll();
  }, 16)); // ~60fps
  
  // Loaded state waits for hi-tech boot; counters start when visible
  const startAfterBoot = () => {
    document.body.classList.add('loaded');
    initCountersOnView();
  };

  if (document.body.classList.contains('boot-done')) {
    startAfterBoot();
  } else {
    window.addEventListener('portfolio:ready', startAfterBoot, { once: true });
    // Fallback if hi-tech.js missing
    setTimeout(() => {
      if (!document.body.classList.contains('boot-done')) startAfterBoot();
    }, 3500);
  }
});

function initCountersOnView() {
  const section = document.getElementById('counters');
  if (!section) {
    animateCounters();
    return;
  }

  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    animateCounters();
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(section);
  } else {
    run();
  }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

// ===== ACCESSIBILITY =====
document.addEventListener('keydown', function(e) {
  // Escape key to close any open modals or overlays
  if (e.key === 'Escape') {
    // Add any modal closing logic here
  }
  
  // Enter key for buttons
  if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
    e.target.click();
  }
});

// ===== RESPONSIVE HANDLING =====
function handleResize() {
  // Recalculate any layout-dependent values
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', debounce(handleResize, 250));
handleResize(); // Initial call

// ===== AUDIO SYSTEM =====
class ResumeNarrator {
  constructor() {
    this.isPlaying = false;
    this.isMuted = localStorage.getItem('audioMuted') === 'true';
    this.currentLanguage = localStorage.getItem('preferredLanguage') || 'th'; // 'th' or 'en'
    this.audioToggle = document.getElementById('audioToggle');
    this.audioIcon = document.getElementById('audioIcon');
    this.languageToggle = document.getElementById('languageToggle');
    this.languageIcon = document.getElementById('languageIcon');
    this.languageText = document.getElementById('languageText');
    this.speechSynthesis = window.speechSynthesis;
    this.currentUtterance = null;
    
    this.init();
  }

  async init() {
    this.setupAudioToggle();
    this.setupLanguageToggle();
    this.updateAudioButton();
    this.updateLanguageButton();
    this.prepareNarrationScript();
  }

  setupAudioToggle() {
    if (this.audioToggle) {
      this.audioToggle.addEventListener('click', () => {
        this.toggleAudio();
      });
    }
  }

  setupLanguageToggle() {
    if (this.languageToggle) {
      this.languageToggle.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }
  }

  toggleAudio() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('audioMuted', this.isMuted.toString());
    this.updateAudioButton();
    
    if (!this.isMuted) {
      this.playNarration();
    } else {
      this.stopNarration();
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'th' ? 'en' : 'th';
    localStorage.setItem('preferredLanguage', this.currentLanguage);
    this.updateLanguageButton();
    
    // If currently playing, restart with new language
    if (this.isPlaying) {
      this.stopNarration();
      setTimeout(() => {
        this.playNarration();
      }, 100);
    }
  }

  updateAudioButton() {
    if (this.audioToggle && this.audioIcon) {
      if (this.isMuted) {
        this.audioToggle.classList.add('muted');
        this.audioIcon.className = 'fas fa-volume-mute';
        this.audioToggle.title = this.currentLanguage === 'th' ? 'เปิดเสียงบรรยาย' : 'Play Narration';
      } else if (this.isPlaying) {
        this.audioToggle.classList.remove('muted');
        this.audioIcon.className = 'fas fa-stop';
        this.audioToggle.title = this.currentLanguage === 'th' ? 'หยุดการบรรยาย' : 'Stop Narration';
      } else {
        this.audioToggle.classList.remove('muted');
        this.audioIcon.className = 'fas fa-play';
        this.audioToggle.title = this.currentLanguage === 'th' ? 'เริ่มการบรรยาย' : 'Start Narration';
      }
    }
  }

  updateLanguageButton() {
    if (this.languageToggle && this.languageText) {
      if (this.currentLanguage === 'th') {
        this.languageText.textContent = 'TH';
        this.languageToggle.title = 'Switch to English';
      } else {
        this.languageText.textContent = 'EN';
        this.languageToggle.title = 'เปลี่ยนเป็นภาษาไทย';
      }
    }
  }

  prepareNarrationScript() {
    this.scripts = {
      th: `
        สวัสดีครับ ผม ธนภัทร พิศวงศ์ (น๊อต) Full Stack Developer และ Cloud Systems Engineer
        
        ผมมีความเชี่ยวชาญในการออกแบบและพัฒนาระบบสถาปัตยกรรมระดับ Enterprise, ระบบโรงงานอุตสาหกรรมยาตามมาตรฐาน GMP, 
        Infrastructure as Code ด้วย AWS CDK TypeScript, ระบบเชื่อมต่อ SAP Business One, ระบบ AI Agent และ MCP Server, รวมถึงระบบวิศวกรรมยานยนต์ Android Auto
        
        ปัจจุบัน ผมปฏิบัติงานที่ บริษัท ที.พี. ดรัก แลบบอราทอรี่ส์ (1969) จำกัด ในตำแหน่ง Full Stack Developer และ Systems Engineer
        รับผิดชอบการออกแบบและพัฒนาระบบ Electronic Batch Record หรือ EBR ด้วย Next.js 16, React 19 Compiler, Bun 1.3, Prisma 7 และ Aurora PostgreSQL แบบไร้รหัสผ่านด้วย AWS RDS IAM Signer พร้อมชุดทดสอบ Playwright E2E
        ออกแบบโครงสร้างพื้นฐาน Cloud 7 Stacks ด้วย AWS CDK TypeScript และ GitHub Actions OIDC
        พัฒนาระบบนิเวศอินทราเน็ต 4 แอปพลิเคชัน เชื่อมต่อ Central Cognito SSO, SharePoint MCP Server และ Microsoft 365
        พัฒนาระบบ ManHour ด้วย Laravel 12 และ PHP 8.4 Sync ข้อมูลกับ SAP Business One แบบ Real-time และพัฒนาระบบ E-Leaflet ด้วย .NET 8 Web API
        รวมถึงวางระบบ DevSecOps ด้วย SonarQube SAST และ Polyglot Docker DevContainer
        
        นอกจากนี้ ผมยังได้พัฒนา Car Share Mirror สำหรับส่งภาพขึ้นหน้าจอรถยนต์ MG S5 EV ผ่าน Android Auto ไร้สาย,
        AcoustiCar AI ระบบวิเคราะห์เสียงเครื่องยนต์ด้วยความถี่ FFT และเรดาร์ 60 เฟรมต่อวินาที,
        JARVIS AI ระบบผู้ช่วยวิศวกรอัจฉริยะด้วย Vercel AI SDK, MCP Server, MediaPipe Vision และ Three.js 3D,
        รวมถึงระบบวิเคราะห์สถิติการเทรด TD Master เชื่อมต่อ MetaTrader 5
        
        ผมสำเร็จการศึกษาจาก มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี สาขาวิชาเทคโนโลยีสารสนเทศ ด้วยเกรดเฉลี่ย 3.09
        ขอบคุณที่ให้ความสนใจในผลงานของผมครับ
      `,
      en: `
        Hello, I'm Thanapat Pisavong (Not), a Full Stack Developer and Cloud Systems Engineer.
        
        I specialize in architecting mission-critical enterprise platforms, pharmaceutical GMP-grade manufacturing systems,
        AWS CDK TypeScript infrastructure as code, zero-trust passwordless database security, SAP Business One integrations, Model Context Protocol AI agents, and automotive engineering.
        
        Currently, I serve as Full Stack Developer & Systems Engineer at TP Drug Laboratories (1969) Co., Ltd.
        I architect the Electronic Batch Record (EBR) using Next.js 16, React 19 Compiler, Bun 1.3, Prisma 7, AWS RDS IAM Signer, and Playwright E2E automation,
        a 7-stack AWS CDK TypeScript cloud infrastructure with GitHub Actions OIDC CI/CD,
        a 4-app enterprise SSO and SharePoint MCP ecosystem,
        the ManHour Manufacturing Ecosystem with Laravel 12 and PHP 8.4 integrated real-time with SAP Business One,
        the E-Leaflet Patient QR platform with ASP.NET Core 8 Web API,
        and DevSecOps quality gates powered by SonarQube 26 and multi-database Docker DevContainers.
        
        My portfolio also features Car Share Mirror for wireless Android Auto projection on MG S5 EV,
        AcoustiCar AI for real-time 60fps FFT spectrogram and polar radar engine fault diagnostics,
        JARVIS AI powered by Vercel AI SDK, MCP tools, MediaPipe computer vision, and React Three Fiber 3D,
        and TD Master quantitative trading analytics.
        
        Thank you for reviewing my portfolio and system architectures.
      `
    };
  }

  playNarration() {
    if (this.isMuted) return;
    
    // If already playing, stop it first
    if (this.isPlaying) {
      this.stopNarration();
      return;
    }
    
    this.isPlaying = true;
    this.updateAudioButton();
    this.audioToggle.classList.add('pulse');
    
    // Get the appropriate script based on current language
    const script = this.scripts[this.currentLanguage];
    
    // Wait for voices to load
    const speak = () => {
      // Create speech utterance
      this.currentUtterance = new SpeechSynthesisUtterance(script);
      
      // Configure voice settings based on language
      if (this.currentLanguage === 'th') {
        this.currentUtterance.rate = 0.85; // Slower for Thai
        this.currentUtterance.pitch = 1.1;
        this.currentUtterance.volume = 0.9;
        this.currentUtterance.lang = 'th-TH';
      } else {
        this.currentUtterance.rate = 0.9; // Slightly faster for English
        this.currentUtterance.pitch = 1.0;
        this.currentUtterance.volume = 0.9;
        this.currentUtterance.lang = 'en-US';
      }
      
      // Try to use appropriate voice for the language
      const voices = this.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (this.currentLanguage === 'th') {
        // Look for Thai voice
        selectedVoice = voices.find(voice => 
          voice.lang.includes('th') || voice.name.includes('Thai') || voice.name.includes('thai')
        );
        if (selectedVoice) {
          console.log('Using Thai voice:', selectedVoice.name);
        }
      } else {
        // Look for English voice
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en') && (
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Alex') ||
            voice.name.includes('Karen')
          )
        );
        if (selectedVoice) {
          console.log('Using English voice:', selectedVoice.name);
        }
      }
      
      // Fallback to any available voice if specific language not found
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          this.currentLanguage === 'th' ? 
            voice.lang.includes('th') : 
            voice.lang.includes('en')
        );
        if (selectedVoice) {
          console.log('Using fallback voice:', selectedVoice.name);
        }
      }
      
      if (selectedVoice) {
        this.currentUtterance.voice = selectedVoice;
      }
      
      // Event handlers
      this.currentUtterance.onend = () => {
        this.isPlaying = false;
        this.audioToggle.classList.remove('pulse');
        this.updateAudioButton();
      };
      
      this.currentUtterance.onerror = (event) => {
        console.log('Speech synthesis error:', event.error);
        this.isPlaying = false;
        this.audioToggle.classList.remove('pulse');
        this.updateAudioButton();
      };
      
      // Start speaking
      this.speechSynthesis.speak(this.currentUtterance);
    };
    
    // Check if voices are loaded
    if (this.speechSynthesis.getVoices().length === 0) {
      this.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
    } else {
      speak();
    }
  }

  stopNarration() {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.audioToggle.classList.remove('pulse');
    this.updateAudioButton();
  }

}

// Initialize narrator system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new ResumeNarrator();
});

// ===== PROJECT DETAILS DATA & MODAL SYSTEM =====
const PROJECT_DETAILS = {
  ebr: {
    title: 'Electronic Batch Record (EBR) — GMP Digital Manufacturing',
    category: 'Pharma GMP & Digital Manufacturing',
    tagline: 'ระบบบันทึกประวัติการผลิตยาแบบดิจิทัลตามมาตรฐาน GMP / GxP Validation พร้อม Passwordless IAM DB และ Playwright E2E',
    diagram: `[Operator / QA Web Client (React 19 Compiler)]
        │  (OIDC PKCE Authentication / AWS Cognito)
        ▼
[Next.js 16 App Router + Bun 1.3 + pdf-lib / @napi-rs/canvas]
        │  (Prisma 7 ORM + @aws-sdk/rds-signer IAM Auth)
        ▼
[AWS Aurora PostgreSQL (Multi-AZ Zero-Password DB)]
        │  (Immutable Audit Trail, Digital Signatures, Playwright E2E)
        ▼
[AWS S3 Encrypted Vault for Signed Batch PDFs]`,
    challenges: [
      'โรงงานยาต้องปฏิบัติตามข้อกำหนด GMP / GxP อย่างเคร่งครัด ห้ามมีการแก้ไขข้อมูลย้อนหลังโดยไม่มี Audit Trail และต้องสร้างไฟล์ PDF พร้อมลายเซ็นอิเล็กทรอนิกส์ที่ตรวจสอบได้',
      'ฟอร์มบันทึกข้อมูลในสายการผลิตยามีความซับซ้อนสูง (Dynamic Form Fields, Multi-step Approval, Formula Validation) และต้องผ่านการทดสอบ E2E อัตโนมัติทุกครั้งก่อนขึ้น Production',
      'การรันระบบบน Cloud ต้องมีความปลอดภัยระดับสูงสุด ห้ามฝังรหัสผ่านฐานข้อมูลใน Environment Variables หรือโค้ดโดยเด็ดขาด'
    ],
    solutions: [
      'พัฒนาฟอร์มด้วย React 19 (babel-plugin-react-compiler) และ Next.js 16 พร้อมระบบ Drag-and-Drop Form Builder (@dnd-kit), Zod 4 Validation และการสร้างเอกสาร PDF ความละเอียดสูงด้วย pdf-lib, pdfjs-dist และ @napi-rs/canvas',
      'ออกแบบ Immutable Audit Trail และระบบ Digital Signature พร้อมชุดทดสอบอัตโนมัติ Playwright 1.61 E2E Test Suite ตรวจสอบทุก Flow การอนุมัติ',
      'ใช้ AWS Cognito (PKCE OIDC) ร่วมกับ @aws-sdk/rds-signer เพื่อให้การเชื่อมต่อฐานข้อมูล Aurora PostgreSQL ผ่าน Prisma 7 ใช้โทเค็น IAM ชั่วคราวแบบไร้รหัสผ่าน 100%'
    ],
    tech: ['Next.js 16', 'React 19 Compiler', 'Bun 1.3', 'Prisma 7', '@aws-sdk/rds-signer', 'Playwright 1.61 E2E', 'pdf-lib', '@napi-rs/canvas', 'AWS ECS Fargate', 'AWS Cognito'],
    metrics: [
      'ลดระยะเวลาการรวบรวมและตรวจสอบเอกสาร Batch Record จากเดิม 3-5 วัน เหลือเพียงไม่กี่นาที',
      'ขจัดความผิดพลาดจากการเขียนเอกสารด้วยมือ (Paperless 100%) พร้อมความครอบคลุมการทดสอบด้วย Playwright E2E',
      'สอดคล้องตามมาตรฐานข้อกำหนดการผลิตยา GMP และสถาปัตยกรรม Zero-Trust Passwordless Database'
    ]
  },
  manhour: {
    title: 'ManHour Production Tracking & SAP Integration',
    category: 'Enterprise Manufacturing & ERP Sync',
    tagline: 'ระบบคำนวณชั่วโมงทำงาน ต้นทุนแรงงาน และการเชื่อมโยงข้อมูล 2 ทิศทางกับ SAP Business One',
    diagram: `[SAP Business One (MSSQL)]
        ▲  ▲
        │  │ (Node.js ESM Sync via node-cron)
        │  ▼
[ManHour Backend API (Laravel 12 / PHP 8.4 / MySQL)]
        ▲
        │ (REST API / Sanctum Token / DataTables)
        ▼
[ManHour Frontend & Mobile Web (Blade + Vite 7 + Tailwind 4)]
        ▲
[Shop Floor Barcode / QR Scanners & Line Workers]`,
    challenges: [
      'ข้อมูล Production Order (OWOR) และ Route Stages ใน SAP มีขนาดใหญ่และต้องอัปเดตสถานะแบบ Real-time',
      'พนักงานในไลน์ผลิตยาต้องการหน้าเว็บที่โหลดรวดเร็ว ใช้งานง่ายบนแท็บเล็ตและอุปกรณ์สแกนบาร์โค้ดหน้างาน',
      'ข้อมูลชั่วโมงทำงานและผลผลิตต้องส่งกลับไปอัปเดตลงใน SAP โดยไม่ทำให้ฐานข้อมูลหลักเกิด Deadlock'
    ],
    solutions: [
      'สร้างสคริปต์ Node.js ESM เชื่อมต่อ MSSQL และ MySQL ทำงานผ่าน Cron Job เพื่อ Sync ข้อมูลแบบ Idempotent',
      'พัฒนา Backend API ด้วย Laravel 12 และ PHP 8.4 รองรับ Swagger OpenAPI, Queue Worker, และ Caching',
      'ออกแบบหน้าจอ Shop Floor ด้วย Laravel Blade, Tailwind CSS 4, และ Vite 7 โหลดเร็วและรองรับหน้าจอสัมผัส พร้อมระบบ IIS Artifact Watcher Deploy อัตโนมัติ'
    ],
    tech: ['PHP 8.4', 'Laravel 12', 'Blade', 'Vite 7', 'Tailwind CSS 4', 'MySQL', 'MSSQL (SAP)', 'Node.js', 'ASP.NET Core 8', 'Yajra DataTables', 'Sanctum'],
    metrics: [
      'อัปเดตสถานะคำสั่งผลิตตรงกับ SAP Business One ตลอด 24 ชั่วโมง',
      'ลดเวลาในการบันทึกและคำนวณชั่วโมงแรงงานต่อกะลงมากกว่า 70%',
      'ระบบทำงานแบบ High Availability ด้วย Production Uptime 99.9%'
    ]
  },
  leaflet: {
    title: 'E-Leaflet — Smart Drug Registration & Patient QR',
    category: 'Healthcare Regulatory & PDF Streaming',
    tagline: 'ระบบเอกสารกำกับยาอิเล็กทรอนิกส์ สแกน QR Code เปิดอ่าน PDF ความเร็วสูง และแจ้งเตือนยาหมดอายุ',
    diagram: `[Patient / Doctor Mobile Scan] ──(QR Code)──▶ [Leaflet Mobile Web]
                                                     │
                                             (Range Requests)
                                                     ▼
[Leaflet Web API (.NET 8)] ◀──(EF Core 8)──▶ [PdfProxy Engine]
        │                                            │
  (Import SAP)                               (Stream PDF.js)
        ▼                                            ▼
[MySQL (leafletdb) & SAP SQL]              [Secure Patient Reader]`,
    challenges: [
      'ไฟล์เอกสารกำกับยา PDF มีขนาดใหญ่ หากโหลดทั้งไฟล์จะทำให้คนไข้หรือแพทย์บนมือถือรอนานและเปลืองแบนด์วิดท์',
      'ทะเบียนยามีการอัปเดตและมีวันหมดอายุ หากปล่อยให้ยาหมดอายุในระบบจะผิดข้อบังคับของสำนักงานคณะกรรมการอาหารและยา (อย.)'
    ],
    solutions: [
      'ออกแบบ PdfProxy ใน ASP.NET Core 8 รองรับ HTTP Range Requests ทำให้ PDF.js โหลดเฉพาะหน้าที่ผู้ใช้กำลังเปิดอ่านได้ทันที',
      'พัฒนาระบบ Hosted Services ใน Background ตรวจสอบวันหมดอายุของทะเบียนยาและแจ้งเตือนผ่านอีเมล (SMTP) อัตโนมัติ',
      'พัฒนา Web Portal ด้วย ASP.NET Core MVC (Razor) ให้ฝ่ายขึ้นทะเบียนยาจัดการไฟล์และ Permission ได้อย่างเป็นระบบ'
    ],
    tech: ['C# .NET 8', 'ASP.NET Core Web API & MVC', 'Entity Framework Core 8', 'Pomelo MySQL', 'PDF.js', 'JWT', 'ClosedXML', 'Bootstrap', 'Serilog'],
    metrics: [
      'เปิดอ่านเอกสารกำกับยาผ่าน QR Code ได้ภายในเสี้ยววินาที ไม่กระตุกแม้อยู่ในพื้นที่สัญญาณเน็ตต่ำ',
      'ลดการใช้กระดาษพิมพ์ใบแทรกยาในกล่องยา และอัปเดตข้อมูลยาล่าสุดได้แบบ Real-time'
    ]
  },
  carshare: {
    title: 'Car Share Mirror — Automotive Screen Projection',
    category: 'Automotive & Android Auto Engineering',
    tagline: 'แอพพลิเคชัน Native Android สำหรับแชร์หน้าจอมือถือขึ้นจอรถยนต์ MG S5 EV 12.8" ผ่าน Android Auto ไร้สาย',
    diagram: `[Android Smartphone (Kotlin App)]
        │  (MediaProjection API captures screen frames)
        ▼
[CarMirrorService & MirrorCarScreen (Android Auto SDK)]
        │  (Wireless Android Auto Channel / 5GHz Wi-Fi + BT)
        ▼
[MG S5 EV 12.8" Infotainment Display Unit]
  - Smooth 60fps mirror display
  - Continuous streaming while vehicle is driving
  - No Browser or Hotspot connection required!`,
    challenges: [
      'รถยนต์ MG S5 EV ไม่มี Web Browser ในตัว และการเปิด Hotspot จากมือถือทำให้เครื่องร้อนและเปลืองแบตเตอรี่',
      'Google จำกัดการทำงานของแอพพลิเคชันบุคคลที่สามบน Android Auto เพื่อความปลอดภัย'
    ],
    solutions: [
      'พัฒนาด้วย Native Android (Kotlin) โดยเชื่อมต่อเข้ากับช่องสัญญาณ Android Auto SDK โดยตรง',
      'สร้าง CarMirrorService และ MirrorCarScreen ใช้ MediaProjection API สตรีมเฟรมภาพแบบ Low-latency',
      'ปรับแต่งให้ทำงานต่อเนื่องได้อย่างเสถียร ไม่สะดุด และไม่ต้องพึ่งพาเบราว์เซอร์หรือการปล่อย Wi-Fi Hotspot'
    ],
    tech: ['Kotlin', 'Android SDK', 'Android Auto SDK', 'MediaProjection', 'CarAppService', 'Gradle'],
    metrics: [
      'เชื่อมต่อและแสดงผลบนหน้าจอ 12.8 นิ้วของ MG S5 EV ได้ทันทีด้วยการกดเพียงปุ่มเดียว',
      'Latency ต่ำ เฟรมเรตลื่นไหล ให้ประสบการณ์ความบันเทิงและนำทางระดับพรีเมียม'
    ]
  },
  tdmaster: {
    title: 'TD Master — Private Quant Trading Journal',
    category: 'FinTech & Quantitative Trading',
    tagline: 'ระบบบันทึกและวิเคราะห์สถิติการเทรดแบบ Quantitative วิเคราะห์ Equity Curve และ Chart Capture อัตโนมัติ',
    diagram: `[MetaTrader 5 (MT5 Terminal)]
        │  (MQL5 Expert Advisor hooks on trade execution)
        ▼
[Automated Ingestion API / PowerShell Scripts]
        │  (Captures Chart Snapshot & Trade Metadata)
        ▼
[Supabase PostgreSQL & Storage Engine]
        │  (Real-time subscription & Webhooks)
        ▼
[Next.js 14 Analytics Dashboard + Chart.js + TradingView MCP]`,
    challenges: [
      'การจดบันทึกการเทรดด้วยมือ (Manual Trading Journal) มักตกหล่น ไม่ทันท่วงที และขาดภาพถ่ายชาร์ตในจังหวะเข้าออเดอร์',
      'การคำนวณ Drawdown, Risk-to-Reward, และ Win Rate จากหลายกลยุทธ์พร้อมกันต้องการระบบประมวลผลที่แม่นยำ'
    ],
    solutions: [
      'สร้าง MT5 EA (MQL5) และสคริปต์ PowerShell บันทึกข้อมูลการเปิด-ปิดออเดอร์พร้อมแคปเจอร์ชาร์ตส่งเข้าฐานข้อมูลอัตโนมัติ',
      'พัฒนา Dashboard ด้วย Next.js 14 และ Chart.js พล็อตกราฟ Equity Curve, Daily P&L, และสถิติประสิทธิภาพแบบ Real-time',
      'ผสานรวม TradingView MCP สำหรับดึงข้อมูลอินดิเคเตอร์และโครงสร้างราคามาวิเคราะห์เชิงปริมาณ'
    ],
    tech: ['Next.js 14', 'Supabase', 'PostgreSQL', 'MetaTrader 5 (MQL5)', 'TradingView MCP', 'Chart.js', 'PowerShell'],
    metrics: [
      'บันทึกประวัติการเทรด 100% อัตโนมัติ ไม่มีตกหล่น พร้อมภาพหลักฐานทุกไม้',
      'ช่วยให้นักเทรดเห็นจุดบกพร่องทางจิตวิทยาและปรับปรุงวินัยการเทรดอย่างเป็นรูปธรรม'
    ]
  },
  jarvis: {
    title: 'JARVIS AI — Multimodal Agentic OS & MCP Engine',
    category: 'Autonomous AI Agent & Developer Tools',
    tagline: 'ระบบปฏิบัติการ AI Agent อัจฉริยะ ขับเคลื่อนด้วย Vercel AI SDK, MCP Protocol, MediaPipe Vision และ Three.js 3D Core',
    diagram: `[Voice / Camera Gesture Input (MediaPipe Tasks Vision)]
        │
        ▼
[JARVIS Agent Engine (Next.js 15 + Vercel AI SDK)]
        │  (Hybrid LLM: Ollama qwen3.6:27b + Groq llama-3.3-70b)
        ├──▶ [@modelcontextprotocol/sdk (MCP Tool Server)]
        ├──▶ [Autonomous File / CLI / Web Search Execution]
        └──▶ [Persistent Memory Store (Prisma + SQLite/Supabase)]
        │
        ▼
[React Three Fiber (R3F) 3D Holographic Core & HUD]`,
    challenges: [
      'AI Chatbot ทั่วไปไม่สามารถสลับใช้โมเดล Local LLM (เพื่อความเป็นส่วนตัว) และ Cloud LLM ความเร็วสูง หรือเรียกใช้เครื่องมือมาตรฐานผ่านโปรโตคอล MCP ได้',
      'การสั่งงานด้วยท่าทางมือ (Hand Gesture) เสียงพูดสองภาษา และการแสดงผล 3D แบบ Real-time ในเบราว์เซอร์ต้องการสถาปัตยกรรมที่ซิงค์กันอย่างแม่นยำ'
    ],
    solutions: [
      'พัฒนาแกนประมวลผลด้วย Vercel AI SDK (@ai-sdk/openai) และ @modelcontextprotocol/sdk เชื่อมต่อทั้ง Local Ollama (qwen3.6:27b) และ Cloud Groq (llama-3.3-70b)',
      'ผสานระบบตรวจจับใบหน้าและท่าทางมือด้วย @mediapipe/tasks-vision ร่วมกับระบบสั่งงานด้วยเสียง Web Speech API ภาษาไทยและอังกฤษ',
      'สร้างแกนพลังงานโฮโลแกรม 3 มิติแบบ Interactive ด้วย Three.js, @react-three/fiber และ @react-three/drei'
    ],
    tech: ['Next.js 15', 'React 19', 'Vercel AI SDK', '@modelcontextprotocol/sdk', 'Ollama (qwen3.6:27b)', 'Groq (llama-3.3-70b)', 'MediaPipe Vision', 'React Three Fiber', 'Three.js', 'Prisma'],
    metrics: [
      'รองรับการทำงานแบบ Hybrid AI สลับระหว่าง Local LLM (Offline/Private) และ Cloud LLM ความเร็วสูงได้อย่างไร้รอยต่อ',
      'เพิ่มความเร็วในการวิเคราะห์โค้ดเบสและสั่งงานอัตโนมัติผ่าน MCP Tools มากกว่า 60%'
    ]
  },
  crossmatch: {
    title: 'CrossMatch Catalog & Multi-Branch POS',
    category: 'Retail & Inventory Systems',
    tagline: 'ระบบแคตตาล็อกอุปกรณ์เสริมมือถือพร้อม Cross-Device Compatibility Matrix และระบบ POS หลายสาขา',
    diagram: `[Retail Staff Fast Search Bar]
        │  (Normalized Fuzzy Search in < 5ms)
        ▼
[Cross-Device Matrix Engine (Next.js & Local Cache)]
        │  (Finds compatible film/case models instantly)
        ▼
[Shelf Location & Stock Balance Display]
        │
        ▼
[Multi-Branch POS & Daily Revenue Analytics (Chart.js)]`,
    challenges: [
      'พนักงานหน้าร้านต้องจำรุ่นมือถือและแท็บเล็ตหลายร้อยรุ่นว่าฟิล์มหรือเคสรุ่นไหนใส่ด้วยกันได้ ทำให้ตอบลูกค้าช้าและหยิบสินค้าผิด',
      'การเปิดค้นหาในตาราง Excel ใช้เวลานานและไม่สะดวกเมื่อใช้งานบนมือถือหรือแท็บเล็ต'
    ],
    solutions: [
      'สร้างระบบ Fuzzy Normalized Search พิมพ์ชื่อรุ่นสั้นๆ (เช่น Air 5, S23) ระบบจะแสดงรหัสสินค้าและรุ่นที่ใส่ด้วยกันได้ทั้งหมดทันที',
      'มีฟังก์ชันเปรียบเทียบรุ่น (Compatibility Checker) สองรุ่นว่าตรงกันหรือไม่ พร้อมแสดงตำแหน่งตู้จัดเก็บสินค้าในร้าน',
      'มีระบบ POS บันทึกยอดขาย รายรับ-รายจ่าย แยกตามสาขา พร้อมกราฟสรุปยอดและระบบป้องกันด้วย Admin PIN'
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Fuzzy Matching Engine', 'Chart.js', 'CSV Importer/Exporter', 'Vercel'],
    metrics: [
      'ลดเวลาค้นหาและแนะนำอุปกรณ์เสริมให้ลูกค้าจากเดิม 2 นาที เหลือเพียง 3 วินาที',
      'ลดอัตราการหยิบสินค้าผิดพลาดของพนักงานใหม่ลงเกือบ 100%'
    ]
  },
  corporate: {
    title: 'TP Drug Multi-App Intranet, Central SSO & SharePoint MCP',
    category: 'Enterprise Identity, Portal & MCP Ecosystem',
    tagline: 'ระบบนิเวศอินทราเน็ตและศูนย์กลางการยืนยันตัวตน 4 แอปพลิเคชัน (Employee, AppCenter, Connect, For Healthy Life) พร้อม SharePoint MCP',
    diagram: `[Employee SSO IdP & Org Tree] ──(Cognito OIDC + jose JWT)──▶ [Cross-App RBAC Guard]
                                                                      │
        ┌──────────────────────┬──────────────────────────────────────┴───────────────────┐
        ▼                      ▼                                                          ▼
[AppCenter Ticket Portal]  [TP Drug Connect Intranet]                        [For Healthy Life CMS]
                               │  (@modelcontextprotocol/sdk)
                               ▼
                   [SharePoint MCP Server & M365 Graph Calendar]`,
    challenges: [
      'องค์กรมีหลายระบบงานภายใน (HR, IT Support Ticket, Intranet, Corporate CMS) หากแยกฐานข้อมูลผู้ใช้จะเกิดปัญหาล็อกอินซ้ำซ้อนและจัดการสิทธิ์ตามแผนกได้ยาก',
      'การค้นหาเอกสารใน SharePoint และตารางการประชุม Microsoft 365 ต้องการการเข้าถึงที่รวดเร็วและปลอดภัยโดยไม่ให้ Token รั่วไหลไปยังฝั่ง Browser'
    ],
    solutions: [
      'พัฒนา Employee Management System เป็นศูนย์กลาง Identity Provider (AWS Cognito OIDC + jose) พร้อมแผนผังองค์กร (Department Tree) และระบบ Cross-App RBAC ควบคุมสิทธิ์ข้ามแอปพลิเคชัน',
      'พัฒนา TP Drug Connect ด้วย Next.js 16, React 19 และสร้าง SharePoint MCP Server (@modelcontextprotocol/sdk) เชื่อมต่อเอกสารองค์กรและปฏิทิน Microsoft 365',
      'พัฒนา AppCenter Problem Ticket Portal และเว็บไซต์องค์กร For Healthy Life (2 ภาษา TH/EN + Headless CMS) โดยเชื่อมต่อฐานข้อมูลผ่าน Prisma 7 และ @aws-sdk/rds-signer'
    ],
    tech: ['Next.js 16', 'React 19', 'Bun 1.3', 'Prisma 7', '@aws-sdk/rds-signer', 'AWS Cognito OIDC', '@modelcontextprotocol/sdk', 'SharePoint MCP', 'M365 Graph', 'TanStack Table'],
    metrics: [
      'รวมศูนย์การล็อกอินและสิทธิ์การใช้งานของ 4 ระบบหลักในองค์กรด้วย Single Sign-On (SSO) เพียงบัญชีเดียว',
      'ยกระดับความเร็วการค้นหาเอกสารภายในผ่าน SharePoint MCP และการแจ้งซ่อม IT ผ่าน AppCenter อย่างเป็นระบบ'
    ]
  },
  aws: {
    title: 'Enterprise AWS CDK Infrastructure (7-Stack TypeScript IaC)',
    category: 'Cloud Architecture & DevSecOps Automation',
    tagline: 'โครงสร้างพื้นฐาน Cloud ระดับองค์กร 7 Stacks พัฒนาด้วย AWS CDK (TypeScript) พร้อม Passwordless RDS IAM Signer และ CI/CD OIDC',
    diagram: `[GitHub Actions OIDC CI/CD (Selective Matrix Deploy)]
        │  (Zero Long-Lived AWS Keys / Automated DNS Sync)
        ▼
[AWS CDK (TypeScript) 7-Stack CloudFormation Engine]
        ├──▶ [CloudFront CDN + ACM SSL + Route53 Auto DNS]
        ├──▶ [Multi-Tier VPC + ALB + ECS Fargate Spot/On-Demand]
        ├──▶ [IAM Bootstrap / Infra / Apps Least-Privilege Stacks]
        └──▶ [Aurora PostgreSQL Serverless + @aws-sdk/rds-signer]`,
    challenges: [
      'การดูแลหลายแอปพลิเคชันบน AWS ต้องการการแบ่งแยกสิทธิ์ IAM อย่างชัดเจน (Separation of Concerns) และต้องป้องกันความเสี่ยงจากการใช้รหัสผ่านฐานข้อมูลแบบคงที่',
      'การ Deploy ทุกแอปพลิเคชันพร้อมกันทุกครั้งที่แก้โค้ดทำให้เสียเวลา CI/CD และเพิ่มความเสี่ยงในการกระทบระบบอื่น'
    ],
    solutions: [
      'ออกแบบสถาปัตยกรรม AWS CDK ด้วยภาษา TypeScript แยกเป็น 7 Stacks อิสระ (CloudFront+ACM, Network/ECS/Aurora Infra, IAM Bootstrap, IAM Infra, IAM Apps, App Stack, และ Status Page)',
      'บังคับใช้นโยบาย Zero-Password Database Authentication โดยทุกคอนเทนเนอร์ต้องขอโทเค็นชั่วคราวผ่าน @aws-sdk/rds-signer ก่อนเชื่อมต่อ Aurora PostgreSQL',
      'สร้าง GitHub Actions Selective Matrix Pipeline ที่ตรวจจับเฉพาะแอปที่มีการแก้ไข พร้อมสคริปต์ซิงค์ DNS อัตโนมัติและระบบ Health Status Page'
    ],
    tech: ['AWS CDK (TypeScript)', 'CloudFormation', 'AWS ECS Fargate', 'Aurora PostgreSQL', '@aws-sdk/rds-signer', 'CloudFront & ACM', 'GitHub Actions OIDC', 'Docker Multi-Stage'],
    metrics: [
      'ขจัดความเสี่ยงรหัสผ่านฐานข้อมูลรั่วไหลเป็น 0% ด้วย IAM-Only Authentication ทั้งระบบ',
      'ลดเวลาการ Deploy ใน CI/CD ลงกว่า 65% ด้วย Selective Matrix Pipeline และสามารถ Provision สภาพแวดล้อมใหม่ได้ภายในไม่กี่นาที'
    ]
  },
  ants: {
    title: 'ANTS Enterprise SMS Marketing Platform',
    category: 'High-Concurrency Messaging & Web API',
    tagline: 'แพลตฟอร์มส่ง SMS ทางการตลาดระดับ Enterprise รองรับทราฟฟิกมหาศาล พร้อมระบบคำนวณเครดิตและออกรายงาน',
    diagram: `[Enterprise Client Portal (React)] ──▶ [ASP.NET Core Web API]
                                                 │
                                         (Batch Processing)
                                                 ▼
[High-Throughput SMS Gateways] ◀── [SQL Server & Queue Workers]`,
    challenges: [
      'ระบบต้องรองรับการยิงข้อความ SMS พร้อมกันเป็นแสนๆ ข้อความในช่วงแคมเปญการตลาดโดยระบบต้องไม่ล่ม',
      'การตัดยอดเครดิตทางการเงินต้องมีความแม่นยำ 100% ป้องกันยอดติดลบหรือการส่งซ้ำ'
    ],
    solutions: [
      'พัฒนาแกนกลางด้วย C# .NET Core และ SQL Server ออกแบบ Transaction ในระดับ Database ที่รัดกุม',
      'ใช้ Queue Processing สำหรับการกระจายโหลดข้อความและการบันทึก Delivery Report จากผู้ให้บริการเครือข่าย',
      'พัฒนา Dashboard ด้วย React สำหรับให้ลูกค้าตั้งเวลาส่งข้อความและตรวจสอบยอดเครดิตคงเหลือแบบ Real-time'
    ],
    tech: ['C# .NET Core', 'React', 'SQL Server', 'REST API', 'Batch Jobs', 'IIS', 'Azure DevOps'],
    metrics: [
      'รองรับการส่งข้อความหลายล้านข้อความต่อเดือนอย่างราบรื่น',
      'ระบบเครดิตและ Billing มีความถูกต้องแม่นยำ ไม่พบข้อผิดพลาดทางการเงิน'
    ]
  },
  hongthong: {
    title: 'Geofencing Attendance & Payroll (ข้าวหงษ์ทอง)',
    category: 'Enterprise HR & Financial Back-office',
    tagline: 'ระบบลงเวลาทำงานด้วย Geofencing พิกัดดาวเทียม คำนวณ KPI และประมวลผลเงินเดือนพนักงานครบวงจร',
    diagram: `[Employee Mobile Device] ──(GPS Geofence Verification)──▶ [Attendance Service]
                                                                  │
                                                        (Calculates Overtime & KPI)
                                                                  ▼
[Payroll Calculation Engine] ──▶ [SQL Database] ──▶ [Export Bank Text / Slip]`,
    challenges: [
      'พนักงานมีหลายสาขาและเดินทางไปทำงานนอกสถานที่ การเช็คชื่อด้วยเครื่องสแกนนิ้วมือเดิมไม่ตอบโจทย์',
      'สูตรการคำนวณเงินเดือน เบี้ยขยัน ค่าล่วงเวลา (OT) และเกณฑ์ประเมิน KPI มีเงื่อนไขที่ซับซ้อนตามนโยบายองค์กร'
    ],
    solutions: [
      'พัฒนาระบบ Geofencing ตรวจสอบตำแหน่ง GPS บนมือถือพนักงานว่าอยู่ในรัศมีที่กำหนดของแต่ละสาขาหรือไม่ก่อนอนุมัติการลงเวลา',
      'สร้างระบบ Payroll Engine คำนวณเงินเดือน หักภาษี ประกันสังคม และเบี้ยเลี้ยงอัตโนมัติ พร้อมออกสลิปเงินเดือนและไฟล์ส่งธนาคาร',
      'ออกแบบ Schema ฐานข้อมูล SQL ที่มีโครงสร้างยืดหยุ่น รองรับการเพิ่มเงื่อนไข KPI ประจำปี'
    ],
    tech: ['Fullstack Web', 'Geofencing GPS API', 'SQL Server / MySQL', 'Payroll Calculation Logic', 'KPI Engine', 'FileZilla'],
    metrics: [
      'ลดเวลาฝ่ายบุคคลในการรวบรวมเวลาทำงานและคิดเงินเดือนลงจาก 7 วัน เหลือเพียงครึ่งวัน',
      'ป้องกันการเช็คชื่อแทนกันและการทุจริตเวลาทำงานได้อย่างสมบูรณ์'
    ]
  },
  truckscale: {
    title: 'Industrial IoT Truck Scale Weight System',
    category: 'Industrial IoT & Hardware Automation',
    tagline: 'ระบบชั่งน้ำหนักรถบรรทุกและสแกนบัตรในโรงงานอุตสาหกรรม บันทึกค่าน้ำหนักสุทธิก่อน-หลังขนถ่ายอัตโนมัติ',
    diagram: `[Truck on Weight Bridge] ──▶ [Weight Indicator (RS-232 / Serial)]
                                         │
[Driver RFID Card Scan] ───────────────┼──▶ [C# Windows Desktop Application]
                                         │
                                   (Calculates Net Weight)
                                         ▼
                             [SQL Database & Auto Print Weigh Ticket]`,
    challenges: [
      'สภาพแวดล้อมหน้างานเป็นโรงงานอุตสาหกรรม มีสัญญาณรบกวนและฝุ่นละออง อุปกรณ์ฮาร์ดแวร์ต้องสื่อสารได้อย่างแม่นยำ',
      'ต้องป้องกันการทุจริต เช่น การวนรถเข้าชั่งซ้ำ หรือการแอบนำสินค้าลงก่อนชั่งน้ำหนักรอบสอง'
    ],
    solutions: [
      'พัฒนาโปรแกรม C# Windows Application เชื่อมต่อ Serial Port (RS-232) เพื่ออ่านค่าน้ำหนักจากหัวชั่งโดยตรงแบบ Real-time',
      'ผสานเครื่องอ่านบัตร RFID สแกนบัตรคนขับและทะเบียนรถ เพื่อจับคู่รายการชั่งขาเข้าและขาออกอัตโนมัติ',
      'ระบบคำนวณน้ำหนักสุทธิ (Gross - Tare = Net) และพิมพ์ใบชั่งน้ำหนักพร้อมเก็บประวัติลงฐานข้อมูลทันที'
    ],
    tech: ['C# .NET', 'Windows Forms', 'RS-232 Serial Port', 'RFID Barcode Scanners', 'Industrial Weigh Indicators', 'SQL Database'],
    metrics: [
      'ขจัดปัญหาการทุจริตน้ำหนักรถบรรทุกและข้อผิดพลาดจากการจดบันทึกด้วยมือ',
      'กระบวนการชั่งน้ำหนักรถบรรทุกแต่ละคันใช้เวลาไม่เกิน 30 วินาที เพิ่มความเร็วการขนถ่ายสินค้าอย่างมีนัยสำคัญ'
    ]
  },
  acousticar: {
    title: 'AcoustiCar AI™ — Predictive Vehicle Acoustic Diagnostics',
    category: 'Automotive DSP & Predictive Maintenance AI',
    tagline: 'แพลตฟอร์มวิเคราะห์เสียงเครื่องยนต์และวินิจฉัยอาการเสียรถยนต์แบบ Real-Time ด้วย FFT Spectrogram และ Polar Radar 60fps',
    diagram: `[Raw Vehicle Microphone / 8-Fault Acoustic Synthesizer]
        │  (EchoCancellation & NoiseSuppression Disabled for Raw Signal)
        ▼
[Web Audio API DSP Engine (2048-bin FFT & Sub-band Extractor)]
        │  (Harmonic Ratio, Crest Factor & Spectral Centroid Analysis)
        ▼
[60fps Multi-Mode Visualizer (FFT, Oscilloscope, Heatmap, Polar Radar)]
        │
        ▼
[AI Diagnostic Engine (Severity Scoring, Repair Cost & PDF/JSON Export)]`,
    challenges: [
      'เบราว์เซอร์ทั่วไปมักเปิดระบบตัดเสียงรบกวน (Noise Suppression) อัตโนมัติ ทำให้ความถี่สำคัญของอาการเสียเครื่องยนต์ เช่น เสียงสายพานหอนหรือลูกปืนแตก ถูกกรองทิ้ง',
      'การประมวลผลคลื่นความถี่เสียงและวาดกราฟ Spectrogram หลายโหมดพร้อมกันต้องทำงานที่ 60fps โดยไม่ทำให้หน้าเว็บกระตุก'
    ],
    solutions: [
      'ออกแบบระบบดึงสัญญาณเสียง Raw Audio Stream โดยปิด Echo Cancellation, Noise Suppression และ Auto Gain Control เพื่อรักษาความแม่นยำของคลื่นความถี่กลไก 100%',
      'สร้างเอนจินวิเคราะห์ความถี่ Web Audio API คำนวณพลังงานแยกย่านความถี่ (Sub-Band Energy), Spectral Centroid และ Crest Factor พร้อมโหมดจำลองเสียงอาการเสียรถยนต์ 8 รูปแบบ (8-Fault Synthesizer)',
      'พัฒนา Canvas Visualizer 60fps 4 โหมด (FFT Spectrum, Time-Domain Waveform, Scrolling Waterfall Spectrogram และ 360° Polar Acoustic Radar) รองรับการทำงานแบบ Offline PWA'
    ],
    tech: ['Web Audio API (FFT DSP)', 'HTML5 Canvas 60fps', 'Acoustic Fault Synthesizer', 'Harmonic Signature AI', 'Progressive Web App (PWA)', 'Zero-Dependency JS'],
    metrics: [
      'จำแนกความถี่เสียงผิดปกติของเครื่องยนต์ สายพาน ลูกปืนล้อ และระบบเบรกแบบ Real-time ที่ความละเอียด 60 เฟรมต่อวินาที',
      'ประเมินระดับความรุนแรงและประมาณการค่าซ่อมเบื้องต้นพร้อมส่งออกรายงานวินิจฉัยได้ทันทีบนมือถือและแท็บเล็ต'
    ]
  },
  devtools: {
    title: 'DevSecOps Quality Gates & Polyglot Docker DevContainer',
    category: 'DevSecOps, Static Analysis & Container Engineering',
    tagline: 'ระบบตรวจสอบคุณภาพและความปลอดภัยโค้ดด้วย SonarQube 26 SAST ร่วมกับสภาพแวดล้อมการพัฒนา Docker Multi-Database แบบคำสั่งเดียว',
    diagram: `[Polyglot Developer Workspace (VS Code DevContainer)]
        │  (1-Command Docker Compose: PHP 8.4, .NET 8, Node 20, Bun)
        ▼
[Unified Local Data Layer (MySQL 8, Postgres 15, MSSQL 2022, Redis 7)]
        │  (Automated Unit & Playwright 1.61 E2E Test Execution)
        ▼
[SonarQube 26.10 SAST & Security Quality Gate Scanner]
        │
        ▼
[Zero-Downtime CI/CD & IIS Artifact Watcher w/ Teams Webhook Alerts]`,
    challenges: [
      'การพัฒนาซอฟต์แวร์หลายภาษา (TypeScript, PHP 8.4, C# .NET 8) ร่วมกับฐานข้อมูลหลายชนิด (PostgreSQL, MySQL, SQL Server) มักเกิดปัญหาสภาพแวดล้อมเครื่องนักพัฒนาไม่ตรงกัน',
      'การตรวจสอบช่องโหว่ความปลอดภัย (SAST) และ Code Smell ต้องทำอย่างต่อเนื่องก่อนนำโค้ดขึ้นระบบ Production'
    ],
    solutions: [
      'ออกแบบ Polyglot Docker DevContainer ที่รวบรวม Runtime และฐานข้อมูลทั้งหมด (MySQL 8, PostgreSQL 15, SQL Server 2022, Redis 7, MailHog, Nginx) ให้พร้อมใช้งานด้วยคำสั่งเดียว',
      'วางระบบตรวจสอบคุณภาพซอฟต์แวร์ด้วย SonarQube 26.10 (sonar-project.properties) สแกนหาช่องโหว่ความปลอดภัย, Security Hotspots, และความซับซ้อนของโค้ดในทุกโปรเจคหลัก',
      'สร้างสคริปต์ PowerShell Automated Artifact Watcher สำหรับเซิร์ฟเวอร์ IIS ที่ทำการสำรองข้อมูล, สลับเวอร์ชัน, ทดสอบ Health Check, Rollback อัตโนมัติ และแจ้งเตือนผ่าน Microsoft Teams Webhook'
    ],
    tech: ['SonarQube 26 SAST', 'Docker Compose', 'VS Code DevContainers', 'Playwright E2E', 'MySQL 8 / Postgres 15 / MSSQL 2022', 'Redis 7', 'PowerShell Ops', 'Teams Webhook'],
    metrics: [
      'ลดเวลาการตั้งค่าเครื่องนักพัฒนาใหม่จากเดิม 1-2 วัน เหลือเพียงไม่กี่นาทีด้วย 1-Command Docker DevContainer',
      'ยกระดับมาตรฐานความปลอดภัยโค้ดและลดอัตราการเกิด Downtime ขณะอัปเดตระบบด้วย Automated Rollback & Health Check'
    ]
  }
};

// Open Project Detail Modal
function openProjectDetail(projectId) {
  const data = PROJECT_DETAILS[projectId];
  if (!data) return;

  const contentEl = document.getElementById('projectDetailContent');
  const modalEl = document.getElementById('projectDetailModal');
  if (!contentEl || !modalEl) return;

  const techBadges = data.tech.map(t => `<span class="badge">${t}</span>`).join(' ');
  const challengeItems = data.challenges.map(c => `<li>${c}</li>`).join('');
  const solutionItems = data.solutions.map(s => `<li>${s}</li>`).join('');
  const metricItems = data.metrics.map(m => `<li><i class="fas fa-check"></i> ${m}</li>`).join('');

  contentEl.innerHTML = `
    <h2>${data.title}</h2>
    <p class="modal-tagline"><strong>[${data.category}]</strong> — ${data.tagline}</p>

    <div class="modal-section-title"><i class="fas fa-sitemap"></i> SYSTEM ARCHITECTURE TOPOLOGY</div>
    <div class="modal-diagram-box">${data.diagram}</div>

    <div class="modal-section-title"><i class="fas fa-exclamation-triangle"></i> KEY ENGINEERING CHALLENGES</div>
    <ul class="modal-bullet-list">${challengeItems}</ul>

    <div class="modal-section-title"><i class="fas fa-lightbulb"></i> TECHNICAL SOLUTIONS &amp; IMPLEMENTATION</div>
    <ul class="modal-bullet-list">${solutionItems}</ul>

    <div class="modal-section-title"><i class="fas fa-chart-line"></i> IMPACT &amp; VALIDATION RESULTS</div>
    <ul class="modal-bullet-list modal-metrics-list">${metricItems}</ul>

    <div class="modal-section-title"><i class="fas fa-code"></i> TECHNOLOGY STACK</div>
    <div class="modal-tech-chips">${techBadges}</div>
  `;

  modalEl.classList.add('is-active');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// Close Project Detail Modal
function closeProjectDetailModal() {
  const modalEl = document.getElementById('projectDetailModal');
  if (!modalEl) return;
  modalEl.classList.remove('is-active');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ESC Key listener for modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeProjectDetailModal();
    if (typeof closeProjectsModal === 'function') closeProjectsModal();
  }
});

// Category Filter Tabs
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategories = (item.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || itemCategories.includes(filter)) {
          item.classList.remove('is-hidden');
          item.style.display = 'flex';
        } else {
          item.classList.add('is-hidden');
          item.style.display = 'none';
        }
      });
    });
  });
});
 
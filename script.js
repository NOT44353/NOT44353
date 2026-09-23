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
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
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
    let index = 0;
    element.textContent = '';
    const typeChar = () => {
      if (index < originalText.length) {
        element.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeChar, 70);
      }
    };
    typeChar();
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
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(45deg, #2ca7e0, #0a2342);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(44, 167, 224, 0.3);
  `;
  
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
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

    frame.src = `/mini-projects/?t=${Date.now()}`;
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
        ระบบเชื่อมต่อ SAP Business One, ระบบควบคุมยานยนต์ Android Auto, และ Cloud Infrastructure บน AWS
        
        ปัจจุบัน ผมปฏิบัติงานที่ บริษัท ที.พี. ดรัก แลบบอราทอรี่ส์ (1969) จำกัด ในตำแหน่ง Full Stack Developer และ Systems Engineer
        รับผิดชอบการออกแบบและพัฒนาระบบ Electronic Batch Record หรือ EBR ด้วย Next.js 16, React 19, Bun, Prisma 7 และ PostgreSQL บน AWS ECS
        พัฒนาระบบ ManHour สำหรับติดตามชั่วโมงทำงานและต้นทุนการผลิต ด้วย Laravel 12 และ PHP 8.4 พร้อม Sync ข้อมูลกับ SAP แบบ Real-time
        พัฒนาระบบเอกสารกำกับยา E-Leaflet ด้วย .NET 8 Web API และสตรีมมิ่งผ่าน PdfProxy สำหรับการสแกน QR Code ของคนไข้
        และวางโครงสร้างพื้นฐาน Cloud บน AWS ด้วย SAM และ GitHub Actions
        
        นอกจากนี้ ผมยังได้พัฒนา Car Share Mirror แอพพลิเคชัน Native Android ด้วย Kotlin สำหรับส่งภาพขึ้นหน้าจอรถยนต์ MG S5 EV ผ่าน Android Auto ไร้สาย,
        ระบบบันทึกและวิเคราะห์สถิติการเทรด TD Master เชื่อมต่อ MetaTrader 5 และ TradingView,
        รวมถึง JARVIS AI Autonomous Engineer Dashboard
        
        ด้านประสบการณ์ก่อนหน้านี้ ผมเคยพัฒนาแพลตฟอร์ม ANTS SMS Marketing ขนาดใหญ่ที่ Advance Network Technology,
        พัฒนาระบบ Geofencing, KPI และ Payroll ให้กับข้าวหงษ์ทอง เจียเม้งมาร์เก็ตติ้ง,
        และพัฒนาระบบชั่งน้ำหนักรถบรรทุกเชื่อมต่อ IoT ที่ Software & Scale Engineering
        
        ผมสำเร็จการศึกษาจาก มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี สาขาวิชาเทคโนโลยีสารสนเทศ ด้วยเกรดเฉลี่ย 3.09
        
        เป้าหมายของผมคือการสร้างระบบซอฟต์แวร์ที่มีความปลอดภัย ประสิทธิภาพสูง และสร้างคุณค่าที่แท้จริงให้กับองค์กร
        ขอบคุณที่ให้ความสนใจในผลงานของผมครับ
      `,
      en: `
        Hello, I'm Thanapat Pisavong (Not), a Full Stack Developer and Cloud Systems Engineer.
        
        I specialize in architecting mission-critical enterprise platforms, pharmaceutical GMP-grade manufacturing systems,
        SAP Business One bidirectional integrations, Android Auto in-car automotive engineering, and AWS cloud infrastructure.
        
        Currently, I serve as Full Stack Developer & Systems Engineer at TP Drug Laboratories (1969) Co., Ltd.
        I architect and develop the Electronic Batch Record (EBR) using Next.js 16, React 19, Bun, Prisma 7, and PostgreSQL on AWS ECS Fargate,
        the ManHour Manufacturing Ecosystem with Laravel 12 and PHP 8.4 integrated real-time with SAP Business One,
        the E-Leaflet Patient QR and drug registration platform with ASP.NET Core 8 Web API and PdfProxy streaming,
        and enterprise Cloud Infrastructure using AWS SAM and GitHub Actions CI/CD.
        
        My portfolio also features Car Share Mirror, a native Android Kotlin application projecting phone displays wirelessly to MG S5 EV 12.8" screens via Android Auto SDK,
        TD Master, an automated quantitative trading journal integrated with MetaTrader 5 and TradingView,
        and JARVIS AI, an autonomous engineering assistant dashboard.
        
        My previous experience includes architecting the ANTS SMS marketing platform,
        geofencing attendance, KPI and payroll engines for Hong Thong Rice,
        and industrial IoT truck scale weight systems.
        
        I graduated from Rajamangala University of Technology Thanyaburi in Information Technology with a GPA of 3.09.
        
        Thank you for reviewing my portfolio and resume. Feel free to explore my system architectures or contact me directly.
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
    title: 'Electronic Batch Record (EBR)',
    category: 'Pharma GMP & Digital Manufacturing',
    tagline: 'ระบบบันทึกประวัติการผลิตยาแบบดิจิทัล (Digital Batch Record) ตามมาตรฐาน GMP / GxP Validation',
    diagram: `[Operator / QA Web Client (React 19)]
        │  (OIDC PKCE Authentication / Cognito)
        ▼
[Next.js 16 App Router + Bun 1.3 Container]
        │  (Prisma 7 ORM / IAM Auth)
        ▼
[AWS Aurora PostgreSQL (Multi-AZ Serverless)]
        │  (Form Schemas, Audit Trail, Signatures)
        ▼
[S3 Storage for Signed Batch PDFs & Attachments]`,
    challenges: [
      'โรงงานยาต้องปฏิบัติตามข้อกำหนด GMP / GxP อย่างเคร่งครัด ห้ามมีการแก้ไขข้อมูลย้อนหลังโดยไม่มี Audit Trail',
      'ฟอร์มบันทึกข้อมูลในสายการผลิตยามีความซับซ้อนสูง (Dynamic Form Fields, Multi-step Approval, Formula Validation)',
      'การรันระบบบน Cloud ต้องมีความปลอดภัยระดับสูงสุด ไม่มี Token รั่วไหลไปฝั่ง Client'
    ],
    solutions: [
      'พัฒนาฟอร์มด้วย React 19 และ Next.js 16 พร้อมระบบ Drag-and-Drop Form Builder โดยใช้ @dnd-kit และ Zod Validation',
      'ออกแบบ Audit Trail และระบบ Digital Signature ตรวจสอบย้อนกลับได้ทุกการกดบันทึกหรืออนุมัติขั้นตอน',
      'ใช้ AWS Cognito ร่วมกับ AWS RDS IAM Signer เพื่อให้การเชื่อมต่อฐานข้อมูล Aurora ปลอดภัยสูงสุดโดยไม่ต้องใช้รหัสผ่านฝังในโค้ด'
    ],
    tech: ['Next.js 16', 'React 19', 'Bun 1.3', 'Prisma 7', 'PostgreSQL', 'Tailwind CSS 4', 'Radix UI', 'AWS ECS Fargate', 'AWS Cognito', 'Docker'],
    metrics: [
      'ลดระยะเวลาการรวบรวมและตรวจสอบเอกสาร Batch Record จากเดิม 3-5 วัน เหลือเพียงไม่กี่นาที',
      'ขจัดความผิดพลาดจากการเขียนเอกสารด้วยมือ (Paperless 100%)',
      'สอดคล้องตามมาตรฐานข้อกำหนดการผลิตยา GMP และข้อกำหนดด้านการตรวจสอบย้อนกลับ'
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
      'ออกแบบหน้าจอ Shop Floor ด้วย Laravel Blade, Tailwind CSS 4, และ Vite 7 โหลดเร็วและรองรับหน้าจอสัมผัส'
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
    title: 'JARVIS AI — Autonomous Engineering Assistant',
    category: 'Autonomous AI Agent & Developer Tools',
    tagline: 'แดชบอร์ดผู้ช่วยวิศวกรสไตล์ Tony Stark ขับเคลื่อนด้วย Agentic AI รองรับคำสั่งเสียง/ข้อความ และรันคำสั่ง Shell อัตโนมัติ',
    diagram: `[Voice / Natural Language Prompt (TH/EN)]
        │
        ▼
[JARVIS Agent Core Engine (Next.js + LLM Models)]
        │  (Agentic Loop: Plan -> Tool Call -> Execute -> Verify)
        ├──▶ [File Tool: Read / Edit / Refactor Code]
        ├──▶ [CLI Tool: Bash / PowerShell Execution]
        └──▶ [Knowledge Retrieval & Memory (Supabase / Prisma)]
        │
        ▼
[Cinematic Holographic HUD Interface (Orbitron & Cyber Glow)]`,
    challenges: [
      'AI Chatbot ทั่วไปมักทำได้แค่ตอบคำถาม แต่ไม่สามารถช่วยทำงานจริงกับระบบไฟล์และคำสั่งคอมมานด์ไลน์ได้',
      'UI ส่วนใหญ่เป็นเพียงกล่องแชทธรรมดา ขาดความรู้สึกเป็นเครื่องมือวิศวกรที่ล้ำสมัยและแม่นยำ'
    ],
    solutions: [
      'ออกแบบสถาปัตยกรรม Agentic Tool Calling ให้ JARVIS อ่านไฟล์ แก้ไขโค้ด และสั่งรันคำสั่งในระบบได้อย่างปลอดภัย',
      'สร้างอินเทอร์เฟซสไตล์ Sci-Fi HUD ในโทนสี Cyan & Gold Holographic ตามแรงบันดาลใจจาก Stark Industries',
      'รองรับคำสั่งเสียงสองภาษา (Thai/English) พร้อมระบบสังเคราะห์เสียงตอบสนองแบบ Real-time'
    ],
    tech: ['Next.js', 'Supabase', 'Prisma', 'LLM Agent Tools', 'Web Speech API', 'Cyberpunk CSS', 'Orbitron'],
    metrics: [
      'ช่วยเพิ่มความเร็วในการแก้บั๊กและการสำรวจโค้ดเบสขนาดใหญ่ขึ้นมากกว่า 50%',
      'อินเทอร์เฟซระดับภาพยนตร์ที่ให้ประสบการณ์การเขียนโค้ดที่สนุกและตื่นตาตื่นใจ'
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
    title: 'TP Drug Corporate Website & Employee Intranet',
    category: 'Corporate Web & Identity Management',
    tagline: 'เว็บไซต์ทางการและระบบอินทราเน็ตพนักงาน ที.พี. ดรัก แลบบอราทอรี่ส์ (1969) จำกัด พร้อม SSO และ Headless CMS',
    diagram: `[Public Visitor Web] ──▶ [Next.js 16 Bun SSR App] ──▶ [Prisma CMS & i18n]
                                       │
[Staff Intranet Login] ──(PKCE OIDC)───┼──▶ [AWS Cognito User Pool]
                                       │
                                 (IAM S3 Client)
                                       ▼
                            [AWS S3 Document Vault]`,
    challenges: [
      'เว็บไซต์องค์กรต้องรองรับ 2 ภาษา (TH/EN) โหลดรวดเร็ว ติดอันดับ SEO และมีระบบจัดการเนื้อหา (CMS) ที่ปลอดภัย',
      'ระบบอินทราเน็ตสำหรับพนักงานมีเอกสารลับขององค์กร ต้องมีระบบ Single Sign-On (SSO) ที่ไม่มี Token รั่วไหลไปที่ Browser'
    ],
    solutions: [
      'ใช้ Next.js 16 บน Bun Runtime สร้างเว็บไซต์ที่ Render แบบ Server-Side รวดเร็วและใช้ Tailwind CSS 4',
      'ออกแบบระบบล็อกอินหลังบ้าน /cms ด้วย AWS Cognito PKCE OIDC Server-side Auth เก็บ Session ใน HttpOnly Cookie ปลอดภัยสูงสุด',
      'เชื่อมต่อ AWS S3 สำหรับจัดเก็บเอกสารและแบบฟอร์มภายในของบริษัทอย่างเป็นหมวดหมู่'
    ],
    tech: ['Next.js 16', 'React 19', 'Bun 1.3', 'Tailwind CSS 4', 'Prisma', 'AWS Cognito (PKCE OIDC)', 'AWS S3', 'Docker'],
    metrics: [
      'ความเร็วการเปิดหน้าเว็บระดับ Top-tier (Performance Score 95+)',
      'ระบบล็อกอินและจัดการเอกสารมีความปลอดภัยสูงสุดตามมาตรฐานความปลอดภัยคลาวด์'
    ]
  },
  aws: {
    title: 'Enterprise AWS Cloud Infrastructure (IaC SAM)',
    category: 'Cloud Architecture & DevOps Automation',
    tagline: 'โครงสร้างพื้นฐาน Cloud สำหรับระบบทั้งหมดขององค์กร ออกแบบผ่าน SAM / CloudFormation พร้อม CI/CD OIDC',
    diagram: `[GitHub Repo (Commit & Push)]
        │  (GitHub Actions CI/CD via OIDC Role - No Stored Keys!)
        ▼
[AWS SAM / CloudFormation Engine]
        ├──▶ [VPC, Public/Private Subnets, NAT Gateways]
        ├──▶ [Application Load Balancer (ALB) & CloudFront CDN]
        ├──▶ [Amazon ECS Fargate (Docker Container Tasks)]
        ├──▶ [Amazon Aurora PostgreSQL Serverless (Multi-AZ)]
        └──▶ [AWS Lambda (Python 3) for DB Bootstrap & Maintenance]`,
    challenges: [
      'การตั้งค่าระบบบน Cloud ด้วยการคลิกผ่าน Console มักเกิด Human Error และไม่สามารถทำซ้ำใน Environment Dev/UAT/Prod ได้เหมือนกัน',
      'การเก็บ AWS Access Key ไว้ใน CI/CD มีความเสี่ยงต่อการถูกขโมยข้อมูลลับ'
    ],
    solutions: [
      'เขียน Infrastructure as Code (IaC) ทั้งหมดด้วย AWS SAM และ CloudFormation ควบคุมเวอร์ชันผ่าน Git',
      'ใช้ GitHub Actions OIDC Authentication สำหรับการ Deploy ขึ้น AWS โดยไม่ต้องเก็บ Secret Key ถาวรใน Repository',
      'วางระบบเครือข่าย Multi-tier VPC แยก Database และ Application Tasks ไว้ใน Private Subnet มีเพียง ALB และ CloudFront ที่รับ Traffic ภายนอก'
    ],
    tech: ['AWS SAM', 'CloudFormation', 'AWS ECS Fargate', 'Amazon Aurora', 'AWS Cognito', 'CloudFront', 'Python 3 Lambda', 'GitHub Actions CI/CD'],
    metrics: [
      'สามารถ Deploy สภาพแวดล้อมใหม่ (Dev/UAT/Prod) ได้อย่างแม่นยำภายในเวลาไม่กี่นาที',
      'ผ่านการประเมินความปลอดภัยตาม Best Practice สถาปัตยกรรม Well-Architected Framework'
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
  const metricItems = data.metrics.map(m => `<li><i class="fas fa-check" style="color:#22c55e;margin-right:6px"></i> ${m}</li>`).join('');

  contentEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
      <span class="project-cat-badge" style="font-size:0.8rem; padding:4px 12px;">${data.category}</span>
    </div>
    <h2>${data.title}</h2>
    <p class="modal-tagline">${data.tagline}</p>

    <div class="modal-section-title"><i class="fas fa-sitemap"></i> SYSTEM ARCHITECTURE TOPOLOGY</div>
    <div class="modal-diagram-box">${data.diagram}</div>

    <div class="modal-section-title"><i class="fas fa-exclamation-triangle" style="color:#f59e0b;"></i> KEY ENGINEERING CHALLENGES</div>
    <ul class="modal-bullet-list">${challengeItems}</ul>

    <div class="modal-section-title"><i class="fas fa-lightbulb" style="color:#00e5ff;"></i> TECHNICAL SOLUTIONS &amp; IMPLEMENTATION</div>
    <ul class="modal-bullet-list">${solutionItems}</ul>

    <div class="modal-section-title"><i class="fas fa-chart-line" style="color:#22c55e;"></i> IMPACT &amp; VALIDATION RESULTS</div>
    <ul class="modal-bullet-list" style="list-style:none; padding-left:0;">${metricItems}</ul>

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
 
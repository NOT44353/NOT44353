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

// ===== GLASS CARD HOVER EFFECT =====
function initGlassCardEffects() {
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
  const text = "FULL STACK DEVELOPER";
  const element = document.querySelector('.hero h2');
  if (!element) return;
  
  let index = 0;
  const originalText = element.textContent;
  element.textContent = '';
  
  function typeChar() {
    if (index < originalText.length) {
      element.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeChar, 100);
    }
  }
  
  setTimeout(typeChar, 1000);
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

// ===== REAL-TIME COUNTER SYSTEM =====
function initCounters() {
  console.log('Initializing real-time counter system...');
  
  // Load real-time data from API
  loadRealTimeCounts();
  
  // Track page view (this will increment the count)
  trackPageView();
  
  // Add download tracking
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    console.log('Download button found, adding event listener');
    downloadBtn.addEventListener('click', function() {
      console.log('Download button clicked!');
      trackDownload();
    });
  } else {
    console.log('Download button not found!');
  }
  
  // Initialize auto-refresh for real-time updates
  initRealTimeRefresh();
}

// ===== GOOGLE ANALYTICS FUNCTIONS =====
function initGoogleAnalytics() {
  // Check if gtag is available
  if (typeof gtag === 'undefined') {
    console.log('Google Analytics not loaded, using fallback');
    return false;
  }
  
  console.log('Google Analytics initialized');
  return true;
}

function trackPageView() {
  // Send to multiple real-time APIs
  sendToRealTimeAPI('visitor');
  
  // Try to send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: 'Thanapat Pisawong - Resume',
      page_location: window.location.href,
      custom_parameter_1: 'resume_view'
    });
    console.log('Page view tracked to Google Analytics');
  }
}

function trackDownload() {
  // Send to multiple real-time APIs
  sendToRealTimeAPI('download');
  
  // Try to send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'file_download', {
      file_name: 'resume.pdf',
      file_extension: 'pdf',
      custom_parameter_1: 'resume_download'
    });
    console.log('Download tracked to Google Analytics');
  }
}

// ===== REAL-TIME API FUNCTIONS =====
function loadRealTimeCounts() {
  console.log('Loading real-time counts...');
  
  // Try multiple APIs for better reliability
  Promise.allSettled([
    loadFromCountAPI(),
    loadFromGoatCounter(),
    loadFromPlausible()
  ]).then(results => {
    console.log('Real-time data loaded from APIs');
  });
}

function sendToRealTimeAPI(type) {
  console.log(`Sending ${type} to real-time APIs...`);
  
  // Send to multiple APIs simultaneously
  const promises = [
    sendToCountAPI(type),
    sendToGoatCounter(type),
    sendToPlausible(type)
  ];
  
  Promise.allSettled(promises).then(results => {
    console.log(`${type} sent to real-time APIs`);
    // Refresh counts after sending
    setTimeout(loadRealTimeCounts, 1000);
  });
}

// ===== COUNT API =====
function loadFromCountAPI() {
  return fetch('https://api.countapi.xyz/get/not44353.github.io/visitors')
    .then(response => response.json())
    .then(data => {
      if (data.value) {
        updateCounterDisplay('visitor-count', data.value);
        console.log(`CountAPI visitors: ${data.value}`);
      }
    })
    .catch(error => console.log('CountAPI visitors failed:', error));
}

function sendToCountAPI(type) {
  const endpoint = type === 'visitor' ? 'visitors' : 'downloads';
  return fetch(`https://api.countapi.xyz/hit/not44353.github.io/${endpoint}`)
    .then(response => response.json())
    .then(data => {
      console.log(`CountAPI ${type}: ${data.value}`);
      updateCounterDisplay(`${type}-count`, data.value);
    })
    .catch(error => console.log(`CountAPI ${type} failed:`, error));
}

// ===== FIREBASE REALTIME DATABASE =====
function loadFromFirebase() {
  // Using Firebase Realtime Database for true real-time
  const firebaseConfig = {
    databaseURL: "https://not44353-cv-default-rtdb.firebaseio.com/"
  };
  
  // This would require Firebase SDK
  // For now, using CountAPI as primary
  return Promise.resolve();
}

function sendToFirebase(type) {
  // Send to Firebase Realtime Database
  // This would require Firebase SDK
  return Promise.resolve();
}

// ===== GOAT COUNTER =====
function loadFromGoatCounter() {
  // GoatCounter doesn't have public API, using localStorage as fallback
  return Promise.resolve();
}

function sendToGoatCounter(type) {
  // GoatCounter tracking would go here
  return Promise.resolve();
}

// ===== PLAUSIBLE =====
function loadFromPlausible() {
  // Plausible doesn't have public API, using localStorage as fallback
  return Promise.resolve();
}

function sendToPlausible(type) {
  // Plausible tracking would go here
  return Promise.resolve();
}

// ===== REAL-TIME REFRESH =====
function initRealTimeRefresh() {
  // Refresh every 10 seconds for real-time feel
  setInterval(() => {
    loadRealTimeCounts();
  }, 10000);
  
  // Also refresh when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      loadRealTimeCounts();
    }
  });
}

// Removed local storage functions - now using real-time APIs only

// Removed old auto refresh - now using real-time refresh

// ===== ADVANCED VISITOR TRACKING =====
function getVisitorFingerprint() {
  // Create a unique fingerprint for each visitor
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Visitor fingerprint', 2, 2);
  
  const fingerprint = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent.substring(0, 50),
    canvas: canvas.toDataURL(),
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(fingerprint));
}

function isNewVisitor() {
  const fingerprint = getVisitorFingerprint();
  const storedFingerprint = localStorage.getItem('visitorFingerprint');
  const lastVisit = localStorage.getItem('lastVisit');
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours
  
  // Check if it's a new visitor or after 24 hours
  if (!storedFingerprint || 
      fingerprint !== storedFingerprint || 
      !lastVisit || 
      (now - parseInt(lastVisit)) > oneDay) {
    
    localStorage.setItem('visitorFingerprint', fingerprint);
    localStorage.setItem('lastVisit', now.toString());
    return true;
  }
  
  return false;
}

// Removed old API functions - now using Google Analytics

function updateCounterDisplay(elementId, count) {
  const element = document.getElementById(elementId);
  if (element) {
    // Animate counter
    animateCounter(element, parseInt(element.textContent) || 0, count);
  }
}

function animateCounter(element, start, end) {
  const duration = 1000; // 1 second
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    element.textContent = current.toLocaleString('th-TH');
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions
  initParticles();
  initGlassCardEffects();
  initParallax();
  initTypingEffect();
  initScrollToTop();
  initLazyLoading();
  initCounters(); // Initialize counters
  initAutoRefresh(); // Initialize auto refresh
  
  // Add event listeners with throttling
  window.addEventListener('scroll', throttle(() => {
    animateSkillBars();
    revealOnScroll();
  }, 16)); // ~60fps
  
  // Initial animations
  setTimeout(() => {
    animateCounters();
  }, 1000);
  
  // Add loading animation
  document.body.classList.add('loaded');
});

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
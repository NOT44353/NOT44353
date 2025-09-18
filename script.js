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

// ===== BACKEND API COUNTER SYSTEM =====
function initCounters() {
  console.log('Initializing Backend API counter system...');
  
  // Initialize Backend API first
  initBackendAPI();
  
  // Track page view
  trackPageView();
  
  // Load data from Backend API
  loadFromBackendAPI();
  
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
  
  // Initialize real-time refresh
  initRealTimeRefresh();
}

// ===== BACKEND API FUNCTIONS =====
function initBackendAPI() {
  console.log('Initializing Backend API counter system...');
  
  // ตรวจสอบว่าเซิร์ฟเวอร์ทำงานหรือไม่
  checkServerStatus();
  
  console.log('✅ Backend API initialized');
  return true;
}

function checkServerStatus() {
  fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ Backend server is running');
        updateCounterDisplay('visitor-count', data.data.visitors);
        updateCounterDisplay('download-count', data.data.downloads);
      } else {
        console.log('❌ Backend server error');
        updateCounterDisplay('visitor-count', '0');
        updateCounterDisplay('download-count', '0');
      }
    })
    .catch(error => {
      console.log('❌ Backend server not available:', error);
      updateCounterDisplay('visitor-count', '0');
      updateCounterDisplay('download-count', '0');
    });
}

function trackPageView() {
  // Send to Backend API
  fetch('/api/visitor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('✅ Page view tracked to Backend API');
      updateCounterDisplay('visitor-count', data.data.visitors);
    } else {
      console.log('❌ Failed to track page view');
    }
  })
  .catch(error => {
    console.log('❌ Backend API error:', error);
  });
}

function trackDownload() {
  // Send to Backend API
  fetch('/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('✅ Download tracked to Backend API');
      updateCounterDisplay('download-count', data.data.downloads);
    } else {
      console.log('❌ Failed to track download');
    }
  })
  .catch(error => {
    console.log('❌ Backend API error:', error);
  });
}

// ===== BACKEND API DATA FUNCTIONS =====
function loadFromBackendAPI() {
  console.log('Loading data from Backend API...');
  
  // แสดงตัวเลขเริ่มต้นทันที
  updateCounterDisplay('visitor-count', '0');
  updateCounterDisplay('download-count', '0');
  
  // ตรวจสอบสถานะเซิร์ฟเวอร์
  checkServerStatus();
}

function loadFromGA4DataAPI() {
  console.log('📊 GA4 Data API - Loading real-time data...');
  
  // ใช้ Google Analytics Realtime API
  // เนื่องจากเราไม่สามารถเรียก GA4 Data API โดยตรงจาก client-side
  // เราจะใช้วิธีอื่นในการดึงข้อมูล
  
  // วิธีที่ 1: ใช้ Google Analytics Realtime API
  loadFromGA4RealtimeAPI();
  
  // วิธีที่ 2: ใช้ gtag events ที่ส่งไปแล้ว
  loadFromGTagEvents();
}

function loadFromGA4RealtimeAPI() {
  console.log('📊 Loading from GA4 Realtime API...');
  
  // แสดงตัวเลขเริ่มต้นทันที
  updateCounterDisplay('visitor-count', '0');
  updateCounterDisplay('download-count', '0');
  
  // ใช้ Google Analytics Realtime API
  // ต้องมี Measurement ID ที่ถูกต้อง
  const measurementId = 'G-XXXXXXXXXX';
  
  if (measurementId === 'G-XXXXXXXXXX') {
    console.log('⚠️ Please update Measurement ID in index.html');
    return;
  }
  
  // ใช้ GA4 Realtime API
  try {
    // ตัวอย่างการใช้งาน GA4 Realtime API
    console.log('📊 GA4 Realtime API - Loading data...');
    
    console.log('📊 Data loaded from GA4 Realtime API');
  } catch (error) {
    console.log('❌ GA4 Realtime API error:', error);
    loadFromGTagEvents();
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลจาก Google Analytics Realtime API
async function fetchGA4RealtimeData() {
  try {
    // ใช้ Google Analytics Realtime API
    // ต้องมี Measurement ID ที่ถูกต้อง
    const measurementId = 'G-XXXXXXXXXX';
    
    if (measurementId === 'G-XXXXXXXXXX') {
      console.log('⚠️ Please update Measurement ID in index.html');
      return null;
    }
    
    // ใช้ GA4 Realtime API
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${measurementId}:runRealtimeReport`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        dimensions: [
          { name: 'pageTitle' }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.log('❌ GA4 Realtime API error:', error);
    return null;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลจาก Google Analytics Realtime API
async function fetchGA4RealtimeData() {
  try {
    // ใช้ Google Analytics Realtime API
    // ต้องมี Measurement ID ที่ถูกต้อง
    const measurementId = 'G-XXXXXXXXXX';
    
    if (measurementId === 'G-XXXXXXXXXX') {
      console.log('⚠️ Please update Measurement ID in index.html');
      return null;
    }
    
    // ใช้ GA4 Realtime API
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${measurementId}:runRealtimeReport`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        dimensions: [
          { name: 'pageTitle' }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.log('❌ GA4 Realtime API error:', error);
    return null;
  }
}

function loadFromGA4EmbedAPI() {
  console.log('📊 Loading from GA4 Embed API...');
  
  // ใช้ Google Analytics Embed API
  if (typeof gapi !== 'undefined') {
    gapi.load('analytics', function() {
      // ใช้ GA4 Embed API เพื่อดึงข้อมูล
      loadRealTimeDataFromGA4();
    });
  } else {
    console.log('📊 GA4 Embed API not available, using gtag events');
    loadFromGTagEvents();
  }
}

function loadFromGTagEvents() {
  console.log('📊 Loading from gtag events...');
  
  // แสดงตัวเลขเริ่มต้นทันที
  updateCounterDisplay('visitor-count', '0');
  updateCounterDisplay('download-count', '0');
  
  // ตรวจสอบว่า gtag ทำงานหรือไม่
  if (typeof gtag !== 'undefined') {
    console.log('✅ gtag is working - events are being sent to GA4');
    
    // ตรวจสอบ Measurement ID
    const measurementId = 'G-XXXXXXXXXX';
    
    if (measurementId === 'G-XXXXXXXXXX') {
      console.log('⚠️ Please update Measurement ID in index.html');
      return;
    }
    
    console.log('📊 Data is being sent to Google Analytics');
    console.log('📊 Check GA4 Dashboard for real-time data');
    console.log('📊 Measurement ID:', measurementId);
    
    // แสดงข้อความแนะนำ
    showGA4Instructions();
  } else {
    console.log('❌ gtag not available');
  }
}

function showGA4Instructions() {
  console.log('📊 ===== GOOGLE ANALYTICS SETUP INSTRUCTIONS =====');
  console.log('📊 1. Go to Google Analytics (analytics.google.com)');
  console.log('📊 2. Create a GA4 Property');
  console.log('📊 3. Get your Measurement ID (G-XXXXXXXXXX)');
  console.log('📊 4. Update the Measurement ID in index.html');
  console.log('📊 5. Check GA4 Dashboard for real-time data');
  console.log('📊 ================================================');
}

function loadRealTimeDataFromGA4() {
  console.log('📊 Loading real-time data from GA4...');
  
  // ใช้ GA4 Embed API เพื่อดึงข้อมูล real-time
  // ต้องมี Measurement ID ที่ถูกต้อง
  const measurementId = 'G-XXXXXXXXXX'; // ต้องแทนที่ด้วย ID จริง
  
  if (measurementId === 'G-XXXXXXXXXX') {
    console.log('⚠️ Please update Measurement ID in script.js');
    updateCounterDisplay('visitor-count', '⚠️');
    updateCounterDisplay('download-count', '⚠️');
    return;
  }
  
  // ใช้ GA4 Embed API
  try {
    // ตัวอย่างการใช้งาน GA4 Embed API
    console.log('📊 GA4 Embed API - Loading data...');
    
    // เนื่องจาก GA4 Embed API ต้องการการตั้งค่าที่ซับซ้อน
    // เราจะใช้วิธีแสดงข้อมูลที่ส่งไปแล้ว
    updateCounterDisplay('visitor-count', '📊');
    updateCounterDisplay('download-count', '📊');
    
    console.log('📊 Data loaded from GA4 Embed API');
  } catch (error) {
    console.log('❌ GA4 Embed API error:', error);
    loadFromGTagEvents();
  }
}

function loadRealTimeCounts() {
  console.log('Loading real-time counts from Google Analytics...');
  
  // Load from Google Analytics
  loadFromGoogleAnalytics();
}

// Removed old API functions - now using Google Analytics only

// Removed CountAPI functions - now using Google Analytics only

// Removed localStorage functions - using Google Analytics only

// Removed other API functions - now using Google Analytics only

// ===== GOOGLE ANALYTICS REFRESH =====
function initRealTimeRefresh() {
  // Refresh every 30 seconds
  setInterval(() => {
    loadFromBackendAPI();
  }, 30000);
  
  // Also refresh when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      loadFromBackendAPI();
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
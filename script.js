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

// ===== PROJECTS MODAL FUNCTIONS =====
function openProjectsModal() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
  }
}

function closeProjectsModal() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeProjectsModal();
  }
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
  
  // Profile click event removed - now using button instead
  
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
        สวัสดีครับ ผม ธนาพัฒน์ พิษาวงศ์ นักพัฒนา Full Stack และ Software Engineer
        
        ผมเป็นนักพัฒนาที่มีความหลงใหลในการพัฒนาตนเองอย่างต่อเนื่อง ทั้งในด้านส่วนตัวและวิชาชีพ 
        ด้วยความอดทนภายใต้ความกดดัน ความกระหายในการเรียนรู้ และแรงขับเคลื่อนที่แข็งแกร่งในการเรียนรู้จากผู้ที่อยู่ข้างหน้า
        
        เป้าหมายของผมคือการเป็น Full Stack Developer ที่สร้างระบบเปลี่ยนแปลงองค์กรและสังคม
        คติของผมคือ ไม่หยุดพัฒนา ไม่หยุดเรียนรู้ ไม่หยุดสร้างสรรค์
        
        ด้านการศึกษา ผมจบจากมหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี คณะบริหารธุรกิจ สาขาวิชาเทคโนโลยีสารสนเทศ 
        ระหว่างเดือนกรกฎาคม 2563 ถึง มีนาคม 2567 ด้วยเกรดเฉลี่ย 3.09
        
        ด้านประสบการณ์การทำงาน ผมมีประสบการณ์มากกว่า 3 ปี
        
        เริ่มจาก Advance Network Technology & Services Company Limited ระหว่างเดือนมิถุนายน 2568 ถึง สิงหาคม 2568 
        ในตำแหน่ง Programmer รับผิดชอบการออกแบบและพัฒนาแอปพลิเคชันซอฟต์แวร์ตามความต้องการทางธุรกิจ
        ใช้เครื่องมือต่างๆ เช่น Git, Azure DevOps, Fork, Virtual Machines, IIS และ FileZilla
        ปัจจุบันทำงานเกี่ยวกับโซลูชันการตลาดผ่าน SMS
        
        ต่อมาที่ บจก. เจียเม้งมาร์เก็ตติ้ง ระหว่างเดือนมีนาคม 2567 ถึง มิถุนายน 2568 
        ในตำแหน่ง Fullstack Developer พัฒนาระบบ Back-office สำหรับการเข้างานของพนักงาน
        ระบบ Geofencing การประเมิน KPI และการประมวลผลเงินเดือน
        ออกแบบฐานข้อมูล SQL และจัดการการ Deploy ผ่าน FileZilla
        
        และที่ Software & Scale Engineering ระหว่างเดือนมกราคม 2566 ถึง ธันวาคม 2566 
        ในตำแหน่ง Programmer และ Software Tester พัฒนาแอปพลิเคชัน C# Windows
        สำหรับสแกนบัตรพนักงานและยานพาหนะ รวมถึงการเชื่อมต่ออุปกรณ์ IoT
        
        ด้านทักษะการเขียนโปรแกรม ผมมีความเชี่ยวชาญใน C# และ .NET Core ระดับ 95%
        JavaScript และ TypeScript ระดับ 92% React, Vue.js และ Next.js ระดับ 90%
        Node.js และ Express ระดับ 88% Go และ Echo Framework ระดับ 85%
        PHP, HTML และ CSS ระดับ 88% Java ระดับ 80% และ Python ระดับ 75%
        
        ด้านทักษะเทคนิค ผมมีความเชี่ยวชาญในฐานข้อมูล SQL Server, MySQL, PostgreSQL
        MongoDB, Redis, Entity Framework, Dapper และ Prisma ORM
        
        ด้าน Cloud และ DevOps ผมมีประสบการณ์กับ Docker, Azure Cloud Services
        Git, GitHub, CI/CD Pipelines และ FileZilla Deployment
        
        ด้าน Frameworks และ Tools ผมเชี่ยวชาญ ASP.NET Core, Web API
        React, Next.js, Vue.js, Express.js, Node.js, Bootstrap, Tailwind CSS
        และ JWT Authentication
        
        ด้าน Data และ Analytics ผมมีประสบการณ์การสร้าง Excel Report ด้วย EPPlus
        Chart.js, Recharts, Data Processing, Batch Jobs, FTP Integration
        และ Log4Net Logging
        
        ด้าน Frontend Technologies ผมเชี่ยวชาญ React, TypeScript, Ant Design
        Material-UI, Framer Motion, Socket.IO และ HLS.js
        
        ด้าน Backend และ API ผมมีประสบการณ์การพัฒนา RESTful API
        JWT Token Management, RabbitMQ, Payment Gateway Integration
        และ Microservices Architecture
        
        ด้านทักษะพิเศษ ผมมีประสบการณ์การสนับสนุนระบบ 24 ชั่วโมง
        การตรวจจับและแก้ไขบั๊ก, การออกแบบ System Architecture
        การสร้าง Flowchart และ System Diagram, DevOps และ Deployment
        การประมวลผลข้อมูล, Security และ Authentication
        และ Responsive Design
        
        ด้าน Portfolio และโครงการ ผมได้พัฒนาโครงการสำคัญหลายโครงการ
        เริ่มจาก ANTS SMS Platform ระบบส่ง SMS ขนาดใหญ่
        Thai Luck Gaming Platform เว็บเกมลุ้นโชค
        Anime Streaming Platform เว็บดูอนิเมะออนไลน์
        Batch Processing Systems ระบบ Batch Jobs
        Credit Balance Management ระบบจัดการเครดิต
        Back-office Attendance & Payroll System ระบบจัดการพนักงาน
        และ IoT Truck Weight System แอป C# เชื่อม IoT
        
        ด้านใบรับรองและรางวัล ผมได้รับ Microsoft Certified: Azure Fundamentals
        และรางวัลชนะเลิศการแข่งขันพัฒนาโปรแกรมระดับคณะ
        
        ด้านข้อมูลส่วนตัว ผมชื่อเล่น น๊อต เกิดวันที่ 17 กรกฎาคม 2544
        อาศัยอยู่ที่ 90/84 หมู่ 19 ตำบลคลองหนึ่ง อำเภอคลองหลวง จังหวัดปทุมธานี 12120
        สถานะโสด นับถือพุทธศาสนา
        
        ด้านงานอดิเรก ผมชอบออกกำลังกายและฟิตเนส เล่นเกม ฟังเพลง
        Coding และ Technology และท่องเที่ยวธรรมชาติ
        
        ด้านความสนใจพิเศษ ผมเคยแก้บั๊กข้ามวันข้ามคืนจนสำเร็จ
        ชอบออกแบบ flowchart และ diagram มาก
        เป็นสาย support เพื่อนร่วมงาน 24/7
        และชอบเรียนรู้เทคโนโลยีใหม่ๆ เสมอ
        
        ภารกิจและวิสัยทัศน์ของผมคือ การสร้างระบบที่เปลี่ยนแปลงองค์กรและสังคม
        ด้วยเทคโนโลยีที่มีประสิทธิภาพและยั่งยืน
        เติบโตไปพร้อมกับทีมและไม่หยุดพัฒนาตนเอง
        
        ขอบคุณที่ให้เวลาฟังประวัติของผมครับ
        หากสนใจสามารถติดต่อได้ที่ thanapatpisawong@gmail.com
        หรือโทร 081-7356592
        หรือดูผลงานเพิ่มเติมได้ที่ GitHub: NOT44353
        
        ขอบคุณครับ
      `,
      en: `
        Hello, I'm Thanapat Pisawong, a Full Stack Developer and Software Engineer.
        
        I'm a passionate developer who believes in continuous improvement, both personal and professional. 
        With resilience under pressure, a hunger for knowledge, and a strong drive to learn from those ahead of me, 
        I aim to become a force of positive change through technology.
        
        My goal is to be a Full Stack Developer who creates systems that transform organizations and society.
        My motto is: Never stop developing, never stop learning, never stop creating.
        
        In terms of education, I graduated from Rajamangala University of Technology Thanyaburi, 
        Faculty of Business Administration, Department of Information Technology, 
        from July 2020 to March 2024 with a GPA of 3.09.
        
        In terms of work experience, I have over 3 years of experience.
        
        Starting with Advance Network Technology & Services Company Limited from June 2025 to August 2025 
        as a Programmer, responsible for designing and developing software applications based on business requirements.
        I use various tools such as Git, Azure DevOps, Fork, Virtual Machines, IIS, and FileZilla.
        Currently working on SMS-based marketing solutions.
        
        Next at Jiameng Marketing Company Limited from March 2024 to June 2025 
        as a Fullstack Developer, developing Back-office systems for employee attendance,
        Geofencing, KPI evaluation, and payroll processing.
        I designed SQL databases and managed deployment via FileZilla.
        
        And at Software & Scale Engineering from January 2023 to December 2023 
        as a Programmer and Software Tester, developing C# Windows applications
        for scanning employee and vehicle ID cards, including IoT device integration.
        
        In programming skills, I'm proficient in C# and .NET Core at 95%,
        JavaScript and TypeScript at 92%, React, Vue.js and Next.js at 90%,
        Node.js and Express at 88%, Go and Echo Framework at 85%,
        PHP, HTML and CSS at 88%, Java at 80%, and Python at 75%.
        
        In technical skills, I'm proficient in databases: SQL Server, MySQL, PostgreSQL,
        MongoDB, Redis, Entity Framework, Dapper, and Prisma ORM.
        
        In Cloud and DevOps, I have experience with Docker, Azure Cloud Services,
        Git, GitHub, CI/CD Pipelines, and FileZilla Deployment.
        
        In Frameworks and Tools, I'm skilled in ASP.NET Core, Web API,
        React, Next.js, Vue.js, Express.js, Node.js, Bootstrap, Tailwind CSS,
        and JWT Authentication.
        
        In Data and Analytics, I have experience creating Excel Reports with EPPlus,
        Chart.js, Recharts, Data Processing, Batch Jobs, FTP Integration,
        and Log4Net Logging.
        
        In Frontend Technologies, I'm skilled in React, TypeScript, Ant Design,
        Material-UI, Framer Motion, Socket.IO, and HLS.js.
        
        In Backend and API, I have experience developing RESTful APIs,
        JWT Token Management, RabbitMQ, Payment Gateway Integration,
        and Microservices Architecture.
        
        In special skills, I have experience in 24/7 system support,
        bug detection and debugging, System Architecture design,
        creating Flowcharts and System Diagrams, DevOps and Deployment,
        data processing, Security and Authentication,
        and Responsive Design.
        
        In Portfolio and projects, I've developed several important projects:
        Starting with ANTS SMS Platform, a large-scale SMS system,
        Thai Luck Gaming Platform, a luck-based gaming website,
        Anime Streaming Platform, an online anime viewing website,
        Batch Processing Systems for automated batch jobs,
        Credit Balance Management system,
        Back-office Attendance & Payroll System for employee management,
        and IoT Truck Weight System, a C# app connecting to IoT devices.
        
        In certificates and awards, I received Microsoft Certified: Azure Fundamentals
        and won first place in the faculty-level programming competition.
        
        In personal information, my nickname is Not, born on July 17, 2001,
        living at 90/84 Moo 19, Khlong Nueng Subdistrict, Khlong Luang District, Pathum Thani 12120,
        single status, Buddhist religion.
        
        In hobbies, I enjoy fitness and exercise, gaming, listening to music,
        coding and technology, and nature travel.
        
        In special interests, I once debugged bugs across days and nights until success,
        love designing flowcharts and diagrams,
        am a 24/7 support person for colleagues,
        and always love learning new technologies.
        
        My mission and vision are to create systems that transform organizations and society
        with efficient and sustainable technology,
        growing together with the team and never stopping self-development.
        
        Thank you for taking the time to listen to my background.
        If interested, you can contact me at thanapatpisawong@gmail.com
        or call 081-7356592
        or view more work at GitHub: NOT44353
        
        Thank you.
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
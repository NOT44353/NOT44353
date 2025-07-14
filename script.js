// Smooth scroll for anchor links
const links = document.querySelectorAll('a[href^="#"]');
for (const link of links) {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Skill bar animation on scroll
function animateSkillBars() {
  const bars = document.querySelectorAll('.progress');
  bars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      bar.style.width = getComputedStyle(bar).width;
      bar.classList.add('active');
    }
  });
}
window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// Scroll reveal effect for sections
const revealElements = document.querySelectorAll('section, .timeline-item');
// function revealOnScroll() {
//   revealElements.forEach(el => {
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight - 60) {
//       el.style.opacity = 1;
//       el.style.transform = 'none';
//     } else {
//       el.style.opacity = 0;
//       el.style.transform = 'translateY(40px)';
//     }
//   });
// }
// window.addEventListener('scroll', revealOnScroll);
// window.addEventListener('load', revealOnScroll);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
  }
});

// Animated badge effect
const badges = document.querySelectorAll('.badge');
badges.forEach((badge, i) => {
  badge.style.opacity = 0;
  setTimeout(() => {
    badge.style.transition = 'opacity 0.7s cubic-bezier(.68,-0.55,.27,1.55)';
    badge.style.opacity = 1;
  }, 800 + i * 300);
});

// Animated quote in hero-extra
const quote = document.querySelector('.hero-extra h2');
if (quote) {
  quote.style.opacity = 0;
  setTimeout(() => {
    quote.style.transition = 'opacity 1.2s cubic-bezier(.68,-0.55,.27,1.55)';
    quote.style.opacity = 1;
  }, 400);
}

// Reveal effect for portfolio/certificates
// function revealCards() {
//   const cards = document.querySelectorAll('.portfolio-item, .cert-list li');
//   cards.forEach(card => {
//     const rect = card.getBoundingClientRect();
//     if (rect.top < window.innerHeight - 60) {
//       card.style.opacity = 1;
//       card.style.transform = 'none';
//     } else {
//       card.style.opacity = 0;
//       card.style.transform = 'translateY(40px)';
//     }
//   });
// }
// window.addEventListener('scroll', revealCards);
// window.addEventListener('load', revealCards);

// Interactive hover for glass-card
const glassCards = document.querySelectorAll('.glass-card');
glassCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(44,167,224,0.10) 0%, rgba(255,255,255,0.18) 80%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = 'rgba(255,255,255,0.18)';
  });
});

// Particle Effect
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(44,167,224,0.7)';
      ctx.shadowColor = '#2ca7e0';
      ctx.shadowBlur = 8;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// Parallax Layer Effect
window.addEventListener('scroll', function() {
  const y = window.scrollY;
  document.querySelectorAll('.parallax-layer').forEach((layer, i) => {
    layer.style.transform = `translateY(${y * (0.1 + i * 0.07)}px)`;
  });
});

// Animated Counter
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 60);
    function update() {
      if (count < target) {
        count += step;
        if (count > target) count = target;
        counter.textContent = count;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }
    update();
  });
}
window.addEventListener('load', animateCounters);

// 3D Tilt Effect
function add3DTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(600px) rotateY(${x/20}deg) rotateX(${-y/20}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
add3DTilt('.glass-card');
add3DTilt('.counter-card');
add3DTilt('.portfolio-item');

// Particle Network Effect
const networkCanvas = document.getElementById('network-canvas');
if (networkCanvas) {
  const ctx = networkCanvas.getContext('2d');
  let nodes = [];
  function resizeNetwork() {
    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeNetwork);
  resizeNetwork();
  for (let i = 0; i < 40; i++) {
    nodes.push({
      x: Math.random() * networkCanvas.width,
      y: Math.random() * networkCanvas.height,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2
    });
  }
  function drawNetwork() {
    ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    for (let i = 0; i < nodes.length; i++) {
      let n1 = nodes[i];
      ctx.beginPath();
      ctx.arc(n1.x, n1.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#00fff7';
      ctx.shadowColor = '#2ca7e0';
      ctx.shadowBlur = 8;
      ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        let n2 = nodes[j];
        let dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = 'rgba(44,167,224,0.18)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
      n1.x += n1.dx;
      n1.y += n1.dy;
      if (n1.x < 0 || n1.x > networkCanvas.width) n1.dx *= -1;
      if (n1.y < 0 || n1.y > networkCanvas.height) n1.dy *= -1;
    }
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();
}

// Matrix Rain Effect
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
  const ctx = matrixCanvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  matrixCanvas.width = w;
  matrixCanvas.height = h;
  let cols = Math.floor(w / 18);
  let ypos = Array(cols).fill(0);
  function matrixRain() {
    ctx.fillStyle = 'rgba(10,35,66,0.18)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00fff7';
    for (let i = 0; i < cols; i++) {
      let text = String.fromCharCode(0x30A0 + Math.random() * 96);
      ctx.fillText(text, i * 18, ypos[i] * 18);
      if (Math.random() > 0.975) ypos[i] = 0;
      ypos[i]++;
      if (ypos[i] * 18 > h) ypos[i] = 0;
    }
    requestAnimationFrame(matrixRain);
  }
  matrixRain();
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    matrixCanvas.width = w;
    matrixCanvas.height = h;
    cols = Math.floor(w / 18);
    ypos = Array(cols).fill(0);
  });
}

// Glitch Effect for .neon-glitch
function glitchText() {
  document.querySelectorAll('.neon-glitch').forEach(el => {
    el.setAttribute('data-text', el.textContent);
  });
}
window.addEventListener('DOMContentLoaded', glitchText);

// Animated Icon Pulse
const icons = document.querySelectorAll('.icon-anim');
icons.forEach((icon, i) => {
  icon.style.opacity = 0;
  setTimeout(() => {
    icon.style.transition = 'opacity 1.2s cubic-bezier(.68,-0.55,.27,1.55)';
    icon.style.opacity = 1;
  }, 400 + i * 300);
});

// Headline Typewriter & Dynamic FX
const typewriterTexts = [
  'THE FUTURE IS NOW',
  'CODE. CREATE. CONQUER.',
  'AI-POWERED INNOVATOR',
  'TECH LEADER OF TOMORROW',
  'DISRUPT. DESIGN. DELIVER.',
  'MAKE IMPOSSIBLE POSSIBLE',
  'ENGINEERING THE FUTURE',
  'DREAM. BUILD. INSPIRE.'
];
let twIndex = 0, charIndex = 0, twForward = true;
const twElem = document.getElementById('headline-typewriter');
function typewriterLoop() {
  if (!twElem) return;
  const text = typewriterTexts[twIndex];
  if (twForward) {
    charIndex++;
    if (charIndex > text.length) {
      twForward = false;
      setTimeout(typewriterLoop, 1200);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      twForward = true;
      twIndex = (twIndex + 1) % typewriterTexts.length;
      setTimeout(typewriterLoop, 400);
      return;
    }
  }
  twElem.textContent = text.slice(0, charIndex);
  setTimeout(typewriterLoop, twForward ? 70 : 30);
}
typewriterLoop();

// Headline Glitch Randomizer
const glitchElem = document.getElementById('headline-glitch');
const glitchTexts = [
  'LEAD THE FUTURE',
  'INNOVATION UNLEASHED',
  'BEYOND THE CODE',
  'DIGITAL VISIONARY',
  'FUTURISTIC THINKER',
  'TECHNOLOGY MAVERICK',
  'DISRUPTIVE FORCE',
  'NEXT-GEN DEVELOPER'
];
function randomGlitch() {
  if (!glitchElem) return;
  const t = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
  glitchElem.textContent = t;
  glitchElem.setAttribute('data-text', t);
  setTimeout(randomGlitch, 3200 + Math.random() * 2000);
}
randomGlitch();

// Headline Hologram Randomizer
const holoElem = document.getElementById('headline-holo');
const holoTexts = [
  'INNOVATE. INSPIRE. IMPACT.',
  'HUMAN + AI = LIMITLESS',
  'CODE THE UNIVERSE',
  'SHAPE TOMORROW',
  'IMAGINE. ENGINEER. EVOLVE.',
  'FUTURE IS YOURS',
  'THINK. DESIGN. LEAD.'
];
function randomHolo() {
  if (!holoElem) return;
  const t = holoTexts[Math.floor(Math.random() * holoTexts.length)];
  holoElem.textContent = t;
  setTimeout(randomHolo, 4000 + Math.random() * 2000);
}
randomHolo(); 
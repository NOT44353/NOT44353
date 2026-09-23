// ==========================================================================
// CYBER STRIKE: ZERO-G PROTOCOL
// High-Octane Cyberpunk Action Rogue-lite Platformer
// Engineered with HTML5 Canvas, Web Audio API & Procedural Audio Engine
// ==========================================================================

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmTimer = null;
        this.bgmStep = 0;
        this.bassNotes = [110, 130.81, 146.83, 164.81, 130.81, 110, 98, 82.41]; // A2, C3, D3, E3...
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.bgmTimer && !this.muted) {
            this.startBgm();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBgm();
        } else {
            this.init();
            this.startBgm();
        }
        return this.muted;
    }

    startBgm() {
        if (this.muted || !this.ctx) return;
        this.bgmTimer = setInterval(() => {
            if (this.muted || !this.ctx) return;
            const note = this.bassNotes[this.bgmStep % this.bassNotes.length];
            this.playSynthBass(note, 0.12);
            if (this.bgmStep % 4 === 0) {
                this.playHiHat(0.04);
            }
            this.bgmStep++;
        }, 160);
    }

    stopBgm() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    playSynthBass(freq, dur) {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + dur);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + dur);
        } catch (_) {}
    }

    playHiHat(dur) {
        if (this.muted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * dur;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 8000;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (_) {}
    }

    laser() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(850, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (_) {}
    }

    dash() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (_) {}
    }

    jump() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (_) {}
    }

    explosion() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.35);
        } catch (_) {}
    }

    gem(pitchMultiplier = 1) {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const base = 523.25 * Math.min(2.5, pitchMultiplier);
            osc.frequency.setValueAtTime(base, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(base * 1.5, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (_) {}
    }

    ultimate() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.5);
        } catch (_) {}
    }

    powerup() {
        if (this.muted || !this.ctx) return;
        try {
            [440, 554.37, 659.25, 880].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + i * 0.08);
                osc.stop(this.ctx.currentTime + i * 0.08 + 0.15);
            });
        } catch (_) {}
    }

    bossWarning() {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.setValueAtTime(340, this.ctx.currentTime + 0.15);
            osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.5);
        } catch (_) {}
    }
}

// ==========================================================================
// PERKS DATABASE (ROGUE-LITE)
// ==========================================================================
const PERK_DEFINITIONS = [
    {
        id: 'rapid_fire',
        title: 'Overclock Blaster',
        icon: 'fa-bolt',
        rarity: 'rare',
        desc: 'เพิ่มความเร็วในการยิง +35% และลดคูลดาวน์การยิง',
        apply: (game) => { game.player.fireRate *= 0.72; }
    },
    {
        id: 'triple_shot',
        title: 'Spread Plasma',
        icon: 'fa-certificate',
        rarity: 'epic',
        desc: 'ยิงกระสุนพลาสม่ากระจาย 3 ทิศทางพร้อมกัน เพิ่มพลังทำลาย',
        apply: (game) => { game.player.multiShot = Math.max(game.player.multiShot, 3); }
    },
    {
        id: 'kinetic_barrier',
        title: 'Kinetic Shield',
        icon: 'fa-shield-halved',
        rarity: 'rare',
        desc: 'เปิดบาเรียสนามพลังป้องกันความเสียหาย 1 ครั้งทุกๆ 12 วินาที',
        apply: (game) => { game.player.hasShield = true; game.player.shieldCooldownMax = 720; }
    },
    {
        id: 'tesla_chain',
        title: 'Tesla Discharge',
        icon: 'fa-network-wired',
        rarity: 'legendary',
        desc: 'กระสุนช็อตไฟฟ้ากระจายใส่ศัตรูตัวข้างเคียงอัตโนมัติ',
        apply: (game) => { game.player.hasTesla = true; }
    },
    {
        id: 'homing_missile',
        title: 'Homing Micro-Pods',
        icon: 'fa-rocket',
        rarity: 'epic',
        desc: 'ยิงจรวดมิสไซล์ขนาดเล็กติดตามเป้าหมายอัตโนมัติเป็นระยะ',
        apply: (game) => { game.player.hasMissiles = true; }
    },
    {
        id: 'drone_buddy',
        title: 'Cyber Drone Escort',
        icon: 'fa-crosshairs',
        rarity: 'legendary',
        desc: 'ส่งโดรนผู้ช่วยบินคุ้มกันรอบตัวและช่วยยิงศัตรูต่อเนื่อง',
        apply: (game) => { game.spawnDrone(); }
    },
    {
        id: 'nanite_leech',
        title: 'Nanite Repair',
        icon: 'fa-heart-pulse',
        rarity: 'rare',
        desc: 'การกำจัดศัตรูมีโอกาส 20% ที่จะฟื้นฟูเลือด HP +15 หน่วย',
        apply: (game) => { game.player.leechChance += 0.2; }
    },
    {
        id: 'plasma_overload',
        title: 'Plasma Detonator',
        icon: 'fa-explosion',
        rarity: 'epic',
        desc: 'กระสุนระเบิดเป็นคลื่นความร้อนเมื่อถูกเป้าหมาย สร้างความเสียหายรอบข้าง',
        apply: (game) => { game.player.explosiveBullets = true; }
    },
    {
        id: 'graviton_pull',
        title: 'Graviton Magnet',
        icon: 'fa-magnet',
        rarity: 'rare',
        desc: 'ดูดคริสตัลคะแนนและไอเทมในฉากเข้าหาตัวอัตโนมัติจากระยะไกล',
        apply: (game) => { game.player.magnetRange += 280; }
    }
];

// ==========================================================================
// MAIN GAME ENGINE
// ==========================================================================
class CyberStrikeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.sound = new SoundEngine();
        this.state = 'start'; // start, playing, paused, perk_select, gameover

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('cyber_strike_highscore') || '0', 10);
        this.wave = 1;
        this.kills = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxCombo = 0;

        // Camera & Juice
        this.camera = { x: 0, y: 0 };
        this.screenShake = 0;

        // Collections
        this.platforms = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.floatingTexts = [];
        this.gems = [];
        this.drones = [];
        this.activePerks = [];

        // Input
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        this.touch = { left: false, right: false, jump: false, dash: false, fire: false, ult: false };

        this.boss = null;
        this.waveEnemiesTotal = 0;
        this.waveEnemiesSpawned = 0;
        this.spawnTimer = 0;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEvents();
        this.createPlayer();
        this.generateWorld();
        this.updateHUD();

        let lastTime = performance.now();
        const loop = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;
            this.update(dt);
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    setupCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    createPlayer() {
        this.player = {
            x: this.width / 2,
            y: this.height - 200,
            w: 32,
            h: 46,
            vx: 0,
            vy: 0,
            speed: 460,
            jumpForce: 780,
            gravity: 1900,
            onGround: false,
            jumpsLeft: 2,
            maxJumps: 2,

            hp: 100,
            maxHp: 100,
            shield: false,
            shieldCooldown: 0,
            shieldCooldownMax: 720,
            hasShield: false,

            dashCooldown: 0,
            dashCooldownMax: 0.9,
            isDashing: false,
            dashTimer: 0,
            dashDirection: 1,

            ultCharge: 0, // 0 to 100

            // Combat stats
            fireTimer: 0,
            fireRate: 0.19, // seconds between shots
            multiShot: 1,
            explosiveBullets: false,
            hasTesla: false,
            hasMissiles: false,
            missileTimer: 0,
            leechChance: 0,
            magnetRange: 140,

            facing: 1,
            ghosts: []
        };
    }

    generateWorld() {
        this.platforms = [];
        const floorY = this.height - 70;

        // Main Ground
        this.platforms.push({
            x: -200,
            y: floorY,
            w: this.width + 400,
            h: 120,
            type: 'ground'
        });

        // Floating Cyber Platforms
        const numPlats = Math.max(5, Math.floor(this.width / 260));
        const stepX = (this.width - 200) / (numPlats - 1);
        for (let i = 0; i < numPlats; i++) {
            const py = floorY - 120 - (i % 3) * 110;
            const px = 100 + i * stepX + (Math.random() * 40 - 20);
            this.platforms.push({
                x: px,
                y: py,
                w: 140 + Math.random() * 60,
                h: 22,
                type: 'floating',
                glowColor: (i % 2 === 0) ? '#00f0ff' : '#ff007f'
            });
        }
    }

    startWave(waveNum) {
        this.wave = waveNum;
        this.waveEnemiesTotal = 6 + waveNum * 3;
        this.waveEnemiesSpawned = 0;
        this.spawnTimer = 0;
        this.boss = null;
        const bossHud = document.getElementById('bossHud');
        if (bossHud) bossHud.classList.remove('active');

        // Boss Wave every 5 waves
        if (this.wave % 5 === 0) {
            this.sound.bossWarning();
            this.triggerScreenShake(20);
            this.createBoss();
        }

        const waveDisplay = document.getElementById('waveDisplay');
        if (waveDisplay) {
            waveDisplay.textContent = `WAVE ${this.wave < 10 ? '0' + this.wave : this.wave}`;
        }
        this.createFloatingText('WAVE ' + this.wave, this.width / 2, this.height / 3, '#00f0ff', 40);
    }

    createBoss() {
        const bossMaxHp = 800 + this.wave * 250;
        this.boss = {
            x: this.width - 200,
            y: 180,
            w: 96,
            h: 96,
            vx: -90,
            vy: 60,
            hp: bossMaxHp,
            maxHp: bossMaxHp,
            attackTimer: 0,
            phase: 1,
            color: '#ff3366'
        };
        const bossHud = document.getElementById('bossHud');
        const bossName = document.getElementById('bossName');
        if (bossHud) bossHud.classList.add('active');
        if (bossName) bossName.textContent = `⚠️ TITAN MECHA // MK-${this.wave}`;
    }

    spawnDrone() {
        this.drones.push({
            angle: Math.random() * Math.PI * 2,
            distance: 55,
            fireTimer: 0,
            fireRate: 0.6
        });
    }

    // ==========================================================================
    // INPUT HANDLING
    // ==========================================================================
    setupEvents() {
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.generateWorld();
        });

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.sound.init();

            if (e.code === 'KeyE' || e.code === 'KeyK') {
                this.activateUltimate();
            }
            if (e.code === 'Escape') {
                this.togglePause();
            }
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.performDash();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.sound.init();
        });

        window.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });

        // Touch Control bindings
        const bindTouch = (id, prop) => {
            const el = document.getElementById(id);
            if (!el) return;
            const start = (e) => { e.preventDefault(); this.touch[prop] = true; this.sound.init(); };
            const end = (e) => { e.preventDefault(); this.touch[prop] = false; };
            el.addEventListener('touchstart', start, { passive: false });
            el.addEventListener('touchend', end, { passive: false });
            el.addEventListener('mousedown', start);
            el.addEventListener('mouseup', end);
        };

        bindTouch('touchLeft', 'left');
        bindTouch('touchRight', 'right');
        bindTouch('touchJump', 'jump');
        bindTouch('touchDash', 'dash');
        bindTouch('touchFire', 'fire');
        bindTouch('touchUlt', 'ult');

        // Buttons
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        const resumeBtn = document.getElementById('resumeBtn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.togglePause());
        }

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }

        const restartPauseBtn = document.getElementById('restartPauseBtn');
        if (restartPauseBtn) {
            restartPauseBtn.addEventListener('click', () => this.restartGame());
        }

        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartGame());
        }

        const audioToggleBtn = document.getElementById('audioToggleBtn');
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => {
                const muted = this.sound.toggleMute();
                const icon = document.getElementById('audioIcon');
                if (icon) {
                    icon.className = muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                }
            });
        }
    }

    startGame() {
        this.sound.init();
        const startModal = document.getElementById('startModal');
        if (startModal) startModal.classList.remove('active');
        this.state = 'playing';
        this.score = 0;
        this.combo = 0;
        this.kills = 0;
        this.createPlayer();
        this.startWave(1);
    }

    restartGame() {
        document.querySelectorAll('.game-modal').forEach(m => m.classList.remove('active'));
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.gems = [];
        this.drones = [];
        this.activePerks = [];
        const perksTray = document.getElementById('perksTray');
        if (perksTray) perksTray.innerHTML = '';
        this.startGame();
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseModal').classList.add('active');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseModal').classList.remove('active');
        }
    }

    // ==========================================================================
    // GAMEPLAY UPDATES
    // ==========================================================================
    update(dt) {
        if (this.state !== 'playing') return;

        this.updatePlayer(dt);
        this.updateDrones(dt);
        this.updateBullets(dt);
        this.updateEnemies(dt);
        this.updateBoss(dt);
        this.updateGems(dt);
        this.updateParticles(dt);
        this.updateWaveLogic(dt);

        // Screen Shake Decay
        if (this.screenShake > 0) {
            this.screenShake = Math.max(0, this.screenShake - dt * 45);
        }

        // Combo Decay
        if (this.combo > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                const cc = document.getElementById('comboContainer');
                if (cc) cc.classList.remove('active');
            }
        }

        this.updateHUD();
    }

    updatePlayer(dt) {
        const p = this.player;

        // Dash cooldown
        if (p.dashCooldown > 0) p.dashCooldown -= dt;

        // Dash Execution
        if (p.isDashing) {
            p.dashTimer -= dt;
            p.vx = p.dashDirection * 1200;
            p.vy = 0;

            // Spawn After-image Ghost
            if (Math.random() < 0.6) {
                p.ghosts.push({
                    x: p.x,
                    y: p.y,
                    alpha: 0.7,
                    facing: p.facing
                });
            }

            if (p.dashTimer <= 0) {
                p.isDashing = false;
                p.vx = p.dashDirection * p.speed;
            }
        } else {
            // Horizontal Input
            const moveLeft = this.keys['KeyA'] || this.keys['ArrowLeft'] || this.touch.left;
            const moveRight = this.keys['KeyD'] || this.keys['ArrowRight'] || this.touch.right;

            if (moveLeft && !moveRight) {
                p.vx = -p.speed;
                p.facing = -1;
            } else if (moveRight && !moveLeft) {
                p.vx = p.speed;
                p.facing = 1;
            } else {
                p.vx *= 0.68; // Smooth Friction
                if (Math.abs(p.vx) < 5) p.vx = 0;
            }

            // Jump Input
            const jumpKey = this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['Space'] || this.touch.jump;
            if (jumpKey && !p.jumpPressed) {
                p.jumpPressed = true;
                if (p.onGround) {
                    p.vy = -p.jumpForce;
                    p.onGround = false;
                    p.jumpsLeft = p.maxJumps - 1;
                    this.sound.jump();
                    this.createJumpSparks(p.x + p.w / 2, p.y + p.h);
                } else if (p.jumpsLeft > 0) {
                    p.vy = -p.jumpForce * 0.9;
                    p.jumpsLeft--;
                    this.sound.jump();
                    this.createJumpSparks(p.x + p.w / 2, p.y + p.h);
                }
            } else if (!jumpKey) {
                p.jumpPressed = false;
            }

            // Gravity
            p.vy += p.gravity * dt;
            if (p.vy > 1200) p.vy = 1200;
        }

        // Touch Dash
        if (this.touch.dash && p.dashCooldown <= 0 && !p.isDashing) {
            this.performDash();
        }

        // Apply velocities
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounds Checking
        if (p.x < 10) p.x = 10;
        if (p.x > this.width - p.w - 10) p.x = this.width - p.w - 10;

        // Platform Collisions
        p.onGround = false;
        for (const plat of this.platforms) {
            if (p.x + p.w > plat.x && p.x < plat.x + plat.w) {
                // Landing on top
                if (p.y + p.h >= plat.y && p.y + p.h - p.vy * dt <= plat.y + 12 && p.vy >= 0) {
                    p.y = plat.y - p.h;
                    p.vy = 0;
                    p.onGround = true;
                    p.jumpsLeft = p.maxJumps;
                }
            }
        }

        // Weapon Firing
        p.fireTimer -= dt;
        const wantsFire = this.mouse.isDown || this.keys['KeyJ'] || this.touch.fire;
        if (wantsFire && p.fireTimer <= 0) {
            this.fireBullet();
            p.fireTimer = p.fireRate;
        }

        // Homing Missiles Perk
        if (p.hasMissiles) {
            p.missileTimer -= dt;
            if (p.missileTimer <= 0) {
                p.missileTimer = 1.6;
                this.fireHomingMissile();
            }
        }

        // Kinetic Shield Regeneration
        if (p.hasShield && !p.shield) {
            p.shieldCooldown--;
            if (p.shieldCooldown <= 0) {
                p.shield = true;
                this.createFloatingText('SHIELD ONLINE', p.x + p.w / 2, p.y - 15, '#00f0ff', 18);
            }
        }

        // Decay Ghosts
        for (let i = p.ghosts.length - 1; i >= 0; i--) {
            p.ghosts[i].alpha -= dt * 3.5;
            if (p.ghosts[i].alpha <= 0) p.ghosts.splice(i, 1);
        }

        // Touch Ult
        if (this.touch.ult) {
            this.activateUltimate();
        }
    }

    performDash() {
        const p = this.player;
        if (p.dashCooldown > 0 || p.isDashing) return;
        p.isDashing = true;
        p.dashTimer = 0.22;
        p.dashCooldown = p.dashCooldownMax;
        p.dashDirection = p.facing;
        this.sound.dash();
        this.triggerScreenShake(7);
    }

    fireBullet() {
        const p = this.player;
        const startX = p.facing === 1 ? p.x + p.w + 4 : p.x - 12;
        const startY = p.y + p.h / 2 - 2;

        let angle = p.facing === 1 ? 0 : Math.PI;

        // If mouse is far enough, aim at mouse
        if (this.mouse.x !== 0 && this.mouse.y !== 0) {
            const dx = this.mouse.x - startX;
            const dy = this.mouse.y - startY;
            if (Math.hypot(dx, dy) > 40) {
                angle = Math.atan2(dy, dx);
            }
        }

        const speed = 900;
        const shots = p.multiShot === 3 ? [-0.15, 0, 0.15] : [0];

        for (const offset of shots) {
            this.bullets.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle + offset) * speed,
                vy: Math.sin(angle + offset) * speed,
                radius: 5,
                explosive: p.explosiveBullets,
                hasTesla: p.hasTesla,
                life: 1.5
            });
        }
        this.sound.laser();
    }

    fireHomingMissile() {
        const p = this.player;
        this.bullets.push({
            x: p.x + p.w / 2,
            y: p.y,
            vx: 0,
            vy: -400,
            radius: 6,
            isMissile: true,
            explosive: true,
            life: 2.5
        });
    }

    activateUltimate() {
        const p = this.player;
        if (p.ultCharge < 100) return;
        p.ultCharge = 0;
        this.sound.ultimate();
        this.triggerScreenShake(25);

        // Clear all enemy bullets
        this.enemyBullets = [];

        // Damage all enemies
        for (const e of this.enemies) {
            e.hp -= 250;
            this.createExplosionSparks(e.x + e.w / 2, e.y + e.h / 2, '#ffe600', 20);
        }
        if (this.boss) {
            this.boss.hp -= 350;
            this.createExplosionSparks(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#ffe600', 30);
        }

        // Spawn Expanding Nova Ring
        for (let i = 0; i < 60; i++) {
            const ang = (i / 60) * Math.PI * 2;
            this.particles.push({
                x: p.x + p.w / 2,
                y: p.y + p.h / 2,
                vx: Math.cos(ang) * 650,
                vy: Math.sin(ang) * 650,
                color: '#ffe600',
                size: 6,
                life: 0.6,
                maxLife: 0.6
            });
        }
        this.createFloatingText('QUANTUM NOVA!', p.x + p.w / 2, p.y - 40, '#ffe600', 36);
    }

    updateDrones(dt) {
        for (const drone of this.drones) {
            drone.angle += dt * 2.2;
            const targetX = this.player.x + this.player.w / 2 + Math.cos(drone.angle) * drone.distance;
            const targetY = this.player.y + this.player.h / 2 + Math.sin(drone.angle) * drone.distance;
            drone.x = targetX;
            drone.y = targetY;

            drone.fireTimer -= dt;
            if (drone.fireTimer <= 0 && this.enemies.length > 0) {
                drone.fireTimer = drone.fireRate;
                const closest = this.getClosestEnemy(drone.x, drone.y);
                if (closest) {
                    const ang = Math.atan2(closest.y + closest.h / 2 - drone.y, closest.x + closest.w / 2 - drone.x);
                    this.bullets.push({
                        x: drone.x,
                        y: drone.y,
                        vx: Math.cos(ang) * 850,
                        vy: Math.sin(ang) * 850,
                        radius: 4,
                        color: '#00ff88',
                        life: 1.2
                    });
                    this.sound.laser();
                }
            }
        }
    }

    getClosestEnemy(x, y) {
        let best = null;
        let bestDist = Infinity;
        for (const e of this.enemies) {
            const d = Math.hypot(e.x + e.w / 2 - x, e.y + e.h / 2 - y);
            if (d < bestDist) {
                bestDist = d;
                best = e;
            }
        }
        if (this.boss) {
            const d = Math.hypot(this.boss.x + this.boss.w / 2 - x, this.boss.y + this.boss.h / 2 - y);
            if (d < bestDist) best = this.boss;
        }
        return best;
    }

    updateBullets(dt) {
        // Player Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.life -= dt;

            // Homing Missile Logic
            if (b.isMissile) {
                const target = this.getClosestEnemy(b.x, b.y);
                if (target) {
                    const targetAngle = Math.atan2(target.y + target.h / 2 - b.y, target.x + target.w / 2 - b.x);
                    b.vx += Math.cos(targetAngle) * 900 * dt;
                    b.vy += Math.sin(targetAngle) * 900 * dt;
                }
            }

            b.x += b.vx * dt;
            b.y += b.vy * dt;

            // Check hit on enemies
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                    hit = true;
                    e.hp -= 40;
                    this.createHitSparks(b.x, b.y);

                    if (b.explosive) {
                        this.createExplosionDamage(b.x, b.y, 75, 45);
                    }
                    if (b.hasTesla) {
                        this.createTeslaArc(e);
                    }

                    if (e.hp <= 0) {
                        this.destroyEnemy(e, j);
                    }
                    break;
                }
            }

            // Check hit on Boss
            if (!hit && this.boss) {
                const bss = this.boss;
                if (b.x > bss.x && b.x < bss.x + bss.w && b.y > bss.y && b.y < bss.y + bss.h) {
                    hit = true;
                    bss.hp -= 35;
                    this.createHitSparks(b.x, b.y);
                    if (b.explosive) this.createExplosionDamage(b.x, b.y, 80, 50);
                    if (bss.hp <= 0) this.destroyBoss();
                }
            }

            if (hit || b.life <= 0 || b.x < 0 || b.x > this.width || b.y < 0 || b.y > this.height) {
                this.bullets.splice(i, 1);
            }
        }

        // Enemy Bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const eb = this.enemyBullets[i];
            eb.x += eb.vx * dt;
            eb.y += eb.vy * dt;
            eb.life -= dt;

            // Hit Player
            const p = this.player;
            if (!p.isDashing && eb.x > p.x && eb.x < p.x + p.w && eb.y > p.y && eb.y < p.y + p.h) {
                this.damagePlayer(15);
                this.enemyBullets.splice(i, 1);
                continue;
            }

            if (eb.life <= 0 || eb.x < 0 || eb.x > this.width || eb.y < 0 || eb.y > this.height) {
                this.enemyBullets.splice(i, 1);
            }
        }
    }

    createExplosionDamage(x, y, radius, damage) {
        this.sound.explosion();
        this.triggerScreenShake(8);
        this.createExplosionSparks(x, y, '#ff007f', 16);

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (Math.hypot(e.x + e.w / 2 - x, e.y + e.h / 2 - y) < radius) {
                e.hp -= damage;
                if (e.hp <= 0) this.destroyEnemy(e, i);
            }
        }
    }

    createTeslaArc(sourceEnemy) {
        for (const e of this.enemies) {
            if (e !== sourceEnemy && Math.hypot(e.x - sourceEnemy.x, e.y - sourceEnemy.y) < 180) {
                e.hp -= 30;
                this.createTeslaBeam(sourceEnemy.x + sourceEnemy.w / 2, sourceEnemy.y + sourceEnemy.h / 2, e.x + e.w / 2, e.y + e.h / 2);
                if (e.hp <= 0) this.destroyEnemy(e, this.enemies.indexOf(e));
                break;
            }
        }
    }

    createTeslaBeam(x1, y1, x2, y2) {
        this.particles.push({
            isBeam: true,
            x1, y1, x2, y2,
            color: '#00f0ff',
            life: 0.15,
            maxLife: 0.15
        });
    }

    destroyEnemy(e, index) {
        if (index >= 0 && index < this.enemies.length) {
            this.enemies.splice(index, 1);
        }
        this.kills++;
        this.sound.explosion();
        this.triggerScreenShake(6);
        this.createExplosionSparks(e.x + e.w / 2, e.y + e.h / 2, e.color || '#ff007f', 18);

        // Increase Combo & Score
        this.combo++;
        this.comboTimer = 3.5;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        const pts = 100 * Math.min(this.combo, 10);
        this.score += pts;
        this.createFloatingText(`+${pts}`, e.x + e.w / 2, e.y, '#ffe600', 18 + Math.min(this.combo * 2, 16));

        // Charge Ult
        this.player.ultCharge = Math.min(100, this.player.ultCharge + 8);

        // Nanite Leech
        if (this.player.leechChance > 0 && Math.random() < this.player.leechChance) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 15);
            this.createFloatingText('+15 HP', this.player.x + this.player.w / 2, this.player.y - 20, '#00ff88', 20);
        }

        // Spawn Data Core Gem
        this.gems.push({
            x: e.x + e.w / 2,
            y: e.y + e.h / 2,
            vx: (Math.random() - 0.5) * 120,
            vy: -180,
            radius: 6,
            color: '#00f0ff'
        });
    }

    destroyBoss() {
        this.sound.explosion();
        this.triggerScreenShake(30);
        this.createExplosionSparks(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#ff007f', 60);

        this.score += 5000;
        this.createFloatingText('BOSS SLAIN! +5000', this.width / 2, this.height / 3, '#00ff88', 42);
        this.boss = null;

        const bossHud = document.getElementById('bossHud');
        if (bossHud) bossHud.classList.remove('active');

        // Grant Perk Card Choice for defeating boss
        this.showPerkSelection();
    }

    updateEnemies(dt) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];

            if (e.type === 'drone') {
                // Flying swoop attack
                e.angle += dt * 3;
                e.x += e.vx * dt;
                e.y += Math.sin(e.angle) * 120 * dt;

                if (e.x < 30 || e.x > this.width - 50) e.vx *= -1;

                e.fireTimer -= dt;
                if (e.fireTimer <= 0) {
                    e.fireTimer = 2.2;
                    const ang = Math.atan2(this.player.y - e.y, this.player.x - e.x);
                    this.enemyBullets.push({
                        x: e.x + e.w / 2,
                        y: e.y + e.h / 2,
                        vx: Math.cos(ang) * 320,
                        vy: Math.sin(ang) * 320,
                        color: '#ff3366',
                        life: 3.5
                    });
                }
            } else if (e.type === 'seeker') {
                // Kamikaze charge
                const dx = this.player.x - e.x;
                const dy = this.player.y - e.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 5) {
                    e.x += (dx / dist) * e.speed * dt;
                    e.y += (dy / dist) * e.speed * dt;
                }
            } else {
                // Ground patrol walker
                e.x += e.vx * dt;
                if (e.x < 30 || e.x > this.width - 60) e.vx *= -1;
            }

            // Touch damage to player
            const p = this.player;
            if (!p.isDashing && e.x < p.x + p.w && e.x + e.w > p.x && e.y < p.y + p.h && e.y + e.h > p.y) {
                this.damagePlayer(20);
                if (e.type === 'seeker') {
                    this.destroyEnemy(e, i);
                }
            }
        }
    }

    updateBoss(dt) {
        if (!this.boss) return;
        const b = this.boss;

        // Hover movement
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x < 60 || b.x > this.width - b.w - 60) b.vx *= -1;
        if (b.y < 80 || b.y > 280) b.vy *= -1;

        b.attackTimer -= dt;
        if (b.attackTimer <= 0) {
            b.attackTimer = 1.4;
            // Spread barrage
            for (let i = -2; i <= 2; i++) {
                const ang = Math.PI / 2 + (i * 0.25);
                this.enemyBullets.push({
                    x: b.x + b.w / 2,
                    y: b.y + b.h,
                    vx: Math.cos(ang) * 340,
                    vy: Math.sin(ang) * 340,
                    color: '#ff0055',
                    life: 4
                });
            }
            this.sound.laser();
        }

        // Update Boss Health Bar
        const bossFill = document.getElementById('bossFill');
        const bossHpPercent = document.getElementById('bossHpPercent');
        const pct = Math.max(0, Math.min(100, Math.floor((b.hp / b.maxHp) * 100)));
        if (bossFill) bossFill.style.width = pct + '%';
        if (bossHpPercent) bossHpPercent.textContent = pct + '%';
    }

    updateGems(dt) {
        const p = this.player;
        for (let i = this.gems.length - 1; i >= 0; i--) {
            const g = this.gems[i];

            // Magnet pulling
            const dx = p.x + p.w / 2 - g.x;
            const dy = p.y + p.h / 2 - g.y;
            const dist = Math.hypot(dx, dy);

            if (dist < p.magnetRange) {
                g.vx += (dx / dist) * 950 * dt;
                g.vy += (dy / dist) * 950 * dt;
            } else {
                g.vy += 450 * dt; // Gravity
                g.vx *= 0.95;
            }

            g.x += g.vx * dt;
            g.y += g.vy * dt;

            // Collect
            if (dist < 26) {
                this.sound.gem(1 + Math.min(this.combo * 0.1, 1));
                this.score += 50;
                p.ultCharge = Math.min(100, p.ultCharge + 3);
                this.gems.splice(i, 1);
            }
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.life -= dt;
            if (pt.isBeam) {
                if (pt.life <= 0) this.particles.splice(i, 1);
                continue;
            }
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            if (pt.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 45 * dt;
            ft.life -= dt;
            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    updateWaveLogic(dt) {
        if (this.boss) return; // Boss wave active

        // Spawn Wave Enemies
        if (this.waveEnemiesSpawned < this.waveEnemiesTotal) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0) {
                this.spawnTimer = Math.max(0.6, 2.0 - this.wave * 0.1);
                this.spawnEnemy();
                this.waveEnemiesSpawned++;
            }
        } else if (this.enemies.length === 0) {
            // Wave Clear!
            this.showPerkSelection();
        }
    }

    spawnEnemy() {
        const types = ['drone', 'walker', 'seeker'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const side = Math.random() > 0.5 ? 1 : -1;

        if (chosen === 'drone') {
            this.enemies.push({
                type: 'drone',
                x: side === 1 ? -40 : this.width + 40,
                y: 120 + Math.random() * 220,
                w: 36,
                h: 28,
                vx: side * 140,
                hp: 50 + this.wave * 15,
                angle: 0,
                fireTimer: 1.5,
                color: '#00f0ff'
            });
        } else if (chosen === 'seeker') {
            this.enemies.push({
                type: 'seeker',
                x: Math.random() * (this.width - 100) + 50,
                y: -40,
                w: 26,
                h: 26,
                speed: 210 + this.wave * 12,
                hp: 35 + this.wave * 10,
                color: '#ff3366'
            });
        } else {
            this.enemies.push({
                type: 'walker',
                x: side === 1 ? 50 : this.width - 90,
                y: this.height - 120,
                w: 38,
                h: 44,
                vx: side * 120,
                hp: 90 + this.wave * 25,
                color: '#ff007f'
            });
        }
    }

    damagePlayer(amount) {
        const p = this.player;
        if (p.isDashing) return;

        if (p.shield) {
            p.shield = false;
            p.shieldCooldown = p.shieldCooldownMax;
            this.sound.dash();
            this.triggerScreenShake(8);
            this.createFloatingText('BARRIER DEFLECTED', p.x + p.w / 2, p.y - 20, '#00f0ff', 20);
            return;
        }

        p.hp -= amount;
        this.triggerScreenShake(14);
        this.sound.explosion();
        this.createHitSparks(p.x + p.w / 2, p.y + p.h / 2);

        if (p.hp <= 0) {
            p.hp = 0;
            this.gameOver();
        }
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('cyber_strike_highscore', this.highScore);
        }

        document.getElementById('finalScoreVal').textContent = this.score;
        document.getElementById('highScoreVal').textContent = this.highScore;
        document.getElementById('finalWaveVal').textContent = this.wave;
        document.getElementById('finalKillsVal').textContent = this.kills;

        document.getElementById('gameOverModal').classList.add('active');
    }

    showPerkSelection() {
        this.state = 'perk_select';
        this.sound.powerup();

        const container = document.getElementById('perkOptionsContainer');
        if (!container) return;
        container.innerHTML = '';

        // Pick 3 random perks
        const shuffled = [...PERK_DEFINITIONS].sort(() => 0.5 - Math.random());
        const chosen = shuffled.slice(0, 3);

        chosen.forEach(perk => {
            const card = document.createElement('div');
            card.className = 'perk-card';
            card.innerHTML = `
                <div class="perk-icon-wrap"><i class="fas ${perk.icon}"></i></div>
                <div class="perk-title">${perk.title}</div>
                <span class="perk-rarity rarity-${perk.rarity}">${perk.rarity}</span>
                <p class="perk-desc">${perk.desc}</p>
            `;
            card.addEventListener('click', () => {
                perk.apply(this);
                this.activePerks.push(perk);
                this.renderPerksTray();
                document.getElementById('perkModal').classList.remove('active');
                this.state = 'playing';
                this.startWave(this.wave + 1);
            });
            container.appendChild(card);
        });

        document.getElementById('perkModal').classList.add('active');
    }

    renderPerksTray() {
        const tray = document.getElementById('perksTray');
        if (!tray) return;
        tray.innerHTML = '';
        this.activePerks.forEach(p => {
            const chip = document.createElement('div');
            chip.className = 'perk-chip';
            chip.title = p.title;
            chip.innerHTML = `<i class="fas ${p.icon}"></i>`;
            tray.appendChild(chip);
        });
    }

    // ==========================================================================
    // PARTICLES & JUICE
    // ==========================================================================
    triggerScreenShake(amt) {
        this.screenShake = amt;
    }

    createJumpSparks(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 160,
                vy: Math.random() * 80 + 30,
                color: '#00f0ff',
                size: 3,
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    createHitSparks(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 320,
                vy: (Math.random() - 0.5) * 320,
                color: '#ffe600',
                size: 3,
                life: 0.25,
                maxLife: 0.25
            });
        }
    }

    createExplosionSparks(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 320 + 80;
            this.particles.push({
                x, y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color,
                size: Math.random() * 5 + 2,
                life: 0.45,
                maxLife: 0.45
            });
        }
    }

    createFloatingText(text, x, y, color = '#fff', size = 20) {
        this.floatingTexts.push({
            text, x, y, color, size, life: 1.0, maxLife: 1.0
        });
    }

    updateHUD() {
        const p = this.player;
        if (!p) return;

        // HP
        const hpPercent = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
        const hpFill = document.getElementById('hpFill');
        const hpVal = document.getElementById('hpVal');
        if (hpFill) hpFill.style.width = hpPercent + '%';
        if (hpVal) hpVal.textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;

        // Energy / Dash
        const dashPercent = p.dashCooldown <= 0 ? 100 : Math.floor(((p.dashCooldownMax - p.dashCooldown) / p.dashCooldownMax) * 100);
        const energyFill = document.getElementById('energyFill');
        const energyVal = document.getElementById('energyVal');
        if (energyFill) energyFill.style.width = dashPercent + '%';
        if (energyVal) energyVal.textContent = p.dashCooldown <= 0 ? 'READY' : `${dashPercent}%`;

        // Ult
        const ultFill = document.getElementById('ultFill');
        const ultVal = document.getElementById('ultVal');
        if (ultFill) ultFill.style.width = p.ultCharge + '%';
        if (ultVal) ultVal.textContent = p.ultCharge >= 100 ? 'READY [E]' : `${Math.floor(p.ultCharge)}%`;

        // Score
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) scoreDisplay.textContent = this.score.toLocaleString();

        // Combo
        const cc = document.getElementById('comboContainer');
        const comboCount = document.getElementById('comboCount');
        if (cc && comboCount) {
            if (this.combo > 1) {
                cc.classList.add('active');
                comboCount.textContent = `x${this.combo}`;
            } else {
                cc.classList.remove('active');
            }
        }
    }

    // ==========================================================================
    // RENDERING
    // ==========================================================================
    render() {
        const ctx = this.ctx;
        ctx.save();

        // Screen Shake offset
        if (this.screenShake > 0) {
            const rx = (Math.random() - 0.5) * this.screenShake;
            const ry = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(rx, ry);
        }

        // Draw Parallax Cyber Space Background
        ctx.fillStyle = '#040914';
        ctx.fillRect(0, 0, this.width, this.height);

        // Cyber Grid Lines (perspective)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;
        const horizon = this.height - 240;
        for (let x = 0; x < this.width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, horizon);
            ctx.lineTo((x - this.width / 2) * 2.5 + this.width / 2, this.height);
            ctx.stroke();
        }
        for (let y = horizon; y < this.height; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Platforms
        for (const plat of this.platforms) {
            if (plat.type === 'ground') {
                ctx.fillStyle = '#061325';
                ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(plat.x, plat.y);
                ctx.lineTo(plat.x + plat.w, plat.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = 'rgba(8, 22, 42, 0.9)';
                ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

                ctx.strokeStyle = plat.glowColor || '#00f0ff';
                ctx.lineWidth = 2;
                ctx.shadowColor = plat.glowColor || '#00f0ff';
                ctx.shadowBlur = 12;
                ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
                ctx.shadowBlur = 0;
            }
        }

        // Data Core Gems
        for (const g of this.gems) {
            ctx.save();
            ctx.fillStyle = g.color;
            ctx.shadowColor = g.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Player Ghosts (Dash Trails)
        for (const gh of this.player.ghosts) {
            ctx.save();
            ctx.globalAlpha = gh.alpha * 0.45;
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.fillRect(gh.x, gh.y, this.player.w, this.player.h);
            ctx.restore();
        }

        // Player Character (Mecha Cyber Suit)
        const p = this.player;
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        if (p.facing === -1) ctx.scale(-1, 1);

        // Body Glow
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = p.isDashing ? 25 : 12;

        // Torso Armor
        ctx.fillStyle = '#0f243d';
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);

        // Cyber Visor
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(2, -p.h / 2 + 6, 12, 6);

        // Core Reactor Glow
        ctx.fillStyle = p.ultCharge >= 100 ? '#ffe600' : '#00f0ff';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Blaster Cannon
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.w / 2 - 2, -2, 10, 5);

        // Kinetic Shield Sphere
        if (p.shield) {
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(0, 0, p.w * 0.9, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();

        // Drones
        for (const drone of this.drones) {
            ctx.save();
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(drone.x, drone.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Enemies
        for (const e of this.enemies) {
            ctx.save();
            ctx.shadowColor = e.color || '#ff007f';
            ctx.shadowBlur = 12;

            if (e.type === 'drone') {
                ctx.fillStyle = e.color;
                ctx.beginPath();
                ctx.moveTo(e.x + e.w, e.y + e.h / 2);
                ctx.lineTo(e.x, e.y);
                ctx.lineTo(e.x + 8, e.y + e.h / 2);
                ctx.lineTo(e.x, e.y + e.h);
                ctx.closePath();
                ctx.fill();
            } else if (e.type === 'seeker') {
                ctx.fillStyle = '#ff3366';
                ctx.beginPath();
                ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = e.color;
                ctx.fillRect(e.x, e.y, e.w, e.h);
                // Eye slot
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(e.x + 4, e.y + 8, e.w - 8, 4);
            }
            ctx.restore();
        }

        // Boss Mecha
        if (this.boss) {
            const b = this.boss;
            ctx.save();
            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#220814';
            ctx.fillRect(b.x, b.y, b.w, b.h);

            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 3;
            ctx.strokeRect(b.x, b.y, b.w, b.h);

            // Glowing Eye Matrix
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(b.x + 18, b.y + 24, b.w - 36, 12);
            ctx.restore();
        }

        // Bullets
        for (const b of this.bullets) {
            ctx.save();
            ctx.fillStyle = b.color || '#00f0ff';
            ctx.shadowColor = b.color || '#00f0ff';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (const eb of this.enemyBullets) {
            ctx.save();
            ctx.fillStyle = eb.color || '#ff3366';
            ctx.shadowColor = eb.color || '#ff3366';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(eb.x, eb.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Particles & Beams
        for (const pt of this.particles) {
            if (pt.isBeam) {
                ctx.save();
                ctx.strokeStyle = pt.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = pt.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(pt.x1, pt.y1);
                ctx.lineTo(pt.x2, pt.y2);
                ctx.stroke();
                ctx.restore();
            } else {
                ctx.save();
                ctx.globalAlpha = pt.life / pt.maxLife;
                ctx.fillStyle = pt.color;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Floating Text
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = ft.life / ft.maxLife;
            ctx.font = `900 ${ft.size}px 'Orbitron', sans-serif`;
            ctx.fillStyle = ft.color;
            ctx.shadowColor = ft.color;
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }

        ctx.restore();
    }
}

// Initial Launch
window.addEventListener('DOMContentLoaded', () => {
    window.game = new CyberStrikeGame();
});

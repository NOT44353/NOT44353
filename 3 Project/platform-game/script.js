// 3D Platform Game - Space Adventure
class PlatformGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 2;
        
        // Game objects
        this.player = null;
        this.platforms = [];
        this.stars = [];
        this.enemies = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            jump: false
        };
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createPlayer();
        this.generateLevel();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Touch controls
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.left = true;
        });

        document.getElementById('leftBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.left = false;
        });

        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.right = true;
        });

        document.getElementById('rightBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.right = false;
        });

        document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.jump = true;
        });

        document.getElementById('jumpBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.jump = false;
        });

        // Mouse controls for desktop
        document.getElementById('leftBtn').addEventListener('mousedown', () => {
            this.touchControls.left = true;
        });

        document.getElementById('leftBtn').addEventListener('mouseup', () => {
            this.touchControls.left = false;
        });

        document.getElementById('rightBtn').addEventListener('mousedown', () => {
            this.touchControls.right = true;
        });

        document.getElementById('rightBtn').addEventListener('mouseup', () => {
            this.touchControls.right = false;
        });

        document.getElementById('jumpBtn').addEventListener('mousedown', () => {
            this.touchControls.jump = true;
        });

        document.getElementById('jumpBtn').addEventListener('mouseup', () => {
            this.touchControls.jump = false;
        });
    }

    createPlayer() {
        this.player = {
            x: this.canvas.width / 2 - 15,
            y: this.canvas.height - 120, // Place on starting platform
            width: 30,
            height: 30,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 15,
            onGround: true, // Start on ground
            color: '#00d4ff',
            invulnerable: false,
            invulnerabilityTime: 0
        };
    }

    generateLevel() {
        this.platforms = [];
        this.stars = [];
        this.enemies = [];

        // Create platforms - ensure there's a starting platform
        this.platforms.push({
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 100,
            width: 100,
            height: 20,
            color: '#4a4a4a'
        });

        // Create more platforms
        for (let i = 1; i < 8; i++) {
            this.platforms.push({
                x: Math.random() * (this.canvas.width - 100),
                y: this.canvas.height - 150 - (i * 120),
                width: 100 + Math.random() * 100,
                height: 20,
                color: '#4a4a4a'
            });
        }

        // Create stars - place them on platforms
        for (let i = 0; i < 12; i++) {
            const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
            this.stars.push({
                x: platform.x + Math.random() * (platform.width - 15),
                y: platform.y - 20,
                width: 15,
                height: 15,
                collected: false,
                color: '#ffd700',
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Create enemies - place them on platforms
        for (let i = 0; i < 3; i++) {
            const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
            this.enemies.push({
                x: platform.x + Math.random() * (platform.width - 25),
                y: platform.y - 25,
                width: 25,
                height: 25,
                velocityX: (Math.random() - 0.5) * 2,
                color: '#ff6b6b',
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.handleInput();
        this.updatePlayer();
        this.updateEnemies();
        this.updateParticles();
        this.checkCollisions();
        this.updateUI();
    }

    handleInput() {
        // Keyboard input
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchControls.left) {
            this.player.velocityX = -this.player.speed;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchControls.right) {
            this.player.velocityX = this.player.speed;
        } else {
            this.player.velocityX *= 0.8; // Friction
        }

        if ((this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Space'] || this.touchControls.jump) && this.player.onGround) {
            this.player.velocityY = -this.player.jumpPower;
            this.player.onGround = false;
            this.createJumpParticles();
        }
    }

    updatePlayer() {
        // Only update player when game is playing
        if (this.gameState !== 'playing') return;

        // Update invulnerability
        if (this.player.invulnerable) {
            this.player.invulnerabilityTime--;
            if (this.player.invulnerabilityTime <= 0) {
                this.player.invulnerable = false;
            }
        }

        // Apply gravity
        this.player.velocityY += 0.8;

        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // Keep player on screen
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.canvas.width - this.player.width) {
            this.player.x = this.canvas.width - this.player.width;
        }

        // Check if player fell off screen
        if (this.player.y > this.canvas.height) {
            this.loseLife();
        }
    }

    updateEnemies() {
        this.enemies.forEach(enemy => {
            enemy.x += enemy.velocityX;
            
            // Bounce off edges
            if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                enemy.velocityX *= -1;
                enemy.direction *= -1;
            }
        });
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }

    checkCollisions() {
        // Only check collisions when game is playing
        if (this.gameState !== 'playing') return;

        // Platform collisions
        this.player.onGround = false;
        this.platforms.forEach(platform => {
            if (this.isColliding(this.player, platform)) {
                if (this.player.velocityY > 0 && this.player.y < platform.y) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                }
            }
        });

        // Star collisions
        this.stars.forEach(star => {
            if (!star.collected && this.isColliding(this.player, star)) {
                star.collected = true;
                this.score += 10;
                this.createStarParticles(star.x, star.y);
            }
        });

        // Enemy collisions - only check if player is not invulnerable
        if (!this.player.invulnerable) {
            this.enemies.forEach(enemy => {
                if (this.isColliding(this.player, enemy)) {
                    this.loseLife();
                }
            });
        }

        // Check level completion
        if (this.stars.every(star => star.collected)) {
            this.nextLevel();
        }
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    createJumpParticles() {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: Math.random() * 2,
                life: 30,
                maxLife: 30,
                alpha: 1,
                color: '#00d4ff'
            });
        }
    }

    createStarParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 40,
                maxLife: 40,
                alpha: 1,
                color: '#ffd700'
            });
        }
    }

    loseLife() {
        // Only lose life if not already invulnerable
        if (this.player.invulnerable) return;

        this.lives--;
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 120;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.onGround = true;
        
        // Make player invulnerable for 2 seconds after losing life
        this.player.invulnerable = true;
        this.player.invulnerabilityTime = 120; // 2 seconds at 60fps
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    nextLevel() {
        this.level++;
        this.gameSpeed += 0.5;
        this.generateLevel();
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 120;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.onGround = true;
    }

    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverModal').classList.add('active');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 4, 40, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background stars
        this.drawBackgroundStars();

        // Draw platforms
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Add 3D effect
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fillRect(platform.x, platform.y, platform.width, 5);
        });

        // Draw stars
        this.stars.forEach(star => {
            if (!star.collected) {
                star.pulse += 0.1;
                const scale = 1 + Math.sin(star.pulse) * 0.2;
                this.ctx.save();
                this.ctx.translate(star.x + star.width / 2, star.y + star.height / 2);
                this.ctx.scale(scale, scale);
                this.ctx.fillStyle = star.color;
                this.ctx.fillRect(-star.width / 2, -star.height / 2, star.width, star.height);
                this.ctx.restore();
            }
        });

        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Add eyes
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
            this.ctx.fillRect(enemy.x + 15, enemy.y + 5, 5, 5);
        });

        // Draw player with invulnerability effect
        this.ctx.save();
        if (this.player.invulnerable) {
            // Make player flash when invulnerable
            this.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.01);
        }
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Add player details
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.player.x + 8, this.player.y + 8, 5, 5);
        this.ctx.fillRect(this.player.x + 17, this.player.y + 8, 5, 5);
        this.ctx.restore();

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
            this.ctx.restore();
        });
    }

    drawBackgroundStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 23) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.gameState = 'playing';
        document.getElementById('gameOverlay').style.display = 'none';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 2;
        this.generateLevel();
        this.createPlayer();
        
        // Reset player position to starting platform
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 120;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.onGround = true;
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseMenu').classList.add('active');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseMenu').classList.remove('active');
        }
    }

    resume() {
        this.gameState = 'playing';
        document.getElementById('pauseMenu').classList.remove('active');
    }

    restart() {
        this.gameState = 'playing';
        document.getElementById('gameOverModal').classList.remove('active');
        document.getElementById('pauseMenu').classList.remove('active');
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 2;
        this.generateLevel();
        this.createPlayer();
        
        // Reset player position to starting platform
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 120;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.onGround = true;
    }
}

// Global Functions
function startGame() {
    game.start();
}

function restartGame() {
    game.restart();
}

function resumeGame() {
    game.resume();
}

function goBack() {
    window.close();
}

// Initialize Game
const game = new PlatformGame();

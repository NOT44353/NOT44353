// Interactive Skills Showcase - Main Script
class InteractiveShowcase {
    constructor() {
        this.currentSection = 'home';
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.setupNavigation();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupGames();
    }

    // Particle System
    createParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(particle);
        }
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        this.currentSection = sectionId;
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            observer.observe(card);
        });

        // Observe game cards
        document.querySelectorAll('.game-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Skill Bars Animation
    setupSkillBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            const levelFill = card.querySelector('.level-fill');
            const level = levelFill.getAttribute('data-level');
            
            // Animate on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            levelFill.style.width = level + '%';
                        }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(card);
        });
    }

    // Games Setup
    setupGames() {
        // Game cards click handlers
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameType = card.onclick.toString().match(/startGame\('(\w+)'\)/)[1];
                this.startGame(gameType);
            });
        });
    }

    // Start Experience
    startExperience() {
        this.showSection('skills');
        this.createFireworks();
    }

    // Fireworks Effect
    createFireworks() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFirework();
            }, i * 100);
        }
    }

    createFirework() {
        const firework = document.createElement('div');
        firework.style.position = 'fixed';
        firework.style.left = Math.random() * window.innerWidth + 'px';
        firework.style.top = Math.random() * window.innerHeight + 'px';
        firework.style.width = '4px';
        firework.style.height = '4px';
        firework.style.background = '#00d4ff';
        firework.style.borderRadius = '50%';
        firework.style.pointerEvents = 'none';
        firework.style.zIndex = '1000';
        
        document.body.appendChild(firework);

        // Animate firework
        firework.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            firework.remove();
        };
    }

    // Game Functions
    startGame(gameType) {
        const modal = document.getElementById('gameModal');
        const gameArea = document.getElementById('gameArea');
        const gameTitle = document.getElementById('gameTitle');

        modal.classList.add('active');

        switch (gameType) {
            case 'typing':
                this.startTypingGame(gameArea, gameTitle);
                break;
            case 'memory':
                this.startMemoryGame(gameArea, gameTitle);
                break;
            case 'puzzle':
                this.startPuzzleGame(gameArea, gameTitle);
                break;
        }
    }

    startTypingGame(container, title) {
        title.textContent = 'Code Typing Challenge';
        container.innerHTML = `
            <div class="typing-game">
                <div class="game-info">
                    <div class="score">Score: <span id="score">0</span></div>
                    <div class="time">Time: <span id="time">60</span>s</div>
                </div>
                <div class="code-display">
                    <div id="codeText">const hello = "Hello World";</div>
                </div>
                <div class="input-area">
                    <input type="text" id="codeInput" placeholder="Type the code above...">
                </div>
                <div class="progress">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
            </div>
        `;

        this.initTypingGame();
    }

    initTypingGame() {
        const codeInput = document.getElementById('codeInput');
        const codeText = document.getElementById('codeText');
        const scoreElement = document.getElementById('score');
        const timeElement = document.getElementById('time');
        const progressBar = document.getElementById('progressBar');

        let score = 0;
        let timeLeft = 60;
        let currentCode = codeText.textContent;
        let codeIndex = 0;

        const codes = [
            'const hello = "Hello World";',
            'function add(a, b) { return a + b; }',
            'const arr = [1, 2, 3, 4, 5];',
            'if (condition) { console.log("true"); }',
            'const obj = { name: "John", age: 30 };'
        ];

        const timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.endTypingGame(score);
            }
        }, 1000);

        codeInput.addEventListener('input', (e) => {
            const input = e.target.value;
            if (input === currentCode) {
                score += 10;
                scoreElement.textContent = score;
                codeIndex = (codeIndex + 1) % codes.length;
                currentCode = codes[codeIndex];
                codeText.textContent = currentCode;
                codeInput.value = '';
                progressBar.style.width = '0%';
            } else {
                const progress = (input.length / currentCode.length) * 100;
                progressBar.style.width = progress + '%';
            }
        });

        codeInput.focus();
    }

    startMemoryGame(container, title) {
        title.textContent = 'Memory Card Game';
        container.innerHTML = `
            <div class="memory-game">
                <div class="game-info">
                    <div class="moves">Moves: <span id="moves">0</span></div>
                    <div class="matches">Matches: <span id="matches">0</span>/8</div>
                </div>
                <div class="memory-grid" id="memoryGrid"></div>
            </div>
        `;

        this.initMemoryGame();
    }

    initMemoryGame() {
        const grid = document.getElementById('memoryGrid');
        const movesElement = document.getElementById('moves');
        const matchesElement = document.getElementById('matches');

        const symbols = ['⚡', '🔥', '💎', '🚀', '⭐', '🎯', '💡', '🎨'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

        let moves = 0;
        let matches = 0;
        let flippedCards = [];
        let lockBoard = false;

        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.innerHTML = '<div class="card-back">?</div><div class="card-front">' + symbol + '</div>';
            card.addEventListener('click', () => this.flipCard(card));
            grid.appendChild(card);
        });

        this.flipCard = (card) => {
            if (lockBoard || card.classList.contains('flipped') || flippedCards.length >= 2) return;

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                lockBoard = true;

                if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                    matches++;
                    matchesElement.textContent = matches;
                    flippedCards.forEach(card => card.classList.add('matched'));
                    flippedCards = [];
                    lockBoard = false;

                    if (matches === 8) {
                        setTimeout(() => this.endMemoryGame(moves), 500);
                    }
                } else {
                    setTimeout(() => {
                        flippedCards.forEach(card => card.classList.remove('flipped'));
                        flippedCards = [];
                        lockBoard = false;
                    }, 1000);
                }
            }
        };
    }

    startPuzzleGame(container, title) {
        title.textContent = 'Code Puzzle';
        container.innerHTML = `
            <div class="puzzle-game">
                <div class="puzzle-info">
                    <div class="puzzle-moves">Moves: <span id="puzzleMoves">0</span></div>
                </div>
                <div class="puzzle-container" id="puzzleContainer"></div>
                <div class="puzzle-target">
                    <h4>Target:</h4>
                    <code>if (x > 0) { return x; }</code>
                </div>
            </div>
        `;

        this.initPuzzleGame();
    }

    initPuzzleGame() {
        const container = document.getElementById('puzzleContainer');
        const movesElement = document.getElementById('puzzleMoves');

        const codeBlocks = [
            'if', '(', 'x', '>', '0', ')', '{', 'return', 'x', ';', '}'
        ];

        let moves = 0;
        let shuffledBlocks = [...codeBlocks].sort(() => Math.random() - 0.5);

        shuffledBlocks.forEach((block, index) => {
            const element = document.createElement('div');
            element.className = 'puzzle-block';
            element.textContent = block;
            element.draggable = true;
            element.dataset.index = index;
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
            });
            element.addEventListener('dragover', (e) => e.preventDefault());
            element.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedIndex = e.dataTransfer.getData('text/plain');
                this.swapBlocks(parseInt(draggedIndex), index);
            });
            container.appendChild(element);
        });

        this.swapBlocks = (from, to) => {
            const blocks = container.children;
            const temp = blocks[from].textContent;
            blocks[from].textContent = blocks[to].textContent;
            blocks[to].textContent = temp;
            moves++;
            movesElement.textContent = moves;

            // Check if solved
            const currentOrder = Array.from(blocks).map(block => block.textContent);
            if (currentOrder.join(' ') === codeBlocks.join(' ')) {
                setTimeout(() => this.endPuzzleGame(moves), 500);
            }
        };
    }

    // End Game Functions
    endTypingGame(score) {
        alert(`Typing Game Over! Your score: ${score}`);
        this.closeGame();
    }

    endMemoryGame(moves) {
        alert(`Memory Game Complete! Moves: ${moves}`);
        this.closeGame();
    }

    endPuzzleGame(moves) {
        alert(`Puzzle Solved! Moves: ${moves}`);
        this.closeGame();
    }

    closeGame() {
        document.getElementById('gameModal').classList.remove('active');
    }
}

// Global Functions
function startExperience() {
    showcase.startExperience();
}

function scrollToSection(sectionId) {
    showcase.showSection(sectionId);
}

function playSkillGame(skill) {
    const games = {
        javascript: 'typing',
        react: 'memory',
        python: 'puzzle'
    };
    showcase.startGame(games[skill]);
}

function startGame(gameType) {
    showcase.startGame(gameType);
}

function closeGame() {
    showcase.closeGame();
}

// Project Navigation Functions
function openEcommerce() {
    window.open('ecommerce/index.html', '_blank');
}

function openPlatformGame() {
    window.open('platform-game/index.html', '_blank');
}

function openMobileApp() {
    window.open('mobile-app/index.html', '_blank');
}

// Initialize
const showcase = new InteractiveShowcase();

// Add CSS for games
const gameStyles = `
    .typing-game, .memory-game, .puzzle-game {
        text-align: center;
    }
    
    .game-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 600;
    }
    
    .code-display {
        background: rgba(0, 0, 0, 0.5);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        font-family: 'Courier New', monospace;
        font-size: 1.5rem;
        color: #00d4ff;
    }
    
    .input-area input {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        border: 2px solid #00d4ff;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        text-align: center;
    }
    
    .progress {
        width: 100%;
        height: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        margin-top: 1rem;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #ff6b6b);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .memory-card {
        aspect-ratio: 1;
        background: #333;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.6s;
    }
    
    .memory-card.flipped {
        transform: rotateY(180deg);
    }
    
    .memory-card.matched {
        background: #00d4ff;
    }
    
    .card-back, .card-front {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        backface-visibility: hidden;
    }
    
    .card-front {
        transform: rotateY(180deg);
    }
    
    .puzzle-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 2rem;
    }
    
    .puzzle-block {
        background: #333;
        color: #fff;
        padding: 1rem;
        border-radius: 5px;
        cursor: move;
        user-select: none;
        transition: all 0.3s ease;
    }
    
    .puzzle-block:hover {
        background: #00d4ff;
        color: #000;
    }
    
    .puzzle-target {
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
    }
    
    .puzzle-target code {
        color: #00d4ff;
        font-size: 1.2rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);

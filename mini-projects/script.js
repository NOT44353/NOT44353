// Interactive Skills Showcase - Main Script
class InteractiveShowcase {
    constructor() {
        this.currentSection = 'home';
        this.gameTimer = null;
        this.gameTimeouts = [];
        this.gameEnded = false;
        this.gameSession = 0;
        this.init();
    }

    init() {
        this.detectEmbedded();
        this.createParticles();
        this.setupNavigation();
        this.setupSkillBars();
        this.setupGames();
        this.setupMessaging();
        this.setupGameModal();
    }

    detectEmbedded() {
        if (window.self !== window.top) {
            document.body.classList.add('embedded');
        }
    }

    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const count = document.body.classList.contains('embedded') ? 24 : 50;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
            container.appendChild(particle);
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                this.showSection(href.substring(1));
            });
        });
    }

    setupMessaging() {
        window.addEventListener('message', (event) => {
            if (window.self === window.top) return;
            if (event.origin !== window.location.origin) return;
            if (event.data?.type !== 'portfolio:escape-request') return;

            const gameModal = document.getElementById('gameModal');
            if (gameModal?.classList.contains('active')) {
                this.closeGame();
                window.parent.postMessage({ type: 'mini-projects:escape-consumed' }, '*');
                return;
            }
            window.parent.postMessage({ type: 'mini-projects:escape-pass' }, '*');
        });
    }

    setupGameModal() {
        const modal = document.getElementById('gameModal');
        if (!modal) return;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeGame();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;

            if (modal.classList.contains('active')) {
                e.preventDefault();
                this.closeGame();
                if (window.self !== window.top) {
                    window.parent.postMessage({ type: 'mini-projects:escape-consumed' }, '*');
                }
                return;
            }

            if (window.self !== window.top) {
                window.parent.postMessage({ type: 'mini-projects:escape-pass' }, '*');
            }
        });
    }

    showSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;

        document.querySelectorAll('.section').forEach((section) => {
            section.classList.remove('active');
        });
        target.classList.add('active');

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        this.currentSection = sectionId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupSkillBars() {
        document.querySelectorAll('.skill-card').forEach((card) => {
            const levelFill = card.querySelector('.level-fill');
            if (!levelFill) return;
            const level = levelFill.getAttribute('data-level') || '0';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            levelFill.style.width = `${level}%`;
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            observer.observe(card);
        });
    }

    setupGames() {
        document.querySelectorAll('.project-card').forEach((card) => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    startExperience() {
        this.showSection('skills');
    }

    clearGameTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    clearGameTimeouts() {
        this.gameTimeouts.forEach((id) => clearTimeout(id));
        this.gameTimeouts = [];
    }

    scheduleTimeout(fn, ms) {
        const session = this.gameSession;
        const id = setTimeout(() => {
            if (session !== this.gameSession || this.gameEnded) return;
            fn();
        }, ms);
        this.gameTimeouts.push(id);
        return id;
    }

    resetGameState() {
        this.gameSession += 1;
        this.clearGameTimer();
        this.clearGameTimeouts();
        this.gameEnded = false;
    }

    isGameOpen() {
        return document.getElementById('gameModal')?.classList.contains('active') ?? false;
    }

    startGame(gameType) {
        const modal = document.getElementById('gameModal');
        const gameArea = document.getElementById('gameArea');
        const gameTitle = document.getElementById('gameTitle');
        if (!modal || !gameArea || !gameTitle) return;

        this.resetGameState();
        gameArea.innerHTML = '';
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
            default:
                this.closeGame();
        }
    }

    showGameResult(message, detail) {
        if (!this.isGameOpen()) return;
        const gameArea = document.getElementById('gameArea');
        if (!gameArea) return;
        gameArea.innerHTML = `
            <div class="game-result">
                <div class="game-result-icon"><i class="fas fa-trophy"></i></div>
                <h4>${message}</h4>
                <p>${detail}</p>
                <button class="btn btn-primary game-retry-btn" type="button">Play Again</button>
            </div>
        `;
        const retryBtn = gameArea.querySelector('.game-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.closeGame());
        }
    }

    startTypingGame(container, title) {
        title.textContent = 'Code Typing Challenge';
        container.innerHTML = `
            <div class="typing-game">
                <div class="game-info">
                    <div class="score">Score: <span id="score">0</span></div>
                    <div class="time">Time: <span id="time">45</span>s</div>
                </div>
                <div class="code-display" id="codeText"></div>
                <div class="input-area">
                    <input type="text" id="codeInput" placeholder="Type exactly as shown..." autocomplete="off" spellcheck="false">
                </div>
                <div class="progress"><div class="progress-bar" id="progressBar"></div></div>
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
        if (!codeInput || !codeText || !scoreElement || !timeElement || !progressBar) return;

        const codes = [
            'const hello = "Hello World";',
            'function add(a, b) { return a + b; }',
            'const arr = [1, 2, 3, 4, 5];',
            'if (condition) { console.log("true"); }',
            'const obj = { name: "John", age: 30 };'
        ];

        let score = 0;
        let timeLeft = 45;
        let codeIndex = 0;
        let currentCode = codes[codeIndex];

        const renderCode = () => {
            codeText.textContent = currentCode;
        };
        renderCode();

        const finish = () => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            this.clearGameTimer();
            this.showGameResult('Typing Complete!', `Your score: ${score}`);
        };

        this.gameTimer = setInterval(() => {
            if (this.gameEnded || !this.isGameOpen()) return;
            timeLeft -= 1;
            timeElement.textContent = timeLeft;
            if (timeLeft <= 0) finish();
        }, 1000);

        codeInput.addEventListener('input', () => {
            if (this.gameEnded || !this.isGameOpen()) return;
            const input = codeInput.value;

            if (!currentCode.startsWith(input)) {
                codeInput.classList.add('input-error');
                this.scheduleTimeout(() => codeInput.classList.remove('input-error'), 180);
                codeInput.value = input.slice(0, -1);
                return;
            }

            progressBar.style.width = `${Math.min((input.length / currentCode.length) * 100, 100)}%`;

            if (input === currentCode) {
                score += 10;
                scoreElement.textContent = score;
                codeIndex = (codeIndex + 1) % codes.length;
                currentCode = codes[codeIndex];
                codeInput.value = '';
                progressBar.style.width = '0%';
                renderCode();
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
        if (!grid || !movesElement || !matchesElement) return;

        const symbols = ['⚡', '🔥', '💎', '🚀', '⭐', '🎯', '💡', '🎨'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

        let moves = 0;
        let matches = 0;
        let flippedCards = [];
        let lockBoard = false;

        const finish = (finalMoves) => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            lockBoard = true;
            this.showGameResult('Memory Cleared!', `Finished in ${finalMoves} moves`);
        };

        const flipCard = (card) => {
            if (this.gameEnded || lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
                return;
            }

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves += 1;
                movesElement.textContent = moves;
                lockBoard = true;

                const [first, second] = flippedCards;
                if (first.dataset.symbol === second.dataset.symbol) {
                    first.classList.add('matched');
                    second.classList.add('matched');
                    matches += 1;
                    matchesElement.textContent = matches;
                    flippedCards = [];
                    lockBoard = false;

                    if (matches === 8) {
                        this.scheduleTimeout(() => finish(moves), 400);
                    }
                } else {
                    this.scheduleTimeout(() => {
                        first.classList.remove('flipped');
                        second.classList.remove('flipped');
                        flippedCards = [];
                        lockBoard = false;
                    }, 700);
                }
            }
        };

        cards.forEach((symbol) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.innerHTML = '<span class="card-back">?</span><span class="card-front">' + symbol + '</span>';
            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });
    }

    startPuzzleGame(container, title) {
        title.textContent = 'Code Puzzle';
        container.innerHTML = `
            <div class="puzzle-game">
                <p class="puzzle-hint">Tap two blocks to swap their positions</p>
                <div class="game-info">
                    <div class="puzzle-moves">Moves: <span id="puzzleMoves">0</span></div>
                </div>
                <div class="puzzle-container" id="puzzleContainer"></div>
                <div class="puzzle-target">
                    <h4>Target:</h4>
                    <code>if ( x > 0 ) { return x ; }</code>
                </div>
            </div>
        `;
        this.initPuzzleGame();
    }

    initPuzzleGame() {
        const container = document.getElementById('puzzleContainer');
        const movesElement = document.getElementById('puzzleMoves');
        if (!container || !movesElement) return;

        const target = ['if', '(', 'x', '>', '0', ')', '{', 'return', 'x', ';', '}'];
        let blocks = [...target];
        do {
            blocks.sort(() => Math.random() - 0.5);
        } while (blocks.join(' ') === target.join(' '));
        let moves = 0;
        let selected = null;

        const finish = (finalMoves) => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            this.showGameResult('Puzzle Solved!', `Completed in ${finalMoves} moves`);
        };

        const render = () => {
            container.innerHTML = '';
            blocks.forEach((text, index) => {
                const element = document.createElement('button');
                element.type = 'button';
                element.className = 'puzzle-block';
                element.textContent = text;
                element.dataset.index = String(index);
                if (selected === index) element.classList.add('selected');

                element.addEventListener('click', () => {
                    if (this.gameEnded) return;

                    if (selected === null) {
                        selected = index;
                        render();
                        return;
                    }

                    if (selected === index) {
                        selected = null;
                        render();
                        return;
                    }

                    const next = [...blocks];
                    [next[selected], next[index]] = [next[index], next[selected]];
                    blocks = next;
                    moves += 1;
                    movesElement.textContent = moves;
                    selected = null;
                    render();

                    if (blocks.join(' ') === target.join(' ')) {
                        this.scheduleTimeout(() => finish(moves), 300);
                    }
                });

                container.appendChild(element);
            });
        };

        render();
    }

    closeGame() {
        this.gameSession += 1;
        this.gameEnded = true;
        this.clearGameTimer();
        this.clearGameTimeouts();
        const modal = document.getElementById('gameModal');
        const gameArea = document.getElementById('gameArea');
        if (gameArea) gameArea.innerHTML = '';
        if (modal) modal.classList.remove('active');
    }
}

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
    const gameType = games[skill];
    if (!gameType) return;
    showcase.startGame(gameType);
}

function startGame(gameType) {
    showcase.startGame(gameType);
}

function closeGame() {
    showcase.closeGame();
}

function openDemo(path) {
    const url = path.startsWith('/') ? path : `/mini-projects/${path}/`;
    window.location.assign(url);
}

function openEcommerce() {
    openDemo('/mini-projects/ecommerce/');
}

function openPlatformGame() {
    openDemo('/mini-projects/platform-game/');
}

function openMobileApp() {
    openDemo('/mini-projects/mobile-app/');
}

const showcase = new InteractiveShowcase();

const gameStyles = `
    .typing-game, .memory-game, .puzzle-game { text-align: center; }
    .game-info {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.2rem;
        font-size: 1rem;
        font-weight: 600;
    }
    .code-display {
        background: rgba(0, 0, 0, 0.45);
        padding: 1.2rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        font-family: 'Courier New', monospace;
        font-size: clamp(0.85rem, 2.5vw, 1.2rem);
        color: #5ec8f5;
        word-break: break-word;
    }
    .input-area input {
        width: 100%;
        padding: 0.85rem 1rem;
        font-size: 1rem;
        border: 2px solid #2ca7e0;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.45);
        color: #fff;
        text-align: center;
        outline: none;
    }
    .input-area input.input-error {
        border-color: #ff6b6b;
        animation: inputShake 0.18s ease;
    }
    @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(4px); }
    }
    .progress {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        margin-top: 0.8rem;
        overflow: hidden;
    }
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #2ca7e0, #5ec8f5);
        width: 0%;
        transition: width 0.2s ease;
    }
    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(56px, 1fr));
        gap: 0.65rem;
        max-width: 360px;
        margin: 0 auto;
    }
    .memory-card {
        aspect-ratio: 1;
        border: none;
        background: transparent;
        border-radius: 10px;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.45s ease;
        padding: 0;
    }
    .memory-card.flipped { transform: rotateY(180deg); }
    .memory-card.matched { pointer-events: none; opacity: 0.85; }
    .card-back, .card-front {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        border-radius: 10px;
        font-size: 1.4rem;
        backface-visibility: hidden;
    }
    .card-back {
        background: #1a3350;
        border: 1px solid rgba(94, 200, 245, 0.35);
        color: #5ec8f5;
    }
    .card-front {
        transform: rotateY(180deg);
        background: #2ca7e0;
        color: #fff;
    }
    .puzzle-hint {
        color: rgba(224, 242, 255, 0.75);
        font-size: 0.9rem;
        margin-bottom: 0.8rem;
    }
    .puzzle-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        justify-content: center;
        margin-bottom: 1rem;
    }
    .puzzle-block {
        border: 1px solid rgba(94, 200, 245, 0.35);
        background: #1a3350;
        color: #fff;
        padding: 0.65rem 0.85rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 0.95rem;
        transition: 0.2s ease;
    }
    .puzzle-block.selected {
        background: #2ca7e0;
        color: #061526;
        box-shadow: 0 0 0 2px rgba(94, 200, 245, 0.6);
    }
    .puzzle-target {
        background: rgba(0, 0, 0, 0.35);
        padding: 0.85rem;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
    }
    .puzzle-target code { color: #5ec8f5; font-size: 0.95rem; }
    .game-result {
        text-align: center;
        padding: 1rem 0.5rem 0.25rem;
    }
    .game-result-icon {
        font-size: 2rem;
        color: #5ec8f5;
        margin-bottom: 0.75rem;
    }
    .game-result h4 {
        font-family: 'Orbitron', sans-serif;
        letter-spacing: 0.06em;
        margin-bottom: 0.5rem;
    }
    .game-result p {
        color: rgba(224, 242, 255, 0.8);
        margin-bottom: 1.2rem;
    }
    .game-retry-btn { margin: 0 auto; }
    body.embedded .memory-grid {
        grid-template-columns: repeat(4, minmax(48px, 1fr));
        gap: 0.45rem;
        max-width: 100%;
    }
    body.embedded .modal-content {
        width: 100%;
        max-height: 88vh;
    }
    body.embedded .modal-body {
        max-height: calc(88vh - 64px);
        overflow-y: auto;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);

// ============================================================================
// THANAPAT ENGINEERING LAB — INTERACTIVE SYSTEMS SANDBOX (DOC // TP-LAB-2026)
// ============================================================================

class InteractiveShowcase {
    constructor() {
        this.currentSection = 'home';
        this.gameTimer = null;
        this.gameTimeouts = [];
        this.gameEnded = false;
        this.gameSession = 0;
        this.simPackets = [];
        this.simMode = 'nominal';
        this.init();
    }

    init() {
        this.detectEmbedded();
        this.initTheme();
        this.setupNavigation();
        this.setupGames();
        this.setupMessaging();
        this.setupGameModal();
        this.initEtlSimulator();
    }

    detectEmbedded() {
        if (window.self !== window.top) {
            document.body.classList.add('embedded');
        }
    }

    initTheme() {
        const saved = localStorage.getItem('cvTheme') || localStorage.getItem('tp_theme') || localStorage.getItem('theme') || 'light';
        this.applyTheme(saved === 'dark' ? 'dark' : 'light');

        const toggleBtn = document.getElementById('labThemeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'light';
                const next = current === 'dark' ? 'light' : 'dark';
                this.applyTheme(next);
                try {
                    localStorage.setItem('cvTheme', next);
                    localStorage.setItem('tp_theme', next);
                    localStorage.setItem('theme', next);
                } catch (_) {}
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('labThemeIcon');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                e.preventDefault();
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

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        this.currentSection = sectionId;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // ========================================================================
    // LIVE ENTERPRISE ETL & TELEMETRY SIMULATOR (SHEET 01)
    // ========================================================================
    initEtlSimulator() {
        const canvas = document.getElementById('etlSimCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const nodes = [
            { id: 'SAP', label: 'SAP B1 MSSQL', sub: 'OWOR / ITT1', x: 0.14, y: 0.5 },
            { id: 'SYNC', label: 'SYNC ENGINE', sub: 'Node.js / .NET 8', x: 0.39, y: 0.5 },
            { id: 'APP', label: 'MANHOUR & EBR', sub: 'Laravel 12 / Next 16', x: 0.65, y: 0.5 },
            { id: 'AWS', label: 'AWS ECS CLOUD', sub: 'Fargate / Aurora', x: 0.88, y: 0.5 }
        ];

        // Spawn baseline packets
        for (let i = 0; i < 8; i++) {
            this.simPackets.push({
                seg: i % 3,
                t: Math.random(),
                speed: 0.008 + Math.random() * 0.006,
                color: i % 2 === 0 ? '#C84B31' : '#1B7A43',
                size: 3.5
            });
        }

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(300, rect.width) * dpr;
            canvas.height = Math.max(160, rect.height) * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            const w = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
            const h = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            ctx.clearRect(0, 0, w, h);

            // Subtle engineering grid
            ctx.strokeStyle = isDark ? 'rgba(236,240,246,0.05)' : 'rgba(20,25,35,0.05)';
            ctx.lineWidth = 1;
            for (let gx = 0; gx < w; gx += 24) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, h);
                ctx.stroke();
            }
            for (let gy = 0; gy < h; gy += 24) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(w, gy);
                ctx.stroke();
            }

            // Draw conduits between nodes
            for (let i = 0; i < nodes.length - 1; i++) {
                const a = nodes[i];
                const b = nodes[i + 1];
                const ax = a.x * w;
                const ay = a.y * h;
                const bx = b.x * w;
                const by = b.y * h;

                ctx.strokeStyle = isDark ? '#3A4659' : '#C5BFB2';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(ax, ay - 6);
                ctx.lineTo(bx, by - 6);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(ax, ay + 6);
                ctx.lineTo(bx, by + 6);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Update & draw packets
            for (let i = this.simPackets.length - 1; i >= 0; i--) {
                const p = this.simPackets[i];
                p.t += p.speed;
                if (p.t >= 1) {
                    if (p.burst) {
                        if (p.seg < 2) {
                            p.seg += 1;
                            p.t = 0;
                        } else {
                            this.simPackets.splice(i, 1);
                            continue;
                        }
                    } else {
                        p.t = 0;
                        p.seg = (p.seg + 1) % 3;
                    }
                }

                const a = nodes[p.seg];
                const b = nodes[p.seg + 1];
                const px = (a.x + (b.x - a.x) * p.t) * w;
                const py = a.y * h + (p.reverse ? 6 : -6);

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(px, py, p.size || 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Node Boxes
            nodes.forEach((n, idx) => {
                const nx = n.x * w;
                const ny = n.y * h;
                const bw = Math.min(108, w * 0.21);
                const bh = 54;

                ctx.fillStyle = isDark ? '#1C2430' : '#FFFFFF';
                ctx.strokeStyle = idx === 1 ? '#C84B31' : (isDark ? '#58677D' : '#141923');
                ctx.lineWidth = idx === 1 ? 2 : 1.5;
                ctx.fillRect(nx - bw / 2, ny - bh / 2, bw, bh);
                ctx.strokeRect(nx - bw / 2, ny - bh / 2, bw, bh);

                // Status dot
                ctx.fillStyle = '#1B7A43';
                ctx.beginPath();
                ctx.arc(nx - bw / 2 + 8, ny - bh / 2 + 9, 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = isDark ? '#ECF0F6' : '#141923';
                ctx.font = '700 9.5px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(n.label, nx, ny - 2);

                ctx.fillStyle = isDark ? '#9BA7B8' : '#687385';
                ctx.font = '500 8px "JetBrains Mono", monospace';
                ctx.fillText(n.sub, nx, ny + 13);
            });

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    triggerSimAction(action) {
        const tpEl = document.getElementById('simThroughput');
        const latEl = document.getElementById('simLatency');
        const qEl = document.getElementById('simQueue');
        const badgeEl = document.getElementById('simHealthBadge');
        const logEl = document.getElementById('simLogOutput');

        const now = new Date().toTimeString().split(' ')[0];
        const appendLog = (tag, cls, text) => {
            if (!logEl) return;
            const div = document.createElement('div');
            div.className = 'log-line';
            div.innerHTML = `[${now}] <span class="${cls}">${tag}</span> ${text}`;
            logEl.appendChild(div);
            logEl.scrollTop = logEl.scrollHeight;
        };

        if (action === 'batch') {
            for (let i = 0; i < 6; i++) {
                this.simPackets.push({
                    seg: 0,
                    t: i * 0.12,
                    speed: 0.018,
                    color: '#C84B31',
                    size: 4.5,
                    burst: true
                });
            }
            if (tpEl) tpEl.textContent = '2,180 tx/min';
            if (latEl) latEl.textContent = '14 ms';
            if (qEl) qEl.textContent = '0 pending';
            if (badgeEl) badgeEl.textContent = 'BATCH COMMITTED';
            appendLog('SYNC', 'log-ok', 'Dispatched SAP B1 OWOR + ITT1 batch (240 rows -> Prisma 7)');
        } else if (action === 'spike') {
            for (let i = 0; i < 10; i++) {
                this.simPackets.push({
                    seg: i % 2,
                    t: Math.random() * 0.5,
                    speed: 0.022,
                    color: '#B45309',
                    size: 4.5,
                    burst: true
                });
            }
            if (tpEl) tpEl.textContent = '4,650 tx/min';
            if (latEl) latEl.textContent = '31 ms (AUTO-SCALE)';
            if (qEl) qEl.textContent = '12 buffered';
            if (badgeEl) badgeEl.textContent = 'ECS SCALING: 4 TASKS';
            appendLog('WARN', 'log-warn', 'High shop-floor concurrency detected -> AWS ECS scaled to 4 tasks');
            setTimeout(() => {
                if (qEl) qEl.textContent = '0 pending';
                if (latEl) latEl.textContent = '17 ms';
                if (badgeEl) badgeEl.textContent = 'HEALTH: 99.98%';
                appendLog('INFO', 'log-ok', 'Queue drained; latency stabilized at 17ms');
            }, 1800);
        } else if (action === 'audit') {
            for (let i = 0; i < 5; i++) {
                this.simPackets.push({
                    seg: 0,
                    t: i * 0.15,
                    speed: 0.016,
                    color: '#1B7A43',
                    size: 4.5,
                    burst: true
                });
            }
            if (badgeEl) badgeEl.textContent = 'GxP HASH VERIFIED';
            appendLog('AUDIT', 'log-ok', 'Pharma GMP 21 CFR Part 11 audit trail verified (SHA-256 intact)');
        }
    }

    // ========================================================================
    // MODAL & DRILL LIFECYCLE
    // ========================================================================
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

    showGameResult(message, detail, gameType) {
        if (!this.isGameOpen()) return;
        const gameArea = document.getElementById('gameArea');
        if (!gameArea) return;
        gameArea.innerHTML = `
            <div class="game-result">
                <div class="game-result-icon"><i class="fas fa-circle-check"></i></div>
                <p class="result-kicker">DIAGNOSTIC VERIFICATION COMPLETE</p>
                <h4>${message}</h4>
                <p>${detail}</p>
                <div class="result-actions">
                    <button class="btn btn-primary game-retry-btn" type="button">Run Drill Again</button>
                    <button class="btn btn-secondary game-close-btn" type="button">Close Window</button>
                </div>
            </div>
        `;
        const retryBtn = gameArea.querySelector('.game-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.startGame(gameType || 'typing'));
        }
        const closeBtn = gameArea.querySelector('.game-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGame());
        }
    }

    // ========================================================================
    // DRILL 01: PRODUCTION CODE BENCHMARK (REAL ENTERPRISE SNIPPETS)
    // ========================================================================
    startTypingGame(container, title) {
        title.textContent = 'DRILL 01 // Production Code Benchmark';
        container.innerHTML = `
            <div class="typing-game">
                <div class="drill-meta-row">
                    <span class="drill-context-tag" id="snippetContext">STACK: NEXT.JS 16 + PRISMA 7 (GMP EBR)</span>
                    <button class="drill-skip-btn" id="skipSnippetBtn" type="button">Next Snippet &rarr;</button>
                </div>
                <div class="game-info">
                    <div class="stat-pill">COMPLETED: <span id="score">0</span>/5</div>
                    <div class="stat-pill">SPEED: <span id="wpmStat">0</span> WPM</div>
                    <div class="stat-pill">ACCURACY: <span id="accStat">100%</span></div>
                    <div class="stat-pill">TIME: <span id="time">60</span>s</div>
                </div>
                <div class="code-display" id="codeText"></div>
                <div class="input-area">
                    <input type="text" id="codeInput" placeholder="Type the production statement above..." autocomplete="off" spellcheck="false">
                </div>
                <div class="progress"><div class="progress-bar" id="progressBar"></div></div>
            </div>
        `;
        this.initTypingGame();
    }

    initTypingGame() {
        const codeInput = document.getElementById('codeInput');
        const codeText = document.getElementById('codeText');
        const contextEl = document.getElementById('snippetContext');
        const scoreElement = document.getElementById('score');
        const wpmElement = document.getElementById('wpmStat');
        const accElement = document.getElementById('accStat');
        const timeElement = document.getElementById('time');
        const progressBar = document.getElementById('progressBar');
        const skipBtn = document.getElementById('skipSnippetBtn');
        if (!codeInput || !codeText || !scoreElement || !timeElement || !progressBar) return;

        const snippets = [
            {
                context: '01/05 // NEXT.JS 16 + PRISMA 7 (GMP EBR AUDIT TRANSACTION)',
                code: 'await prisma.$transaction(async (tx) => tx.ebrBatch.create({ data }));'
            },
            {
                context: '02/05 // LARAVEL 12 + PHP 8.4 (SAP B1 ROUTE STAGE UPSERT)',
                code: "DB::transaction(fn () => RouteStage::upsert($rows, ['doc_entry']));"
            },
            {
                context: '03/05 // ASP.NET CORE 8 WEB API (JWT BEARER MIDDLEWARE)',
                code: 'builder.Services.AddAuthentication().AddJwtBearer();'
            },
            {
                context: '04/05 // MSSQL & POSTGRESQL (PRODUCTION MANHOUR WINDOW QUERY)',
                code: 'SELECT dept_id, SUM(hours) OVER (PARTITION BY dept_id) FROM manhour;'
            },
            {
                context: '05/05 // AWS ECS FARGATE (ZERO-DOWNTIME CONTAINER ROLLOUT)',
                code: 'aws ecs update-service --cluster prod-gmp --force-new-deployment'
            }
        ];

        let completed = 0;
        let timeLeft = 60;
        let codeIndex = 0;
        let totalKeystrokes = 0;
        let validKeystrokes = 0;
        const startTime = Date.now();

        const escapeHtml = (str) =>
            str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const renderCode = (typed = '') => {
            const target = snippets[codeIndex].code;
            if (contextEl) contextEl.textContent = snippets[codeIndex].context;
            const matched = escapeHtml(target.slice(0, typed.length));
            const current = escapeHtml(target.slice(typed.length, typed.length + 1));
            const rest = escapeHtml(target.slice(typed.length + 1));
            codeText.innerHTML = `<span class="char-ok">${matched}</span><span class="char-cursor">${current}</span><span class="char-rest">${rest}</span>`;
        };

        renderCode('');

        const updateTelemetry = () => {
            const elapsedMinutes = Math.max((Date.now() - startTime) / 60000, 0.05);
            const wpm = Math.round((validKeystrokes / 5) / elapsedMinutes);
            const acc = totalKeystrokes > 0 ? Math.round((validKeystrokes / totalKeystrokes) * 100) : 100;
            if (wpmElement) wpmElement.textContent = String(wpm);
            if (accElement) accElement.textContent = `${acc}%`;
            return { wpm, acc };
        };

        const finish = () => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            this.clearGameTimer();
            const stats = updateTelemetry();
            this.showGameResult(
                'Production Code Benchmark Complete',
                `Verified ${completed}/5 production statements · Speed: ${stats.wpm} WPM · Accuracy: ${stats.acc}%`,
                'typing'
            );
        };

        this.gameTimer = setInterval(() => {
            if (this.gameEnded || !this.isGameOpen()) return;
            timeLeft -= 1;
            timeElement.textContent = String(timeLeft);
            updateTelemetry();
            if (timeLeft <= 0) finish();
        }, 1000);

        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                codeIndex = (codeIndex + 1) % snippets.length;
                codeInput.value = '';
                progressBar.style.width = '0%';
                renderCode('');
                codeInput.focus();
            });
        }

        codeInput.addEventListener('input', () => {
            if (this.gameEnded || !this.isGameOpen()) return;
            const currentTarget = snippets[codeIndex].code;
            const input = codeInput.value;
            totalKeystrokes += 1;

            if (!currentTarget.startsWith(input)) {
                codeInput.classList.add('input-error');
                this.scheduleTimeout(() => codeInput.classList.remove('input-error'), 180);
                codeInput.value = input.slice(0, -1);
                updateTelemetry();
                return;
            }

            validKeystrokes += 1;
            updateTelemetry();
            renderCode(input);
            progressBar.style.width = `${Math.min((input.length / currentTarget.length) * 100, 100)}%`;

            if (input === currentTarget) {
                completed += 1;
                scoreElement.textContent = String(completed);
                if (completed >= snippets.length) {
                    finish();
                    return;
                }
                codeIndex = (codeIndex + 1) % snippets.length;
                codeInput.value = '';
                progressBar.style.width = '0%';
                renderCode('');
            }
        });

        codeInput.focus();
    }

    // ========================================================================
    // DRILL 02: SYSTEM ARCHITECTURE PAIRING MATRIX (8 PRODUCTION PAIRS)
    // ========================================================================
    startMemoryGame(container, title) {
        title.textContent = 'DRILL 02 // System Architecture Matrix';
        container.innerHTML = `
            <div class="memory-game">
                <p class="puzzle-hint">Match each enterprise system node with its corresponding architectural counterpart (PAIR 01–08).</p>
                <div class="game-info">
                    <div class="stat-pill">ATTEMPTS: <span id="moves">0</span></div>
                    <div class="stat-pill">LINKED PAIRS: <span id="matches">0</span>/8</div>
                </div>
                <div class="arch-insight-bar" id="archInsightBar">
                    <code>SELECT 2 CARDS TO VERIFY ARCHITECTURAL LINK</code>
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
        const insightBar = document.getElementById('archInsightBar');
        if (!grid || !movesElement || !matchesElement) return;

        const pairs = [
            { id: '01', a: 'SAP B1 OWOR', b: 'Production Order SQL', note: 'ManHour Sync: Bi-directional ETL between SAP B1 OWOR/ITT1 tables and shop-floor web app.' },
            { id: '02', a: 'Cognito PKCE', b: 'OAuth 2.0 JWT Auth', note: 'Enterprise Cloud: Centralized OIDC + PKCE single sign-on across Next.js 16 & internal portals.' },
            { id: '03', a: 'AWS ECS Fargate', b: 'Serverless Container', note: 'Cloud Infra: Zero-downtime containerized deployment behind Application Load Balancer (ALB).' },
            { id: '04', a: 'Prisma 7 ORM', b: 'GxP Audit Trail', note: 'Pharma EBR: Atomic database transactions with immutable field-level audit logging.' },
            { id: '05', a: 'PdfProxy Stream', b: 'E-Leaflet QR Viewer', note: 'E-Leaflet (.NET 8): Secure streaming of patient leaflet PDFs with expiry alerts.' },
            { id: '06', a: 'Android Auto SDK', b: 'MG S5 EV 12.8" Headunit', note: 'Car Share Mirror: Native Kotlin projection over Android Auto protocol at 60fps.' },
            { id: '07', a: 'MQL5 Expert Advisor', b: 'TD Sequential Signal', note: 'TD Master: Automated MetaTrader 5 chart capture and quantitative trading journal.' },
            { id: '08', a: 'CloudFront CDN', b: 'S3 Edge Static Cache', note: 'Corporate Intranet: Low-latency asset delivery paired with S3 presigned document storage.' }
        ];

        const deck = [];
        pairs.forEach((p) => {
            deck.push({ pairId: p.id, label: p.a, role: 'NODE A', note: p.note });
            deck.push({ pairId: p.id, label: p.b, role: 'NODE B', note: p.note });
        });
        deck.sort(() => Math.random() - 0.5);

        let moves = 0;
        let matches = 0;
        let flippedCards = [];
        let lockBoard = false;

        const finish = (finalMoves) => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            lockBoard = true;
            this.showGameResult(
                'Architecture Topology Verified!',
                `All 8 enterprise architecture pairs linked in ${finalMoves} attempts.`,
                'memory'
            );
        };

        const flipCard = (card, item) => {
            if (this.gameEnded || lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
                return;
            }

            card.classList.add('flipped');
            flippedCards.push({ card, item });

            if (flippedCards.length === 2) {
                moves += 1;
                movesElement.textContent = String(moves);
                lockBoard = true;

                const [first, second] = flippedCards;
                if (first.item.pairId === second.item.pairId) {
                    first.card.classList.add('matched');
                    second.card.classList.add('matched');
                    matches += 1;
                    matchesElement.textContent = String(matches);
                    if (insightBar) {
                        insightBar.innerHTML = `<span class="insight-linked">LINKED [PAIR ${first.item.pairId}]:</span> ${first.item.note}`;
                    }
                    flippedCards = [];
                    lockBoard = false;

                    if (matches === pairs.length) {
                        this.scheduleTimeout(() => finish(moves), 500);
                    }
                } else {
                    if (insightBar) {
                        insightBar.innerHTML = `<code>MISMATCH: [PAIR ${first.item.pairId}] ${first.item.label} != [PAIR ${second.item.pairId}] ${second.item.label}</code>`;
                    }
                    this.scheduleTimeout(() => {
                        first.card.classList.remove('flipped');
                        second.card.classList.remove('flipped');
                        flippedCards = [];
                        lockBoard = false;
                    }, 850);
                }
            }
        };

        deck.forEach((item) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'memory-card';
            card.dataset.pairId = item.pairId;
            card.innerHTML = `
                <span class="card-back">
                    <small>ARCH NODE</small>
                    <strong>// ?</strong>
                </span>
                <span class="card-front">
                    <small class="pair-badge">PAIR ${item.pairId}</small>
                    <strong class="pair-label">${item.label}</strong>
                </span>
            `;
            card.addEventListener('click', () => flipCard(card, item));
            grid.appendChild(card);
        });
    }

    // ========================================================================
    // DRILL 03: PIPELINE & QUERY SYNTHESIZER (3 REAL STAGES)
    // ========================================================================
    startPuzzleGame(container, title) {
        title.textContent = 'DRILL 03 // Pipeline & Query Synthesizer';
        container.innerHTML = `
            <div class="puzzle-game">
                <div class="drill-meta-row">
                    <span class="drill-context-tag" id="puzzleStageTag">STAGE 1 OF 3 // SQL AGGREGATION PIPELINE</span>
                    <div class="stat-pill">SWAPS: <span id="puzzleMoves">0</span></div>
                </div>
                <p class="puzzle-hint">Click any two token blocks to swap their positions until the statement matches the production specification below.</p>
                <div class="puzzle-container" id="puzzleContainer"></div>
                <div class="puzzle-target">
                    <h4>TARGET PRODUCTION SPECIFICATION:</h4>
                    <code id="puzzleTargetCode"></code>
                </div>
            </div>
        `;
        this.initPuzzleGame();
    }

    initPuzzleGame() {
        const container = document.getElementById('puzzleContainer');
        const movesElement = document.getElementById('puzzleMoves');
        const targetCodeEl = document.getElementById('puzzleTargetCode');
        const stageTagEl = document.getElementById('puzzleStageTag');
        if (!container || !movesElement || !targetCodeEl) return;

        const stages = [
            {
                title: 'STAGE 1 OF 3 // SAP B1 MANHOUR SQL AGGREGATION',
                tokens: ['SELECT', 'dept_id,', 'SUM(hours)', 'FROM', 'route_stages', 'WHERE', "status = 'ACTIVE'", 'GROUP BY', 'dept_id;']
            },
            {
                title: 'STAGE 2 OF 3 // PRISMA 7 ATOMIC TRANSACTION',
                tokens: ['await', 'prisma.$transaction(', 'async (tx) =>', '{', 'return', 'tx.ebrBatch.create({', 'data', '});', '});']
            },
            {
                title: 'STAGE 3 OF 3 // AWS ECS FARGATE ZERO-DOWNTIME DEPLOY',
                tokens: ['aws', 'ecs', 'update-service', '--cluster', 'prod-gmp', '--service', 'ebr-web', '--force-new-deployment']
            }
        ];

        let stageIdx = 0;
        let moves = 0;
        let selected = null;
        let blocks = [];

        const loadStage = () => {
            const stage = stages[stageIdx];
            if (stageTagEl) stageTagEl.textContent = stage.title;
            targetCodeEl.textContent = stage.tokens.join(' ');
            blocks = [...stage.tokens];
            do {
                blocks.sort(() => Math.random() - 0.5);
            } while (blocks.join(' ') === stage.tokens.join(' '));
            selected = null;
            render();
        };

        const finish = (finalMoves) => {
            if (this.gameEnded) return;
            this.gameEnded = true;
            this.showGameResult(
                'All 3 Production Pipelines Synthesized!',
                `Completed SQL, Prisma 7 Transaction, and AWS ECS CLI synthesis in ${finalMoves} swaps.`,
                'puzzle'
            );
        };

        const render = () => {
            const targetTokens = stages[stageIdx].tokens;
            container.innerHTML = '';
            blocks.forEach((text, index) => {
                const element = document.createElement('button');
                element.type = 'button';
                const isCorrectSpot = text === targetTokens[index];
                element.className = 'puzzle-block' +
                    (selected === index ? ' selected' : '') +
                    (isCorrectSpot ? ' token-aligned' : '');
                element.textContent = text;

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
                    movesElement.textContent = String(moves);
                    selected = null;
                    render();

                    if (blocks.join(' ') === targetTokens.join(' ')) {
                        if (stageIdx + 1 < stages.length) {
                            stageIdx += 1;
                            this.scheduleTimeout(() => loadStage(), 380);
                        } else {
                            this.scheduleTimeout(() => finish(moves), 350);
                        }
                    }
                });

                container.appendChild(element);
            });
        };

        loadStage();
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

// Global hooks preserved for HTML attributes & parent portfolio modal integration
function startExperience() {
    showcase.startExperience();
}

function scrollToSection(sectionId) {
    showcase.showSection(sectionId);
}

function triggerSimAction(action) {
    showcase.triggerSimAction(action);
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
    window.location.assign(path);
}

function openEcommerce() {
    openDemo('./ecommerce/index.html');
}

function openPlatformGame() {
    openDemo('./platform-game/index.html');
}

function openMobileApp() {
    openDemo('./mobile-app/index.html');
}

const showcase = new InteractiveShowcase();

// Injected Engineering Drill Styles
const gameStyles = `
    .typing-game, .memory-game, .puzzle-game { text-align: left; }
    .drill-meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.85rem;
        padding-bottom: 0.65rem;
        border-bottom: 1px solid var(--border-hairline);
    }
    .drill-context-tag {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--accent-primary);
        letter-spacing: 0.06em;
    }
    .drill-skip-btn {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.35rem 0.7rem;
        background: var(--bg-sheet);
        color: var(--ink-primary);
        border: 1px solid var(--border-hairline);
        cursor: pointer;
    }
    .drill-skip-btn:hover {
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }
    .game-info {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .stat-pill {
        font-family: var(--font-mono);
        font-size: 0.74rem;
        font-weight: 600;
        padding: 0.35rem 0.65rem;
        background: var(--bg-sheet);
        border: 1px solid var(--border-hairline);
        color: var(--ink-secondary);
    }
    .stat-pill span {
        color: var(--ink-primary);
        font-weight: 700;
    }
    .code-display {
        background: var(--bg-code);
        color: #DCE4F0;
        padding: 1.15rem 1.25rem;
        border: 1px solid var(--border-strong);
        margin-bottom: 0.9rem;
        font-family: var(--font-mono);
        font-size: clamp(0.82rem, 1.8vw, 1rem);
        line-height: 1.6;
        word-break: break-all;
    }
    .char-ok { color: #3FB950; font-weight: 700; }
    .char-cursor {
        background: #C84B31;
        color: #FFFFFF;
        padding: 0 1px;
    }
    .char-rest { color: #8B97A8; }
    .input-area input {
        width: 100%;
        padding: 0.85rem 1rem;
        font-family: var(--font-mono);
        font-size: 0.92rem;
        border: 2px solid var(--border-strong);
        background: var(--bg-elevated);
        color: var(--ink-primary);
        outline: none;
    }
    .input-area input:focus {
        border-color: var(--accent-primary);
    }
    .input-area input.input-error {
        border-color: #DC2626;
        animation: inputShake 0.16s ease;
    }
    @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(4px); }
    }
    .progress {
        width: 100%;
        height: 6px;
        background: var(--bg-sheet);
        border: 1px solid var(--border-hairline);
        margin-top: 0.75rem;
        overflow: hidden;
    }
    .progress-bar {
        height: 100%;
        background: var(--accent-emerald);
        width: 0%;
        transition: width 0.15s ease;
    }
    .arch-insight-bar {
        padding: 0.65rem 0.85rem;
        background: var(--bg-sheet);
        border: 1px solid var(--border-hairline);
        border-left: 3px solid var(--accent-primary);
        margin-bottom: 1rem;
        font-size: 0.82rem;
        color: var(--ink-secondary);
    }
    .insight-linked {
        font-family: var(--font-mono);
        font-weight: 700;
        color: var(--accent-emerald);
    }
    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(110px, 1fr));
        gap: 0.6rem;
    }
    .memory-card {
        min-height: 78px;
        border: none;
        background: transparent;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.35s ease;
        padding: 0;
    }
    .memory-card.flipped { transform: rotateY(180deg); }
    .memory-card.matched .card-front {
        border-color: var(--accent-emerald);
        background: rgba(27, 122, 67, 0.1);
    }
    .card-back, .card-front {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        text-align: center;
        backface-visibility: hidden;
        border: 1px solid var(--border-strong);
    }
    .card-back {
        background: var(--bg-sheet);
        color: var(--ink-secondary);
        font-family: var(--font-mono);
    }
    .card-back small { font-size: 0.6rem; letter-spacing: 0.08em; color: var(--ink-muted); }
    .card-back strong { font-size: 0.95rem; color: var(--ink-primary); margin-top: 0.15rem; }
    .card-front {
        transform: rotateY(180deg);
        background: var(--bg-elevated);
        color: var(--ink-primary);
        border: 2px solid var(--accent-primary);
    }
    .pair-badge {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        font-weight: 700;
        color: var(--accent-primary);
        letter-spacing: 0.06em;
        margin-bottom: 0.2rem;
    }
    .pair-label {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        line-height: 1.25;
        color: var(--ink-primary);
    }
    .puzzle-hint {
        color: var(--ink-secondary);
        font-size: 0.88rem;
        margin-bottom: 0.85rem;
    }
    .puzzle-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        padding: 1rem;
        background: var(--bg-sheet);
        border: 1px solid var(--border-hairline);
        margin-bottom: 1rem;
    }
    .puzzle-block {
        border: 1px solid var(--border-strong);
        background: var(--bg-elevated);
        color: var(--ink-primary);
        padding: 0.55rem 0.8rem;
        cursor: pointer;
        font-family: var(--font-mono);
        font-size: 0.84rem;
        font-weight: 600;
        transition: all 0.15s ease;
    }
    .puzzle-block.token-aligned {
        border-color: var(--accent-emerald);
        color: var(--accent-emerald);
    }
    .puzzle-block.selected {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: #FFFFFF;
    }
    .puzzle-target {
        background: var(--bg-code);
        color: #DCE4F0;
        padding: 0.9rem 1.1rem;
        border: 1px solid var(--border-strong);
        font-family: var(--font-mono);
    }
    .puzzle-target h4 {
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        color: #8B97A8;
        margin-bottom: 0.35rem;
    }
    .puzzle-target code { color: #3FB950; font-size: 0.86rem; }
    .game-result {
        text-align: center;
        padding: 1.5rem 1rem;
    }
    .game-result-icon {
        font-size: 2.2rem;
        color: var(--accent-emerald);
        margin-bottom: 0.5rem;
    }
    .result-kicker {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--accent-primary);
        margin-bottom: 0.35rem;
    }
    .game-result h4 {
        font-family: var(--font-display);
        font-size: 1.35rem;
        margin-bottom: 0.45rem;
    }
    .game-result p {
        color: var(--ink-secondary);
        margin-bottom: 1.25rem;
    }
    .result-actions {
        display: flex;
        justify-content: center;
        gap: 0.65rem;
        flex-wrap: wrap;
    }
    @media (max-width: 640px) {
        .memory-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);

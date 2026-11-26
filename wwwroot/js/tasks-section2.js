/**
 * RhythmCode / Püskül - Section 2 (Tasks 11 - 20) Interactive Engine Module
 * Extends TaskEngine with advanced algorithmic concepts:
 * 11: Repeat Loop (Square)
 * 12: Nested Loops (Star Pattern)
 * 13: Conditional Sensor (If/Else Traffic)
 * 14: Variables (Step Counter)
 * 15: Debugging (Bug Hunt & Code Repair)
 * 16: Functions (Reusable Dance Method)
 * 17: Parameters (Color & Speed Arguments)
 * 18: Queue / Array Stack (Order Execution)
 * 19: Event Listeners (Keyboard / Arrow Controls)
 * 20: Master Loop (Crystal Temple Symphony)
 */

(function () {
    if (typeof TaskEngine === 'undefined') {
        console.warn('TaskEngine must be loaded before tasks-section2.js');
        return;
    }

    const originalInitTaskState = TaskEngine.prototype._initTaskState;
    const originalSetupEvents = TaskEngine.prototype._setupEvents;
    const originalHandlePointerDown = TaskEngine.prototype.handlePointerDown;
    const originalHandlePointerMove = TaskEngine.prototype.handlePointerMove;
    const originalHandlePointerUp = TaskEngine.prototype.handlePointerUp;
    const originalLoop = TaskEngine.prototype.loop;

    // Extend Event Setup for Task 19 Keyboard Controls
    TaskEngine.prototype._setupEvents = function () {
        originalSetupEvents.call(this);

        if (this.taskId === 19) {
            this._keyHandler = (e) => {
                if (this.isCompleted) return;
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    this.movePuskul('up');
                } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    this.movePuskul('down');
                } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.movePuskul('left');
                } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.movePuskul('right');
                }
            };
            window.addEventListener('keydown', this._keyHandler);
        }
    };

    // Extend _initTaskState
    TaskEngine.prototype._initTaskState = function () {
        if (this.taskId <= 10) {
            return originalInitTaskState.call(this);
        }

        switch (this.taskId) {
            case 11:
                // Task 11: Döngü ile Geometrik Kare
                this.state = {
                    corners: [
                        { x: 220, y: 100 },
                        { x: 420, y: 100 },
                        { x: 420, y: 260 },
                        { x: 220, y: 260 }
                    ],
                    puskulPos: { x: 220, y: 100 },
                    drawnLines: [],
                    currentEdge: 0,
                    progress: 0,
                    isRunning: false,
                    notes: ['Do', 'Re', 'Mi', 'Sol']
                };
                this._updateHUD("4 adımlı döngüyü çalıştırmak için 'Döngüyü Başlat' butonuna tıkla.");
                break;

            case 12:
                // Task 12: İç İçe Yıldız Deseni (Nested Loops)
                this.state = {
                    cx: this.width / 2,
                    cy: this.height / 2,
                    points: 5,
                    outerR: 110,
                    innerR: 50,
                    puskulPos: { x: this.width / 2, y: this.height / 2 - 110 },
                    angle: 0,
                    currentCorner: 0,
                    drawnTrail: [],
                    isRunning: false,
                    sparkleCount: 0
                };
                this._updateHUD("Yıldız döngüsünü başlat; her köşede Püskül minik bir ışıltı çemberi döner.");
                break;

            case 13:
                // Task 13: Koşullu Kapı (Sensör Algısı / If-Else)
                this.state = {
                    puskulX: 120,
                    puskulY: 180,
                    trafficLightColor: 'red', // red or green
                    doorOpen: false,
                    sensorActive: false,
                    targetX: 520
                };
                this._updateHUD("Işık kırmızı! 'Yeşil Işık' butonuna basarak sensörün kapıyı açmasını sağla.");
                break;

            case 14:
                // Task 14: Adım Sayacı Değişkeni
                this.state = {
                    counter: 0,
                    targetCount: 5,
                    energyFill: 0,
                    bubbles: []
                };
                this._updateHUD("Enerji butonuna tıklayarak sayacı tam 5 yap!");
                break;

            case 15:
                // Task 15: Bozuk Kodu Onar (Bug Hunting)
                this.state = {
                    blocks: [
                        { id: 1, text: 'İleri Git', correct: true, icon: '⬆️' },
                        { id: 2, text: 'Sola Dön', correct: false, fixedText: 'Sağa Dön', icon: '🔄', isFixed: false },
                        { id: 3, text: 'İleri Git', correct: true, icon: '⬆️' }
                    ],
                    puskulX: 150,
                    puskulY: 240,
                    targetStar: { x: 480, y: 120 },
                    testRunning: false
                };
                this._updateHUD("Kırmızı işaretli hatalı bloğa tıkla ve yönü düzelt!");
                break;

            case 16:
                // Task 16: Müzikal Fonksiyon Bloğu
                this.state = {
                    functionName: 'DansEt()',
                    steps: ['Zıpla', 'Dön', 'Işılda'],
                    currentStepIndex: -1,
                    puskulY: 190,
                    puskulAngle: 0,
                    isRunning: false
                };
                this._updateHUD("'DansEt()' fonksiyon butonuna tıkla ve hazır bloğu tek seferde çalıştır.");
                break;

            case 17:
                // Task 17: Parametreli Fonksiyon
                this.state = {
                    selectedColor: '#3B82F6',
                    selectedSpeed: 'normal',
                    puskulX: 160,
                    puskulY: 180,
                    animating: false,
                    targetX: 480
                };
                this._updateHUD("Renk parametresini seç ve 'Uygula' butonuna bas.");
                break;

            case 18:
                // Task 18: Kuyruk & Dizi Hafızası (Queue / Array)
                this.state = {
                    queue: [],
                    maxQueue: 3,
                    gridX: 1,
                    gridY: 2,
                    targetGridX: 3,
                    targetGridY: 1,
                    executing: false
                };
                this._updateHUD("Yön butonlarıyla 3 komutluk kuyruk oluştur, sonra 'Yürüt'e bas.");
                break;

            case 19:
                // Task 19: Olay Dinleyicisi (Klavye & Ok Tuşları)
                this.state = {
                    puskul: { x: 140, y: 180, radius: 24 },
                    stars: [
                        { x: 300, y: 120, collected: false },
                        { x: 420, y: 220, collected: false },
                        { x: 520, y: 140, collected: false }
                    ]
                };
                this._updateHUD("Ok tuşlarıyla Püskül'ü yönlendir ve 3 yıldızı topla!");
                break;

            case 20:
                // Task 20: Bölüm Sonu Ustalık Görevi (Master Loop)
                this.state = {
                    crystals: [
                        { x: 200, y: 110, color: '#3B82F6', note: 'Do', lit: false },
                        { x: 440, y: 110, color: '#10B981', note: 'Mi', lit: false },
                        { x: 440, y: 250, color: '#F59E0B', note: 'Sol', lit: false },
                        { x: 200, y: 250, color: '#EC4899', note: 'La', lit: false }
                    ],
                    activeCrystal: -1,
                    isRunning: false
                };
                this._updateHUD("2. Bölüm Ustalık Kupası için 'Kristal Senfoniyi Başlat' butonuna bas!");
                break;
        }
    };

    // Extend Pointer Down
    TaskEngine.prototype.handlePointerDown = function (pos) {
        if (this.taskId <= 10) {
            return originalHandlePointerDown.call(this, pos);
        }

        if (window.RhythmMixer) window.RhythmMixer.ensureContext();

        switch (this.taskId) {
            case 14:
                // Click on energy orb
                const dist14 = Math.hypot(pos.x - this.width / 2, pos.y - this.height / 2);
                if (dist14 < 75) {
                    this.incrementCounter();
                }
                break;

            case 15:
                // Click on buggy block
                const blockY = 160;
                if (pos.x >= 230 && pos.x <= 410 && pos.y >= blockY && pos.y <= blockY + 45) {
                    this.fixBuggyBlock();
                }
                break;

            case 19:
                // Click on canvas to move towards pointer
                const dx = pos.x - this.state.puskul.x;
                const dy = pos.y - this.state.puskul.y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.movePuskul(dx > 0 ? 'right' : 'left');
                } else {
                    this.movePuskul(dy > 0 ? 'down' : 'up');
                }
                break;
        }
    };

    // ========================================================
    // SECTION 2 CUSTOM ACTION METHODS
    // ========================================================

    // Task 11: Run Square Loop
    TaskEngine.prototype.runSquareLoop = function () {
        if (this.state.isRunning || this.isCompleted) return;
        this.state.isRunning = true;
        this.state.currentEdge = 0;
        this.state.progress = 0;
        this.state.drawnLines = [];

        const corners = this.state.corners;
        let edge = 0;

        const advanceEdge = () => {
            if (edge >= 4) {
                this.state.isRunning = false;
                window.RhythmMixer.playSuccess();
                this._updateHUD("Kare tamamlandı! 4 adımlı döngü başarıyla çalıştı 🔄");
                this.triggerComplete();
                return;
            }

            const start = corners[edge];
            const end = corners[(edge + 1) % 4];
            this.state.currentEdge = edge;

            window.RhythmMixer.playNote(this.state.notes[edge], 0.35, 'triangle');
            this.particles.burst(start.x, start.y, 16);

            let t = 0;
            const stepAnim = () => {
                t += 0.05;
                if (t >= 1) {
                    this.state.puskulPos = { x: end.x, y: end.y };
                    this.state.drawnLines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
                    edge++;
                    setTimeout(advanceEdge, 200);
                } else {
                    this.state.puskulPos = {
                        x: start.x + (end.x - start.x) * t,
                        y: start.y + (end.y - start.y) * t
                    };
                    requestAnimationFrame(stepAnim);
                }
            };
            stepAnim();
        };

        advanceEdge();
    };

    // Task 12: Run Nested Star Loop
    TaskEngine.prototype.runStarLoop = function () {
        if (this.state.isRunning || this.isCompleted) return;
        this.state.isRunning = true;
        this.state.drawnTrail = [];

        const totalSteps = 5;
        let step = 0;
        const cx = this.state.cx;
        const cy = this.state.cy;
        const R = this.state.outerR;

        const nextCorner = () => {
            if (step >= totalSteps) {
                this.state.isRunning = false;
                window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.8);
                this._updateHUD("İç içe yıldız deseni tamamlandı! ⭐");
                this.triggerComplete();
                return;
            }

            // Star angle (stepping by 2 points)
            const angle = (step * (4 * Math.PI / totalSteps)) - (Math.PI / 2);
            const targetX = cx + Math.cos(angle) * R;
            const targetY = cy + Math.sin(angle) * R;

            const startX = this.state.puskulPos.x;
            const startY = this.state.puskulPos.y;

            window.RhythmMixer.playSparkle();
            window.RhythmMixer.playNote(260 + step * 60, 0.3, 'sine');

            let t = 0;
            const anim = () => {
                t += 0.06;
                if (t >= 1) {
                    this.state.puskulPos = { x: targetX, y: targetY };
                    this.state.drawnTrail.push({ x1: startX, y1: startY, x2: targetX, y2: targetY });
                    this.particles.burst(targetX, targetY, 20);
                    step++;
                    setTimeout(nextCorner, 180);
                } else {
                    this.state.puskulPos = {
                        x: startX + (targetX - startX) * t,
                        y: startY + (targetY - startY) * t
                    };
                    requestAnimationFrame(anim);
                }
            };
            anim();
        };

        nextCorner();
    };

    // Task 13: Traffic Light Green
    TaskEngine.prototype.setTrafficGreen = function () {
        if (this.state.doorOpen || this.isCompleted) return;
        this.state.trafficLightColor = 'green';
        this.state.doorOpen = true;

        window.RhythmMixer.playNote('Sol', 0.4, 'triangle');
        window.RhythmMixer.playSparkle();
        this._updateHUD("Sensör: YEŞİL algılandı! Kapı açıldı, Püskül geçiyor...");

        // Püskül moves across door
        let currentX = this.state.puskulX;
        const move = () => {
            if (currentX < this.state.targetX) {
                currentX += 5;
                this.state.puskulX = currentX;
                requestAnimationFrame(move);
            } else {
                window.RhythmMixer.playSuccess();
                this._updateHUD("Koşullu geçiş başarıyla tamamlandı! 🚦🎉");
                this.triggerComplete();
            }
        };
        setTimeout(move, 300);
    };

    // Task 14: Step Counter Increment
    TaskEngine.prototype.incrementCounter = function () {
        if (this.isCompleted) return;
        if (this.state.counter < this.state.targetCount) {
            this.state.counter++;
            const notes = ['Do', 'Re', 'Mi', 'Sol', 'La'];
            window.RhythmMixer.playNote(notes[this.state.counter - 1] || 'Do', 0.25, 'triangle');
            this.particles.burst(this.width / 2, this.height / 2, 14);

            this._updateHUD(`Sayaç: ${this.state.counter} / ${this.state.targetCount}`);

            if (this.state.counter >= this.state.targetCount) {
                setTimeout(() => {
                    window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.8);
                    this.triggerComplete();
                }, 300);
            }
        }
    };

    // Task 15: Fix Buggy Block
    TaskEngine.prototype.fixBuggyBlock = function () {
        if (this.state.blocks[1].isFixed || this.isCompleted) return;
        this.state.blocks[1].isFixed = true;
        this.state.blocks[1].text = 'Sağa Dön';
        this.state.blocks[1].correct = true;

        window.RhythmMixer.playSparkle();
        window.RhythmMixer.playNote('Sol', 0.4, 'triangle');
        this.particles.burst(320, 180, 25);
        this._updateHUD("Hata düzeltildi! Püskül şimdi yıldıza doğru koşuyor...");

        // Püskül reaches star
        let t = 0;
        const startX = this.state.puskulX;
        const startY = this.state.puskulY;
        const targetX = this.state.targetStar.x;
        const targetY = this.state.targetStar.y;

        const move = () => {
            t += 0.04;
            if (t >= 1) {
                this.state.puskulX = targetX;
                this.state.puskulY = targetY;
                window.RhythmMixer.playSuccess();
                this._updateHUD("Hata ayıklandı ve yıldıza ulaşıldı! 🐞✨");
                this.triggerComplete();
            } else {
                this.state.puskulX = startX + (targetX - startX) * t;
                this.state.puskulY = startY + (targetY - startY) * t;
                requestAnimationFrame(move);
            }
        };
        setTimeout(move, 400);
    };

    // Task 16: Run Dance Method
    TaskEngine.prototype.runDanceFunction = function () {
        if (this.state.isRunning || this.isCompleted) return;
        this.state.isRunning = true;
        const baseY = 190;

        window.RhythmMixer.playNote('Do', 0.25, 'triangle');
        this.state.currentStepIndex = 0;
        this.state.puskulY = baseY - 40; // Jump

        setTimeout(() => {
            window.RhythmMixer.playNote('Mi', 0.25, 'triangle');
            this.state.currentStepIndex = 1;
            this.state.puskulY = baseY;
            this.state.puskulAngle = 180; // Spin

            setTimeout(() => {
                window.RhythmMixer.playNote('Sol', 0.35, 'triangle');
                window.RhythmMixer.playSparkle();
                this.state.currentStepIndex = 2;
                this.state.puskulAngle = 360; // Complete spin
                this.particles.burst(this.width / 2, baseY, 25);

                setTimeout(() => {
                    this.state.isRunning = false;
                    this.state.puskulAngle = 0;
                    window.RhythmMixer.playSuccess();
                    this._updateHUD("DansEt() fonksiyonu başarıyla tamamlandı! 🧩✨");
                    this.triggerComplete();
                }, 400);
            }, 350);
        }, 350);
    };

    // Task 17: Apply Parameters
    TaskEngine.prototype.setFunctionParam = function (color, speed) {
        if (this.state.animating || this.isCompleted) return;
        this.state.selectedColor = color;
        this.state.selectedSpeed = speed;

        window.RhythmMixer.playNote(color === '#EC4899' ? 'Sol' : 'Do', 0.3, 'sine');
        this._updateHUD(`Parametre: Renk = ${color === '#EC4899' ? 'Pembe' : 'Mavi'}. Şimdi 'Uygula'ya bas!`);
    };

    TaskEngine.prototype.runParameterizedMovement = function () {
        if (this.state.animating || this.isCompleted) return;
        this.state.animating = true;

        const speedVal = this.state.selectedSpeed === 'fast' ? 7 : 4;
        let curX = this.state.puskulX;

        const anim = () => {
            if (curX < this.state.targetX) {
                curX += speedVal;
                this.state.puskulX = curX;
                requestAnimationFrame(anim);
            } else {
                this.state.animating = false;
                window.RhythmMixer.playSuccess();
                this._updateHUD("Parametreli fonksiyon başarıyla çalıştı! 🎛️");
                this.triggerComplete();
            }
        };
        anim();
    };

    // Task 18: Queue / Array Stack
    TaskEngine.prototype.enqueueCommand = function (dir) {
        if (this.state.executing || this.isCompleted) return;
        if (this.state.queue.length < this.state.maxQueue) {
            this.state.queue.push(dir);
            window.RhythmMixer.playPop(300 + this.state.queue.length * 60);
            this._updateHUD(`Kuyruktaki komut sayısı: ${this.state.queue.length} / ${this.state.maxQueue}`);
        }
    };

    TaskEngine.prototype.executeQueue = function () {
        if (this.state.executing || this.state.queue.length === 0 || this.isCompleted) return;
        this.state.executing = true;

        let index = 0;
        const stepQueue = () => {
            if (index >= this.state.queue.length) {
                this.state.executing = false;
                window.RhythmMixer.playSuccess();
                this._updateHUD("Kuyruktaki tüm komutlar başarıyla yürütüldü! 📋🎉");
                this.triggerComplete();
                return;
            }

            const cmd = this.state.queue[index];
            window.RhythmMixer.playNote(260 + index * 70, 0.25, 'triangle');

            if (cmd === 'right') this.state.gridX += 1;
            else if (cmd === 'up') this.state.gridY -= 1;
            else if (cmd === 'down') this.state.gridY += 1;

            this.particles.burst(160 + this.state.gridX * 80, 100 + this.state.gridY * 60, 12);

            index++;
            setTimeout(stepQueue, 450);
        };
        stepQueue();
    };

    // Task 19: Move Puskul with Keys/Arrows
    TaskEngine.prototype.movePuskul = function (direction) {
        if (this.isCompleted) return;
        const step = 40;
        const p = this.state.puskul;

        if (direction === 'up') p.y = Math.max(80, p.y - step);
        else if (direction === 'down') p.y = Math.min(280, p.y + step);
        else if (direction === 'left') p.x = Math.max(80, p.x - step);
        else if (direction === 'right') p.x = Math.min(560, p.x + step);

        window.RhythmMixer.playPop(420);

        // Check star collection
        this.state.stars.forEach(star => {
            if (!star.collected) {
                const dist = Math.hypot(p.x - star.x, p.y - star.y);
                if (dist < 32) {
                    star.collected = true;
                    window.RhythmMixer.playSparkle();
                    window.RhythmMixer.playNote('Sol', 0.3, 'sine');
                    this.particles.burst(star.x, star.y, 20);
                }
            }
        });

        const collectedCount = this.state.stars.filter(s => s.collected).length;
        this._updateHUD(`Toplanan Yıldızlar: ${collectedCount} / 3`);

        if (collectedCount >= 3) {
            setTimeout(() => {
                window.RhythmMixer.playSuccess();
                this.triggerComplete();
            }, 300);
        }
    };

    // Task 20: Master Symphony
    TaskEngine.prototype.startMasterSymphony = function () {
        if (this.state.isRunning || this.isCompleted) return;
        this.state.isRunning = true;

        let index = 0;
        const crystals = this.state.crystals;

        const nextCrystal = () => {
            if (index >= crystals.length) {
                this.state.isRunning = false;
                window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'La', 'Do5'], 1.2);
                this.particles.burst(this.width / 2, this.height / 2, 45);
                this._updateHUD("Tebrikler! 2. Bölüm Ustalık Kupasını Kazandın! 👑🏆✨");
                this.triggerComplete();
                return;
            }

            const c = crystals[index];
            c.lit = true;
            this.state.activeCrystal = index;
            window.RhythmMixer.playNote(c.note, 0.45, 'triangle');
            window.RhythmMixer.playSparkle();
            this.particles.burst(c.x, c.y, 22);

            index++;
            setTimeout(nextCrystal, 500);
        };
        nextCrystal();
    };

    // ========================================================
    // RENDER DISPATCH EXTENSION
    // ========================================================
    TaskEngine.prototype.loop = function () {
        originalLoop.call(this);

        if (this.taskId >= 11 && this.taskId <= 20) {
            switch (this.taskId) {
                case 11: this._renderTask11(); break;
                case 12: this._renderTask12(); break;
                case 13: this._renderTask13(); break;
                case 14: this._renderTask14(); break;
                case 15: this._renderTask15(); break;
                case 16: this._renderTask16(); break;
                case 17: this._renderTask17(); break;
                case 18: this._renderTask18(); break;
                case 19: this._renderTask19(); break;
                case 20: this._renderTask20(); break;
            }
        }
    };

    // ========================================================
    // RENDER IMPLEMENTATIONS (11 - 20)
    // ========================================================

    // Render Task 11: Geometric Square Loop
    TaskEngine.prototype._renderTask11 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Draw Guide Square (Dashed)
        ctx.save();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(220, 100, 200, 160);
        ctx.restore();

        // Draw Drawn Edges
        ctx.save();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        s.drawnLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });
        ctx.restore();

        // Corners dots
        s.corners.forEach((c, idx) => {
            ctx.save();
            ctx.fillStyle = idx <= s.currentEdge && s.isRunning ? '#6366F1' : '#94A3B8';
            ctx.beginPath();
            ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Püskül Mascot
        CanvasEngine.drawPuskul(ctx, s.puskulPos.x, s.puskulPos.y, 0, 1.4, '#4F46E5', this.isCompleted);
    };

    // Render Task 12: Nested Loops Star
    TaskEngine.prototype._renderTask12 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Draw Trail
        ctx.save();
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        s.drawnTrail.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });
        ctx.restore();

        // Center Sparkle
        ctx.save();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.beginPath();
        ctx.arc(s.cx, s.cy, s.outerR + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Mascot
        CanvasEngine.drawPuskul(ctx, s.puskulPos.x, s.puskulPos.y, 0, 1.3, '#EC4899', this.isCompleted);
    };

    // Render Task 13: Conditional Sensor
    TaskEngine.prototype._renderTask13 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Road
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(80, 150, 480, 60);

        // Traffic Light Post
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(310, 80, 20, 120);
        ctx.fillStyle = s.trafficLightColor === 'green' ? '#10B981' : '#EF4444';
        ctx.beginPath();
        ctx.arc(320, 95, 14, 0, Math.PI * 2);
        ctx.fill();

        // Gate Barrier
        ctx.save();
        ctx.strokeStyle = s.doorOpen ? '#10B981' : '#EF4444';
        ctx.lineWidth = 8;
        ctx.beginPath();
        if (s.doorOpen) {
            ctx.moveTo(330, 150);
            ctx.lineTo(330, 90); // Raised
        } else {
            ctx.moveTo(330, 150);
            ctx.lineTo(330, 210); // Closed
        }
        ctx.stroke();
        ctx.restore();

        // Goal Flag
        ctx.font = '28px sans-serif';
        ctx.fillText('🏁', s.targetX, 190);

        // Mascot
        CanvasEngine.drawPuskul(ctx, s.puskulX, s.puskulY, 0, 1.4, '#F59E0B', s.doorOpen);
    };

    // Render Task 14: Step Counter
    TaskEngine.prototype._renderTask14 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Big Energy Orb
        const cx = this.width / 2;
        const cy = this.height / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(cx, cy, 25 + s.counter * 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Baloo 2, Nunito';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${s.counter} / ${s.targetCount}`, cx, cy);
        ctx.restore();

        // Mascot Cheer
        CanvasEngine.drawPuskul(ctx, 140, 180, 0, 1.4, '#10B981', s.counter >= s.targetCount);
    };

    // Render Task 15: Bug Hunter
    TaskEngine.prototype._renderTask15 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Path Line
        ctx.save();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(150, 240);
        ctx.lineTo(s.targetStar.x, s.targetStar.y);
        ctx.stroke();
        ctx.restore();

        // Star
        ctx.font = '36px sans-serif';
        ctx.fillText('⭐', s.targetStar.x - 18, s.targetStar.y + 12);

        // Blocks on Top
        s.blocks.forEach((b, idx) => {
            const bx = 160 + idx * 115;
            const by = 50;

            ctx.fillStyle = b.isFixed || b.correct ? '#4F46E5' : '#EF4444';
            ctx.beginPath();
            ctx.roundRect(bx, by, 100, 42, 10);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 13px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText(`${b.icon} ${b.text}`, bx + 50, by + 26);
        });

        // Mascot
        CanvasEngine.drawPuskul(ctx, s.puskulX, s.puskulY, 0, 1.4, '#EF4444', s.blocks[1].isFixed);
    };

    // Render Task 16: Function Block
    TaskEngine.prototype._renderTask16 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Stage Floor
        ctx.fillStyle = '#EDE9FE';
        ctx.fillRect(180, 240, 280, 16);

        // Method Tag
        ctx.fillStyle = '#8B5CF6';
        ctx.font = 'bold 22px Baloo 2, Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('fonksiyon DansEt() { ... }', this.width / 2, 80);

        // Mascot Dancing
        CanvasEngine.drawPuskul(ctx, this.width / 2, s.puskulY, s.puskulAngle, 1.6, '#8B5CF6', s.isRunning || this.isCompleted);
    };

    // Render Task 17: Parameterized Function
    TaskEngine.prototype._renderTask17 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Path
        ctx.fillStyle = '#E0F2FE';
        ctx.fillRect(120, 160, 400, 40);

        // Goal Flag
        ctx.font = '30px sans-serif';
        ctx.fillText('🚩', s.targetX, 192);

        // Mascot with custom color parameter
        CanvasEngine.drawPuskul(ctx, s.puskulX, s.puskulY, 0, 1.4, s.selectedColor, this.isCompleted);
    };

    // Render Task 18: Queue Array Stack
    TaskEngine.prototype._renderTask18 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Grid cells
        for (let gx = 0; gx < 5; gx++) {
            for (let gy = 0; gy < 4; gy++) {
                ctx.strokeStyle = '#E2E8F0';
                ctx.strokeRect(160 + gx * 70, 80 + gy * 50, 65, 45);
            }
        }

        // Target Cell
        ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
        ctx.fillRect(160 + s.targetGridX * 70, 80 + s.targetGridY * 50, 65, 45);
        ctx.font = '22px sans-serif';
        ctx.fillText('🎯', 160 + s.targetGridX * 70 + 20, 80 + s.targetGridY * 50 + 32);

        // Mascot on Grid
        const px = 160 + s.gridX * 70 + 32;
        const py = 80 + s.gridY * 50 + 24;
        CanvasEngine.drawPuskul(ctx, px, py, 0, 1.2, '#14B8A6', this.isCompleted);

        // Queue Display Below
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 14px Nunito';
        ctx.textAlign = 'left';
        ctx.fillText(`Kuyruk [${s.queue.join(' ➔ ') || 'Boş'}]`, 160, 310);
    };

    // Render Task 19: Keyboard Event Listener
    TaskEngine.prototype._renderTask19 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Field Border
        ctx.strokeStyle = '#FED7AA';
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 60, 520, 240);

        // Stars
        s.stars.forEach(star => {
            if (!star.collected) {
                ctx.font = '26px sans-serif';
                ctx.fillText('⭐', star.x - 13, star.y + 10);
            }
        });

        // Mascot
        CanvasEngine.drawPuskul(ctx, s.puskul.x, s.puskul.y, 0, 1.4, '#F97316', this.isCompleted);
    };

    // Render Task 20: Master Symphony
    TaskEngine.prototype._renderTask20 = function () {
        const ctx = this.ctx;
        const s = this.state;

        // Temple Center Platform
        ctx.save();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, 130, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4 Crystals
        s.crystals.forEach(c => {
            ctx.save();
            ctx.fillStyle = c.lit ? c.color : '#CBD5E1';
            ctx.beginPath();
            ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Nunito';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.note, c.x, c.y);
            ctx.restore();
        });

        // Center Mascot
        CanvasEngine.drawPuskul(ctx, this.width / 2, this.height / 2, 0, 1.8, '#4F46E5', this.isCompleted || s.isRunning);
    };
})();

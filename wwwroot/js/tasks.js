/**
 * RhythmCode - Section 1 Tasks (1 - 10) Interactive Engine
 */

class TaskEngine {
    constructor(taskId) {
        this.taskId = taskId;
        this.canvas = document.getElementById('taskCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 640;
        this.height = 360;
        this.dpr = window.devicePixelRatio || 1;
        this.particles = new ParticleSystem();
        this.isCompleted = false;
        this.animId = null;
        this.time = 0;

        // Retina netleştirme
        CanvasEngine.setupHiDPI(this.canvas, this.width, this.height);

        // Olay dinleyicileri
        this._setupEvents();

        // Göreve özel durum başlatma
        this._initTaskState();

        // Animasyon döngüsü
        this.loop = this.loop.bind(this);
        this.loop();
    }

    _setupEvents() {
        const getPos = (e) => CanvasEngine.getPointerPos(this.canvas, e);

        this.canvas.addEventListener('pointerdown', (e) => {
            if (this.isCompleted) return;
            const pos = getPos(e);
            this.handlePointerDown(pos);
        });

        this.canvas.addEventListener('pointermove', (e) => {
            const pos = getPos(e);
            this.handlePointerMove(pos);
        });

        const handlePointerEnd = () => {
            this.handlePointerUp();
        };
        window.addEventListener('pointerup', handlePointerEnd);
        window.addEventListener('pointercancel', handlePointerEnd);
    }

    _initTaskState() {
        switch (this.taskId) {
            case 1:
                this.state = {
                    orbX: this.width / 2,
                    orbY: this.height / 2,
                    radius: 46,
                    scale: 1,
                    taps: 0,
                    targetTaps: 3,
                    waveRadius: 0,
                    waveAlpha: 0,
                    pulse: 0
                };
                this._updateHUD(`Dokunma: 0 / ${this.state.targetTaps} (Parlayan topa dokun!)`);
                break;

            case 2:
                // Robot Parçaları (Kafa, Gövde, Ayak)
                this.state = {
                    targetX: 220,
                    headY: 100,
                    bodyY: 180,
                    legsY: 265,
                    parts: [
                        { id: 'head', name: 'Kafa', x: 480, y: 90, origX: 480, origY: 90, w: 70, h: 55, color: '#38BDF8', snapped: false, note: 'Do' },
                        { id: 'body', name: 'Gövde', x: 480, y: 180, origX: 480, origY: 180, w: 90, h: 70, color: '#6366F1', snapped: false, note: 'Mi' },
                        { id: 'legs', name: 'Ayaklar', x: 480, y: 275, origX: 480, origY: 275, w: 80, h: 45, color: '#10B981', snapped: false, note: 'Sol' }
                    ],
                    activePart: null,
                    dragOffset: { x: 0, y: 0 }
                };
                this._updateHUD("Parçaları soldaki kılavuz yuvalarına sürükle!");
                break;

            case 3:
                // Hedefe Taşıma ve Koordinat
                this.state = {
                    star: { x: 120, y: 220, radius: 26, isDragging: false },
                    target: { x: 500, y: 140, radius: 36 },
                    dragOffset: { x: 0, y: 0 },
                    snapped: false
                };
                this._updateHUD(`X: ${this.state.star.x} | Y: ${this.state.star.y} (Yıldızı hedef halkaya sürükle!)`);
                break;

            case 4:
                // Katman Algısı (Z-Index / Bulut ve Güneş)
                this.state = {
                    sun: { x: 320, y: 180, radius: 46, revealed: false },
                    cloud: { x: 320, y: 180, origX: 320, origY: 180, isDragging: false },
                    dragOffset: { x: 0, y: 0 }
                };
                this._updateHUD("Ön Katman (Z-Index: 2): Bulut ☁️ | Bulutu çekip güneşi ortaya çıkar!");
                break;

            case 5:
                // Engeli Temizleme & Debugging
                this.state = {
                    brush: { x: 80, y: 220, speed: 0, moving: false },
                    rock: { x: 340, y: 215, radius: 36, isDragging: false, cleared: false },
                    targetX: 560,
                    pathY: 220,
                    dragOffset: { x: 0, y: 0 }
                };
                this._updateHUD("Taşı yolun dışına çek veya 'Engeli Temizle' butonuna bas!");
                break;

            case 6:
                // Ritmik Yörünge ve Sayaç
                this.state = {
                    cx: this.width / 2,
                    cy: this.height / 2,
                    radiusX: 180,
                    radiusY: 90,
                    angle: 0,
                    selectedTours: 3,
                    completedTours: 0,
                    isRunning: false,
                    speed: 0.04
                };
                this._updateHUD(`Seçilen Tur: 3x (Döngüyü başlat!)`);
                break;

            case 7:
                // İki Yollu Koşul (If-Else)
                this.state = {
                    score: 0,
                    targetScore: 3,
                    currentWave: 'purple',
                    wavePulse: 0,
                    isTransitioning: false,
                    purpleDoor: { x: 140, y: 180, w: 100, h: 140 },
                    yellowDoor: { x: 500, y: 180, w: 100, h: 140 },
                    center: { x: this.width / 2, y: this.height / 2, radius: 36 }
                };
                this._updateHUD(`Skor: 0 / 3 • Sinyalin rengine bak ve doğru kapıya bas!`);
                this._cycleWaveCondition(false);
                break;

            case 8:
                // Dokunsal Boyut Ölçekleme
                this.state = {
                    brushX: 120,
                    brushY: 180,
                    scale: 1.4,
                    minPassScale: 0.7,
                    tunnelX: 340,
                    tunnelWidth: 80,
                    tunnelGap: 75,
                    isDragging: false,
                    isPassing: false,
                    passed: false,
                    dragOffset: { x: 0, y: 0 }
                };
                this._updateHUD(`Mevcut Boyut: 1.4x (Tünel Limiti: 0.7x) • [-] ile küçült!`);
                break;

            case 9:
                // Pentatonik Dizi Hafızası (FIFO)
                this.state = {
                    targetSequence: ['Do', 'Mi', 'Sol'],
                    playerInput: [],
                    keys: [
                        { name: 'Do', freq: 261.63, color: '#3B82F6', x: 100, y: 240, w: 75, h: 100, active: false },
                        { name: 'Re', freq: 293.66, color: '#06B6D4', x: 190, y: 230, w: 75, h: 110, active: false },
                        { name: 'Mi', freq: 329.63, color: '#10B981', x: 280, y: 220, w: 75, h: 120, active: false },
                        { name: 'Sol', freq: 392.00, color: '#F59E0B', x: 370, y: 210, w: 75, h: 130, active: false },
                        { name: 'La', freq: 440.00, color: '#EC4899', x: 460, y: 200, w: 75, h: 140, active: false }
                    ],
                    isPlayingDemo: false,
                    demoTimeoutIds: []
                };
                this._updateHUD("Melodi sırasını dinle ve aynısını çal!");
                break;

            case 10:
                // Simetrik Çift Nesne
                this.state = {
                    leftBrush: { x: 140, y: 180 },
                    rightBrush: { x: 500, y: 180 },
                    activeDrag: null, // 'left' veya 'right'
                    leftTarget: { x: 200, y: 100, radius: 32 },
                    rightTarget: { x: 440, y: 100, radius: 32 },
                    dragOffset: { x: 0, y: 0 },
                    reached: false
                };
                this._updateHUD("Fırçalardan birini sürükle; ikisi aynı anda hedefe varsın!");
                break;
        }
    }

    // ==========================================
    // ETKİLEŞİM İŞLEYİCİLERİ (Pointer Handlers)
    // ==========================================
    handlePointerDown(pos) {
        if (window.RhythmMixer) window.RhythmMixer.ensureContext();

        switch (this.taskId) {
            case 1:
                const dist1 = Math.hypot(pos.x - this.state.orbX, pos.y - this.state.orbY);
                if (dist1 <= this.state.radius * 1.6) {
                    this.state.taps++;
                    this.state.scale = 1.35;
                    this.state.waveRadius = 10;
                    this.state.waveAlpha = 1;

                    window.RhythmMixer.playNote('Do', 0.35, 'triangle', 0.4);
                    window.RhythmMixer.playSparkle();
                    this.particles.burst(this.state.orbX, this.state.orbY, 20);

                    this._updateHUD(`Dokunma: ${this.state.taps} / ${this.state.targetTaps}`);

                    if (this.state.taps >= this.state.targetTaps) {
                        setTimeout(() => {
                            this.triggerComplete();
                        }, 250);
                    }
                }
                break;

            case 2:
                // Robot parçalarını seçme
                for (let part of this.state.parts) {
                    if (!part.snapped) {
                        if (pos.x >= part.x - part.w / 2 && pos.x <= part.x + part.w / 2 &&
                            pos.y >= part.y - part.h / 2 && pos.y <= part.y + part.h / 2) {
                            this.state.activePart = part;
                            this.state.dragOffset = { x: pos.x - part.x, y: pos.y - part.y };
                            window.RhythmMixer.playPop(300);
                            break;
                        }
                    }
                }
                break;

            case 3:
                // Yıldız yakalama
                if (!this.state.snapped) {
                    const dist3 = Math.hypot(pos.x - this.state.star.x, pos.y - this.state.star.y);
                    if (dist3 <= this.state.star.radius * 1.6) {
                        this.state.star.isDragging = true;
                        this.state.dragOffset = { x: pos.x - this.state.star.x, y: pos.y - this.state.star.y };
                        window.RhythmMixer.playPop(350);
                    }
                }
                break;

            case 4:
                // Bulut yakalama
                if (!this.state.sun.revealed) {
                    const dist4 = Math.hypot(pos.x - this.state.cloud.x, pos.y - this.state.cloud.y);
                    if (dist4 <= 95) {
                        this.state.cloud.isDragging = true;
                        this.state.dragOffset = { x: pos.x - this.state.cloud.x, y: pos.y - this.state.cloud.y };
                        window.RhythmMixer.playWhoosh(false);
                    }
                }
                break;

            case 5:
                // Taş fırlatma
                if (!this.state.rock.cleared) {
                    const dist5 = Math.hypot(pos.x - this.state.rock.x, pos.y - this.state.rock.y);
                    if (dist5 <= this.state.rock.radius * 1.5) {
                        this.state.rock.isDragging = true;
                        this.state.dragOffset = { x: pos.x - this.state.rock.x, y: pos.y - this.state.rock.y };
                    }
                }
                break;

            case 7:
                // Merkezdeki dalga jeneratörüne dokunma (sesi tekrar dinle)
                const cDist = Math.hypot(pos.x - this.state.center.x, pos.y - this.state.center.y);
                if (cDist <= this.state.center.radius * 1.3) {
                    this.playWaveSignalSound();
                    return;
                }

                // Kapı seçimi
                const p = this.state.purpleDoor;
                if (pos.x >= p.x - p.w / 2 && pos.x <= p.x + p.w / 2 &&
                    pos.y >= p.y - p.h / 2 && pos.y <= p.y + p.h / 2) {
                    this._verifyConditionDoor('purple');
                }
                const y = this.state.yellowDoor;
                if (pos.x >= y.x - y.w / 2 && pos.x <= y.x + y.w / 2 &&
                    pos.y >= y.y - y.h / 2 && pos.y <= y.y + y.h / 2) {
                    this._verifyConditionDoor('yellow');
                }
                break;

            case 8:
                // Fırçayı sürükleyerek tünelden geçirme
                if (!this.state.passed && !this.state.isPassing) {
                    const dist8 = Math.hypot(pos.x - this.state.brushX, pos.y - this.state.brushY);
                    if (dist8 <= 45 * this.state.scale) {
                        this.state.isDragging = true;
                        this.state.dragOffset = { x: pos.x - this.state.brushX, y: pos.y - this.state.brushY };
                        window.RhythmMixer.playPop(340);
                    }
                }
                break;

            case 9:
                // Tuşlara dokunma
                if (!this.state.isPlayingDemo) {
                    for (let key of this.state.keys) {
                        if (pos.x >= key.x && pos.x <= key.x + key.w &&
                            pos.y >= key.y && pos.y <= key.y + key.h) {
                            this._pressPianoKey(key);
                            break;
                        }
                    }
                }
                break;

            case 10:
                // Sol veya Sağ fırçayı yakalama (Her ikisi de sürüklenebilir)
                if (!this.state.reached) {
                    const dLeft = Math.hypot(pos.x - this.state.leftBrush.x, pos.y - this.state.leftBrush.y);
                    const dRight = Math.hypot(pos.x - this.state.rightBrush.x, pos.y - this.state.rightBrush.y);

                    if (dLeft <= 45) {
                        this.state.activeDrag = 'left';
                        this.state.dragOffset = { x: pos.x - this.state.leftBrush.x, y: pos.y - this.state.leftBrush.y };
                        window.RhythmMixer.playPop(320);
                    } else if (dRight <= 45) {
                        this.state.activeDrag = 'right';
                        this.state.dragOffset = { x: pos.x - this.state.rightBrush.x, y: pos.y - this.state.rightBrush.y };
                        window.RhythmMixer.playPop(320);
                    }
                }
                break;
        }
    }

    handlePointerMove(pos) {
        switch (this.taskId) {
            case 2:
                if (this.state.activePart) {
                    this.state.activePart.x = pos.x - this.state.dragOffset.x;
                    this.state.activePart.y = pos.y - this.state.dragOffset.y;
                }
                break;

            case 3:
                if (this.state.star.isDragging) {
                    this.state.star.x = pos.x - this.state.dragOffset.x;
                    this.state.star.y = pos.y - this.state.dragOffset.y;

                    const distToTarget = Math.hypot(this.state.star.x - this.state.target.x, this.state.star.y - this.state.target.y);
                    this._updateHUD(`X: ${Math.round(this.state.star.x)} | Y: ${Math.round(this.state.star.y)} (Hedefe mesafe: ${Math.round(distToTarget)} px)`);

                    // Manyetik Snap kontrolü
                    if (distToTarget < 42) {
                        this.state.star.x = this.state.target.x;
                        this.state.star.y = this.state.target.y;
                        this.state.star.isDragging = false;
                        this.state.snapped = true;
                        window.RhythmMixer.playNote('Sol', 0.5, 'triangle');
                        window.RhythmMixer.playSparkle();
                        this.particles.burst(this.state.target.x, this.state.target.y, 25);
                        this._updateHUD("Hedefe kilitlendi! ⭐ Tebrikler!");
                        this.triggerComplete();
                    }
                }
                break;

            case 4:
                if (this.state.cloud.isDragging) {
                    this.state.cloud.x = pos.x - this.state.dragOffset.x;
                    this.state.cloud.y = pos.y - this.state.dragOffset.y;

                    // Hem yatay hem dikey kaydırma desteği
                    const dist = Math.hypot(this.state.cloud.x - this.state.sun.x, this.state.cloud.y - this.state.sun.y);
                    if (dist > 110 && !this.state.sun.revealed) {
                        this.state.sun.revealed = true;
                        this.state.cloud.isDragging = false;
                        window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.8);
                        this.particles.burst(this.state.sun.x, this.state.sun.y, 32);
                        this._updateHUD("Güneş ortaya çıktı! ☀️ Z-Index Katmanı Açıldı!");
                        this.triggerComplete();
                    }
                }
                break;

            case 5:
                if (this.state.rock.isDragging) {
                    this.state.rock.x = pos.x - this.state.dragOffset.x;
                    this.state.rock.y = pos.y - this.state.dragOffset.y;

                    // Taş yolun dışına (yukarı, aşağı, sağa veya sola) çekildiyse
                    const distFromPath = Math.abs(this.state.rock.y - this.state.pathY);
                    if (distFromPath > 55 || this.state.rock.x > 480 || this.state.rock.x < 180) {
                        this.clearObstacle();
                    }
                }
                break;

            case 8:
                if (this.state.isDragging) {
                    let nextX = pos.x - this.state.dragOffset.x;
                    let nextY = pos.y - this.state.dragOffset.y;

                    // Tünel engel sınır kontrolü
                    const enteringTunnel = nextX > this.state.tunnelX - 25 && nextX < this.state.tunnelX + this.state.tunnelWidth + 20;
                    if (enteringTunnel && this.state.scale > this.state.minPassScale) {
                        // Tünele sığmadı! Geri sektir ve nazikçe ikaz et
                        nextX = this.state.tunnelX - 30;
                        if (!this.state.lastBump || (Date.now() - this.state.lastBump > 400)) {
                            this.state.lastBump = Date.now();
                            window.RhythmMixer.playErrorSoft();
                            this._updateHUD("Fırça tünele sığmadı! [-] ile küçültelim 🔍");
                        }
                    }

                    this.state.brushX = Math.max(50, Math.min(580, nextX));
                    this.state.brushY = Math.max(100, Math.min(260, nextY));

                    // Tünelden başarıyla geçildi mi?
                    if (this.state.brushX > this.state.tunnelX + this.state.tunnelWidth + 40 && !this.state.passed) {
                        this.state.passed = true;
                        this.state.isDragging = false;
                        window.RhythmMixer.playSuccess();
                        this._updateHUD("Fırça dar tünelden başarıyla geçti! 🎉");
                        this.particles.burst(this.state.brushX, this.state.brushY, 25);
                        this.triggerComplete();
                    }
                }
                break;

            case 10:
                if (this.state.activeDrag === 'left') {
                    let newX = pos.x - this.state.dragOffset.x;
                    let newY = pos.y - this.state.dragOffset.y;
                    newX = Math.max(50, Math.min(this.width / 2 - 40, newX));
                    newY = Math.max(60, Math.min(this.height - 60, newY));

                    this.state.leftBrush.x = newX;
                    this.state.leftBrush.y = newY;
                    this.state.rightBrush.x = this.width - newX;
                    this.state.rightBrush.y = newY;
                } else if (this.state.activeDrag === 'right') {
                    let newX = pos.x - this.state.dragOffset.x;
                    let newY = pos.y - this.state.dragOffset.y;
                    newX = Math.max(this.width / 2 + 40, Math.min(this.width - 50, newX));
                    newY = Math.max(60, Math.min(this.height - 60, newY));

                    this.state.rightBrush.x = newX;
                    this.state.rightBrush.y = newY;
                    this.state.leftBrush.x = this.width - newX;
                    this.state.leftBrush.y = newY;
                }

                if (this.state.activeDrag) {
                    // Hedef kontrolü
                    const d1 = Math.hypot(this.state.leftBrush.x - this.state.leftTarget.x, this.state.leftBrush.y - this.state.leftTarget.y);
                    const d2 = Math.hypot(this.state.rightBrush.x - this.state.rightTarget.x, this.state.rightBrush.y - this.state.rightTarget.y);

                    if (d1 < 32 && d2 < 32 && !this.state.reached) {
                        this.state.reached = true;
                        this.state.activeDrag = null;
                        window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'La', 'Do5'], 0.8);
                        this.particles.burst(this.state.leftTarget.x, this.state.leftTarget.y, 22);
                        this.particles.burst(this.state.rightTarget.x, this.state.rightTarget.y, 22);
                        this._updateHUD("İkiz fırçalar hedefe aynı anda ulaştı! 🪞🎉");
                        this.triggerComplete();
                    }
                }
                break;
        }
    }

    handlePointerUp() {
        switch (this.taskId) {
            case 2:
                if (this.state.activePart) {
                    const p = this.state.activePart;
                    let targetY = 0;
                    if (p.id === 'head') targetY = this.state.headY;
                    else if (p.id === 'body') targetY = this.state.bodyY;
                    else if (p.id === 'legs') targetY = this.state.legsY;

                    const dist = Math.hypot(p.x - this.state.targetX, p.y - targetY);
                    if (dist < 55) {
                        // Yuvasına kilitlendi
                        p.x = this.state.targetX;
                        p.y = targetY;
                        p.snapped = true;
                        window.RhythmMixer.playNote(p.note, 0.4, 'sine');
                        this.particles.burst(p.x, p.y, 14);

                        const snappedCount = this.state.parts.filter(x => x.snapped).length;
                        this._updateHUD(`Parça yerleşti: ${snappedCount} / 3`);

                        const allDone = this.state.parts.every(x => x.snapped);
                        if (allDone) {
                            setTimeout(() => {
                                window.RhythmMixer.playSuccess();
                                this._updateHUD("Tebrikler! Robot başarıyla tamamlandı 🤖");
                                this.triggerComplete();
                            }, 300);
                        }
                    } else {
                        // Geri dön
                        p.x = p.origX;
                        p.y = p.origY;
                    }
                    this.state.activePart = null;
                }
                break;

            case 3:
                if (this.state.star.isDragging) {
                    this.state.star.isDragging = false;
                }
                break;

            case 4:
                if (this.state.cloud.isDragging) {
                    this.state.cloud.isDragging = false;
                    if (!this.state.sun.revealed) {
                        this.state.cloud.x = this.state.cloud.origX;
                        this.state.cloud.y = this.state.cloud.origY;
                    }
                }
                break;

            case 5:
                if (this.state.rock.isDragging) {
                    this.state.rock.isDragging = false;
                }
                break;

            case 8:
                if (this.state.isDragging) {
                    this.state.isDragging = false;
                }
                break;

            case 10:
                this.state.activeDrag = null;
                break;
        }
    }

    // ==========================================
    // ÖZEL GÖREV EYLEMLERİ
    // ==========================================

    // Görev 5: Engeli Temizleme & Fırçayı Yürütme
    clearObstacle() {
        if (this.state.rock.cleared) return;
        this.state.rock.cleared = true;
        this.state.rock.isDragging = false;
        window.RhythmMixer.playWhoosh(true);
        this.particles.burst(this.state.rock.x, this.state.rock.y, 20);

        this._updateHUD("Yol açıldı! Fırça hedefe koşuyor...");

        const interval = setInterval(() => {
            if (this.state.brush.x < this.state.targetX) {
                this.state.brush.x += 6;
                if (Math.round(this.state.brush.x) % 60 === 0) {
                    window.RhythmMixer.playNote('Mi', 0.15, 'triangle', 0.2);
                }
            } else {
                clearInterval(interval);
                window.RhythmMixer.playSuccess();
                this._updateHUD("Hedefe varıldı! Hata ayıklama tamamlandı 🧹");
                this.triggerComplete();
            }
        }, 30);
    }

    // Görev 6: Döngüyü Başlatma
    setLoopTours(count, btnEl = null) {
        this.state.selectedTours = count;
        this._updateHUD(`Seçilen Tur: ${count}x (Döngüyü Başlat!)`);

        // Buton grup active durumunu güncelle
        if (btnEl && btnEl.parentElement) {
            btnEl.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }
    }

    startLoopRun() {
        if (this.state.isRunning) return;
        this.state.isRunning = true;
        this.state.completedTours = 0;
        this.state.angle = 0;

        const tourTarget = this.state.selectedTours;
        this._updateHUD(`Döngü başladı: 0 / ${tourTarget} tur`);

        const step = () => {
            if (!this.state.isRunning) return;
            this.state.angle += this.state.speed;

            if (this.state.angle >= Math.PI * 2) {
                this.state.angle -= Math.PI * 2;
                this.state.completedTours++;
                window.RhythmMixer.playPercussion(true);
                window.RhythmMixer.playNote('Sol', 0.3);
                this.particles.burst(this.state.cx + this.state.radiusX, this.state.cy, 15);
                this._updateHUD(`Döngü turu: ${this.state.completedTours} / ${tourTarget}`);

                if (this.state.completedTours >= tourTarget) {
                    this.state.isRunning = false;
                    window.RhythmMixer.playSuccess();
                    this._updateHUD(`Tebrikler! ${tourTarget} tur başarıyla tamamlandı 🔄`);
                    this.triggerComplete();
                    return;
                }
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // Görev 7: İki Yollu Koşul (If-Else)
    _cycleWaveCondition(playSound = true) {
        this.state.currentWave = Math.random() > 0.5 ? 'purple' : 'yellow';
        this.state.wavePulse = 0;
        this.state.isTransitioning = false;
        if (playSound) {
            this.playWaveSignalSound();
        }
    }

    playWaveSignalSound() {
        if (window.RhythmMixer) {
            window.RhythmMixer.ensureContext();
            if (this.state.currentWave === 'purple') {
                window.RhythmMixer.playNote('Do', 0.45, 'sine', 0.35);
            } else {
                window.RhythmMixer.playNote('Sol', 0.45, 'triangle', 0.35);
            }
        }
    }

    _verifyConditionDoor(selected) {
        if (this.state.isTransitioning || this.isCompleted) return;

        if (selected === this.state.currentWave) {
            this.state.isTransitioning = true;
            this.state.score++;
            window.RhythmMixer.playNote('Do5', 0.35, 'triangle');
            window.RhythmMixer.playSparkle();
            const door = selected === 'purple' ? this.state.purpleDoor : this.state.yellowDoor;
            this.particles.burst(door.x, door.y, 22);

            this._updateHUD(`Harika! Doğru Kapı: ${this.state.score} / ${this.state.targetScore}`);

            if (this.state.score >= this.state.targetScore) {
                setTimeout(() => {
                    this.triggerComplete();
                }, 300);
            } else {
                setTimeout(() => this._cycleWaveCondition(true), 800);
            }
        } else {
            window.RhythmMixer.playErrorSoft();
            this._updateHUD("Fırça meraklandı! Merkezdeki sinyalin rengine tekrar bakalım 🎵");
        }
    }

    // Görev 8: Dokunsal Boyut Ölçekleme
    changeBrushScale(delta) {
        if (this.state.isPassing || this.state.passed) return;
        this.state.scale = Math.round(Math.max(0.4, Math.min(2.0, this.state.scale + delta)) * 10) / 10;

        const baseFreq = 261.63 * (1.8 - this.state.scale);
        window.RhythmMixer.playNote(baseFreq, 0.15, 'sine', 0.25);

        this._updateHUD(`Mevcut Boyut: ${this.state.scale.toFixed(1)}x (Tünel Limiti: 0.7x)`);

        const passBtn = document.getElementById('passTunnelBtn');
        if (passBtn) {
            passBtn.disabled = this.state.scale > this.state.minPassScale;
        }
    }

    passThroughTunnel() {
        if (this.state.scale > this.state.minPassScale || this.state.isPassing || this.state.passed) return;
        this.state.isPassing = true;
        window.RhythmMixer.playWhoosh(true);

        const move = setInterval(() => {
            if (this.state.brushX < 560) {
                this.state.brushX += 8;
            } else {
                clearInterval(move);
                this.state.passed = true;
                this.state.isPassing = false;
                window.RhythmMixer.playSuccess();
                this._updateHUD("Fırça tünelden başarıyla geçti! 🔍🎉");
                this.triggerComplete();
            }
        }, 30);
    }

    // Görev 9: Pentatonik Melodi Hafızası
    playDemoSequence() {
        if (this.state.isPlayingDemo) return;
        this.state.isPlayingDemo = true;
        this.state.playerInput = [];
        this._updateHUD("Sistemin çaldığı notaları dinle ve izle...");

        // Önceki zamanlayıcıları temizle
        this.state.demoTimeoutIds.forEach(id => clearTimeout(id));
        this.state.demoTimeoutIds = [];

        const seq = this.state.targetSequence;
        seq.forEach((noteName, idx) => {
            const tid = setTimeout(() => {
                const key = this.state.keys.find(k => k.name === noteName);
                if (key) {
                    key.active = true;
                    window.RhythmMixer.playNote(key.freq, 0.35, 'triangle');
                    setTimeout(() => { key.active = false; }, 320);
                }
                if (idx === seq.length - 1) {
                    const finalTid = setTimeout(() => {
                        this.state.isPlayingDemo = false;
                        this._updateHUD("Şimdi sıra sende! Aynı 3 tuşa bas.");
                    }, 400);
                    this.state.demoTimeoutIds.push(finalTid);
                }
            }, idx * 600);
            this.state.demoTimeoutIds.push(tid);
        });
    }

    _pressPianoKey(key) {
        key.active = true;
        window.RhythmMixer.playNote(key.freq, 0.3, 'sine');
        setTimeout(() => { key.active = false; }, 250);

        this.state.playerInput.push(key.name);
        const curIdx = this.state.playerInput.length - 1;

        if (this.state.playerInput[curIdx] !== this.state.targetSequence[curIdx]) {
            window.RhythmMixer.playErrorSoft();
            this._updateHUD("Fırça melodiyi karıştırdı. 'Tekrar Dinle'ye basabilirsin!");
            this.state.playerInput = [];
            return;
        }

        this._updateHUD(`Doğru nota! (${this.state.playerInput.length} / ${this.state.targetSequence.length})`);

        if (this.state.playerInput.length === this.state.targetSequence.length) {
            window.RhythmMixer.playSuccess();
            this.particles.burst(key.x + key.w / 2, key.y, 25);
            this._updateHUD("Melodi hafızası tamamlandı! Harika kulak! 🎵🎉");
            this.triggerComplete();
        }
    }

    // ==========================================
    // GÖREV BİTİŞ & KUTLAMA MODALI
    // ==========================================
    triggerComplete() {
        if (this.isCompleted) return;
        this.isCompleted = true;

        // Session ilerleme yöneticisine kaydet
        if (window.ProgressManager && typeof window.ProgressManager.completeTask === 'function') {
            window.ProgressManager.completeTask(this.taskId);
        }

        if (window.RhythmMixer && typeof window.RhythmMixer.playSuccess === 'function') {
            window.RhythmMixer.playSuccess();
        }

        const modal = document.getElementById('celebrationModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    _updateHUD(text) {
        const hud = document.getElementById('taskHUD');
        if (hud) hud.textContent = text;
    }

    // ==========================================
    // ANA ANİMASYON & ÇİZİM DÖNGÜSÜ
    // ==========================================
    loop() {
        this.time++;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Arka plan ızgarası
        this._drawBackgroundGrid();

        // Göreve özel çizim
        switch (this.taskId) {
            case 1: this._renderTask1(); break;
            case 2: this._renderTask2(); break;
            case 3: this._renderTask3(); break;
            case 4: this._renderTask4(); break;
            case 5: this._renderTask5(); break;
            case 6: this._renderTask6(); break;
            case 7: this._renderTask7(); break;
            case 8: this._renderTask8(); break;
            case 9: this._renderTask9(); break;
            case 10: this._renderTask10(); break;
        }

        // Parçacıklar
        this.particles.update();
        this.particles.draw(this.ctx);

        this.animId = requestAnimationFrame(this.loop);
    }

    _drawBackgroundGrid() {
        this.ctx.save();
        this.ctx.fillStyle = '#F8FAFC';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#E2E8F0';
        for (let x = 30; x < this.width; x += 30) {
            for (let y = 30; y < this.height; y += 30) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    // Task 1: Sabit Nesne ile İlk Etkileşim (Işıltılı Parlayan Müzik Topu + Fırça)
    _renderTask1() {
        const s = this.state;
        const ctx = this.ctx;

        s.pulse += 0.04;
        const pulseR = s.radius + Math.sin(s.pulse) * 4;

        // Dış Parlama / Halo Halka
        ctx.save();
        const haloGrad = ctx.createRadialGradient(s.orbX, s.orbY, 15, s.orbX, s.orbY, pulseR + 20);
        haloGrad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
        haloGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(s.orbX, s.orbY, pulseR + 20, 0, Math.PI * 2);
        ctx.fill();

        // Parıldayan Renkli Müzik Topu
        const orbGrad = ctx.createRadialGradient(s.orbX - 10, s.orbY - 10, 8, s.orbX, s.orbY, pulseR);
        orbGrad.addColorStop(0, '#A5B4FC');
        orbGrad.addColorStop(0.7, '#6366F1');
        orbGrad.addColorStop(1, '#4338CA');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(s.orbX, s.orbY, pulseR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Üzerinde nota simgesi
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('🎵', s.orbX, s.orbY + 8);
        ctx.restore();

        // Genişleyen ses dalgası
        if (s.waveAlpha > 0) {
            ctx.save();
            ctx.strokeStyle = `rgba(99, 102, 241, ${s.waveAlpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.orbX, s.orbY, s.waveRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            s.waveRadius += 3.5;
            s.waveAlpha -= 0.03;
        }

        // Fırça Karakteri (Topun yanında neşeyle zıplayan)
        s.scale += (1 - s.scale) * 0.1;
        CanvasEngine.drawBrush(ctx, s.orbX + 85, s.orbY, Math.sin(this.time * 0.06) * 10, s.scale * 1.1, '#6366F1', s.taps >= s.targetTaps);
    }

    // Task 2: Robot Yapbozu
    _renderTask2() {
        const ctx = this.ctx;
        const s = this.state;

        // Sol taraf: Gölgeli Kılavuz Silüeti
        ctx.save();
        ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);

        // Kafa yuvası
        ctx.strokeRect(s.targetX - 35, s.headY - 27, 70, 55);
        ctx.fillRect(s.targetX - 35, s.headY - 27, 70, 55);
        // Gövde yuvası
        ctx.strokeRect(s.targetX - 45, s.bodyY - 35, 90, 70);
        ctx.fillRect(s.targetX - 45, s.bodyY - 35, 90, 70);
        // Ayak yuvası
        ctx.strokeRect(s.targetX - 40, s.legsY - 22, 80, 45);
        ctx.fillRect(s.targetX - 40, s.legsY - 22, 80, 45);
        ctx.restore();

        // Parçaları çiz
        for (let p of s.parts) {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 2.5;

            if (p.id === 'head') {
                ctx.beginPath();
                ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 12);
                ctx.fill();
                ctx.stroke();

                // Robot Gözleri & Anteni
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(p.x - 14, p.y - 2, 8, 0, Math.PI * 2);
                ctx.arc(p.x + 14, p.y - 2, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0F172A';
                ctx.beginPath();
                ctx.arc(p.x - 14, p.y - 2, 3.5, 0, Math.PI * 2);
                ctx.arc(p.x + 14, p.y - 2, 3.5, 0, Math.PI * 2);
                ctx.fill();

                // Anten
                ctx.strokeStyle = '#64748B';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - p.h / 2);
                ctx.lineTo(p.x, p.y - p.h / 2 - 12);
                ctx.stroke();
                ctx.fillStyle = '#F59E0B';
                ctx.beginPath();
                ctx.arc(p.x, p.y - p.h / 2 - 14, 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.id === 'body') {
                ctx.beginPath();
                ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#0F172A';
                ctx.fillRect(p.x - 25, p.y - 18, 50, 24);
                ctx.fillStyle = '#34D399';
                ctx.fillRect(p.x - 20, p.y - 13, 14, 14);
                ctx.fillStyle = '#F43F5E';
                ctx.fillRect(p.x + 6, p.y - 13, 14, 14);
            } else if (p.id === 'legs') {
                ctx.beginPath();
                ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 8);
                ctx.fill();
                ctx.stroke();
            }

            // Etiket
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText(p.name, p.x, p.y + (p.h / 2) - 6);
            ctx.restore();
        }
    }

    // Task 3: Hedefe Taşıma ve Koordinat
    _renderTask3() {
        const ctx = this.ctx;
        const s = this.state;

        // Hedef Yuva (Manyetik Halka)
        ctx.save();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(s.target.x, s.target.y, s.target.radius + Math.sin(this.time * 0.08) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
        ctx.fill();
        ctx.restore();

        // Yıldız Çizimi
        CanvasEngine.drawStar(ctx, s.star.x, s.star.y, 5, s.star.radius, s.star.radius * 0.48, '#FBBF24', '#D97706');
    }

    // Task 4: Katman Algısı ve Z-Index
    _renderTask4() {
        const ctx = this.ctx;
        const s = this.state;

        // Katman 1 (Arkada: Z-Index 1): Güneş
        CanvasEngine.drawSun(ctx, s.sun.x, s.sun.y, s.sun.radius, 16, this.time);

        // Katman 2 (Önde: Z-Index 2): Pofuduk Bulut
        CanvasEngine.drawCloud(ctx, s.cloud.x, s.cloud.y, 1.4, 'rgba(255, 255, 255, 0.95)');
    }

    // Task 5: Engeli Temizleme & Debugging
    _renderTask5() {
        const ctx = this.ctx;
        const s = this.state;

        // Yol hattı
        ctx.save();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(60, s.pathY);
        ctx.lineTo(580, s.pathY);
        ctx.stroke();

        if (s.brush.x > 80) {
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(80, s.pathY);
            ctx.lineTo(s.brush.x, s.pathY);
            ctx.stroke();
        }
        ctx.restore();

        // Hedef Bayrak
        ctx.save();
        ctx.fillStyle = '#10B981';
        ctx.fillRect(s.targetX - 4, s.pathY - 45, 8, 50);
        ctx.beginPath();
        ctx.moveTo(s.targetX + 4, s.pathY - 45);
        ctx.lineTo(s.targetX + 36, s.pathY - 30);
        ctx.lineTo(s.targetX + 4, s.pathY - 15);
        ctx.fill();
        ctx.restore();

        // Engel (Kaya / Bug)
        if (!s.rock.cleared) {
            ctx.save();
            ctx.fillStyle = '#64748B';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.rock.x, s.rock.y, s.rock.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#F87171';
            ctx.font = 'bold 22px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('!', s.rock.x, s.rock.y + 7);
            ctx.restore();
        }

        // Fırça
        CanvasEngine.drawBrush(ctx, s.brush.x, s.pathY - 25, 15, 1, '#3B82F6', s.brush.x >= s.targetX);
    }

    // Task 6: Ritmik Yörünge ve Sayaç (Fırça teğet hizalaması düzeltildi)
    _renderTask6() {
        const ctx = this.ctx;
        const s = this.state;

        // Elips Ray Yolu
        ctx.save();
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(s.cx, s.cy, s.radiusX, s.radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(s.cx + s.radiusX, s.cy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Fırça konumu ve hız teğet açısı
        const bx = s.cx + Math.cos(s.angle) * s.radiusX;
        const by = s.cy + Math.sin(s.angle) * s.radiusY;

        // Hız vektörü teğeti
        const vx = -s.radiusX * Math.sin(s.angle);
        const vy = s.radiusY * Math.cos(s.angle);
        // Yerel fırça ucu +Y ekseninde olduğundan -90 dönüşle tam teğete hizalanır
        const brushAngle = (Math.atan2(vy, vx) * 180 / Math.PI) - 90;

        CanvasEngine.drawBrush(ctx, bx, by, brushAngle, 0.9, '#10B981', s.completedTours >= s.selectedTours);
    }

    // Task 7: İki Yollu Koşul (If-Else)
    _renderTask7() {
        const ctx = this.ctx;
        const s = this.state;

        const cx = s.center.x;
        const cy = s.center.y;

        s.wavePulse = (s.wavePulse + 2) % 100;
        const isPurple = s.currentWave === 'purple';

        ctx.save();
        ctx.strokeStyle = isPurple ? `rgba(139, 92, 246, ${1 - s.wavePulse / 100})` : `rgba(245, 158, 11, ${1 - s.wavePulse / 100})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 20 + s.wavePulse, 0, Math.PI * 2);
        ctx.stroke();

        // Merkezdeki sinyal küresi
        ctx.fillStyle = isPurple ? '#8B5CF6' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('🔊', cx, cy + 6);
        ctx.restore();

        // Mor Kapı (Sol)
        const p = s.purpleDoor;
        ctx.save();
        ctx.fillStyle = '#8B5CF6';
        ctx.strokeStyle = '#5B21B6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, [20, 20, 4, 4]);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('MOR KAPI', p.x, p.y + 10);
        ctx.restore();

        // Sarı Kapı (Sağ)
        const y = s.yellowDoor;
        ctx.save();
        ctx.fillStyle = '#F59E0B';
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(y.x - y.w / 2, y.y - y.h / 2, y.w, y.h, [20, 20, 4, 4]);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('SARI KAPI', y.x, y.y + 10);
        ctx.restore();
    }

    // Task 8: Dokunsal Boyut Ölçekleme
    _renderTask8() {
        const ctx = this.ctx;
        const s = this.state;

        // Dar Tünel Duvarları
        ctx.save();
        ctx.fillStyle = '#475569';
        // Üst duvar
        ctx.fillRect(s.tunnelX, 0, s.tunnelWidth, (this.height - s.tunnelGap) / 2);
        // Alt duvar
        ctx.fillRect(s.tunnelX, (this.height + s.tunnelGap) / 2, s.tunnelWidth, (this.height - s.tunnelGap) / 2);

        // Tünel Açıklığı çizgileri
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(s.tunnelX, (this.height - s.tunnelGap) / 2, s.tunnelWidth, s.tunnelGap);
        ctx.restore();

        // Fırça
        CanvasEngine.drawBrush(ctx, s.brushX, s.brushY, 0, s.scale, '#EC4899', s.passed);
    }

    // Task 9: Pentatonik Dizi Hafızası (Slot HUD gösterimi eklendi)
    _renderTask9() {
        const ctx = this.ctx;
        const s = this.state;

        // Üstte Sıralı Melodi Kutucukları (Çocuk Dostu)
        ctx.save();
        const startX = this.width / 2 - 90;
        for (let i = 0; i < s.targetSequence.length; i++) {
            const bx = startX + i * 65;
            const by = 40;
            const isEntered = i < s.playerInput.length;
            const noteText = isEntered ? s.playerInput[i] : (s.isPlayingDemo ? s.targetSequence[i] : '🎵');

            ctx.fillStyle = isEntered ? '#10B981' : (s.isPlayingDemo ? '#FEF08A' : '#E2E8F0');
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(bx, by, 50, 40, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isEntered ? '#FFFFFF' : '#1E293B';
            ctx.font = 'bold 15px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText(noteText, bx + 25, by + 26);
        }
        ctx.restore();

        // Ksilofon Tuşları
        for (let key of s.keys) {
            ctx.save();
            ctx.fillStyle = key.active ? '#FEF08A' : key.color;
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(key.x, key.y, key.w, key.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = key.active ? '#1E293B' : '#FFFFFF';
            ctx.font = 'bold 18px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText(key.name, key.x + key.w / 2, key.y + key.h / 2 + 6);
            ctx.restore();
        }
    }

    // Task 10: Simetrik Çift Nesne
    _renderTask10() {
        const ctx = this.ctx;
        const s = this.state;

        // Ayna Ekseni
        ctx.save();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 20);
        ctx.lineTo(this.width / 2, this.height - 20);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 12px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('🪞 AYNA EKSENİ', this.width / 2, 16);
        ctx.restore();

        // Sol Hedef Yuvası
        ctx.save();
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.leftTarget.x, s.leftTarget.y, s.leftTarget.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.fill();
        ctx.restore();

        // Sağ Hedef Yuvası
        ctx.save();
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.rightTarget.x, s.rightTarget.y, s.rightTarget.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.fill();
        ctx.restore();

        // Sol Fırça
        CanvasEngine.drawBrush(ctx, s.leftBrush.x, s.leftBrush.y, 0, 1, '#3B82F6', s.reached);

        // Sağ Fırça (Ayna İkizi)
        CanvasEngine.drawBrush(ctx, s.rightBrush.x, s.rightBrush.y, 0, 1, '#EC4899', s.reached);
    }

    verifyConditionDoor(color) {
        return this._verifyConditionDoor(color);
    }
}

window.TaskEngine = TaskEngine;
window.GorevEngine = TaskEngine;

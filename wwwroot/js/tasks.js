/**
 * RhythmCode - Section 1 Tasks (1 - 10) Orchestration Engine
 * Modular architecture delegating tasks 1-10 to window.TaskChapter1Modules
 */

window.TaskChapter1Modules = window.TaskChapter1Modules || {};

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
        if (this.taskId <= 10) {
            const mod = window.TaskChapter1Modules[this.taskId];
            if (mod && typeof mod.initState === 'function') {
                mod.initState(this);
            } else {
                console.warn(`Chapter 1 task module for Task ${this.taskId} not found.`);
            }
        }
    }

    // ==========================================
    // ETKİLEŞİM İŞLEYİCİLERİ (Pointer Handlers)
    // ==========================================
    handlePointerDown(pos) {
        if (window.RhythmMixer) window.RhythmMixer.ensureContext();

        if (this.taskId <= 10) {
            const mod = window.TaskChapter1Modules[this.taskId];
            if (mod && typeof mod.handlePointerDown === 'function') {
                mod.handlePointerDown(this, pos);
            }
        }
    }

    handlePointerMove(pos) {
        if (this.taskId <= 10) {
            const mod = window.TaskChapter1Modules[this.taskId];
            if (mod && typeof mod.handlePointerMove === 'function') {
                mod.handlePointerMove(this, pos);
            }
        }
    }

    handlePointerUp() {
        if (this.taskId <= 10) {
            const mod = window.TaskChapter1Modules[this.taskId];
            if (mod && typeof mod.handlePointerUp === 'function') {
                mod.handlePointerUp(this);
            }
        }
    }

    // ==========================================
    // ACTION DISPATCHER METHODS (Buttons & Tests)
    // ==========================================

    // Görev 5: Engeli Temizleme & Fırçayı Yürütme
    clearObstacle() {
        window.TaskChapter1Modules[5]?.clearObstacle?.(this);
    }

    // Görev 6: Yıldız Döngüsünü Çalıştırma & Tahmin Etme
    startLoopRun() {
        window.TaskChapter1Modules[6]?.startLoopRun?.(this);
    }

    guessLoopCount(count, btnEl = null) {
        window.TaskChapter1Modules[6]?.guessLoopCount?.(this, count, btnEl);
    }

    setLoopTours(count, btnEl = null) {
        this.guessLoopCount(count, btnEl);
    }

    // Görev 7: İki Yollu Koşul (If-Else)
    playWaveSignalSound() {
        window.TaskChapter1Modules[7]?.playWaveSignalSound?.(this);
    }

    verifyConditionDoor(selected) {
        window.TaskChapter1Modules[7]?.verifyConditionDoor?.(this, selected);
    }

    _verifyConditionDoor(selected) {
        this.verifyConditionDoor(selected);
    }

    cycleWaveCondition(playSound = true) {
        window.TaskChapter1Modules[7]?.cycleWaveCondition?.(this, playSound);
    }

    _cycleWaveCondition(playSound = true) {
        this.cycleWaveCondition(playSound);
    }

    // Görev 8: Dokunsal Boyut Ölçekleme
    changeBrushScale(delta) {
        window.TaskChapter1Modules[8]?.changeBrushScale?.(this, delta);
    }

    passThroughTunnel() {
        window.TaskChapter1Modules[8]?.passThroughTunnel?.(this);
    }

    // Görev 9: Pentatonik Melodi Hafızası
    playDemoSequence() {
        window.TaskChapter1Modules[9]?.playDemoSequence?.(this);
    }

    pressPianoKey(key) {
        window.TaskChapter1Modules[9]?.pressPianoKey?.(this, key);
    }

    _pressPianoKey(key) {
        this.pressPianoKey(key);
    }

    // Generic Action Dispatcher for Chapter 1 (Mirrors executeChapter2Action)
    executeChapter1Action(actionName, ...args) {
        const mod = window.TaskChapter1Modules[this.taskId];
        if (mod && typeof mod[actionName] === 'function') {
            return mod[actionName](this, ...args);
        }
    }

    // Render delegations for Tasks 1-10 (Backward Compatibility)
    _renderTask1() { window.TaskChapter1Modules[1]?.render?.(this); }
    _renderTask2() { window.TaskChapter1Modules[2]?.render?.(this); }
    _renderTask3() { window.TaskChapter1Modules[3]?.render?.(this); }
    _renderTask4() { window.TaskChapter1Modules[4]?.render?.(this); }
    _renderTask5() { window.TaskChapter1Modules[5]?.render?.(this); }
    _renderTask6() { window.TaskChapter1Modules[6]?.render?.(this); }
    _renderTask7() { window.TaskChapter1Modules[7]?.render?.(this); }
    _renderTask8() { window.TaskChapter1Modules[8]?.render?.(this); }
    _renderTask9() { window.TaskChapter1Modules[9]?.render?.(this); }
    _renderTask10() { window.TaskChapter1Modules[10]?.render?.(this); }

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

        this._setupCelebrationContent();

        const modal = document.getElementById('celebrationModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    _setupCelebrationContent() {
        const desc = document.getElementById('celebrationDesc');
        const img = document.getElementById('celebrationPuskulImg');

        // Çocukları sevindiren, sıcak ve motive edici Püskül mesajları
        const encouragingMessages = [
            "Süpersin! Bunu tek başına harika bir şekilde başardın, seninle çok gurur duyuyoruz!",
            "Aferin sana! Süper zekanla bu görevi şipşak çözdün, sıradaki macera seni bekliyor!",
            "Vay canına, tam bir kahraman gibi başardın! Püskül senin için sevinçten havalara zıplıyor!",
            "Harika iş çıkardın! Her adımda daha da güçleniyorsun, gerçekten müthişsin!",
            "Yaşasın! Ne kadar dikkatli ve zekisin, bu görevi tereyağından kıl çeker gibi geçtin!",
            "Bravo şampiyon! Hayal gücün ve başarma azmin göz kamaştırıyor!",
            "İnanılmazsın! Püskül seninle arkadaş olduğu için çok mutlu, yeni sürprize hazır mısın?"
        ];

        let message = encouragingMessages[(this.taskId - 1) % encouragingMessages.length];
        const faceImg = '/img/firca-yuz.svg';

        if (this.taskId === 10) {
            message = "Vay canına, 1. Bölümün şampiyonu oldun! 10 görevin hepsini başardın, şimdi yepyeni bir macera seni bekliyor!";
        } else if (this.taskId === 22) {
            message = "Efsanesin! 22 görevin tamamını çözüp büyük bir başarıya imza attın! Artık gerçek bir kodlama kahramanısın!";
        }

        if (desc) desc.textContent = message;
        if (img) img.src = faceImg;
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
        if (this.taskId <= 10) {
            const mod = window.TaskChapter1Modules[this.taskId];
            if (mod && typeof mod.render === 'function') {
                mod.render(this);
            }
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
}

window.TaskEngine = TaskEngine;
window.GorevEngine = TaskEngine;

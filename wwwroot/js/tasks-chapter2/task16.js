/**
 * Chapter 2 - Task 16: 5 Bitlik Tam Panel (16, 8, 4, 2, 1) ile Hedef Bulmaca
 * Concept: 5 Bitlik Panel (0-31)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[16] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 128, switchY: 232 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 128, switchY: 232 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 128, switchY: 232 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 128, switchY: 232 },
                    { val: 1, label: '1', isOn: false, x: 550, y: 128, switchY: 232 }
                ],
                target: 7,
                checkBtn: { x: 295, y: 312, w: 176, h: 42, press: 0, wobble: 0 },
                resetBtn: { x: 420, y: 312, w: 48, h: 42, press: 0 },
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 7 • Uygun ampulleri yak ve 'Kontrol Et' butonuna bas!");
        },

        toggleBulb(engine, index) {
            if (engine.isCompleted) return;
            const s = engine.state;
            if (index < 0 || index >= s.bulbs.length) return;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            const b = s.bulbs[index];
            b.isOn = !b.isOn;

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(b.isOn);
                } else {
                    window.RhythmMixer.playPop(b.isOn ? (450 + b.val * 10) : 300);
                }
            }

            if (b.isOn) {
                engine.particles.burst(b.x, b.y, 16);
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: ${currentSum}`);
        },

        checkAnswer(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (currentSum === s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD("Harika! 4 + 2 + 1 = 7 toplamını tam olarak doğruladın!");
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    if (!engine.isCompleted && sum === s.target) {
                        engine.triggerComplete();
                    }
                }, 450);
            } else {
                s.checkBtn.wobble = 16;
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(false);
                } else if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                this.resetBulbs(engine);
                engine._updateHUD(`Toplam ${currentSum} oldu, hedef ${s.target} idi! Devre sıfırlandı, tekrar dene.`);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }
            s.bulbs.forEach(b => b.isOn = false);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: 0`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            const btn = s.checkBtn;
            if (Math.abs(pos.x - btn.x) <= btn.w / 2 && Math.abs(pos.y - btn.y) <= btn.h / 2) {
                btn.press = 1;
                this.checkAnswer(engine);
                return;
            }

            const rBtn = s.resetBtn;
            if (Math.abs(pos.x - rBtn.x) <= rBtn.w / 2 && Math.abs(pos.y - rBtn.y) <= rBtn.h / 2) {
                rBtn.press = 1;
                this.resetBulbs(engine);
                return;
            }

            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                const inSwitch = (
                    pos.x >= b.x - 28 &&
                    pos.x <= b.x + 28 &&
                    pos.y >= b.switchY - 24 &&
                    pos.y <= b.switchY + 24
                );
                if (distBulb <= 42 || inSwitch) {
                    this.toggleBulb(engine, i);
                    break;
                }
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.045;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            const binaryText = s.bulbs.map(b => b.isOn ? '1' : '0').join('');

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 440,
                target: s.target,
                current: currentSum,
                binaryText,
                accentColor: '#F472B6',
                isMatched: currentSum === s.target
            });

            // Yatay Güç Hattı
            CanvasEngine.drawPowerBus(ctx, 54, 586, 232, currentSum > 0, s.pulse);

            // 5 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 30, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.96,
                    label: b.label,
                    labelPosition: 'top',
                    color: '#EC4899',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 52,
                    h: 38,
                    label: b.isOn ? '1' : '0'
                });
            });

            // 3D Kontrol Et ve Sıfırla Butonları
            CanvasEngine.drawCircuitButton(ctx, s.checkBtn, 'Kontrol Et', {
                bg: currentSum === s.target ? '#10B981' : '#EC4899',
                border: currentSum === s.target ? '#059669' : '#BE185D'
            });
            CanvasEngine.drawCircuitButton(ctx, s.resetBtn, '↺', {
                bg: '#475569',
                border: '#334155',
                font: 'bold 18px Fredoka, Nunito, sans-serif'
            });
        }
    };
})();

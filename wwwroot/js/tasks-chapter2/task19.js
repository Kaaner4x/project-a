/**
 * Chapter 2 - Task 19: Çift ve Tek Sayıların Son Biti (LSB / 2^0 = 1)
 * Concept: En Düşük Anlamlı Bit (LSB / Tek-Çift Kuralı)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[19] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 128, switchY: 232 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 128, switchY: 232 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 128, switchY: 232 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 128, switchY: 232 },
                    { val: 1, label: '1 (SON)', isOn: false, x: 550, y: 128, switchY: 232 }
                ],
                target: 14,
                checkBtn: { x: 295, y: 312, w: 186, h: 42, press: 0, wobble: 0 },
                resetBtn: { x: 426, y: 312, w: 48, h: 42, press: 0 },
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Kural: 14 ÇİFT sayısını oluştur! En sağdaki 1 biti 0 (Kapalı) olmalıdır.");
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
                    window.RhythmMixer.playPop(b.isOn ? (480 + b.val * 10) : 300);
                }
            }

            if (b.isOn) {
                engine.particles.burst(b.x, b.y, 16);
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            const lsbIsZero = !s.bulbs[4].isOn;
            engine._updateHUD(`Toplam: ${currentSum} (Hedef: 14 Çift) • Son Bit = ${lsbIsZero ? '0 (Çift)' : '1 (Tek)'}`);
        },

        checkAnswer(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            const lsbIsZero = !s.bulbs[4].isOn;

            if (currentSum === s.target && lsbIsZero) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD("Harika! 8 + 4 + 2 = 14 çift sayısını oluşturdun ve en sağdaki bit 0 kaldı!");
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    const lsb = !s.bulbs[4].isOn;
                    if (!engine.isCompleted && sum === s.target && lsb) {
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
                if (currentSum !== s.target) {
                    engine._updateHUD(`Toplam ${currentSum} oldu, hedef 14 (8 + 4 + 2). Tekrar kontrol et!`);
                } else {
                    engine._updateHUD("14 bir ÇİFT sayıdır! En sağdaki 1 ampulü KAPALI (0) olmalıdır!");
                }
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }
            s.bulbs.forEach(b => b.isOn = false);
            engine._updateHUD("Tüm ampuller sıfırlandı. Değeri 14 olan ÇİFT sayıyı kur!");
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
            const lsbIsZero = !s.bulbs[4].isOn;
            const binaryText = s.bulbs.map(b => b.isOn ? '1' : '0').join('');

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 510,
                target: '14 (ÇİFT)',
                current: currentSum,
                binaryText,
                statusLabel: 'SON BİT',
                statusText: lsbIsZero ? 'ÇİFT ✓' : 'TEK ✗',
                statusOk: lsbIsZero,
                accentColor: '#2DD4BF',
                isMatched: currentSum === s.target && lsbIsZero
            });

            // Sağdaki LSB (1) basamağını vurgulayan kesikli çerçeve
            ctx.save();
            ctx.fillStyle = lsbIsZero ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.09)';
            ctx.strokeStyle = lsbIsZero ? '#10B981' : '#EF4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.roundRect(506, 76, 88, 198, 16);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Yatay Güç Hattı
            CanvasEngine.drawPowerBus(ctx, 54, 586, 232, currentSum > 0, s.pulse);

            // 5 Ampul ve Anahtarlar
            s.bulbs.forEach((b, idx) => {
                const isLsb = idx === 4;
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 30, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.96,
                    label: b.label,
                    labelPosition: 'top',
                    color: isLsb ? '#0D9488' : '#14B8A6',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 52,
                    h: 38,
                    label: b.isOn ? '1' : '0'
                });
            });

            // 3D Kuralı Kontrol Et ve Sıfırla Butonları
            const ready = currentSum === s.target && lsbIsZero;
            CanvasEngine.drawCircuitButton(ctx, s.checkBtn, 'Kuralı Kontrol Et', {
                bg: ready ? '#10B981' : '#14B8A6',
                border: ready ? '#059669' : '#0F766E'
            });
            CanvasEngine.drawCircuitButton(ctx, s.resetBtn, '↺', {
                bg: '#475569',
                border: '#334155',
                font: 'bold 18px Fredoka, Nunito, sans-serif'
            });
        }
    };
})();

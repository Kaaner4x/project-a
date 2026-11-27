/**
 * Chapter 2 - Task 20: Bit Kaydırma Mantığı (x2 ve /2 İlişkisi)
 * Concept: Bit Kaydırma (Bitshift: << ve >>)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[20] = {
        initState(engine) {
            // Başlangıç: 2 açık (activeIdx = 3), Hedef: 8 (activeIdx = 1)
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', x: 90, y: 150 },
                    { val: 8, label: '8', x: 205, y: 150 },
                    { val: 4, label: '4', x: 320, y: 150 },
                    { val: 2, label: '2', x: 435, y: 150 },
                    { val: 1, label: '1', x: 550, y: 150 }
                ],
                activeIdx: 3,
                target: 8,
                leftBtn: { x: 205, y: 292, w: 170, h: 48, press: 0 },
                rightBtn: { x: 395, y: 292, w: 170, h: 48, press: 0 },
                resetBtn: { x: 520, y: 292, w: 48, h: 48, press: 0 },
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 8 • Biti 'Sola Kaydır (x2)' ile 8 basamağına ulaştır!");
        },

        shiftBits(engine, direction) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            if (direction === 'left') {
                if (s.activeIdx > 0) {
                    s.activeIdx--;
                    if (window.RhythmMixer) {
                        if (typeof window.RhythmMixer.playRelayClick === 'function') {
                            window.RhythmMixer.playRelayClick(true);
                        } else {
                            window.RhythmMixer.playPop(520);
                        }
                    }
                    const newBulb = s.bulbs[s.activeIdx];
                    engine.particles.burst(newBulb.x, newBulb.y, 20);
                }
            } else if (direction === 'right') {
                if (s.activeIdx < s.bulbs.length - 1) {
                    s.activeIdx++;
                    if (window.RhythmMixer) {
                        if (typeof window.RhythmMixer.playRelayClick === 'function') {
                            window.RhythmMixer.playRelayClick(false);
                        } else {
                            window.RhythmMixer.playPop(340);
                        }
                    }
                    const newBulb = s.bulbs[s.activeIdx];
                    engine.particles.burst(newBulb.x, newBulb.y, 16);
                }
            }

            const activeBulb = s.bulbs[s.activeIdx];
            engine._updateHUD(`Mevcut Değer: ${activeBulb.val} • Hedef Sayı: ${s.target}`);

            if (activeBulb.val === s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD("Tebrikler! Biti sola kaydırarak 2 -> 4 -> 8 hedefine ulaştın!");
                s.completeTimer = setTimeout(() => {
                    if (!engine.isCompleted && s.bulbs[s.activeIdx].val === s.target) {
                        engine.triggerComplete();
                    }
                }, 450);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }
            s.activeIdx = 3;
            engine._updateHUD(`Başlangıç: Değer: 2 • Hedef Sayı: ${s.target}`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            const lb = s.leftBtn;
            if (Math.abs(pos.x - lb.x) <= lb.w / 2 && Math.abs(pos.y - lb.y) <= lb.h / 2) {
                lb.press = 1;
                this.shiftBits(engine, 'left');
                return;
            }

            const rb = s.rightBtn;
            if (Math.abs(pos.x - rb.x) <= rb.w / 2 && Math.abs(pos.y - rb.y) <= rb.h / 2) {
                rb.press = 1;
                this.shiftBits(engine, 'right');
                return;
            }

            const rBtn = s.resetBtn;
            if (Math.abs(pos.x - rBtn.x) <= rBtn.w / 2 && Math.abs(pos.y - rBtn.y) <= rBtn.h / 2) {
                rBtn.press = 1;
                this.resetBulbs(engine);
                return;
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.045;
            const activeBulb = s.bulbs[s.activeIdx];
            const binaryText = s.bulbs.map((_, idx) => idx === s.activeIdx ? '1' : '0').join('');

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 440,
                target: s.target,
                currentLabel: 'DEĞER',
                current: activeBulb.val,
                binaryText,
                accentColor: '#60A5FA',
                isMatched: activeBulb.val === s.target
            });

            // Yatay Kaydırma Rayı
            CanvasEngine.drawPowerBus(ctx, 64, 576, 200, true, s.pulse);

            // Basamaklar arası x2 yön okları
            ctx.save();
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 14px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            for (let i = 0; i < s.bulbs.length - 1; i++) {
                const midX = (s.bulbs[i].x + s.bulbs[i + 1].x) / 2;
                ctx.fillText('«', midX, 148);
            }
            ctx.restore();

            // 5 Ampul
            s.bulbs.forEach((b, idx) => {
                const isOn = idx === s.activeIdx;
                CanvasEngine.drawBulb(ctx, b.x, b.y, isOn, {
                    scale: 1.04,
                    label: b.label,
                    labelPosition: 'top',
                    bitState: isOn,
                    color: '#3B82F6',
                    glowIntensity: isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
            });

            // 3D Sola / Sağa Kaydır ve Sıfırla Butonları
            CanvasEngine.drawCircuitButton(ctx, s.leftBtn, '⬅ Sola Kaydır (x2)', {
                bg: '#3B82F6',
                border: '#1D4ED8',
                disabled: s.activeIdx <= 0
            });
            CanvasEngine.drawCircuitButton(ctx, s.rightBtn, 'Sağa Kaydır (/2) ➡', {
                bg: '#64748B',
                border: '#475569',
                disabled: s.activeIdx >= s.bulbs.length - 1
            });
            CanvasEngine.drawCircuitButton(ctx, s.resetBtn, '↺', {
                bg: '#475569',
                border: '#334155',
                font: 'bold 18px Fredoka, Nunito, sans-serif'
            });
        }
    };
})();

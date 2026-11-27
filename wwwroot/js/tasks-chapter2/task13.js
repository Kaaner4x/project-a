/**
 * Chapter 2 - Task 13: İkinci Basamak (2^1 = 2) ve İkili Toplam
 * Concept: İkili Toplam (2^1 ve 2^0)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[13] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 2, label: '2¹ = 2', isOn: false, x: 225, y: 150, switchY: 272 },
                    { val: 1, label: '2⁰ = 1', isOn: false, x: 415, y: 150, switchY: 272 }
                ],
                target: 3,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 3 • 2 ve 1 değerli ampulleri yakarak toplamı 3 yap!");
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

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(b.isOn);
                } else {
                    window.RhythmMixer.playPop(b.isOn ? (520 + b.val * 50) : 300);
                }
            }

            if (b.isOn) {
                engine.particles.burst(b.x, b.y, 20);
            }

            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: ${currentSum}`);

            if (currentSum === s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD("Tebrikler! 2 + 1 = 3 ikili toplamını başarıyla oluşturdun!");
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    if (!engine.isCompleted && sum === s.target) {
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
            s.bulbs.forEach(b => b.isOn = false);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: 0`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                const inSwitch = (
                    pos.x >= b.x - 36 &&
                    pos.x <= b.x + 36 &&
                    pos.y >= b.switchY - 28 &&
                    pos.y <= b.switchY + 28
                );
                if (distBulb <= 48 || inSwitch) {
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
                w: 390,
                target: s.target,
                current: currentSum,
                binaryText,
                accentColor: '#38BDF8',
                isMatched: currentSum === s.target
            });

            // Yatay Güç Hattı
            CanvasEngine.drawPowerBus(ctx, 130, 510, 272, currentSum > 0, s.pulse);

            // Ampuller ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 24, b.x, b.y + 36, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.18,
                    label: b.label,
                    labelPosition: 'top',
                    color: '#0EA5E9',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 66,
                    h: 46,
                    label: b.isOn ? 'AÇIK (1)' : 'KAPALI (0)'
                });
            });
        }
    };
})();

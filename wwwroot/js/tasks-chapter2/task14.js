/**
 * Chapter 2 - Task 14: Üçüncü Basamak (2^2 = 4) ile 0–7 Aralığı
 * Concept: 3 Bitlik Sayı (2^2, 2^1, 2^0)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[14] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 4, label: '2² = 4', isOn: false, x: 165, y: 150, switchY: 272 },
                    { val: 2, label: '2¹ = 2', isOn: false, x: 320, y: 150, switchY: 272 },
                    { val: 1, label: '2⁰ = 1', isOn: false, x: 475, y: 150, switchY: 272 }
                ],
                target: 5,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 5 • 4, 2, 1 ampullerini kullanarak 5'e ulaş!");
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
                    window.RhythmMixer.playPop(b.isOn ? (500 + b.val * 30) : 300);
                }
            }

            if (b.isOn) {
                engine.particles.burst(b.x, b.y, 20);
            }

            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: ${currentSum}`);

            if (currentSum === s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD("Tebrikler! 4 + 1 = 5 yaparak 3 bitlik hedefi tam tutturdun!");
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
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: 0`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                const inSwitch = (
                    pos.x >= b.x - 34 &&
                    pos.x <= b.x + 34 &&
                    pos.y >= b.switchY - 26 &&
                    pos.y <= b.switchY + 26
                );
                if (distBulb <= 46 || inSwitch) {
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
                w: 400,
                target: s.target,
                current: currentSum,
                binaryText,
                accentColor: '#FBBF24',
                isMatched: currentSum === s.target
            });

            // Yatay Güç Hattı
            CanvasEngine.drawPowerBus(ctx, 95, 545, 272, currentSum > 0, s.pulse);

            // 3 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 22, b.x, b.y + 34, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.12,
                    label: b.label,
                    labelPosition: 'top',
                    color: '#F59E0B',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 62,
                    h: 44,
                    label: b.isOn ? '1' : '0'
                });
            });
        }
    };
})();

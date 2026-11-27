/**
 * Chapter 2 - Task 15: Dördüncü Basamak (2^3 = 8) ile 0–15 Aralığı
 * Concept: 4 Bitlik Sayı (Nibble / 0-15)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[15] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 8, label: '2³ = 8', isOn: false, x: 125, y: 150, switchY: 272 },
                    { val: 4, label: '2² = 4', isOn: false, x: 255, y: 150, switchY: 272 },
                    { val: 2, label: '2¹ = 2', isOn: false, x: 385, y: 150, switchY: 272 },
                    { val: 1, label: '2⁰ = 1', isOn: false, x: 515, y: 150, switchY: 272 }
                ],
                target: 10,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 10 • 8, 4, 2, 1 ampullerinden doğru olanları yakarak 10'a ulaş!");
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
                    window.RhythmMixer.playPop(b.isOn ? (480 + b.val * 20) : 300);
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
                engine._updateHUD("Tebrikler! 8 + 2 = 10 ikili sayısını (1010) başarıyla oluşturdun!");
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
                    pos.x >= b.x - 32 &&
                    pos.x <= b.x + 32 &&
                    pos.y >= b.switchY - 26 &&
                    pos.y <= b.switchY + 26
                );
                if (distBulb <= 44 || inSwitch) {
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
                w: 420,
                target: s.target,
                current: currentSum,
                binaryText,
                accentColor: '#A78BFA',
                isMatched: currentSum === s.target
            });

            // Yatay Güç Hattı
            CanvasEngine.drawPowerBus(ctx, 72, 568, 272, currentSum > 0, s.pulse);

            // 4 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 22, b.x, b.y + 34, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.08,
                    label: b.label,
                    labelPosition: 'top',
                    color: '#8B5CF6',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 58,
                    h: 42,
                    label: b.isOn ? '1' : '0'
                });
            });
        }
    };
})();

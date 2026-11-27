/**
 * Chapter 2 - Task 15: Dördüncü Basamak (2^3 = 8) ile 0–15 Aralığı
 * Concept: 4 Bitlik Sayı (Nibble / 0-15)
 *
 * 8, 4, 2, 1 ağırlıklarıyla Hedef Sayı: 10'a ulaşma (8 + 2 = 10).
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[15] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 8, label: '2³ = 8', isOn: false, x: 130, y: 130, switchY: 245 },
                    { val: 4, label: '2² = 4', isOn: false, x: 255, y: 130, switchY: 245 },
                    { val: 2, label: '2¹ = 2', isOn: false, x: 380, y: 130, switchY: 245 },
                    { val: 1, label: '2⁰ = 1', isOn: false, x: 505, y: 130, switchY: 245 }
                ],
                target: 10,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 10 • 8, 4, 2, 1 ampullerinden doğru olanları yakarak 10'a ulaş (8 + 2 = 10)! 💡");
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
                engine._updateHUD(`Tebrikler! 8 + 2 = 10 ikili sayısını (1010) başarıyla oluşturdun! 💡🎉`);
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
            s.pulse += 0.04;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            // Üst Bilgi Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(170, 16, 300, 48, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef Sayı:', 188, 38);
            ctx.fillStyle = '#8B5CF6';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${s.target}`, 262, 44);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Canlı Toplam:', 305, 38);
            ctx.fillStyle = currentSum === s.target ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${currentSum}`, 395, 44);
            ctx.restore();

            // 4 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 22, b.x, b.y + 34, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.05,
                    label: b.label,
                    labelPosition: 'top',
                    color: '#8B5CF6',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 56,
                    h: 42,
                    label: b.isOn ? '1' : '0'
                });
            });
        }
    };
})();

/**
 * Chapter 2 - Task 20: Bit Kaydırma Mantığı (x2 ve /2 İlişkisi)
 * Concept: Bit Kaydırma (Bitshift: << ve >>)
 *
 * Biti sola kaydırmak sayıyı 2 ile çarpar (x2), sağa kaydırmak 2'ye böler (/2).
 * Başlangıçta 2 değerli ampul yanar. "Sola Kaydır" ile Hedef Sayı: 8'e ulaşılır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[20] = {
        initState(engine) {
            // Basamaklar: 16 (idx 0), 8 (idx 1), 4 (idx 2), 2 (idx 3), 1 (idx 4)
            // Başlangıç: 2 açık (activeIdx = 3)
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', x: 90, y: 140 },
                    { val: 8, label: '8', x: 205, y: 140 },
                    { val: 4, label: '4', x: 320, y: 140 },
                    { val: 2, label: '2', x: 435, y: 140 },
                    { val: 1, label: '1', x: 550, y: 140 }
                ],
                activeIdx: 3, // 2 açık
                target: 8,    // Hedef: 8 (activeIdx = 1)
                leftBtn: { x: 230, y: 280, w: 155, h: 46 },
                rightBtn: { x: 410, y: 280, w: 155, h: 46 },
                pulse: 0
            };
            engine._updateHUD("Hedef Sayı: 8 • Biti 'Sola Kaydır (x2)' butonuna basarak 8 basamağına ulaştır! 💡");
        },

        shiftBits(engine, direction) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (direction === 'left') {
                if (s.activeIdx > 0) {
                    s.activeIdx--;
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playPop(520);
                    }
                    const newBulb = s.bulbs[s.activeIdx];
                    engine.particles.burst(newBulb.x, newBulb.y, 20);
                }
            } else if (direction === 'right') {
                if (s.activeIdx < s.bulbs.length - 1) {
                    s.activeIdx++;
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playPop(340);
                    }
                    const newBulb = s.bulbs[s.activeIdx];
                    engine.particles.burst(newBulb.x, newBulb.y, 16);
                }
            }

            const activeBulb = s.bulbs[s.activeIdx];
            engine._updateHUD(`Mevcut Değer: ${activeBulb.val} • Hedef Sayı: ${s.target}`);

            if (activeBulb.val === s.target) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playSparkle();
                }
                engine._updateHUD(`Tebrikler! Biti 2 kez sola kaydırarak sayıyı 2 ile çarptın (2 -> 4 -> 8) ve hedefe ulaştın! 💡🎉`);
                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            s.activeIdx = 3; // 2'ye dön
            engine._updateHUD(`Başlangıç: Değer: 2 • Hedef Sayı: ${s.target}`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            // Sola Kaydır Butonu
            const lb = s.leftBtn;
            if (
                pos.x >= lb.x - lb.w / 2 &&
                pos.x <= lb.x + lb.w / 2 &&
                pos.y >= lb.y - lb.h / 2 &&
                pos.y <= lb.y + lb.h / 2
            ) {
                this.shiftBits(engine, 'left');
                return;
            }

            // Sağa Kaydır Butonu
            const rb = s.rightBtn;
            if (
                pos.x >= rb.x - rb.w / 2 &&
                pos.x <= rb.x + rb.w / 2 &&
                pos.y >= rb.y - rb.h / 2 &&
                pos.y <= rb.y + rb.h / 2
            ) {
                this.shiftBits(engine, 'right');
                return;
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.04;
            const activeBulb = s.bulbs[s.activeIdx];

            // Üst Bilgi Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(170, 10, 300, 44, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef Sayı:', 188, 32);
            ctx.fillStyle = '#3B82F6';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${s.target}`, 262, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Mevcut Değer:', 305, 32);
            ctx.fillStyle = activeBulb.val === s.target ? '#10B981' : '#3B82F6';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${activeBulb.val}`, 405, 38);
            ctx.restore();

            // 5 Ampul
            s.bulbs.forEach((b, idx) => {
                const isOn = idx === s.activeIdx;
                CanvasEngine.drawBulb(ctx, b.x, b.y, isOn, {
                    scale: 1.0,
                    label: b.label,
                    bitState: isOn,
                    color: '#3B82F6',
                    glowIntensity: isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
            });

            // "Sola Kaydır (x2)" Butonu
            const lb = s.leftBtn;
            ctx.save();
            ctx.fillStyle = '#3B82F6';
            ctx.strokeStyle = '#1D4ED8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(lb.x - lb.w / 2, lb.y - lb.h / 2, lb.w, lb.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⬅️ Sola Kaydır (x2)', lb.x, lb.y);
            ctx.restore();

            // "Sağa Kaydır (/2)" Butonu
            const rb = s.rightBtn;
            ctx.save();
            ctx.fillStyle = '#64748B';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(rb.x - rb.w / 2, rb.y - rb.h / 2, rb.w, rb.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Sağa Kaydır (/2) ➡️', rb.x, rb.y);
            ctx.restore();
        }
    };
})();

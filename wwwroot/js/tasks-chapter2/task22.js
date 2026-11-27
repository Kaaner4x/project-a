/**
 * Chapter 2 - Task 22: Final İkilik Toplam Sınavı (5 Ampul + Sıfırlama Kuralı)
 * Concept: Final 5 Bit Binary Mastery (Büyük Final Sınavı)
 *
 * Tüm 2^n (16, 8, 4, 2, 1) basamaklarını kullanarak Hedef Sayı: 7'ye ulaşma (4 + 2 + 1 = 7).
 * "Kontrol Et"e basıldığında açık ampullerin toplamı 7 ise bölüm tamamlanır;
 * değilse tüm ampuller kapatılıp sıfırlanır ve oyuncu baştan dener.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[22] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 135, switchY: 220 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 135, switchY: 220 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 135, switchY: 220 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 135, switchY: 220 },
                    { val: 1, label: '1', isOn: false, x: 550, y: 135, switchY: 220 }
                ],
                target: 7,
                checkBtn: { x: 320, y: 300, w: 180, h: 46 },
                pulse: 0
            };
            engine._updateHUD("Büyük Final Sınavı! Hedef Sayı: 7 • 5 ampulden doğru olanları yak ve 'Kontrol Et'e bas! (Hatalıysa sıfırlanır) 👑");
        },

        toggleBulb(engine, index) {
            if (engine.isCompleted) return;
            const s = engine.state;
            if (index < 0 || index >= s.bulbs.length) return;

            const b = s.bulbs[index];
            b.isOn = !b.isOn;

            if (b.isOn) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(460 + b.val * 10);
                }
                engine.particles.burst(b.x, b.y, 18);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(300);
                }
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: ${currentSum} • 'Kontrol Et'e bas`);
        },

        checkAnswer(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (currentSum === s.target) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playSparkle();
                }
                engine.particles.burst(320, 200, 45);
                engine._updateHUD(`Muhteşem! 4 + 2 + 1 = 7! 2. Bölüm İkilik Sistem Sınavını ve 22 görevin tamamını başarıyla tamamladın! 👑🎉`);
                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(200);
                }
                // Sıfırlama Kuralı: Tüm ampuller kapatılır, toplam sıfırlanır
                this.resetBulbs(engine);
                engine._updateHUD(`Toplam ${currentSum} oldu, hedef ${s.target} idi! Sıfırlama kuralı: Devre kapandı, baştan dene! 🔄`);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            s.bulbs.forEach(b => b.isOn = false);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: 0 • Tekrar dene`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            // Check Kontrol Et Button
            const btn = s.checkBtn;
            if (
                pos.x >= btn.x - btn.w / 2 &&
                pos.x <= btn.x + btn.w / 2 &&
                pos.y >= btn.y - btn.h / 2 &&
                pos.y <= btn.y + btn.h / 2
            ) {
                this.checkAnswer(engine);
                return;
            }

            // Check bulbs & switches
            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                const inSwitch = (
                    pos.x >= b.x - 26 &&
                    pos.x <= b.x + 26 &&
                    pos.y >= b.switchY - 22 &&
                    pos.y <= b.switchY + 22
                );
                if (distBulb <= 40 || inSwitch) {
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
            const isTargetMet = currentSum === s.target;

            // Üst Bilgi Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(160, 10, 320, 44, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef Sayı:', 178, 32);
            ctx.fillStyle = '#F59E0B';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${s.target}`, 252, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Canlı Toplam:', 295, 32);
            ctx.fillStyle = isTargetMet ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${currentSum}`, 385, 38);
            ctx.restore();

            // 5 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 32, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.95,
                    label: b.label,
                    bitState: b.isOn,
                    color: '#F59E0B',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
                CanvasEngine.drawSwitch(ctx, b.x, b.switchY, b.isOn, {
                    w: 50,
                    h: 38,
                    label: b.isOn ? '1' : '0'
                });
            });

            // "Kontrol Et" Butonu
            const btn = s.checkBtn;
            ctx.save();
            ctx.fillStyle = '#F59E0B';
            ctx.strokeStyle = '#D97706';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(btn.x - btn.w / 2, btn.y - btn.h / 2, btn.w, btn.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👑 Sınavı Kontrol Et', btn.x, btn.y);
            ctx.restore();
        }
    };
})();

/**
 * Chapter 2 - Task 18: Eksik Biti Tamamlama (Kısmi Toplamdan Hedefe)
 * Concept: Fark Analizi & Eksik Bit
 *
 * Başlangıçta 8 ve 1 açık (toplam = 9). Hedef Sayı: 13.
 * Farkı kapatmak için 4 değerli ampul yakılır (9 + 4 = 13) ve Kontrol Et'e basılır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[18] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 135, switchY: 220 },
                    { val: 8, label: '8', isOn: true, x: 205, y: 135, switchY: 220 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 135, switchY: 220 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 135, switchY: 220 },
                    { val: 1, label: '1', isOn: true, x: 550, y: 135, switchY: 220 }
                ],
                target: 13,
                checkBtn: { x: 320, y: 300, w: 160, h: 44 },
                pulse: 0
            };
            engine._updateHUD("Hedef Sayı: 13 • Şu an 8 + 1 = 9 açık. Eksik olan basamağı açıp 'Kontrol Et'e bas! 💡");
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
                engine.particles.burst(b.x, b.y, 16);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(300);
                }
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: ${currentSum} • 'Kontrol Et'e bas`);
        },

        checkAnswer(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (currentSum === s.target) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playSparkle();
                }
                engine._updateHUD(`Harika! 8 + 4 + 1 = 13! Eksik basamağı tam yerinde tamamladın! 💡🎉`);
                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                // Hatalıysa başlangıç durumuna sıfırla
                this.resetBulbs(engine);
                engine._updateHUD(`Toplam ${currentSum} oldu, hedef ${s.target} idi! Devre başlangıç durumuna döndü, tekrar dene. 🔄`);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            s.bulbs[0].isOn = false; // 16
            s.bulbs[1].isOn = true;  // 8
            s.bulbs[2].isOn = false; // 4
            s.bulbs[3].isOn = false; // 2
            s.bulbs[4].isOn = true;  // 1
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: 9 (8 + 1)`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            // Check Kontrol Et
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
            ctx.fillStyle = '#F97316';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${s.target}`, 262, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Canlı Toplam:', 305, 32);
            ctx.fillStyle = currentSum === s.target ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${currentSum}`, 395, 38);
            ctx.restore();

            // 5 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 32, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.95,
                    label: b.label,
                    bitState: b.isOn,
                    color: '#F97316',
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
            ctx.fillStyle = '#F97316';
            ctx.strokeStyle = '#C2410C';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(btn.x - btn.w / 2, btn.y - btn.h / 2, btn.w, btn.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔍 Kontrol Et', btn.x, btn.y);
            ctx.restore();
        }
    };
})();

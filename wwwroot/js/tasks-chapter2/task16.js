/**
 * Chapter 2 - Task 16: 5 Bitlik Tam Panel (16, 8, 4, 2, 1) ile Hedef Bulmaca
 * Concept: 5 Bitlik Panel (0-31)
 *
 * 16, 8, 4, 2, 1 değerleriyle Hedef Sayı: 7'ye ulaşma (4 + 2 + 1 = 7).
 * "Kontrol Et" butonu ile doğrulanır; yanlışsa tüm ampuller kapatılıp sıfırlanır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[16] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 112, switchY: 225 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 112, switchY: 225 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 112, switchY: 225 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 112, switchY: 225 },
                    { val: 1, label: '1', isOn: false, x: 550, y: 112, switchY: 225 }
                ],
                target: 7,
                checkBtn: { x: 320, y: 310, w: 170, h: 42 },
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 7 • Uygun ampulleri yak ve 'Kontrol Et' butonuna bas! (Yanlışsa sıfırlanır) 💡");
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
            engine._updateHUD(`Hedef Sayı: ${s.target} • Canlı Toplam: ${currentSum} • 'Kontrol Et'e bas`);
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
                engine._updateHUD(`Harika! 4 + 2 + 1 = 7 toplamını tam olarak doğruladın! 💡🎉`);
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    if (!engine.isCompleted && sum === s.target) {
                        engine.triggerComplete();
                    }
                }, 450);
            } else {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(false);
                } else if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                // Sıfırlama kuralı
                this.resetBulbs(engine);
                engine._updateHUD(`Toplam ${currentSum} oldu, hedef ${s.target} idi! Devre sıfırlandı, tekrar dene. 🔄`);
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

            // Check Kontrol Et button
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
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef Sayı:', 188, 32);
            ctx.fillStyle = '#EC4899';
            ctx.font = 'bold 18px Fredoka, Nunito, sans-serif';
            ctx.fillText(`${s.target}`, 262, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.fillText('Canlı Toplam:', 305, 32);
            ctx.fillStyle = currentSum === s.target ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 18px Fredoka, Nunito, sans-serif';
            ctx.fillText(`${currentSum}`, 395, 38);
            ctx.restore();

            // 5 Ampul ve Anahtarlar
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 30, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.95,
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

            // "Kontrol Et" Butonu
            const btn = s.checkBtn;
            ctx.save();
            ctx.fillStyle = '#EC4899';
            ctx.strokeStyle = '#BE185D';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(btn.x - btn.w / 2, btn.y - btn.h / 2, btn.w, btn.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔍 Kontrol Et', btn.x, btn.y);
            ctx.restore();
        }
    };
})();

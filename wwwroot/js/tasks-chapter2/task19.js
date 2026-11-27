/**
 * Chapter 2 - Task 19: Çift ve Tek Sayıların Son Biti (LSB / 2^0 = 1)
 * Concept: En Düşük Anlamlı Bit (LSB / Tek-Çift Kuralı)
 *
 * İkilik sistemde en sağdaki bit (1 değerli ampul) 1 ise TEK, 0 ise ÇİFT'tir.
 * Hedef: Değeri 14 olan ÇİFT bir sayı oluştur (8 + 4 + 2 = 14, LSB 1 = 0).
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[19] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 112, switchY: 225 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 112, switchY: 225 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 112, switchY: 225 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 112, switchY: 225 },
                    { val: 1, label: '1 (LSB)', isOn: false, x: 550, y: 112, switchY: 225 }
                ],
                target: 14,
                checkBtn: { x: 320, y: 310, w: 175, h: 42 },
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Kural: 14 ÇİFT sayısını oluştur! En sağdaki LSB (1) biti 0 (Kapalı) olmalıdır. 💡");
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
            engine._updateHUD(`Toplam: ${currentSum} (Hedef: 14 Çift) • LSB (1) = ${lsbIsZero ? '0 (Çift ✓)' : '1 (Tek ✗)'}`);
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
                engine._updateHUD(`Harika! 8 + 4 + 2 = 14 çift sayısını oluşturdun ve en sağdaki bit (1) 0 kaldı! 💡🎉`);
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    const lsb = !s.bulbs[4].isOn;
                    if (!engine.isCompleted && sum === s.target && lsb) {
                        engine.triggerComplete();
                    }
                }, 450);
            } else if (currentSum !== s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(false);
                } else if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                engine._updateHUD(`Toplam ${currentSum} oldu, hedef 14 (8 + 4 + 2). Tekrar kontrol et! 🔄`);
            } else if (!lsbIsZero) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(false);
                } else if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                engine._updateHUD(`14 bir ÇİFT sayıdır! En sağdaki 1 (LSB) ampulü KAPALI (0) olmalıdır! 💡`);
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
            const lsbIsZero = !s.bulbs[4].isOn;

            // Üst Bilgi Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(130, 10, 380, 44, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef:', 145, 32);
            ctx.fillStyle = '#14B8A6';
            ctx.font = 'bold 16px Fredoka, Nunito, sans-serif';
            ctx.fillText('14 (ÇİFT)', 190, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.fillText('Toplam:', 270, 32);
            ctx.fillStyle = currentSum === s.target ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 16px Fredoka, Nunito, sans-serif';
            ctx.fillText(`${currentSum}`, 325, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.fillText('LSB (1):', 360, 32);
            ctx.fillStyle = lsbIsZero ? '#10B981' : '#EF4444';
            ctx.font = 'bold 15px Fredoka, Nunito, sans-serif';
            ctx.fillText(lsbIsZero ? '0 (Çift)' : '1 (Tek)', 420, 38);
            ctx.restore();

            // 5 Ampul ve Anahtarlar (LSB ampulü özel vurgulu)
            s.bulbs.forEach((b, idx) => {
                const isLsb = idx === 4;
                CanvasEngine.drawWire(ctx, b.x, b.switchY - 20, b.x, b.y + 30, b.isOn, s.pulse);
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.95,
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

            // "Kontrol Et" Butonu
            const btn = s.checkBtn;
            ctx.save();
            ctx.fillStyle = '#14B8A6';
            ctx.strokeStyle = '#0F766E';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(btn.x - btn.w / 2, btn.y - btn.h / 2, btn.w, btn.h, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚖️ Kuralı Kontrol Et', btn.x, btn.y);
            ctx.restore();
        }
    };
})();

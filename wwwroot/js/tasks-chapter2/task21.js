/**
 * Chapter 2 - Task 21: Anahtar Koşulu ile Hedef Bit Kilidi
 * Concept: Koşullu Mantık Kilidi (If Condition)
 *
 * Koşullu kontrol (if): Hedef bit kombinasyonu (19 = 16 + 2 + 1) sağlanmadan
 * Onay Anahtarı devreyi açmaz. Koşul sağlandığında kilit açılır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[21] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 130 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 130 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 130 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 130 },
                    { val: 1, label: '1', isOn: false, x: 550, y: 130 }
                ],
                target: 19,
                isUnlocked: false,
                switchX: 320,
                switchY: 270,
                switchW: 130,
                switchH: 52,
                masterOn: false,
                pulse: 0
            };
            engine._updateHUD("Hedef Sayı: 19 • Ampulleri 19 yap (16 + 2 + 1), ardından Onay Anahtarına dokun! 🔒");
        },

        toggleBulb(engine, index) {
            if (engine.isCompleted) return;
            const s = engine.state;
            if (index < 0 || index >= s.bulbs.length) return;

            const b = s.bulbs[index];
            b.isOn = !b.isOn;

            if (b.isOn) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(480 + b.val * 8);
                }
                engine.particles.burst(b.x, b.y, 16);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(300);
                }
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: ${currentSum} • Kilit Durumu: ${currentSum === s.target ? '🔓 Hazır!' : '🔒 Kilitli'}`);
        },

        toggleConfirmationSwitch(engine) {
            this.toggleSwitch(engine);
        },

        toggleSwitch(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (currentSum === s.target) {
                s.masterOn = true;
                s.isUnlocked = true;
                if (window.RhythmMixer) {
                    window.RhythmMixer.playSparkle();
                }
                engine.particles.burst(s.switchX, s.switchY, 30);
                engine._updateHUD(`Tebrikler! Koşul sağlandı (19 = 16 + 2 + 1) ve Onay Anahtarı devreyi başarıyla açtı! 💡🔓🎉`);
                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            } else {
                s.masterOn = false;
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(200);
                }
                engine._updateHUD(`Kilit Açılmadı! Koşul: Toplam 19 olmalı (Şu an: ${currentSum}). Önce doğru ampulleri yak! 🔒`);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            s.bulbs.forEach(b => b.isOn = false);
            s.masterOn = false;
            s.isUnlocked = false;
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: 0 • Devre Kilitli 🔒`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            // Check Master Switch
            const inSwitch = (
                pos.x >= s.switchX - s.switchW / 2 &&
                pos.x <= s.switchX + s.switchW / 2 &&
                pos.y >= s.switchY - s.switchH / 2 &&
                pos.y <= s.switchY + s.switchH / 2
            );
            if (inSwitch) {
                this.toggleSwitch(engine);
                return;
            }

            // Check Bulbs
            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                if (distBulb <= 40) {
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
            ctx.roundRect(140, 10, 360, 44, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef:', 155, 32);
            ctx.fillStyle = '#6366F1';
            ctx.font = 'bold 16px Fredoka, sans-serif';
            ctx.fillText('19 (16+2+1)', 198, 38);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Toplam:', 305, 32);
            ctx.fillStyle = isTargetMet ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 16px Fredoka, sans-serif';
            ctx.fillText(`${currentSum}`, 355, 38);

            ctx.fillStyle = isTargetMet ? '#10B981' : '#EF4444';
            ctx.font = 'bold 13px Fredoka, sans-serif';
            ctx.fillText(isTargetMet ? '🔓 HAZIR' : '🔒 KİLİTLİ', 420, 38);
            ctx.restore();

            // Kablo dağıtım hattı
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, b.y + 35, s.switchX, s.switchY - s.switchH / 2, b.isOn && s.masterOn, s.pulse);
            });

            // 5 Ampul
            s.bulbs.forEach(b => {
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.95,
                    label: b.label,
                    bitState: b.isOn,
                    color: '#6366F1',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
            });

            // Büyük Onay Anahtarı
            CanvasEngine.drawSwitch(ctx, s.switchX, s.switchY, s.masterOn, {
                w: s.switchW,
                h: s.switchH,
                label: s.masterOn ? '🔓 DEVRE AÇIK (ONAYLANDI)' : (isTargetMet ? '🔓 ONAY ANAHTARINI ÇEVİR' : '🔒 ONAY ANAHTARI (KİLİTLİ)')
            });
        }
    };
})();

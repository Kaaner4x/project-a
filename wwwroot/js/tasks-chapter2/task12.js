/**
 * Chapter 2 - Task 12: En Küçük Basamak (2^0 = 1) ile Hedef Oluşturma
 * Concept: Basamak Değeri (2^0 = 1)
 *
 * İlk basamağın (2^0 = 1) ondalık karşılığını anlama.
 * Değeri 1 olan ampulü yakarak Hedef Sayı: 1'e ulaşılır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[12] = {
        initState(engine) {
            engine.state = {
                isOn: false,
                bulbVal: 1,
                target: 1,
                switchX: 320,
                switchY: 260,
                switchW: 72,
                switchH: 52,
                bulbX: 320,
                bulbY: 130,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 1 • 1 değerindeki ampule dokunup yakarak hedef sayıya ulaş! 💡");
        },

        toggleBulb(engine, index = 0) {
            this.toggleSwitch(engine);
        },

        toggleSwitch(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            s.isOn = !s.isOn;
            const currentSum = s.isOn ? s.bulbVal : 0;

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(s.isOn);
                } else {
                    window.RhythmMixer.playPop(s.isOn ? 640 : 320);
                }
            }

            if (s.isOn) {
                engine.particles.burst(s.bulbX, s.bulbY, 26);
            }

            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: ${currentSum}`);

            if (currentSum === s.target) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine._updateHUD(`Tebrikler! İlk basamak (2⁰ = 1) açık ve toplam tam 1 oldu! 💡🎉`);
                s.completeTimer = setTimeout(() => {
                    if (!engine.isCompleted && s.isOn && (s.isOn ? s.bulbVal : 0) === s.target) {
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
            s.isOn = false;
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: 0`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            const inSwitch = (
                pos.x >= s.switchX - s.switchW / 2 &&
                pos.x <= s.switchX + s.switchW / 2 &&
                pos.y >= s.switchY - s.switchH / 2 &&
                pos.y <= s.switchY + s.switchH / 2
            );
            const distBulb = Math.hypot(pos.x - s.bulbX, pos.y - s.bulbY);

            if (inSwitch || distBulb <= 48) {
                this.toggleSwitch(engine);
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.04;
            const currentSum = s.isOn ? s.bulbVal : 0;

            // Arka plan ışıması
            if (s.isOn) {
                const ambient = ctx.createRadialGradient(s.bulbX, s.bulbY, 10, s.bulbX, s.bulbY, 260);
                ambient.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
                ambient.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
                ambient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = ambient;
                ctx.fillRect(0, 0, engine.width, engine.height);
            }

            // Üst Hedef & Toplam Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(190, 16, 260, 48, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Hedef Sayı:', 208, 38);
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${s.target}`, 280, 44);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.fillText('Toplam:', 320, 38);
            ctx.fillStyle = currentSum === s.target ? '#10B981' : '#F59E0B';
            ctx.font = 'bold 18px Fredoka, sans-serif';
            ctx.fillText(`${currentSum}`, 380, 44);
            ctx.restore();

            // Kablo
            CanvasEngine.drawWire(ctx, s.switchX, s.switchY - s.switchH / 2, s.bulbX, s.bulbY + 36, s.isOn, s.pulse);

            // Ampul (Değer: 1, 2^0)
            CanvasEngine.drawBulb(ctx, s.bulbX, s.bulbY, s.isOn, {
                scale: 1.25,
                label: 'Basamak: 1  (2⁰)',
                bitState: s.isOn,
                color: '#10B981',
                glowIntensity: s.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
            });

            // Anahtar
            CanvasEngine.drawSwitch(ctx, s.switchX, s.switchY, s.isOn, {
                w: s.switchW,
                h: s.switchH,
                label: s.isOn ? 'AÇIK (1)' : 'KAPALI (0)'
            });
        }
    };
})();

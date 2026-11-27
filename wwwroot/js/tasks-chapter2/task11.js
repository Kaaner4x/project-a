/**
 * Chapter 2 - Task 11: Bit Kavramı (0 ve 1 Durumu)
 * Concept: İkili Durum (Bit: 0 ve 1)
 *
 * Tek bir ampulün Kapalı = 0, Açık = 1 anlamına geldiğini kavrama.
 * Öğrenci ampulü 1 (Açık) konumuna getirip ardından 0 (Kapalı) konumuna döndürdüğünde görev tamamlanır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[11] = {
        initState(engine) {
            engine.state = {
                isOn: false,
                hasTurnedOn: false,
                hasTurnedOff: false,
                switchX: 320,
                switchY: 260,
                switchW: 72,
                switchH: 52,
                bulbX: 320,
                bulbY: 130,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Anahtara dokunarak ampulü Açık (1) yap, ardından Kapalı (0) konumuna getir. 💡");
        },

        toggleSwitch(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            s.isOn = !s.isOn;

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(s.isOn);
                } else {
                    window.RhythmMixer.playPop(s.isOn ? 620 : 320);
                }
            }

            if (s.isOn) {
                s.hasTurnedOn = true;
                engine.particles.burst(s.bulbX, s.bulbY, 25);
                engine._updateHUD("Harika! Ampul yandı ve bit değeri 1 oldu. Şimdi anahtarı tekrar çevirip 0 konumuna getir! 💡");
            } else {
                if (s.hasTurnedOn) {
                    s.hasTurnedOff = true;
                    if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                        window.RhythmMixer.playDigitalBeep(true);
                    }
                    engine._updateHUD("Tebrikler! Açık (1) ve Kapalı (0) ikili bit durumlarını ustalıkla keşfettin! 💡🎉");
                    s.completeTimer = setTimeout(() => {
                        if (!engine.isCompleted && !s.isOn && s.hasTurnedOn) {
                            engine.triggerComplete();
                        }
                    }, 450);
                } else {
                    engine._updateHUD("Ampul kapalı (0). Önce anahtara dokunarak ampulü Açık (1) yap! 💡");
                }
            }
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

            if (inSwitch || distBulb <= 45) {
                this.toggleSwitch(engine);
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.04;

            // Arka plan ortam ışıması
            if (s.isOn) {
                const ambient = ctx.createRadialGradient(s.bulbX, s.bulbY, 10, s.bulbX, s.bulbY, 260);
                ambient.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
                ambient.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
                ambient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = ambient;
                ctx.fillRect(0, 0, engine.width, engine.height);
            }

            // Devre kablosu
            CanvasEngine.drawWire(ctx, s.switchX, s.switchY - s.switchH / 2, s.bulbX, s.bulbY + 36, s.isOn, s.pulse);

            // Ampul
            CanvasEngine.drawBulb(ctx, s.bulbX, s.bulbY, s.isOn, {
                scale: 1.25,
                bitState: s.isOn,
                label: s.isOn ? 'Bit: 1 (Açık)' : 'Bit: 0 (Kapalı)',
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

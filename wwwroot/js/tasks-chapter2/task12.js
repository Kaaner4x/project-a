/**
 * Chapter 2 - Task 12: En Küçük Basamak (2^0 = 1) ile Hedef Oluşturma
 * Concept: Basamak Değeri (2^0 = 1)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[12] = {
        initState(engine) {
            engine.state = {
                isOn: false,
                bulbVal: 1,
                target: 1,
                batteryX: 125,
                batteryY: 220,
                bulbX: 320,
                bulbY: 162,
                switchX: 320,
                switchY: 284,
                switchW: 76,
                switchH: 50,
                displayX: 515,
                displayY: 220,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 1 • 1 değerindeki ampulü yakarak hedef sayıya ulaş!");
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
                engine._updateHUD("Tebrikler! İlk basamak (2⁰ = 1) açık ve toplam tam 1 oldu!");
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
                pos.x >= s.switchX - s.switchW / 2 - 8 &&
                pos.x <= s.switchX + s.switchW / 2 + 8 &&
                pos.y >= s.switchY - s.switchH / 2 - 8 &&
                pos.y <= s.switchY + s.switchH / 2 + 8
            );
            const distBulb = Math.hypot(pos.x - s.bulbX, pos.y - s.bulbY);
            const inDisplay = Math.abs(pos.x - s.displayX) <= 54 && Math.abs(pos.y - s.displayY) <= 60;

            if (inSwitch || distBulb <= 48 || inDisplay) {
                this.toggleSwitch(engine);
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.045;
            const currentSum = s.isOn ? s.bulbVal : 0;

            if (s.isOn) {
                const ambient = ctx.createRadialGradient(s.bulbX, s.bulbY, 10, s.bulbX, s.bulbY, 260);
                ambient.addColorStop(0, 'rgba(167, 243, 208, 0.36)');
                ambient.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
                ambient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = ambient;
                ctx.fillRect(0, 0, engine.width, engine.height);
            }

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 360,
                target: s.target,
                current: currentSum,
                binaryText: s.isOn ? '1' : '0',
                accentColor: '#34D399',
                isMatched: currentSum === s.target
            });

            // Devre Hatları
            CanvasEngine.drawPowerBus(ctx, s.batteryX + 34, s.switchX - s.switchW / 2, s.switchY, true, s.pulse);
            CanvasEngine.drawWire(ctx, s.switchX, s.switchY - s.switchH / 2, s.bulbX, s.bulbY + 38, s.isOn, s.pulse);
            CanvasEngine.drawPowerBus(ctx, s.bulbX + 30, s.displayX - 50, s.displayY, s.isOn, s.pulse);

            // Sol: Pil
            CanvasEngine.drawBatteryUnit(ctx, s.batteryX, s.batteryY, s.isOn);

            // Orta Üst: Ampul (Üstte etiket, çakışmasız)
            CanvasEngine.drawBulb(ctx, s.bulbX, s.bulbY, s.isOn, {
                scale: 1.2,
                label: '2⁰ = 1',
                labelPosition: 'top',
                color: '#10B981',
                glowIntensity: s.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
            });

            // Orta Alt: Anahtar
            CanvasEngine.drawSwitch(ctx, s.switchX, s.switchY, s.isOn, {
                w: s.switchW,
                h: s.switchH,
                label: s.isOn ? 'AÇIK (1)' : 'KAPALI (0)'
            });

            // Sağ: Dijital Ekran
            CanvasEngine.drawDigitalPanel(ctx, s.displayX, s.displayY, `${currentSum}`, s.isOn ? 'AÇIK' : 'KAPALI', s.isOn, s.pulse);
        }
    };
})();

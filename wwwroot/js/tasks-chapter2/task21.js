/**
 * Chapter 2 - Task 21: Anahtar Koşulu ile Hedef Bit Kilidi
 * Concept: Koşullu Mantık Kilidi (If Condition)
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[21] = {
        initState(engine) {
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 132 },
                    { val: 8, label: '8', isOn: false, x: 205, y: 132 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 132 },
                    { val: 2, label: '2', isOn: false, x: 435, y: 132 },
                    { val: 1, label: '1', isOn: false, x: 550, y: 132 }
                ],
                target: 19,
                isUnlocked: false,
                switchX: 320,
                switchY: 282,
                switchW: 150,
                switchH: 50,
                switchWobble: 0,
                masterOn: false,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Hedef Sayı: 19 • Ampulleri 19 yap (16 + 2 + 1), ardından Onay Anahtarına dokun!");
        },

        toggleBulb(engine, index) {
            if (engine.isCompleted) return;
            const s = engine.state;
            if (index < 0 || index >= s.bulbs.length) return;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            s.masterOn = false;
            s.isUnlocked = false;

            const b = s.bulbs[index];
            b.isOn = !b.isOn;

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(b.isOn);
                } else {
                    window.RhythmMixer.playPop(b.isOn ? (480 + b.val * 8) : 300);
                }
            }

            if (b.isOn) {
                engine.particles.burst(b.x, b.y, 16);
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: ${currentSum} • Kilit: ${currentSum === s.target ? 'HAZIR' : 'KİLİTLİ'}`);
        },

        toggleConfirmationSwitch(engine) {
            this.toggleSwitch(engine);
        },

        toggleSwitch(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);

            if (currentSum === s.target) {
                s.masterOn = true;
                s.isUnlocked = true;
                if (window.RhythmMixer) {
                    if (typeof window.RhythmMixer.playRelayClick === 'function') {
                        window.RhythmMixer.playRelayClick(true);
                    }
                    if (typeof window.RhythmMixer.playDigitalBeep === 'function') {
                        window.RhythmMixer.playDigitalBeep(true);
                    }
                }
                engine.particles.burst(s.switchX, s.switchY, 30);
                s.bulbs.forEach(b => {
                    if (b.isOn) engine.particles.burst(b.x, b.y, 22);
                });
                engine._updateHUD("Tebrikler! Koşul sağlandı (19 = 16 + 2 + 1) ve Onay Anahtarı devreyi açtı!");
                s.completeTimer = setTimeout(() => {
                    const sum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
                    if (!engine.isCompleted && sum === s.target && s.masterOn) {
                        engine.triggerComplete();
                    }
                }, 450);
            } else {
                s.masterOn = false;
                s.isUnlocked = false;
                s.switchWobble = 16;
                if (window.RhythmMixer) {
                    if (typeof window.RhythmMixer.playRelayClick === 'function') {
                        window.RhythmMixer.playRelayClick(false);
                    }
                    if (typeof window.RhythmMixer.playDigitalBeep === 'function') {
                        window.RhythmMixer.playDigitalBeep(false);
                    } else {
                        window.RhythmMixer.playPop(200);
                    }
                }
                engine._updateHUD(`Kilit Açılmadı! Toplam 19 olmalı (Şu an: ${currentSum}).`);
            }
        },

        resetBulbs(engine) {
            const s = engine.state;
            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }
            s.bulbs.forEach(b => b.isOn = false);
            s.masterOn = false;
            s.isUnlocked = false;
            engine._updateHUD(`Hedef Sayı: ${s.target} • Mevcut Toplam: 0 • Devre Kilitli`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;

            const inSwitch = (
                pos.x >= s.switchX - s.switchW / 2 - 8 &&
                pos.x <= s.switchX + s.switchW / 2 + 8 &&
                pos.y >= s.switchY - s.switchH / 2 - 8 &&
                pos.y <= s.switchY + s.switchH / 2 + 8
            );
            if (inSwitch) {
                this.toggleSwitch(engine);
                return;
            }

            for (let i = 0; i < s.bulbs.length; i++) {
                const b = s.bulbs[i];
                const distBulb = Math.hypot(pos.x - b.x, pos.y - b.y);
                if (distBulb <= 44) {
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
            s.pulse += 0.045;
            const currentSum = s.bulbs.reduce((sum, item) => sum + (item.isOn ? item.val : 0), 0);
            const isTargetMet = currentSum === s.target;
            const binaryText = s.bulbs.map(b => b.isOn ? '1' : '0').join('');

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 500,
                target: s.target,
                current: currentSum,
                binaryText,
                statusLabel: 'KİLİT',
                statusText: s.masterOn ? 'AÇIK ✓' : (isTargetMet ? 'HAZIR' : 'KİLİTLİ'),
                statusOk: isTargetMet || s.masterOn,
                accentColor: '#818CF8',
                isMatched: isTargetMet
            });

            // Temiz dik açılı devre dağıtım barası (Bus)
            const busY = 222;
            CanvasEngine.drawPowerBus(ctx, 90, 550, busY, s.masterOn, s.pulse);
            CanvasEngine.drawWire(ctx, s.switchX, s.switchY - s.switchH / 2, s.switchX, busY, s.masterOn, s.pulse);
            s.bulbs.forEach(b => {
                CanvasEngine.drawWire(ctx, b.x, busY, b.x, b.y + 38, b.isOn && s.masterOn, s.pulse);
            });

            // 5 Ampul
            s.bulbs.forEach(b => {
                const glow = b.isOn
                    ? (s.masterOn ? 1.6 + Math.sin(s.pulse * 3) * 0.25 : 0.45)
                    : 0;

                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 0.98,
                    label: b.label,
                    labelPosition: 'top',
                    bitState: b.isOn,
                    color: s.masterOn ? '#10B981' : '#6366F1',
                    glowIntensity: glow
                });
            });

            // Büyük Onay Anahtarı (Kilitliyken basılınca hafif sallanır)
            ctx.save();
            if (s.switchWobble > 0) {
                s.switchWobble *= 0.85;
                if (s.switchWobble < 0.1) s.switchWobble = 0;
                ctx.translate(s.switchX, s.switchY);
                ctx.rotate(Math.sin(s.switchWobble * 2.8) * 0.08);
                ctx.translate(-s.switchX, -s.switchY);
            }
            CanvasEngine.drawSwitch(ctx, s.switchX, s.switchY, s.masterOn, {
                w: s.switchW,
                h: s.switchH,
                label: s.masterOn ? 'DEVRE AÇIK (ONAYLANDI)' : (isTargetMet ? 'ONAY ANAHTARINI ÇEVİR' : 'ONAY ANAHTARI (KİLİTLİ)')
            });
            ctx.restore();
        }
    };
})();

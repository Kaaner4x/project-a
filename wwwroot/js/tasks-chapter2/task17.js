/**
 * Chapter 2 - Task 17: Bit Dizisinden Ondalık Sayı Okuma (Binary -> Decimal)
 * Concept: Binary -> Decimal Dönüşümü
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[17] = {
        initState(engine) {
            // İkili kod: 0 1 0 1 1 -> 8 + 2 + 1 = 11
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 148 },
                    { val: 8, label: '8', isOn: true, x: 205, y: 148 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 148 },
                    { val: 2, label: '2', isOn: true, x: 435, y: 148 },
                    { val: 1, label: '1', isOn: true, x: 550, y: 148 }
                ],
                correctAnswer: 11,
                selectedOption: null,
                options: [
                    { val: 9, x: 140, y: 288, w: 94, h: 52, press: 0, wobble: 0 },
                    { val: 11, x: 260, y: 288, w: 94, h: 52, press: 0, wobble: 0 },
                    { val: 13, x: 380, y: 288, w: 94, h: 52, press: 0, wobble: 0 },
                    { val: 19, x: 500, y: 288, w: 94, h: 52, press: 0, wobble: 0 }
                ],
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("İkilik Kodu Oku: 0 1 0 1 1 • Yanan ampulleri toplayıp doğru sayıyı seç!");
        },

        selectOption(engine, val) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            s.selectedOption = val;
            const optObj = s.options.find(o => o.val === val);
            if (optObj) optObj.press = 1;

            if (val === s.correctAnswer) {
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(true);
                }
                engine.particles.burst(optObj ? optObj.x : 320, 288, 30);
                engine._updateHUD("Tebrikler! 8 + 2 + 1 = 11! İkilik kodu başarıyla ondalık sayıya çevirdin!");
                s.completeTimer = setTimeout(() => {
                    if (!engine.isCompleted && s.selectedOption === s.correctAnswer) {
                        engine.triggerComplete();
                    }
                }, 450);
            } else {
                if (optObj) optObj.wobble = 16;
                if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                    window.RhythmMixer.playDigitalBeep(false);
                } else if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                engine._updateHUD(`Seçtiğin sayı (${val}) yanlış. Yalnızca yanan ampulleri topla: 8 + 2 + 1 = ?`);
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            for (let i = 0; i < s.options.length; i++) {
                const opt = s.options[i];
                if (Math.abs(pos.x - opt.x) <= opt.w / 2 && Math.abs(pos.y - opt.y) <= opt.h / 2) {
                    this.selectOption(engine, opt.val);
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

            // Üst LED Bilgi Paneli
            CanvasEngine.drawBinaryHeader(ctx, {
                w: 380,
                titleText: 'İKİLİK KOD: 0 1 0 1 1  =  ?',
                accentColor: '#38BDF8',
                isMatched: s.selectedOption === s.correctAnswer
            });

            // Devre Alt Hattı
            CanvasEngine.drawPowerBus(ctx, 64, 576, 198, true, s.pulse);

            // 5 Sabit Ampul
            s.bulbs.forEach(b => {
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.04,
                    label: b.label,
                    labelPosition: 'top',
                    bitState: b.isOn,
                    color: '#06B6D4',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
            });

            // 3D Seçenek Kartları (9, 11, 13, 19)
            s.options.forEach(opt => {
                const isSelected = s.selectedOption === opt.val;
                const isCorrect = isSelected && opt.val === s.correctAnswer;

                CanvasEngine.drawCircuitButton(ctx, opt, `${opt.val}`, {
                    bg: isCorrect ? '#10B981' : (isSelected ? '#EF4444' : '#FFFFFF'),
                    border: isCorrect ? '#059669' : (isSelected ? '#B91C1C' : '#94A3B8'),
                    textColor: isSelected ? '#FFFFFF' : '#0F172A',
                    font: '900 22px Fredoka, Nunito, sans-serif'
                });
            });
        }
    };
})();

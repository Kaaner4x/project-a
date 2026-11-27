/**
 * Chapter 2 - Task 17: Bit Dizisinden Ondalık Sayı Okuma (Binary -> Decimal)
 * Concept: Binary -> Decimal Dönüşümü
 *
 * Hazır yanan 5 bitlik ikilik kodu (01011 -> 8 + 2 + 1 = 11) okuyup
 * ekrandaki seçeneklerden doğru sayıyı (11) seçme.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[17] = {
        initState(engine) {
            // İkili kod: 0 1 0 1 1 -> 8 + 2 + 1 = 11
            engine.state = {
                bulbs: [
                    { val: 16, label: '16', isOn: false, x: 90, y: 130 },
                    { val: 8, label: '8', isOn: true, x: 205, y: 130 },
                    { val: 4, label: '4', isOn: false, x: 320, y: 130 },
                    { val: 2, label: '2', isOn: true, x: 435, y: 130 },
                    { val: 1, label: '1', isOn: true, x: 550, y: 130 }
                ],
                correctAnswer: 11,
                selectedOption: null,
                options: [
                    { val: 9, x: 140, y: 275, w: 90, h: 48 },
                    { val: 11, x: 260, y: 275, w: 90, h: 48 },
                    { val: 13, x: 380, y: 275, w: 90, h: 48 },
                    { val: 19, x: 500, y: 275, w: 90, h: 48 }
                ],
                pulse: 0
            };
            engine._updateHUD("İkilik Kodu Oku: 0 1 0 1 1 • Yanan ampulleri toplayıp doğru ondalık sayıyı seç! 💡");
        },

        selectOption(engine, val) {
            if (engine.isCompleted) return;
            const s = engine.state;
            s.selectedOption = val;

            if (val === s.correctAnswer) {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playSparkle();
                }
                engine.particles.burst(320, 275, 30);
                engine._updateHUD(`Tebrikler! 8 + 2 + 1 = 11! İkilik kodu başarıyla ondalık sayıya çevirdin! 💡🎉`);
                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            } else {
                if (window.RhythmMixer) {
                    window.RhythmMixer.playPop(220);
                }
                engine._updateHUD(`Seçtiğin sayı (${val}) yanlış. İpucu: Yalnızca yananları topla: 8 + 2 + 1 = ? 💡`);
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            for (let i = 0; i < s.options.length; i++) {
                const opt = s.options[i];
                if (
                    pos.x >= opt.x - opt.w / 2 &&
                    pos.x <= opt.x + opt.w / 2 &&
                    pos.y >= opt.y - opt.h / 2 &&
                    pos.y <= opt.y + opt.h / 2
                ) {
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
            s.pulse += 0.04;

            // Üst Başlık Kartı
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(160, 10, 320, 44, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#06B6D4';
            ctx.font = 'bold 15px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('İkilik Kod: 0 1 0 1 1 = ? (Ondalık Değer)', 320, 37);
            ctx.restore();

            // 5 Sabit Ampul
            s.bulbs.forEach(b => {
                CanvasEngine.drawBulb(ctx, b.x, b.y, b.isOn, {
                    scale: 1.0,
                    label: b.label,
                    bitState: b.isOn,
                    color: '#06B6D4',
                    glowIntensity: b.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
                });
            });

            // Seçenek Kartları (9, 11, 13, 19)
            s.options.forEach(opt => {
                const isSelected = s.selectedOption === opt.val;
                const isCorrect = isSelected && opt.val === s.correctAnswer;

                ctx.save();
                ctx.fillStyle = isCorrect ? '#10B981' : (isSelected ? '#EF4444' : '#F8FAFC');
                ctx.strokeStyle = isCorrect ? '#059669' : (isSelected ? '#DC2626' : '#CBD5E1');
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(opt.x - opt.w / 2, opt.y - opt.h / 2, opt.w, opt.h, 12);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = isSelected ? '#FFFFFF' : '#1E293B';
                ctx.font = 'bold 20px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${opt.val}`, opt.x, opt.y);
                ctx.restore();
            });
        }
    };
})();

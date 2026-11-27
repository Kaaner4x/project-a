/**
 * Chapter 1 - Task 7: İki Yollu Koşullu Seçim
 * Concept: Karar Mekanizması (If - Else)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[7] = {
        initState(engine) {
            // İki Yollu Koşul (If-Else)
            engine.state = {
                score: 0,
                targetScore: 3,
                currentWave: 'purple',
                wavePulse: 0,
                isTransitioning: false,
                purpleDoor: { x: 145, y: 195, w: 104, h: 148, wobble: 0, flash: 0 },
                yellowDoor: { x: 495, y: 195, w: 104, h: 148, wobble: 0, flash: 0 },
                center: { x: engine.width / 2, y: 195, radius: 36 }
            };
            engine._updateHUD("Skor: 0 / 3 • Sinyalin rengine bak ve doğru kapıya bas!");
            this.cycleWaveCondition(engine, false);
        },

        cycleWaveCondition(engine, playSound = true) {
            const s = engine.state;
            s.currentWave = Math.random() > 0.5 ? 'purple' : 'yellow';
            s.wavePulse = 0;
            s.isTransitioning = false;
            if (playSound) {
                this.playWaveSignalSound(engine);
            }
        },

        playWaveSignalSound(engine) {
            if (window.RhythmMixer) {
                window.RhythmMixer.ensureContext();
                if (engine.state.currentWave === 'purple') {
                    window.RhythmMixer.playNote('Do', 0.45, 'sine', 0.35);
                } else {
                    window.RhythmMixer.playNote('Sol', 0.45, 'triangle', 0.35);
                }
            }
        },

        verifyConditionDoor(engine, selected) {
            const s = engine.state;
            if (s.isTransitioning || engine.isCompleted) return;

            if (selected === s.currentWave) {
                s.isTransitioning = true;
                s.score++;
                if (window.RhythmMixer) {
                    window.RhythmMixer.playNote('Do5', 0.35, 'triangle');
                    window.RhythmMixer.playSparkle();
                }
                const door = selected === 'purple' ? s.purpleDoor : s.yellowDoor;
                door.flash = 1;
                engine.particles.burst(door.x, door.y, 24);

                engine._updateHUD(`Harika! Doğru Kapı: ${s.score} / ${s.targetScore}`);

                if (s.score >= s.targetScore) {
                    setTimeout(() => {
                        engine.triggerComplete();
                    }, 300);
                } else {
                    setTimeout(() => this.cycleWaveCondition(engine, true), 800);
                }
            } else {
                const wrongDoor = selected === 'purple' ? s.purpleDoor : s.yellowDoor;
                wrongDoor.wobble = 16;
                if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                engine._updateHUD("Fırça meraklandı! Merkezdeki sinyalin rengine tekrar bakalım 🎵");
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Merkezdeki dalga jeneratörüne dokunma (sesi tekrar dinle)
            const cDist = Math.hypot(pos.x - s.center.x, pos.y - s.center.y);
            if (cDist <= s.center.radius * 1.3) {
                this.playWaveSignalSound(engine);
                return;
            }

            // Kapı seçimi
            const p = s.purpleDoor;
            if (pos.x >= p.x - p.w / 2 && pos.x <= p.x + p.w / 2 &&
                pos.y >= p.y - p.h / 2 && pos.y <= p.y + p.h / 2) {
                this.verifyConditionDoor(engine, 'purple');
            }
            const y = s.yellowDoor;
            if (pos.x >= y.x - y.w / 2 && pos.x <= y.x + y.w / 2 &&
                pos.y >= y.y - y.h / 2 && pos.y <= y.y + y.h / 2) {
                this.verifyConditionDoor(engine, 'yellow');
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        _drawDoor(ctx, door, fillColor, strokeColor, panelColor, handleSide) {
            ctx.save();
            ctx.translate(door.x, door.y);

            // Yanlış seçimde hafif sallanma (wobble)
            if (door.wobble > 0) {
                door.wobble *= 0.85;
                if (door.wobble < 0.1) door.wobble = 0;
                ctx.rotate(Math.sin(door.wobble * 2.6) * 0.1);
            }

            // Doğru seçimde parlama efekti (flash)
            if (door.flash > 0) {
                door.flash *= 0.9;
                if (door.flash < 0.02) door.flash = 0;
                ctx.shadowColor = `rgba(16, 185, 129, ${door.flash * 0.85})`;
                ctx.shadowBlur = 28 * door.flash;
            } else {
                ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
                ctx.shadowBlur = 14;
                ctx.shadowOffsetY = 6;
            }

            // Ana kapı gövdesi
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.roundRect(-door.w / 2, -door.h / 2, door.w, door.h, [28, 28, 8, 8]);
            ctx.fill();
            ctx.stroke();

            ctx.shadowColor = 'transparent';

            // İç ahşap panel çerçevesi
            ctx.fillStyle = panelColor;
            ctx.beginPath();
            ctx.roundRect(-door.w / 2 + 13, -door.h / 2 + 16, door.w - 26, door.h * 0.42, [18, 18, 6, 6]);
            ctx.fill();

            ctx.beginPath();
            ctx.roundRect(-door.w / 2 + 13, 12, door.w - 26, door.h * 0.34, 6);
            ctx.fill();

            // Kapı kolu (Altın tokmak)
            const handleX = handleSide === 'right' ? (door.w / 2 - 18) : (-door.w / 2 + 18);
            ctx.fillStyle = '#FEF08A';
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(handleX, 6, 7.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Doğru seçimde beyaz ışıltı katmanı
            if (door.flash > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${door.flash * 0.38})`;
                ctx.beginPath();
                ctx.roundRect(-door.w / 2, -door.h / 2, door.w, door.h, [28, 28, 8, 8]);
                ctx.fill();
            }

            ctx.restore();
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. ÜST 3 ADIMLI İLERLEME GÖSTERGESİ
            const indicatorY = 52;
            const stepWidth = 46;
            const startX = engine.width / 2 - ((s.targetScore - 1) * stepWidth) / 2;

            ctx.save();
            for (let i = 0; i < s.targetScore; i++) {
                const stepX = startX + i * stepWidth;
                const isDone = s.score > i;
                const isCurrent = s.score === i;

                ctx.beginPath();
                ctx.arc(stepX, indicatorY, 15, 0, Math.PI * 2);
                ctx.fillStyle = isDone ? '#10B981' : (isCurrent ? '#EEF2FF' : '#F8FAFC');
                ctx.fill();
                ctx.strokeStyle = isDone ? '#059669' : (isCurrent ? '#6366F1' : '#CBD5E1');
                ctx.lineWidth = isCurrent ? 2.5 : 1.5;
                ctx.stroke();

                ctx.fillStyle = isDone ? '#FFFFFF' : (isCurrent ? '#4338CA' : '#94A3B8');
                ctx.font = 'bold 12px Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(isDone ? '✓' : `${i + 1}`, stepX, indicatorY);
            }
            ctx.restore();

            // 2. MERKEZDEKİ SİNYAL KÜRESİ VE DALGALAR
            const cx = s.center.x;
            const cy = s.center.y;

            s.wavePulse = (s.wavePulse + 2) % 100;
            const isPurple = s.currentWave === 'purple';

            ctx.save();
            ctx.strokeStyle = isPurple ? `rgba(139, 92, 246, ${1 - s.wavePulse / 100})` : `rgba(245, 158, 11, ${1 - s.wavePulse / 100})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(cx, cy, 20 + s.wavePulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = isPurple ? '#8B5CF6' : '#F59E0B';
            ctx.beginPath();
            ctx.arc(cx, cy, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3.5;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '18px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔊', cx, cy + 1);
            ctx.restore();

            // 3. YAZISIZ, RENK ODAKLI CANLI KAPILAR
            this._drawDoor(ctx, s.purpleDoor, '#8B5CF6', '#5B21B6', 'rgba(255, 255, 255, 0.16)', 'right');
            this._drawDoor(ctx, s.yellowDoor, '#F59E0B', '#B45309', 'rgba(255, 255, 255, 0.22)', 'left');
        }
    };
})();

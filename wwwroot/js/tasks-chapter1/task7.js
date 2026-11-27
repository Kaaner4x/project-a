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
                purpleDoor: { x: 140, y: 180, w: 100, h: 140 },
                yellowDoor: { x: 500, y: 180, w: 100, h: 140 },
                center: { x: engine.width / 2, y: engine.height / 2, radius: 36 }
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
                engine.particles.burst(door.x, door.y, 22);

                engine._updateHUD(`Harika! Doğru Kapı: ${s.score} / ${s.targetScore}`);

                if (s.score >= s.targetScore) {
                    setTimeout(() => {
                        engine.triggerComplete();
                    }, 300);
                } else {
                    setTimeout(() => this.cycleWaveCondition(engine, true), 800);
                }
            } else {
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

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

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

            // Merkezdeki sinyal küresi
            ctx.fillStyle = isPurple ? '#8B5CF6' : '#F59E0B';
            ctx.beginPath();
            ctx.arc(cx, cy, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('🔊', cx, cy + 6);
            ctx.restore();

            // Mor Kapı (Sol)
            const p = s.purpleDoor;
            ctx.save();
            ctx.fillStyle = '#8B5CF6';
            ctx.strokeStyle = '#5B21B6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, [20, 20, 4, 4]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('MOR KAPI', p.x, p.y + 10);
            ctx.restore();

            // Sarı Kapı (Sağ)
            const y = s.yellowDoor;
            ctx.save();
            ctx.fillStyle = '#F59E0B';
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(y.x - y.w / 2, y.y - y.h / 2, y.w, y.h, [20, 20, 4, 4]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('SARI KAPI', y.x, y.y + 10);
            ctx.restore();
        }
    };
})();

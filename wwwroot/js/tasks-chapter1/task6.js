/**
 * Chapter 1 - Task 6: Ritmik Yörünge ve Sayaç
 * Concept: Döngü Tekrarı (Loop Iteration)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[6] = {
        initState(engine) {
            // Ritmik Yörünge ve Sayaç (Yıldızın Gizli Döngü Sayısını Tahmin Etme)
            const secretCount = Math.floor(Math.random() * 4) + 1; // 1, 2, 3 veya 4 tur
            engine.state = {
                cx: engine.width / 2,
                cy: 145,
                radiusX: 195,
                radiusY: 78,
                angle: 0,
                secretLoops: secretCount,
                completedTours: 0,
                isRunning: false,
                speed: 0.042,
                hasWatched: false,
                readyToGuess: false,
                cards: [
                    { value: 1, x: 215, y: 288, w: 56, h: 56, wobble: 0 },
                    { value: 2, x: 285, y: 288, w: 56, h: 56, wobble: 0 },
                    { value: 3, x: 355, y: 288, w: 56, h: 56, wobble: 0 },
                    { value: 4, x: 425, y: 288, w: 56, h: 56, wobble: 0 }
                ],
                selectedCard: null
            };
            engine._updateHUD("Yıldız dönüyor... Kaç tur attığını dikkatle izle ve say! 🌟");
            // 400ms sonra yıldızın döngüsünü otomatik başlat
            setTimeout(() => {
                if (engine.taskId === 6 && !engine.state.isRunning && !engine.state.hasWatched) {
                    this.startLoopRun(engine);
                }
            }, 400);
        },

        startLoopRun(engine) {
            const s = engine.state;
            if (s.isRunning || engine.isCompleted) return;
            s.isRunning = true;
            s.completedTours = 0;
            s.angle = 0;
            s.readyToGuess = false;
            s.hasWatched = true;

            const totalSecret = s.secretLoops;
            engine._updateHUD("Yıldız dönüyor... Dikkatle say! 🔄");

            const notes = ['Do', 'Mi', 'Sol', 'Do5'];

            const step = () => {
                if (!s.isRunning) return;
                s.angle += s.speed;

                if (s.angle >= Math.PI * 2) {
                    s.angle -= Math.PI * 2;
                    s.completedTours++;

                    // Her tamamlanan turda melodik zil ve ritim
                    const noteName = notes[Math.min(s.completedTours - 1, notes.length - 1)];
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playPercussion(true);
                        window.RhythmMixer.playNote(noteName, 0.45, 'triangle', 0.4);
                    }

                    engine.particles.burst(s.cx + s.radiusX, s.cy, 20);

                    // Gizli tur sayısı tamamlandıysa dur ve tahmini bekle
                    if (s.completedTours >= totalSecret) {
                        s.isRunning = false;
                        s.readyToGuess = true;
                        s.angle = 0;
                        if (window.RhythmMixer) window.RhythmMixer.playSparkle();
                        engine._updateHUD("Yıldız durdu! Kaç kez döndü? Kartlardan doğru sayıyı seç! 🎴");
                        return;
                    }
                }
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        },

        guessLoopCount(engine, count, btnEl = null) {
            if (engine.isCompleted) return;
            const s = engine.state;

            // Henüz izlenmediyse önce izlet
            if (!s.hasWatched && !s.readyToGuess) {
                this.startLoopRun(engine);
                return;
            }

            // Yıldız henüz dönüyorsa bitmesini bekle
            if (s.isRunning) {
                engine._updateHUD("Yıldızın dönmesi bitene kadar bekle ve say! 🌟");
                return;
            }

            s.selectedCard = count;
            const cardObj = s.cards.find(c => c.value === count);

            if (count === s.secretLoops) {
                // DOĞRU TAHMİN!
                if (window.RhythmMixer) {
                    window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.85);
                    window.RhythmMixer.playSparkle();
                }
                engine.particles.burst(s.cx + s.radiusX, s.cy, 36);
                if (cardObj) engine.particles.burst(cardObj.x, cardObj.y, 25);

                engine._updateHUD(`Tebrikler! Yıldız tam ${count} kez dönmüştü! 🌟🎉`);

                if (btnEl) {
                    btnEl.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active', 'btn-success', 'btn-danger'));
                    btnEl.classList.add('active', 'btn-success');
                }

                setTimeout(() => {
                    engine.triggerComplete();
                }, 500);
            } else {
                // YANLIŞ TAHMİN
                if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                if (cardObj) cardObj.wobble = 16;
                engine._updateHUD(`Hop! ${count} tur değildi. 'Tekrar İzle'ye basıp turları tekrar sayabilirsin! 🔍`);

                if (btnEl) {
                    btnEl.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active', 'btn-success', 'btn-danger'));
                    btnEl.classList.add('active', 'btn-danger');
                }
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Kartlara doğrudan tuval üzerinde tıklama
            if (!s.isRunning && !engine.isCompleted) {
                for (let card of s.cards) {
                    if (pos.x >= card.x - card.w / 2 && pos.x <= card.x + card.w / 2 &&
                        pos.y >= card.y - card.h / 2 && pos.y <= card.y + card.h / 2) {
                        this.guessLoopCount(engine, card.value);
                        break;
                    }
                }
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. ELİPS RAY YOLU
            ctx.save();
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.ellipse(s.cx, s.cy, s.radiusX, s.radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.stroke();
            ctx.restore();

            // 2. ORTADAKİ DURUM METNİ VE İKON
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (s.isRunning) {
                ctx.fillStyle = '#10B981';
                ctx.font = 'bold 15px Nunito, sans-serif';
                ctx.fillText('Döngüyü İzle ve Say! 🔄', s.cx, s.cy);
            } else if (s.readyToGuess) {
                ctx.fillStyle = '#6366F1';
                ctx.font = '900 16px Fredoka, Nunito, sans-serif';
                ctx.fillText('Kaç Tur Döndü? ❓', s.cx, s.cy);
            } else {
                ctx.fillStyle = '#94A3B8';
                ctx.font = 'bold 14px Nunito, sans-serif';
                ctx.fillText('Döngüyü İzle 🌟', s.cx, s.cy);
            }
            ctx.restore();

            // 3. BAŞLANGIÇ / BİTİŞ KAPISI (🏁)
            ctx.save();
            const gateX = s.cx + s.radiusX;
            const gateY = s.cy;
            ctx.fillStyle = s.readyToGuess ? '#10B981' : '#6366F1';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(gateX, gateY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', gateX, gateY);
            ctx.restore();

            // 4. ALTTTAKİ 4 TAHMİN KARTI (1, 2, 3, 4)
            for (let card of s.cards) {
                ctx.save();

                // Yanlış tahminde sallanma (wobble)
                if (card.wobble > 0) {
                    card.wobble *= 0.85;
                    if (card.wobble < 0.1) card.wobble = 0;
                    ctx.translate(card.x, card.y);
                    ctx.rotate(Math.sin(card.wobble * 2.8) * 0.15);
                    ctx.translate(-card.x, -card.y);
                }

                const isSelected = s.selectedCard === card.value;
                const isCorrect = isSelected && card.value === s.secretLoops;

                ctx.shadowColor = 'rgba(15, 23, 42, 0.1)';
                ctx.shadowBlur = 12;
                ctx.shadowOffsetY = 4;

                ctx.fillStyle = isCorrect ? '#DCFCE7' : (isSelected ? '#FEE2E2' : '#FFFFFF');
                ctx.strokeStyle = isCorrect ? '#10B981' : (isSelected ? '#EF4444' : '#CBD5E1');
                ctx.lineWidth = isSelected ? 2.5 : 1.5;

                ctx.beginPath();
                ctx.roundRect(card.x - card.w / 2, card.y - card.h / 2, card.w, card.h, 12);
                ctx.fill();
                ctx.stroke();
                ctx.shadowColor = 'transparent';

                // Kart üstündeki minik yıldız
                ctx.fillStyle = isCorrect ? '#059669' : '#F59E0B';
                ctx.font = '12px "Segoe UI Emoji", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⭐', card.x, card.y - 14);

                // Kart Sayısı
                ctx.fillStyle = isCorrect ? '#059669' : (isSelected ? '#DC2626' : '#1E293B');
                ctx.font = '900 20px Fredoka, Nunito, sans-serif';
                ctx.fillText(card.value, card.x, card.y + 10);

                ctx.restore();
            }

            // 5. YÖRÜNGEDE DÖNEN PARLAK SEVİMLİ YILDIZ
            const sx = s.cx + Math.cos(s.angle) * s.radiusX;
            const sy = s.cy + Math.sin(s.angle) * s.radiusY;

            ctx.save();
            // Dış parıltı halesi
            const haloGrad = ctx.createRadialGradient(sx, sy, 8, sx, sy, 28);
            haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
            haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(sx, sy, 28, 0, Math.PI * 2);
            ctx.fill();

            // 5 köşeli parlak yıldız
            CanvasEngine.drawStar(ctx, sx, sy, 5, 20, 10, '#FBBF24', '#D97706');

            // Yıldızın sevimli minik yüzü (Gözler ve gülümseme)
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.arc(sx - 4, sy - 2, 1.8, 0, Math.PI * 2);
            ctx.arc(sx + 4, sy - 2, 1.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(sx, sy + 2, 3, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();

            ctx.restore();
        }
    };
})();

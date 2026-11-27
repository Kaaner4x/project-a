/**
 * Chapter 1 - Task 1: Sabit Nesne ile İlk Etkileşim
 * Concept: Olay Tetikleme (OnClick)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[1] = {
        initState(engine) {
            engine.state = {
                orbX: engine.width / 2,
                orbY: engine.height / 2 - 8,
                // Her basışta küçülen boyut seviyeleri: Başlangıç(72px) -> 1.Tık(52px) -> 2.Tık(38px) -> 3.Tık(28px - OK)
                initialRadius: 72,
                radius: 72,
                targetRadius: 72,
                shrinkLevels: [72, 52, 38, 28],
                taps: 0,
                targetTaps: 3,
                scale: 1,
                squashX: 1,
                squashY: 1,
                notes: ['Do', 'Mi', 'Sol'],
                noteColors: ['#6366F1', '#EC4899', '#10B981'],
                isCompleted: false,
                showOkBadge: false,
                waveRadius: 0,
                waveAlpha: 0,
                pulse: 0
            };
            engine._updateHUD("Dokunma: 0 / 3 • Sihirli müzik topuna tıkla ve küçült! 🎵");
        },

        handlePointerDown(engine, pos) {
            const s1 = engine.state;
            if (s1.isCompleted) return;

            const dist1 = Math.hypot(pos.x - s1.orbX, pos.y - s1.orbY);
            // Küçüldükçe dokunmayı kolaylaştırmak için konforlu dokunma alanı (min 48px)
            const clickHitRadius = Math.max(s1.radius * 1.4, 48);

            if (dist1 <= clickHitRadius) {
                s1.taps++;
                const levelIndex = Math.min(s1.taps, s1.shrinkLevels.length - 1);
                s1.targetRadius = s1.shrinkLevels[levelIndex];

                // Yaylanma / Squash & Stretch esnek animasyon efekti
                s1.scale = 1.35;
                s1.squashX = 1.25;
                s1.squashY = 0.82;
                s1.waveRadius = s1.radius;
                s1.waveAlpha = 1;

                // Estetik pentatonik nota çal (1: Do, 2: Mi, 3: Sol)
                const noteIndex = Math.min(s1.taps - 1, s1.notes.length - 1);
                const playedNote = s1.notes[noteIndex];
                if (window.RhythmMixer) {
                    window.RhythmMixer.playNote(playedNote, 0.65, 'sine', 0.45);
                    window.RhythmMixer.playSparkle();
                }
                engine.particles.burst(s1.orbX, s1.orbY, 20 + s1.taps * 8);

                if (s1.taps >= s1.targetTaps) {
                    s1.isCompleted = true;
                    s1.showOkBadge = true;
                    engine._updateHUD("Tebrikler! 3 basış tamamlandı ve görev OK ✓");

                    // Tek noktadan triggerComplete çağrılır
                    setTimeout(() => {
                        engine.triggerComplete();
                    }, 400);
                } else {
                    engine._updateHUD(`Dokunma: ${s1.taps} / ${s1.targetTaps} • Top küçülüyor, devam et! 💫`);
                }
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        render(engine) {
            const s = engine.state;
            const ctx = engine.ctx;

            // Pürüzsüz yaylanarak küçülme ve toparlanma fiziği
            s.radius += (s.targetRadius - s.radius) * 0.18;
            s.scale += (1 - s.scale) * 0.12;
            s.squashX += (1 - s.squashX) * 0.15;
            s.squashY += (1 - s.squashY) * 0.15;
            s.pulse += 0.045;

            const pulseR = s.radius + Math.sin(s.pulse) * (s.isCompleted ? 2 : 3);
            const currentColor = s.isCompleted ? '#10B981' : s.noteColors[Math.min(s.taps, s.noteColors.length - 1)];

            // 1. ÜST AŞAMA İLERLEME GÖSTERGESİ (Nota Yazısı Olmadan 3 Aşamalı Görsel Rozetler)
            const indicatorY = s.orbY - 105;
            const stepWidth = 46;
            const startX = s.orbX - ((3 - 1) * stepWidth) / 2;

            ctx.save();
            for (let i = 0; i < 3; i++) {
                const stepX = startX + i * stepWidth;
                const isDone = s.taps > i;
                const isCurrent = s.taps === i;

                // Dairesel rozet
                ctx.beginPath();
                ctx.arc(stepX, indicatorY, 15, 0, Math.PI * 2);
                ctx.fillStyle = isDone ? '#10B981' : (isCurrent ? '#EEF2FF' : '#F8FAFC');
                ctx.fill();
                ctx.strokeStyle = isDone ? '#059669' : (isCurrent ? '#6366F1' : '#CBD5E1');
                ctx.lineWidth = isCurrent ? 2.5 : 1.5;
                ctx.stroke();

                // İkon: Tamamlanmışsa ✓ (Son adımda OK), Sıradakiyse 1, 2, 3
                ctx.fillStyle = isDone ? '#FFFFFF' : (isCurrent ? '#4338CA' : '#94A3B8');
                ctx.font = 'bold 12px Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const icon = isDone ? (i === 2 ? 'OK' : '✓') : `${i + 1}`;
                ctx.fillText(icon, stepX, indicatorY);
            }
            ctx.restore();

            // 2. DIŞ IŞILTILI HALO (Glow)
            ctx.save();
            const haloGrad = ctx.createRadialGradient(s.orbX, s.orbY, s.radius * 0.4, s.orbX, s.orbY, pulseR + (s.isCompleted ? 32 : 24));
            haloGrad.addColorStop(0, s.isCompleted ? 'rgba(16, 185, 129, 0.45)' : 'rgba(99, 102, 241, 0.35)');
            haloGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(s.orbX, s.orbY, pulseR + (s.isCompleted ? 32 : 24), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 3. TAMAMLANINCA DÖNEN KUTLAMA ÇEMBERİ (OK Starburst)
            if (s.isCompleted) {
                ctx.save();
                ctx.strokeStyle = '#F59E0B';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 6]);
                ctx.beginPath();
                ctx.arc(s.orbX, s.orbY, pulseR + 14, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // 4. KÜÇÜLEN PARLAK MÜZİK TOPU (Squash & Stretch Efektiyle)
            ctx.save();
            ctx.translate(s.orbX, s.orbY);
            ctx.scale(s.scale * s.squashX, s.scale * s.squashY);

            const orbGrad = ctx.createRadialGradient(-pulseR * 0.3, -pulseR * 0.3, pulseR * 0.15, 0, 0, pulseR);
            if (s.isCompleted) {
                orbGrad.addColorStop(0, '#A7F3D0');
                orbGrad.addColorStop(0.6, '#10B981');
                orbGrad.addColorStop(1, '#047857');
            } else {
                orbGrad.addColorStop(0, '#E0E7FF');
                orbGrad.addColorStop(0.65, currentColor);
                orbGrad.addColorStop(1, '#312E81');
            }

            ctx.fillStyle = orbGrad;
            ctx.beginPath();
            ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = s.isCompleted ? 3.5 : 2.5;
            ctx.stroke();

            // Topun İçi: Tamamlandıysa "OK ✓", Değilse Dinamik Ok ve Nota
            if (s.isCompleted) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '900 16px Baloo 2, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('OK ✓', 0, 0);
            } else {
                // Küçük yönlendiren sevimli ok ve nota ikonu
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 20px Baloo 2, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const symbol = s.taps === 0 ? '👆' : (s.taps === 1 ? '➔' : '🎯');
                ctx.fillText(symbol, 0, 0);
            }
            ctx.restore();

            // 5. GENİŞLEYEN BAŞARI SES DALGASI
            if (s.waveAlpha > 0) {
                ctx.save();
                ctx.strokeStyle = `rgba(${s.isCompleted ? '16, 185, 129' : '99, 102, 241'}, ${s.waveAlpha})`;
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.arc(s.orbX, s.orbY, s.waveRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                s.waveRadius += 4;
                s.waveAlpha -= 0.035;
            }
        }
    };
})();

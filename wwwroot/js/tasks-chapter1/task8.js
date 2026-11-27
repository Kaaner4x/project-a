/**
 * Chapter 1 - Task 8: Dokunsal Boyut Ölçekleme
 * Concept: Nesne Özellikleri (Scale / Size)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[8] = {
        initState(engine) {
            // Dokunsal Boyut Ölçekleme & Dar Geçit
            // Başlangıç boyutu: 1.8x (Genişlik/Yükseklik ~50px, 46px geçitten kesinlikle geçemez)
            // Hedef boyut: <= 0.8x (Geçit açıklığı 46px, 0.8x olunca ~22px olur ve rahatça geçer)
            engine.state = {
                brushX: 110,
                brushY: 180,
                origX: 110,
                origY: 180,
                pathY: 180,
                scale: 1.8,
                minPassScale: 0.8,
                gateX: 330,
                gateWidth: 64,
                gateGap: 46,
                isDragging: false,
                isPassing: false,
                passed: false,
                wobble: 0,
                dragOffset: { x: 0, y: 0 }
            };
            engine._updateHUD("Püskül kapıdan geçmek için çok büyük! (1.8x) • [-] Küçült butonuyla küçültelim 🔍");
        },

        changeBrushScale(engine, delta) {
            const s = engine.state;
            if (s.isPassing || s.passed) return;
            s.scale = Math.round(Math.max(0.6, Math.min(2.0, s.scale + delta)) * 10) / 10;

            const baseFreq = 261.63 * (2.2 - s.scale);
            if (window.RhythmMixer) window.RhythmMixer.playNote(baseFreq, 0.16, 'triangle', 0.35);

            const canPass = s.scale <= s.minPassScale;
            if (canPass) {
                engine._updateHUD(`Harika! Boyut: ${s.scale.toFixed(1)}x (Sığdı!) • Sürükle veya 'Geç ▶'e bas! ✨`);
            } else {
                engine._updateHUD(`Mevcut Boyut: ${s.scale.toFixed(1)}x (Geçit Limiti: 0.8x) • [-] Küçült ile küçült! 🔍`);
            }

            const passBtn = document.getElementById('passTunnelBtn');
            if (passBtn) {
                passBtn.disabled = !canPass;
                if (canPass) {
                    passBtn.classList.remove('btn-secondary');
                    passBtn.classList.add('btn-success');
                } else {
                    passBtn.classList.remove('btn-success');
                    passBtn.classList.add('btn-secondary');
                }
            }
        },

        passThroughTunnel(engine) {
            const s = engine.state;
            if (s.scale > s.minPassScale || s.isPassing || s.passed) return;
            s.isPassing = true;
            s.isDragging = false;
            if (window.RhythmMixer) window.RhythmMixer.playWhoosh(true);

            const glide = () => {
                if (engine.taskId !== 8 || s.passed) return;
                if (s.brushX < 510) {
                    s.brushX += 6;
                    requestAnimationFrame(glide);
                } else {
                    s.brushX = 510;
                    s.passed = true;
                    s.isPassing = false;
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.85);
                        window.RhythmMixer.playSparkle();
                    }
                    engine.particles.burst(s.brushX, s.brushY, 32);
                    engine._updateHUD("Püskül dar geçitten başarıyla geçti! 🔍🎉");
                    setTimeout(() => engine.triggerComplete(), 450);
                }
            };
            requestAnimationFrame(glide);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Püskül'ü sürükleyerek geçitten geçirme
            if (!s.passed && !s.isPassing) {
                const dist8 = Math.hypot(pos.x - s.brushX, pos.y - s.brushY);
                if (dist8 <= 36 * Math.max(1, s.scale)) {
                    s.isDragging = true;
                    s.dragOffset = { x: pos.x - s.brushX, y: 0 };
                    if (window.RhythmMixer) window.RhythmMixer.playPop(340);
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.isDragging) {
                let targetX = pos.x - s.dragOffset.x;
                targetX = Math.max(70, Math.min(540, targetX));

                const barrierX = s.gateX - 20;
                if (s.scale > s.minPassScale && targetX > barrierX) {
                    // Geçite sığmadı! Kapıya çarpıp seker
                    targetX = barrierX;
                    if (!s.lastBump || (Date.now() - s.lastBump > 400)) {
                        s.lastBump = Date.now();
                        if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                        s.wobble = 14;
                        engine._updateHUD(`Püskül (${s.scale.toFixed(1)}x) geçite sığmadı! [-] ile küçültelim 🔍`);
                    }
                }

                s.brushX = targetX;
                s.brushY = s.pathY; // Ray boyunca pürüzsüz yatay hareket

                // Bitiş bayrağına ulaştı mı?
                if (s.brushX >= 500 && !s.passed) {
                    s.passed = true;
                    s.isDragging = false;
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.85);
                        window.RhythmMixer.playSparkle();
                    }
                    engine.particles.burst(s.brushX, s.brushY, 32);
                    engine._updateHUD("Püskül dar geçitten başarıyla geçti! 🎉");
                    setTimeout(() => engine.triggerComplete(), 450);
                }
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            if (s.isDragging) {
                s.isDragging = false;
                // Eğer geçitten geçilmediyse ve fırça büyükse, engelden geriye başlangıç noktasına yumuşakça dönsün
                if (!s.passed && s.scale > s.minPassScale && s.brushX > s.gateX - 40) {
                    s.brushX = s.origX;
                }
            }
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            const halfGap = s.gateGap / 2; // 23px
            const gateTop = s.pathY - halfGap; // 157
            const gateBottom = s.pathY + halfGap; // 203
            const canPass = s.scale <= s.minPassScale;

            // 1. KILAVUZ HAREKET YOLU / RAY
            ctx.save();
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(80, s.pathY);
            ctx.lineTo(520, s.pathY);
            ctx.stroke();

            ctx.strokeStyle = canPass ? '#A7F3D0' : '#CBD5E1';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(80, s.pathY);
            ctx.lineTo(520, s.pathY);
            ctx.stroke();
            ctx.restore();

            // 2. DAR GEÇİT / PORTAL DUVARLARI
            ctx.save();
            const wallX = s.gateX;
            const wallW = s.gateWidth;

            // Üst Duvar (Tavandan gateTop'a kadar)
            const topGrad = ctx.createLinearGradient(wallX, 0, wallX + wallW, gateTop);
            topGrad.addColorStop(0, '#1E293B');
            topGrad.addColorStop(1, '#334155');
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.roundRect(wallX - wallW / 2, 20, wallW, gateTop - 20, [12, 12, 4, 4]);
            ctx.fill();
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Alt Duvar (gateBottom'dan zemine kadar)
            const botGrad = ctx.createLinearGradient(wallX, gateBottom, wallX + wallW, engine.height - 20);
            botGrad.addColorStop(0, '#334155');
            botGrad.addColorStop(1, '#1E293B');
            ctx.fillStyle = botGrad;
            ctx.beginPath();
            ctx.roundRect(wallX - wallW / 2, gateBottom, wallW, engine.height - 20 - gateBottom, [4, 4, 12, 12]);
            ctx.fill();
            ctx.stroke();

            // Duvarlardaki Lazer Verici Başlıkları (Emitter Caps)
            ctx.fillStyle = canPass ? '#10B981' : '#F43F5E';
            ctx.beginPath();
            ctx.roundRect(wallX - 18, gateTop - 9, 36, 9, [4, 4, 0, 0]);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(wallX - 18, gateBottom, 36, 9, [0, 0, 4, 4]);
            ctx.fill();

            // 3. LAZER GÜVENLİK IŞINI / ENERJİ BARİYERİ
            const beamColor = canPass ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.45)';
            const beamCore = canPass ? '#34D399' : '#FB7185';

            // Lazer Halesi
            ctx.fillStyle = beamColor;
            ctx.fillRect(wallX - 12, gateTop, 24, s.gateGap);

            // Lazer Çekirdeği
            ctx.strokeStyle = beamCore;
            ctx.lineWidth = canPass ? 2.5 : 3.5;
            ctx.beginPath();
            ctx.moveTo(wallX, gateTop);
            ctx.lineTo(wallX, gateBottom);
            ctx.stroke();

            // Kapı Durum Rozeti (Duvar üstünde ve altında)
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(canPass ? 'AÇIK 🔓' : 'KİLİTLİ 🔒', wallX, gateTop - 24);

            ctx.font = 'bold 11px Nunito, sans-serif';
            ctx.fillStyle = '#94A3B8';
            ctx.fillText('Geçit: 46px', wallX, gateBottom + 24);
            ctx.restore();

            // 4. BİTİŞ HEDEFİ / BAYRAK (🏁)
            ctx.save();
            const finishX = 515;
            const finishY = s.pathY;

            ctx.beginPath();
            ctx.arc(finishX, finishY, 20, 0, Math.PI * 2);
            ctx.fillStyle = s.passed ? '#DCFCE7' : '#F1F5F9';
            ctx.fill();
            ctx.strokeStyle = s.passed ? '#10B981' : '#94A3B8';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.font = '16px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', finishX, finishY);
            ctx.restore();

            // 5. PÜSKÜL (Wobble & Sürükleme Efektiyle)
            ctx.save();
            if (s.wobble > 0) {
                s.wobble *= 0.85;
                if (s.wobble < 0.1) s.wobble = 0;
                ctx.translate(s.brushX, s.brushY);
                ctx.rotate(Math.sin(s.wobble * 2.8) * 0.12);
                ctx.translate(-s.brushX, -s.brushY);
            }

            // Püskül boyutu için bilgi etiketi (Püskülün hemen üstünde)
            ctx.fillStyle = canPass ? '#059669' : '#E11D48';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${s.scale.toFixed(1)}x`, s.brushX, s.brushY - 26 * s.scale);

            CanvasEngine.drawBrush(ctx, s.brushX, s.brushY, 0, s.scale, '#EC4899', s.passed);
            ctx.restore();
        }
    };
})();

/**
 * Chapter 1 - Task 8: Dokunsal Boyut Ölçekleme
 * Concept: Nesne Özellikleri (Scale / Size)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[8] = {
        initState(engine) {
            // Dokunsal Boyut Ölçekleme & Dar Geçit
            // Başlangıç boyutu: 1.8x (46px geçitten geçemez) -> Hedef boyut: <= 0.8x
            engine.state = {
                brushX: 125,
                brushY: 165,
                origX: 125,
                origY: 165,
                pathY: 165,
                scale: 1.8,
                minPassScale: 0.8,
                gateX: 335,
                gateWidth: 64,
                gateGap: 46,
                finishX: 520,
                minusBtn: { x: 90, y: 298, r: 26, press: 0 },
                plusBtn: { x: 168, y: 298, r: 26, press: 0 },
                isDragging: false,
                isPassing: false,
                passed: false,
                wobble: 0,
                dragOffset: { x: 0, y: 0 }
            };
            engine._updateHUD("Püskül geçitten geçmek için çok büyük! Eksi (-) butonuna basıp küçült.");
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
            if (s.passed || s.isPassing) return;

            // 1. Tuval içi [-] Küçült butonu
            const distMinus = Math.hypot(pos.x - s.minusBtn.x, pos.y - s.minusBtn.y);
            if (distMinus <= s.minusBtn.r + 8) {
                s.minusBtn.press = 1;
                this.changeBrushScale(engine, -0.2);
                return;
            }

            // 2. Tuval içi [+] Büyüt butonu
            const distPlus = Math.hypot(pos.x - s.plusBtn.x, pos.y - s.plusBtn.y);
            if (distPlus <= s.plusBtn.r + 8) {
                s.plusBtn.press = 1;
                this.changeBrushScale(engine, 0.2);
                return;
            }

            // 3. Yeterince küçüldüyse yeşil geçide veya bitiş bayrağına dokunarak otomatik geç
            if (s.scale <= s.minPassScale) {
                const inGate = Math.abs(pos.x - s.gateX) <= s.gateWidth / 2 + 10 &&
                    Math.abs(pos.y - s.pathY) <= s.gateGap / 2 + 24;
                const distFinish = Math.hypot(pos.x - s.finishX, pos.y - s.pathY);
                if (inGate || distFinish <= 34) {
                    this.passThroughTunnel(engine);
                    return;
                }
            }

            // 4. Püskül'ü sürükleyerek geçitten geçirme
            const dist8 = Math.hypot(pos.x - s.brushX, pos.y - s.brushY);
            if (dist8 <= 36 * Math.max(1, s.scale)) {
                s.isDragging = true;
                s.dragOffset = { x: pos.x - s.brushX, y: 0 };
                if (window.RhythmMixer) window.RhythmMixer.playPop(340);
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

        _drawScaleButton(ctx, btn, symbol, bgColor, borderColor, disabled) {
            ctx.save();
            if (btn.press > 0) {
                btn.press *= 0.82;
                if (btn.press < 0.02) btn.press = 0;
            }
            const pressScale = 1 - btn.press * 0.12;
            ctx.translate(btn.x, btn.y);
            ctx.scale(pressScale, pressScale);

            ctx.shadowColor = disabled ? 'transparent' : 'rgba(15, 23, 42, 0.14)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;

            ctx.fillStyle = disabled ? '#E2E8F0' : bgColor;
            ctx.strokeStyle = disabled ? '#CBD5E1' : borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, btn.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.shadowColor = 'transparent';
            ctx.fillStyle = disabled ? '#94A3B8' : '#FFFFFF';
            ctx.font = '900 26px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, 0, 1);
            ctx.restore();
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            const halfGap = s.gateGap / 2;
            const gateTop = s.pathY - halfGap;
            const gateBottom = s.pathY + halfGap;
            const canPass = s.scale <= s.minPassScale;

            // 1. KILAVUZ HAREKET YOLU / RAY
            ctx.save();
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(80, s.pathY);
            ctx.lineTo(s.finishX, s.pathY);
            ctx.stroke();

            ctx.strokeStyle = canPass ? '#A7F3D0' : '#CBD5E1';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(80, s.pathY);
            ctx.lineTo(s.finishX, s.pathY);
            ctx.stroke();
            ctx.restore();

            // 2. DAR GEÇİT / PORTAL DUVARLARI
            ctx.save();
            const wallX = s.gateX;
            const wallW = s.gateWidth;

            // Üst Duvar
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

            // Alt Duvar
            const botGrad = ctx.createLinearGradient(wallX, gateBottom, wallX + wallW, engine.height - 20);
            botGrad.addColorStop(0, '#334155');
            botGrad.addColorStop(1, '#1E293B');
            ctx.fillStyle = botGrad;
            ctx.beginPath();
            ctx.roundRect(wallX - wallW / 2, gateBottom, wallW, engine.height - 20 - gateBottom, [4, 4, 12, 12]);
            ctx.fill();
            ctx.stroke();

            // Duvarlardaki Lazer Verici Başlıkları
            ctx.fillStyle = canPass ? '#10B981' : '#F43F5E';
            ctx.beginPath();
            ctx.roundRect(wallX - 18, gateTop - 9, 36, 9, [4, 4, 0, 0]);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(wallX - 18, gateBottom, 36, 9, [0, 0, 4, 4]);
            ctx.fill();

            // 3. LAZER GÜVENLİK IŞINI / GEÇİŞ IŞIĞI
            const beamColor = canPass ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.42)';
            const beamCore = canPass ? '#34D399' : '#FB7185';

            ctx.fillStyle = beamColor;
            ctx.fillRect(wallX - 14, gateTop, 28, s.gateGap);

            if (!canPass) {
                ctx.strokeStyle = beamCore;
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(wallX, gateTop);
                ctx.lineTo(wallX, gateBottom);
                ctx.stroke();
            } else if (!s.passed) {
                // Geçit açıkken hafif hareketli yeşil yön oku
                const arrowShift = Math.sin(engine.time * 0.1) * 4;
                ctx.fillStyle = '#059669';
                ctx.font = 'bold 20px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('▶', wallX + arrowShift, s.pathY);
            }
            ctx.restore();

            // 4. BİTİŞ HEDEFİ / BAYRAK
            ctx.save();
            const finishX = s.finishX;
            const finishY = s.pathY;

            ctx.beginPath();
            ctx.arc(finishX, finishY, 22, 0, Math.PI * 2);
            ctx.fillStyle = s.passed ? '#DCFCE7' : (canPass ? '#ECFDF5' : '#F1F5F9');
            ctx.fill();
            ctx.strokeStyle = (s.passed || canPass) ? '#10B981' : '#94A3B8';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.font = '18px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', finishX, finishY);
            ctx.restore();

            // 5. TUVAL İÇİ BOYUT KONTROL BUTONLARI (− ve +)
            if (!s.passed && !s.isPassing) {
                this._drawScaleButton(ctx, s.minusBtn, '−', '#6366F1', '#4338CA', s.scale <= 0.6);
                this._drawScaleButton(ctx, s.plusBtn, '+', '#EC4899', '#BE185D', s.scale >= 2.0);
            }

            // 6. PÜSKÜL (Wobble & Sürükleme Efektiyle)
            ctx.save();
            if (s.wobble > 0) {
                s.wobble *= 0.85;
                if (s.wobble < 0.1) s.wobble = 0;
                ctx.translate(s.brushX, s.brushY);
                ctx.rotate(Math.sin(s.wobble * 2.8) * 0.12);
                ctx.translate(-s.brushX, -s.brushY);
            }

            CanvasEngine.drawBrush(ctx, s.brushX, s.brushY, 0, s.scale, '#EC4899', s.passed);
            ctx.restore();
        }
    };
})();

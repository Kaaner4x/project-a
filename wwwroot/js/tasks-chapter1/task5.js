/**
 * Chapter 1 - Task 5: Engeli Temizleme & Hata Ayıklama
 * Concept: Hata Ayıklama (Debugging)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[5] = {
        initState(engine) {
            // Engeli Temizleme & Debugging (Böcek / Bug ve Çöp Kutusu)
            engine.state = {
                brush: { x: 80, y: 220, speed: 0, moving: false },
                rock: { x: 340, y: 215, origX: 340, origY: 215, radius: 26, isDragging: false, cleared: false, wobble: 0 },
                bin: { x: 340, y: 80, w: 56, h: 58, lidOpen: false },
                targetX: 560,
                pathY: 220,
                dragOffset: { x: 0, y: 0 }
            };
            engine._updateHUD("Yolu tıkayan hatayı (Bug) 🐞 Çöp Kutusuna 🗑️ sürükle ve içine bırak!");
        },

        clearObstacle(engine) {
            const s = engine.state;
            if (s.rock.cleared) return;
            s.rock.cleared = true;
            s.rock.isDragging = false;
            if (window.RhythmMixer) window.RhythmMixer.playWhoosh(true);
            engine.particles.burst(s.rock.x, s.rock.y, 20);

            engine._updateHUD("Yol açıldı! Fırça hedefe koşuyor...");

            const interval = setInterval(() => {
                if (s.brush.x < s.targetX) {
                    s.brush.x += 6;
                    if (Math.round(s.brush.x) % 60 === 0) {
                        if (window.RhythmMixer) window.RhythmMixer.playNote('Mi', 0.15, 'triangle', 0.2);
                    }
                } else {
                    clearInterval(interval);
                    engine._updateHUD("Hedefe varıldı! Hata ayıklama tamamlandı 🧹");
                    engine.triggerComplete();
                }
            }, 30);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            if (!s.rock.cleared) {
                const dist5 = Math.hypot(pos.x - s.rock.x, pos.y - s.rock.y);
                if (dist5 <= s.rock.radius * 1.5) {
                    s.rock.isDragging = true;
                    s.dragOffset = { x: pos.x - s.rock.x, y: pos.y - s.rock.y };
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.rock.isDragging) {
                s.rock.x = pos.x - s.dragOffset.x;
                s.rock.y = pos.y - s.dragOffset.y;

                // Çöp kutusuna yakınlık kontrolü (Kapağı arala)
                const distToBin = Math.hypot(s.rock.x - s.bin.x, s.rock.y - s.bin.y);
                s.bin.lidOpen = distToBin < 85;

                if (distToBin < 55) {
                    engine._updateHUD("Böceği Çöp Kutusuna 🗑️ bırak!");
                }
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            if (s.rock.isDragging) {
                s.rock.isDragging = false;
                s.bin.lidOpen = false;

                const distToBin = Math.hypot(s.rock.x - s.bin.x, s.rock.y - s.bin.y);
                const insideBinArea = distToBin < 60 ||
                    (Math.abs(s.rock.x - s.bin.x) < 40 && Math.abs(s.rock.y - s.bin.y) < 48);

                if (insideBinArea) {
                    // ÇÖP KUTUSUNA BIRAKILDI -> TEMİZLE!
                    s.rock.x = s.bin.x;
                    s.rock.y = s.bin.y;
                    this.clearObstacle(engine);
                } else {
                    // Çöp kutusu dışına bırakıldı -> Başlangıç noktasına geri yaylan
                    s.rock.x = s.rock.origX;
                    s.rock.y = s.rock.origY;
                    s.rock.wobble = 16;
                    if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                    engine._updateHUD("Hatayı (Bug) 🐞 temizlemek için Çöp Kutusuna 🗑️ sürükleyip içine bırakmalısın!");
                }
            }
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. ÇÖP KUTUSU (Geri Dönüşüm / Debug Kutusu)
            ctx.save();
            const binX = s.bin.x;
            const binY = s.bin.y;
            const binW = s.bin.w;
            const binH = s.bin.h;

            // Kutu Gövdesi
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(binX - binW / 2, binY - binH / 2 + 6, binW, binH - 6, [0, 0, 10, 10]);
            ctx.fill();
            ctx.stroke();

            // Kutu üzerindeki dikey oluk çizgileri
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            [-12, 0, 12].forEach(ox => {
                ctx.beginPath();
                ctx.moveTo(binX + ox, binY - 12);
                ctx.lineTo(binX + ox, binY + 20);
                ctx.stroke();
            });

            // Çöp Kutusu Kapağı (Yaklaşınca aralanır)
            ctx.save();
            ctx.translate(binX - binW / 2, binY - binH / 2 + 6);
            if (s.bin.lidOpen) {
                ctx.rotate(-0.35);
            }
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(-4, -10, binW + 8, 10, 4);
            ctx.fill();
            ctx.stroke();

            // Kapak kulpu
            ctx.beginPath();
            ctx.arc(binW / 2, -10, 6, Math.PI, 0);
            ctx.stroke();
            ctx.restore();

            // Kutu Etiketi
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 11px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Çöp Kutusu 🗑️', binX, binY + binH / 2 + 16);
            ctx.restore();

            // 2. YOL HATTI
            ctx.save();
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 28;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(60, s.pathY);
            ctx.lineTo(580, s.pathY);
            ctx.stroke();

            if (s.brush.x > 80) {
                ctx.strokeStyle = '#38BDF8';
                ctx.lineWidth = 14;
                ctx.beginPath();
                ctx.moveTo(80, s.pathY);
                ctx.lineTo(s.brush.x, s.pathY);
                ctx.stroke();
            }
            ctx.restore();

            // 3. HEDEF BAYRAK
            ctx.save();
            ctx.fillStyle = '#10B981';
            ctx.fillRect(s.targetX - 4, s.pathY - 45, 8, 50);
            ctx.beginPath();
            ctx.moveTo(s.targetX + 4, s.pathY - 45);
            ctx.lineTo(s.targetX + 36, s.pathY - 30);
            ctx.lineTo(s.targetX + 4, s.pathY - 15);
            ctx.fill();
            ctx.restore();

            // 4. ENGEL (SEVİMLİ KOD BÖCEĞİ / BUG)
            if (!s.rock.cleared) {
                ctx.save();

                // Sallanma / Titreme (Wobble) efekti
                if (s.rock.wobble > 0) {
                    s.rock.wobble *= 0.86;
                    if (s.rock.wobble < 0.1) s.rock.wobble = 0;
                    ctx.translate(s.rock.x, s.rock.y);
                    ctx.rotate(Math.sin(s.rock.wobble * 2.8) * 0.12);
                    ctx.translate(-s.rock.x, -s.rock.y);
                }

                // Sürüklenirken derinlik gölgesi
                if (s.rock.isDragging) {
                    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
                    ctx.shadowBlur = 16;
                    ctx.shadowOffsetY = 8;
                }

                const rx = s.rock.x;
                const ry = s.rock.y;
                const r = s.rock.radius;

                // Bacaklar (6 minik bacak)
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 2.8;
                ctx.lineCap = 'round';
                [-8, 0, 8].forEach(ox => {
                    ctx.beginPath();
                    ctx.moveTo(rx + ox, ry - 6);
                    ctx.lineTo(rx + ox - 14, ry - 14);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(rx + ox, ry + 6);
                    ctx.lineTo(rx + ox - 14, ry + 14);
                    ctx.stroke();
                });

                // Kırmızı parlak böcek kabuğu
                const shellGrad = ctx.createRadialGradient(rx - 6, ry - 6, 4, rx, ry, r);
                shellGrad.addColorStop(0, '#F87171');
                shellGrad.addColorStop(0.6, '#EF4444');
                shellGrad.addColorStop(1, '#B91C1C');
                ctx.fillStyle = shellGrad;
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(rx, ry, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Kanat ayırıcı siyah orta hat
                ctx.beginPath();
                ctx.moveTo(rx - r + 4, ry);
                ctx.lineTo(rx + r - 8, ry);
                ctx.stroke();

                // Kabuk benekleri
                ctx.fillStyle = '#1E293B';
                [
                    { ox: -6, oy: -9 }, { ox: 5, oy: -9 },
                    { ox: -6, oy: 9 }, { ox: 5, oy: 9 }
                ].forEach(spot => {
                    ctx.beginPath();
                    ctx.arc(rx + spot.ox, ry + spot.oy, 3, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Baş kısmı
                ctx.fillStyle = '#0F172A';
                ctx.beginPath();
                ctx.arc(rx + r - 7, ry, 11, -0.45 * Math.PI, 0.45 * Math.PI);
                ctx.fill();
                ctx.stroke();

                // Antenler
                ctx.strokeStyle = '#0F172A';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(rx + r - 2, ry - 5);
                ctx.lineTo(rx + r + 8, ry - 12);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(rx + r - 2, ry + 5);
                ctx.lineTo(rx + r + 8, ry + 12);
                ctx.stroke();

                // Anten ucu altın topları
                ctx.fillStyle = '#F59E0B';
                ctx.beginPath();
                ctx.arc(rx + r + 8, ry - 12, 2.8, 0, Math.PI * 2);
                ctx.arc(rx + r + 8, ry + 12, 2.8, 0, Math.PI * 2);
                ctx.fill();

                // Sevimli beyaz gözler ve gözbebekleri
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(rx + r - 3, ry - 4, 4, 0, Math.PI * 2);
                ctx.arc(rx + r - 3, ry + 4, 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#0F172A';
                ctx.beginPath();
                ctx.arc(rx + r - 2, ry - 4, 1.8, 0, Math.PI * 2);
                ctx.arc(rx + r - 2, ry + 4, 1.8, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }

            // Fırça
            CanvasEngine.drawBrush(ctx, s.brush.x, s.pathY - 25, 15, 1, '#3B82F6', s.brush.x >= s.targetX);
        }
    };
})();

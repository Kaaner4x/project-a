/**
 * Chapter 1 - Task 4: Katman Algısı ve Keşif
 * Concept: Derinlik Hiyerarşisi (Z-Index)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[4] = {
        initState(engine) {
            // Katman Algısı (Z-Index / 7 Bulut Arasında Güneşi Keşfetme)
            const cloudConfigs = [
                { id: 1, x: 125, y: 95, scale: 1.05, secret: '⭐' },
                { id: 2, x: 320, y: 85, scale: 1.15, secret: '🌙' },
                { id: 3, x: 515, y: 95, scale: 1.0, secret: '🕊️' },
                { id: 4, x: 140, y: 230, scale: 1.05, secret: '🌈' },
                { id: 5, x: 320, y: 195, scale: 1.35, secret: '☀️' },
                { id: 6, x: 500, y: 235, scale: 1.1, secret: '🎵' },
                { id: 7, x: 320, y: 295, scale: 1.05, secret: '💫' }
            ];

            // Güneşin saklandığı gizli parçayı rastgele belirle
            const sunIndex = Math.floor(Math.random() * cloudConfigs.length);

            engine.state = {
                clouds: cloudConfigs.map((cfg, idx) => ({
                    ...cfg,
                    origX: cfg.x,
                    origY: cfg.y,
                    hasSun: idx === sunIndex,
                    isDragging: false,
                    checked: false
                })),
                activeCloud: null,
                dragOffset: { x: 0, y: 0 },
                sun: {
                    x: cloudConfigs[sunIndex].x,
                    y: cloudConfigs[sunIndex].y,
                    radius: 42,
                    revealed: false
                }
            };
            engine._updateHUD("Bulutlardan birinin arkasında güneş saklı! ☀️ Bulutları çekip güneşi keşfet!");
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Güneş zaten bulunduysa yeni sürükleme engellenir
            if (s.sun.revealed) return;

            // Tıklanan bulutu tespit et (en üst katmandan geriye doğru)
            for (let i = s.clouds.length - 1; i >= 0; i--) {
                const c = s.clouds[i];
                const dist = Math.hypot(pos.x - c.x, pos.y - c.y);
                const hitRadius = 52 * c.scale;
                if (dist <= hitRadius) {
                    s.activeCloud = c;
                    c.isDragging = true;
                    s.dragOffset = { x: pos.x - c.x, y: pos.y - c.y };

                    // Sürüklenen parçayı en üst katmana taşı (çizim listesinin sonuna ekle)
                    s.clouds.splice(i, 1);
                    s.clouds.push(c);

                    if (window.RhythmMixer) window.RhythmMixer.playWhoosh(false);
                    break;
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.activeCloud && s.activeCloud.isDragging) {
                const c = s.activeCloud;
                c.x = Math.max(50, Math.min(engine.width - 50, pos.x - s.dragOffset.x));
                c.y = Math.max(45, Math.min(engine.height - 45, pos.y - s.dragOffset.y));

                const distFromOrig = Math.hypot(c.x - c.origX, c.y - c.origY);

                // Parça başlangıç yuvasından 60px kenara çekilince altındakini keşfeder
                if (distFromOrig > 60 && !c.checked) {
                    c.checked = true;

                    if (c.hasSun && !s.sun.revealed) {
                        // GÜNEŞ BULUNDU!
                        s.sun.revealed = true;
                        c.isDragging = false;
                        s.activeCloud = null;

                        if (window.RhythmMixer) {
                            window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'Do5'], 0.85);
                            window.RhythmMixer.playSparkle();
                        }
                        engine.particles.burst(s.sun.x, s.sun.y, 35);
                        engine._updateHUD("Güneşi buldun! ☀️ Katmanların ardındaki ışık parıldıyor!");

                        setTimeout(() => {
                            engine.triggerComplete();
                        }, 550);
                    } else if (!c.hasSun) {
                        // Güneş bu parçada yoktu
                        if (window.RhythmMixer) window.RhythmMixer.playPop(420);
                        engine.particles.burst(c.origX, c.origY, 12);
                        const checkedCount = s.clouds.filter(cl => cl.checked).length;
                        engine._updateHUD(`Bu bulutta yoktu 💨 (${checkedCount} / 7 denendi) • Güneş diğer bulutlardan birinde! 🔍`);
                    }
                }
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            if (s.activeCloud) {
                const c = s.activeCloud;
                c.isDragging = false;
                s.activeCloud = null;

                // Eğer kullanıcı parçayı çok az oynatıp bıraktıysa (< 45px), yuvasına geri dönsün
                const distFromOrig = Math.hypot(c.x - c.origX, c.y - c.origY);
                if (distFromOrig < 45 && !c.checked) {
                    c.x = c.origX;
                    c.y = c.origY;
                }
            }
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. ARKA KATMAN: GÜNEŞ (Güneşin saklandığı parça oynatıldığında veya keşfedildiğinde parıldar)
            const sunCloud = s.clouds.find(c => c.hasSun);
            if (sunCloud) {
                const distFromOrig = Math.hypot(sunCloud.x - sunCloud.origX, sunCloud.y - sunCloud.origY);
                if (distFromOrig > 20 || s.sun.revealed) {
                    CanvasEngine.drawSun(ctx, s.sun.x, s.sun.y, s.sun.radius, 16, engine.time);
                }
            }

            // 2. YUVALARDAKİ SÜRPRİZ SİMGELER (Bulut kenara çekildikçe altındaki simge ortaya çıkar)
            for (let c of s.clouds) {
                if (!c.hasSun) {
                    const distFromOrig = Math.hypot(c.x - c.origX, c.y - c.origY);
                    if (distFromOrig > 25 || c.checked) {
                        ctx.save();
                        // Yuva arka plan silik dairesi
                        ctx.fillStyle = 'rgba(241, 245, 249, 0.7)';
                        ctx.strokeStyle = '#E2E8F0';
                        ctx.lineWidth = 1.5;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.arc(c.origX, c.origY, 24, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        // Sürpriz simge (Yıldız, Hilal, Kuş, vb.)
                        ctx.font = '20px "Segoe UI Emoji", sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(c.secret, c.origX, c.origY);
                        ctx.restore();
                    }
                }
            }

            // 3. ÖN KATMANLAR: 7 BULUT PARÇASI (Yazısız, tek renk beyaz, çizgisiz yumuşak bulutlar)
            for (let c of s.clouds) {
                ctx.save();

                // Sürüklenirken derinlik gölgesi
                if (c.isDragging) {
                    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
                    ctx.shadowBlur = 24;
                    ctx.shadowOffsetY = 12;
                }

                // Pofuduk bulut gövdesi (Tek renk beyaz, çizgisiz/kontursuz doğal hacim)
                CanvasEngine.drawCloud(ctx, c.x, c.y, c.scale, '#FFFFFF', null);

                ctx.restore();
            }
        }
    };
})();

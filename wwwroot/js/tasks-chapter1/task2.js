/**
 * Chapter 1 - Task 2: Parça-Bütün İlişkisi (Robot Yapbozu)
 * Concept: Modülerlik (Decomposition)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[2] = {
        initState(engine) {
            // Robot Parçaları (Kafa, Kollar, Gövde, Ayaklar - Birbirine Dikişsiz Oturan Modüler Parçalar)
            // Sağ palet Y konumları karıştırılarak parçaların rastgele sırada çıkması sağlanır
            const palettePositions = [
                { x: 495, y: 65 },
                { x: 495, y: 142 },
                { x: 495, y: 218 },
                { x: 495, y: 292 }
            ];
            // Fisher-Yates ile rastgele karıştır
            for (let i = palettePositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [palettePositions[i], palettePositions[j]] = [palettePositions[j], palettePositions[i]];
            }

            const rawParts = [
                { id: 'head', name: 'Kafa', w: 74, h: 54, color: '#38BDF8', note: 'Do' },
                { id: 'body', name: 'Gövde', w: 86, h: 68, color: '#6366F1', note: 'Re' },
                { id: 'arms', name: 'Kollar', w: 126, h: 32, color: '#F59E0B', note: 'Mi' },
                { id: 'legs', name: 'Ayaklar', w: 78, h: 44, color: '#10B981', note: 'Sol' }
            ];

            engine.state = {
                targetX: 205,
                slots: [
                    { id: 'head', name: 'Kafa', x: 205, y: 86, w: 74, h: 54, radius: 14 },
                    { id: 'arms', name: 'Kollar', x: 205, y: 148, w: 126, h: 32, radius: 10 },
                    { id: 'body', name: 'Gövde', x: 205, y: 150, w: 86, h: 68, radius: 12 },
                    { id: 'legs', name: 'Ayaklar', x: 205, y: 216, w: 78, h: 44, radius: 10 }
                ],
                parts: rawParts.map((p, idx) => ({
                    ...p,
                    x: palettePositions[idx].x,
                    y: palettePositions[idx].y,
                    origX: palettePositions[idx].x,
                    origY: palettePositions[idx].y,
                    snapped: false,
                    wobble: 0
                })),
                activePart: null,
                dragOffset: { x: 0, y: 0 }
            };
            engine._updateHUD("Robot parçalarını sürükleyip soldaki yuvalarına yerleştir! Yanlış parça geri döner.");
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Robot parçalarını seçme (tıklanan parçayı en üste alarak seç)
            for (let i = s.parts.length - 1; i >= 0; i--) {
                const part = s.parts[i];
                if (!part.snapped) {
                    if (pos.x >= part.x - part.w / 2 - 8 && pos.x <= part.x + part.w / 2 + 8 &&
                        pos.y >= part.y - part.h / 2 - 8 && pos.y <= part.y + part.h / 2 + 8) {
                        s.activePart = part;
                        s.dragOffset = { x: pos.x - part.x, y: pos.y - part.y };
                        // Sürüklenen parçayı çizim listesinin sonuna taşı (en üstte çizilsin)
                        s.parts.splice(i, 1);
                        s.parts.push(part);
                        if (window.RhythmMixer) window.RhythmMixer.playPop(350);
                        break;
                    }
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.activePart) {
                s.activePart.x = pos.x - s.dragOffset.x;
                s.activePart.y = pos.y - s.dragOffset.y;
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            if (s.activePart) {
                const p = s.activePart;
                s.activePart = null;

                // Bu parçanın doğru yuvasını bul
                const correctSlot = s.slots.find(slot => slot.id === p.id);
                const distToCorrect = Math.hypot(p.x - correctSlot.x, p.y - correctSlot.y);

                if (distToCorrect < 50) {
                    // DOĞRU YUVASINA KİLİTLENDİ
                    p.x = correctSlot.x;
                    p.y = correctSlot.y;
                    p.snapped = true;
                    p.wobble = 0;

                    if (window.RhythmMixer) {
                        window.RhythmMixer.playNote(p.note, 0.5, 'triangle', 0.45);
                        window.RhythmMixer.playSparkle();
                    }
                    engine.particles.burst(p.x, p.y, 22);

                    const snappedCount = s.parts.filter(x => x.snapped).length;
                    engine._updateHUD(`Harika! ${p.name} yerine tam oturdu (${snappedCount} / ${s.parts.length}) 🧩`);

                    const allDone = s.parts.every(x => x.snapped);
                    if (allDone) {
                        setTimeout(() => {
                            engine._updateHUD("Tebrikler! Robot tüm parçalarıyla tamamlandı 🤖🎉");
                            engine.triggerComplete();
                        }, 450);
                    }
                } else {
                    // YANLIŞ YERLEŞTİRME KONTROLÜ
                    let nearWrongSlot = false;
                    for (let otherSlot of s.slots) {
                        if (otherSlot.id !== p.id) {
                            if (Math.hypot(p.x - otherSlot.x, p.y - otherSlot.y) < 55) {
                                nearWrongSlot = true;
                                break;
                            }
                        }
                    }

                    const nearRobotZone = p.x < 320 && Math.hypot(p.x - s.targetX, p.y - 150) < 130;

                    if (nearWrongSlot || nearRobotZone) {
                        // HATA VER: Kulak tırmalamayan soru/uyarı tonu, titreme ve uyarı metni
                        if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                        p.wobble = 18;
                        engine._updateHUD(`Hop! ${p.name} buraya uymadı 🤖 Başka bir yuvayı dene!`);
                    }

                    // Parçayı sağdaki paletine geri gönder
                    p.x = p.origX;
                    p.y = p.origY;
                }
            }
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. SOL TARAFTA YALNIZCA HENÜZ OTURMAMIŞ YUVALARIN KILAVUZ ÇİZGİLERİNİ ÇİZ
            ctx.save();
            for (let slot of s.slots) {
                const isSnapped = s.parts.some(p => p.id === slot.id && p.snapped);
                if (!isSnapped) {
                    ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
                    ctx.strokeStyle = '#CBD5E1';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);

                    ctx.beginPath();
                    ctx.roundRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, slot.radius || 10);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            ctx.restore();

            // 2. PARÇALAR OTURDUĞUNDA ARALARINDAKİ DİKİŞSİZ ROBOT EKLEMLERİ (Joints)
            const isHeadSnapped = s.parts.some(p => p.id === 'head' && p.snapped);
            const isBodySnapped = s.parts.some(p => p.id === 'body' && p.snapped);
            const isLegsSnapped = s.parts.some(p => p.id === 'legs' && p.snapped);

            // Kafa ile Gövde arasındaki boyun eklemi
            if (isHeadSnapped && isBodySnapped) {
                ctx.save();
                ctx.fillStyle = '#64748B';
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(s.targetX - 8, 112, 16, 6, 3);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // Gövde ile Ayaklar arasındaki bel/kalça eklemi
            if (isBodySnapped && isLegsSnapped) {
                ctx.save();
                ctx.fillStyle = '#475569';
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(s.targetX - 16, 184, 32, 10, 4);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // 3. PARÇALARI DOĞRU KATMAN SIRASINDA ÇİZ (Kollar -> Ayaklar -> Gövde -> Kafa -> Aktif Parça)
            const renderOrder = ['arms', 'legs', 'body', 'head'];
            const sortedParts = [...s.parts].sort((a, b) => {
                if (a === s.activePart) return 1;
                if (b === s.activePart) return -1;
                return renderOrder.indexOf(a.id) - renderOrder.indexOf(b.id);
            });

            for (let p of sortedParts) {
                ctx.save();

                // Yanlış yere bırakıldığında sevimli titreme / sallanma (Wobble) efekti
                if (p.wobble > 0) {
                    p.wobble *= 0.88;
                    if (p.wobble < 0.1) p.wobble = 0;
                    ctx.translate(p.x, p.y);
                    ctx.rotate(Math.sin(p.wobble * 2.5) * (p.wobble * 0.025));
                    ctx.translate(-p.x, -p.y);
                }

                // Sürüklenen parçaya derinlik gölgesi
                if (p === s.activePart) {
                    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
                    ctx.shadowBlur = 16;
                    ctx.shadowOffsetY = 8;
                }

                ctx.fillStyle = p.color;
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 2.5;

                if (p.id === 'head') {
                    // KAFA: Antenli, büyük sevimli gözlü ve gülümseyen robot başı
                    ctx.beginPath();
                    ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 14);
                    ctx.fill();
                    ctx.stroke();

                    // Anten çubuğu ve altın küre
                    ctx.strokeStyle = '#64748B';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - p.h / 2);
                    ctx.lineTo(p.x, p.y - p.h / 2 - 12);
                    ctx.stroke();
                    ctx.fillStyle = '#F59E0B';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y - p.h / 2 - 14, 5.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    // Büyük sevimli gözler
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(p.x - 14, p.y - 4, 8.5, 0, Math.PI * 2);
                    ctx.arc(p.x + 14, p.y - 4, 8.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#0F172A';
                    ctx.beginPath();
                    ctx.arc(p.x - 14, p.y - 4, 4, 0, Math.PI * 2);
                    ctx.arc(p.x + 14, p.y - 4, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Işıltı parıltıları
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(p.x - 16, p.y - 6, 1.8, 0, Math.PI * 2);
                    ctx.arc(p.x + 12, p.y - 6, 1.8, 0, Math.PI * 2);
                    ctx.fill();

                    // Gülümseyen sevimli ağız
                    ctx.strokeStyle = '#0F172A';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y + 10, 6, 0.15 * Math.PI, 0.85 * Math.PI);
                    ctx.stroke();

                    // Altta boyun bağlantı tırnağı
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(p.x - 7, p.y + p.h / 2 - 2, 14, 5);

                } else if (p.id === 'arms') {
                    // KOLLAR: Gövdenin sol ve sağ omuzlarına bağlanan mekanik kollar ve sarı kıskaçlar
                    const armW = 28;
                    const armH = 22;

                    // Sol kol
                    ctx.beginPath();
                    ctx.roundRect(p.x - p.w / 2, p.y - armH / 2, armW, armH, 8);
                    ctx.fill();
                    ctx.stroke();

                    // Sağ kol
                    ctx.beginPath();
                    ctx.roundRect(p.x + p.w / 2 - armW, p.y - armH / 2, armW, armH, 8);
                    ctx.fill();
                    ctx.stroke();

                    // Ortadaki gövde arkası bağlantı kirişi
                    ctx.fillStyle = '#D97706';
                    ctx.beginPath();
                    ctx.roundRect(p.x - 44, p.y - 7, 88, 14, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Sol kıskaç el
                    ctx.fillStyle = '#FEF08A';
                    ctx.strokeStyle = '#1E293B';
                    ctx.beginPath();
                    ctx.arc(p.x - p.w / 2 + 2, p.y, 6, 0.5 * Math.PI, 1.5 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                    // Sağ kıskaç el
                    ctx.beginPath();
                    ctx.arc(p.x + p.w / 2 - 2, p.y, 6, -0.5 * Math.PI, 0.5 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                } else if (p.id === 'body') {
                    // GÖVDE: Göğüs ekranı, ritmik LED ışıkları ve güç paneli
                    ctx.beginPath();
                    ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 12);
                    ctx.fill();
                    ctx.stroke();

                    // Göğüs konsol ekranı
                    ctx.fillStyle = '#0F172A';
                    ctx.beginPath();
                    ctx.roundRect(p.x - 28, p.y - 20, 56, 26, 6);
                    ctx.fill();
                    ctx.stroke();

                    // LED durum ışıkları
                    ctx.fillStyle = '#34D399'; // Yeşil LED
                    ctx.fillRect(p.x - 22, p.y - 15, 12, 14);
                    ctx.fillStyle = '#F43F5E'; // Kırmızı LED
                    ctx.fillRect(p.x - 6, p.y - 15, 12, 14);
                    ctx.fillStyle = '#38BDF8'; // Mavi LED
                    ctx.fillRect(p.x + 10, p.y - 15, 12, 14);

                    // Göğüs perçinleri / cıvataları
                    ctx.fillStyle = '#CBD5E1';
                    [-p.w / 2 + 7, p.w / 2 - 7].forEach(bx => {
                        [-p.h / 2 + 7, p.h / 2 - 7].forEach(by => {
                            ctx.beginPath();
                            ctx.arc(p.x + bx, p.y + by, 2.5, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    });

                } else if (p.id === 'legs') {
                    // AYAKLAR: Sağlam çift robot bacağı ve esnek yaylı palet tabanları
                    ctx.beginPath();
                    ctx.roundRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 10);
                    ctx.fill();
                    ctx.stroke();

                    // İki bacak arasındaki ayırıcı yuva
                    ctx.fillStyle = '#F8FAFC';
                    ctx.fillRect(p.x - 8, p.y - 6, 16, p.h / 2 + 8);
                    ctx.strokeStyle = '#1E293B';
                    ctx.strokeRect(p.x - 8, p.y - 6, 16, p.h / 2 + 8);

                    // Sol ve sağ taban kauçukları
                    ctx.fillStyle = '#0F172A';
                    ctx.fillRect(p.x - p.w / 2 + 4, p.y + p.h / 2 - 6, p.w / 2 - 10, 6);
                    ctx.fillRect(p.x + 6, p.y + p.h / 2 - 6, p.w / 2 - 10, 6);
                }

                ctx.restore();
            }
        }
    };
})();

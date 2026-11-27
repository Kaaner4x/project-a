/**
 * Chapter 1 - Task 9: 7 Notalı Ksilofon Dizi Hafızası
 * Concept: Sıralı Dizi Mantığı (Array / Sequence)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[9] = {
        initState(engine) {
            const baseNotes = [
                { name: 'Do', freq: 261.63, color: '#EF4444' },
                { name: 'Re', freq: 293.66, color: '#F97316' },
                { name: 'Mi', freq: 329.63, color: '#F59E0B' },
                { name: 'Fa', freq: 349.23, color: '#10B981' },
                { name: 'Sol', freq: 392.00, color: '#06B6D4' },
                { name: 'La', freq: 440.00, color: '#6366F1' },
                { name: 'Si', freq: 493.88, color: '#EC4899' }
            ];

            // 7 ksilofon tuşunu tuvalde tam ortalı ve merdiven boyutlu yerleştir
            const keyW = 64;
            const gap = 12;
            const totalW = baseNotes.length * keyW + (baseNotes.length - 1) * gap;
            const startX = (engine.width - totalW) / 2;
            const centerY = 236;

            const keys = baseNotes.map((n, idx) => {
                const h = 166 - idx * 9;
                return {
                    name: n.name,
                    freq: n.freq,
                    color: n.color,
                    x: startX + idx * (keyW + gap),
                    y: centerY - h / 2,
                    w: keyW,
                    h,
                    active: false,
                    press: 0,
                    wobble: 0
                };
            });

            // 7 nota arasından rastgele 4 farklı nota seç
            const pool = baseNotes.map(n => n.name);
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            const targetSequence = pool.slice(0, 4);

            engine.state = {
                targetSequence,
                playerInput: [],
                keys,
                isPlayingDemo: false,
                activeDemoIndex: -1,
                demoTimeoutIds: [],
                replayBtn: { x: 472, y: 58, r: 22, press: 0 }
            };

            engine._updateHUD("Melodiyi dinle ve 4 notayı aynı sırayla çal!");

            // Sayfa açıldığında melodiyi otomatik başlat
            const startTid = setTimeout(() => {
                if (engine.taskId === 9 && !engine.isCompleted) {
                    this.playDemoSequence(engine);
                }
            }, 500);
            engine.state.demoTimeoutIds.push(startTid);
        },

        playDemoSequence(engine) {
            const s = engine.state;
            if (s.isPlayingDemo || engine.isCompleted) return;
            s.isPlayingDemo = true;
            s.activeDemoIndex = -1;
            s.playerInput = [];
            engine._updateHUD("Sistemin çaldığı 4 notayı dinle ve izle...");

            // Önceki zamanlayıcıları temizle
            s.demoTimeoutIds.forEach(id => clearTimeout(id));
            s.demoTimeoutIds = [];

            const seq = s.targetSequence;
            seq.forEach((noteName, idx) => {
                const tid = setTimeout(() => {
                    if (engine.taskId !== 9 || engine.isCompleted) return;
                    s.activeDemoIndex = idx;
                    const key = s.keys.find(k => k.name === noteName);
                    if (key) {
                        key.active = true;
                        key.press = 1;
                        if (window.RhythmMixer) window.RhythmMixer.playNote(key.freq, 0.42, 'triangle', 0.4);
                        const offTid = setTimeout(() => { key.active = false; }, 380);
                        s.demoTimeoutIds.push(offTid);
                    }
                    if (idx === seq.length - 1) {
                        const finalTid = setTimeout(() => {
                            s.isPlayingDemo = false;
                            s.activeDemoIndex = -1;
                            engine._updateHUD("Şimdi sıra sende! Aynı 4 tuşa sırayla bas.");
                        }, 460);
                        s.demoTimeoutIds.push(finalTid);
                    }
                }, idx * 620);
                s.demoTimeoutIds.push(tid);
            });
        },

        pressPianoKey(engine, key) {
            const s = engine.state;
            if (engine.isCompleted || s.isPlayingDemo) return;

            key.active = true;
            key.press = 1;
            if (window.RhythmMixer) window.RhythmMixer.playNote(key.freq, 0.35, 'sine', 0.4);
            setTimeout(() => { key.active = false; }, 260);

            s.playerInput.push(key.name);
            const curIdx = s.playerInput.length - 1;

            if (s.playerInput[curIdx] !== s.targetSequence[curIdx]) {
                key.wobble = 16;
                if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                engine._updateHUD("Farklı nota oldu! Melodiyi tekrar dinleyip deneyelim.");
                s.playerInput = [];
                return;
            }

            engine.particles.burst(key.x + key.w / 2, key.y + 18, 12);
            engine._updateHUD(`Harika! (${s.playerInput.length} / ${s.targetSequence.length})`);

            if (s.playerInput.length === s.targetSequence.length) {
                engine.particles.burst(key.x + key.w / 2, key.y, 30);
                engine._updateHUD("Melodi hafızası tamamlandı! Harika kulak!");
                setTimeout(() => {
                    engine.triggerComplete();
                }, 380);
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            if (engine.isCompleted) return;

            // 1. Tuval içi Tekrar Dinle (🔊) butonu
            const distReplay = Math.hypot(pos.x - s.replayBtn.x, pos.y - s.replayBtn.y);
            if (distReplay <= s.replayBtn.r + 8) {
                s.replayBtn.press = 1;
                this.playDemoSequence(engine);
                return;
            }

            // 2. Ksilofon tuşlarına dokunma
            if (!s.isPlayingDemo) {
                for (let key of s.keys) {
                    if (pos.x >= key.x && pos.x <= key.x + key.w &&
                        pos.y >= key.y && pos.y <= key.y + key.h) {
                        this.pressPianoKey(engine, key);
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

            // 1. ÜSTTE 4 RENK EŞLEŞMELİ MELODİ YUVASI
            const slotSpacing = 54;
            const slotsStartX = engine.width / 2 - ((s.targetSequence.length - 1) * slotSpacing) / 2 - 22;
            const slotY = 58;

            ctx.save();
            for (let i = 0; i < s.targetSequence.length; i++) {
                const sx = slotsStartX + i * slotSpacing;
                const isEntered = i < s.playerInput.length;
                const isDemoActive = s.isPlayingDemo && s.activeDemoIndex === i;
                const isDemoShown = s.isPlayingDemo && i <= s.activeDemoIndex;
                const noteKey = s.keys.find(k => k.name === s.targetSequence[i]);
                const noteColor = noteKey ? noteKey.color : '#6366F1';

                if (isDemoActive) {
                    ctx.shadowColor = noteColor;
                    ctx.shadowBlur = 16;
                } else {
                    ctx.shadowColor = 'transparent';
                }

                ctx.beginPath();
                ctx.arc(sx, slotY, isDemoActive ? 20 : 17, 0, Math.PI * 2);
                ctx.fillStyle = isEntered ? '#10B981' : (isDemoShown ? noteColor : '#F1F5F9');
                ctx.fill();
                ctx.strokeStyle = isEntered ? '#059669' : (isDemoShown ? '#FFFFFF' : '#CBD5E1');
                ctx.lineWidth = isDemoActive ? 3 : 2;
                ctx.stroke();

                ctx.shadowColor = 'transparent';
                ctx.fillStyle = (isEntered || isDemoShown) ? '#FFFFFF' : '#94A3B8';
                ctx.font = 'bold 13px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(isEntered ? '✓' : `${i + 1}`, sx, slotY);
            }
            ctx.restore();

            // 2. TUVAL İÇİ TEKRAR DİNLE (🔊) BUTONU
            ctx.save();
            const rb = s.replayBtn;
            if (rb.press > 0) {
                rb.press *= 0.82;
                if (rb.press < 0.02) rb.press = 0;
            }
            const rbScale = 1 - rb.press * 0.12;
            ctx.translate(rb.x, rb.y);
            ctx.scale(rbScale, rbScale);

            if (s.isPlayingDemo) {
                const pulseR = rb.r + 5 + Math.sin(engine.time * 0.15) * 3;
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.shadowColor = 'rgba(99, 102, 241, 0.25)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 3;
            ctx.fillStyle = s.isPlayingDemo ? '#818CF8' : '#6366F1';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, rb.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.shadowColor = 'transparent';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '18px "Segoe UI Emoji", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔊', 0, 1);
            ctx.restore();

            // 3. KSİLOFON AHŞAP TAŞIYICI ÇITALARI (Arka Plan Destek)
            ctx.save();
            ctx.fillStyle = '#D6B892';
            ctx.strokeStyle = '#A7845A';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(48, 198, engine.width - 96, 14, 7);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.roundRect(48, 260, engine.width - 96, 14, 7);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // 4. 7 RENKLİ KSİLOFON TUŞU
            for (let key of s.keys) {
                ctx.save();

                if (key.press > 0) {
                    key.press *= 0.84;
                    if (key.press < 0.02) key.press = 0;
                }

                const cx = key.x + key.w / 2;
                const cy = key.y + key.h / 2;
                ctx.translate(cx, cy + key.press * 5);

                if (key.wobble > 0) {
                    key.wobble *= 0.85;
                    if (key.wobble < 0.1) key.wobble = 0;
                    ctx.rotate(Math.sin(key.wobble * 2.8) * 0.1);
                }

                if (key.active) {
                    ctx.shadowColor = key.color;
                    ctx.shadowBlur = 24;
                } else {
                    ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetY = 5;
                }

                ctx.fillStyle = key.active ? '#FEF08A' : key.color;
                ctx.strokeStyle = key.active ? '#F59E0B' : '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(-key.w / 2, -key.h / 2, key.w, key.h, 14);
                ctx.fill();
                ctx.stroke();

                ctx.shadowColor = 'transparent';

                // Üst & Alt ksilofon vidaları
                ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
                ctx.beginPath();
                ctx.arc(0, -key.h / 2 + 16, 4.5, 0, Math.PI * 2);
                ctx.arc(0, key.h / 2 - 16, 4.5, 0, Math.PI * 2);
                ctx.fill();

                // Nota adı
                ctx.fillStyle = key.active ? '#1E293B' : '#FFFFFF';
                ctx.font = 'bold 17px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(key.name, 0, 2);

                ctx.restore();
            }
        }
    };
})();

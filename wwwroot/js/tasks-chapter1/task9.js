/**
 * Chapter 1 - Task 9: Pentatonik Dizi Hafızası
 * Concept: Sıralı Dizi Mantığı (Array / Sequence)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[9] = {
        initState(engine) {
            // Pentatonik Dizi Hafızası (FIFO)
            engine.state = {
                targetSequence: ['Do', 'Mi', 'Sol'],
                playerInput: [],
                keys: [
                    { name: 'Do', freq: 261.63, color: '#3B82F6', x: 100, y: 240, w: 75, h: 100, active: false },
                    { name: 'Re', freq: 293.66, color: '#06B6D4', x: 190, y: 230, w: 75, h: 110, active: false },
                    { name: 'Mi', freq: 329.63, color: '#10B981', x: 280, y: 220, w: 75, h: 120, active: false },
                    { name: 'Sol', freq: 392.00, color: '#F59E0B', x: 370, y: 210, w: 75, h: 130, active: false },
                    { name: 'La', freq: 440.00, color: '#EC4899', x: 460, y: 200, w: 75, h: 140, active: false }
                ],
                isPlayingDemo: false,
                demoTimeoutIds: []
            };
            engine._updateHUD("Melodi sırasını dinle ve aynısını çal!");
        },

        playDemoSequence(engine) {
            const s = engine.state;
            if (s.isPlayingDemo) return;
            s.isPlayingDemo = true;
            s.playerInput = [];
            engine._updateHUD("Sistemin çaldığı notaları dinle ve izle...");

            // Önceki zamanlayıcıları temizle
            s.demoTimeoutIds.forEach(id => clearTimeout(id));
            s.demoTimeoutIds = [];

            const seq = s.targetSequence;
            seq.forEach((noteName, idx) => {
                const tid = setTimeout(() => {
                    const key = s.keys.find(k => k.name === noteName);
                    if (key) {
                        key.active = true;
                        if (window.RhythmMixer) window.RhythmMixer.playNote(key.freq, 0.35, 'triangle');
                        setTimeout(() => { key.active = false; }, 320);
                    }
                    if (idx === seq.length - 1) {
                        const finalTid = setTimeout(() => {
                            s.isPlayingDemo = false;
                            engine._updateHUD("Şimdi sıra sende! Aynı 3 tuşa bas.");
                        }, 400);
                        s.demoTimeoutIds.push(finalTid);
                    }
                }, idx * 600);
                s.demoTimeoutIds.push(tid);
            });
        },

        pressPianoKey(engine, key) {
            const s = engine.state;
            key.active = true;
            if (window.RhythmMixer) window.RhythmMixer.playNote(key.freq, 0.3, 'sine');
            setTimeout(() => { key.active = false; }, 250);

            s.playerInput.push(key.name);
            const curIdx = s.playerInput.length - 1;

            if (s.playerInput[curIdx] !== s.targetSequence[curIdx]) {
                if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                engine._updateHUD("Fırça melodiyi karıştırdı. 'Tekrar Dinle'ye basabilirsin!");
                s.playerInput = [];
                return;
            }

            engine._updateHUD(`Doğru nota! (${s.playerInput.length} / ${s.targetSequence.length})`);

            if (s.playerInput.length === s.targetSequence.length) {
                engine.particles.burst(key.x + key.w / 2, key.y, 25);
                engine._updateHUD("Melodi hafızası tamamlandı! Harika kulak! 🎵🎉");
                engine.triggerComplete();
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Tuşlara dokunma
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

            // Üstte Sıralı Melodi Kutucukları (Çocuk Dostu)
            ctx.save();
            const startX = engine.width / 2 - 90;
            for (let i = 0; i < s.targetSequence.length; i++) {
                const bx = startX + i * 65;
                const by = 40;
                const isEntered = i < s.playerInput.length;
                const noteText = isEntered ? s.playerInput[i] : (s.isPlayingDemo ? s.targetSequence[i] : '🎵');

                ctx.fillStyle = isEntered ? '#10B981' : (s.isPlayingDemo ? '#FEF08A' : '#E2E8F0');
                ctx.strokeStyle = '#64748B';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(bx, by, 50, 40, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = isEntered ? '#FFFFFF' : '#1E293B';
                ctx.font = 'bold 15px Fredoka';
                ctx.textAlign = 'center';
                ctx.fillText(noteText, bx + 25, by + 26);
            }
            ctx.restore();

            // Ksilofon Tuşları
            for (let key of s.keys) {
                ctx.save();
                ctx.fillStyle = key.active ? '#FEF08A' : key.color;
                ctx.strokeStyle = '#0F172A';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(key.x, key.y, key.w, key.h, 12);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = key.active ? '#1E293B' : '#FFFFFF';
                ctx.font = 'bold 18px Fredoka';
                ctx.textAlign = 'center';
                ctx.fillText(key.name, key.x + key.w / 2, key.y + key.h / 2 + 6);
                ctx.restore();
            }
        }
    };
})();

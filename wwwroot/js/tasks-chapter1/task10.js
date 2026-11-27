/**
 * Chapter 1 - Task 10: Simetrik Çift Nesne
 * Concept: İlişkili Değişkenler (Senkronizasyon)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[10] = {
        initState(engine) {
            // Simetrik Çift Nesne
            engine.state = {
                leftBrush: { x: 140, y: 180 },
                rightBrush: { x: 500, y: 180 },
                activeDrag: null, // 'left' veya 'right'
                leftTarget: { x: 200, y: 100, radius: 32 },
                rightTarget: { x: 440, y: 100, radius: 32 },
                dragOffset: { x: 0, y: 0 },
                reached: false
            };
            engine._updateHUD("Fırçalardan birini sürükle; ikisi aynı anda hedefe varsın!");
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            // Sol veya Sağ fırçayı yakalama (Her ikisi de sürüklenebilir)
            if (!s.reached) {
                const dLeft = Math.hypot(pos.x - s.leftBrush.x, pos.y - s.leftBrush.y);
                const dRight = Math.hypot(pos.x - s.rightBrush.x, pos.y - s.rightBrush.y);

                if (dLeft <= 45) {
                    s.activeDrag = 'left';
                    s.dragOffset = { x: pos.x - s.leftBrush.x, y: pos.y - s.leftBrush.y };
                    if (window.RhythmMixer) window.RhythmMixer.playPop(320);
                } else if (dRight <= 45) {
                    s.activeDrag = 'right';
                    s.dragOffset = { x: pos.x - s.rightBrush.x, y: pos.y - s.rightBrush.y };
                    if (window.RhythmMixer) window.RhythmMixer.playPop(320);
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.activeDrag === 'left') {
                let newX = pos.x - s.dragOffset.x;
                let newY = pos.y - s.dragOffset.y;
                newX = Math.max(50, Math.min(engine.width / 2 - 40, newX));
                newY = Math.max(60, Math.min(engine.height - 60, newY));

                s.leftBrush.x = newX;
                s.leftBrush.y = newY;
                s.rightBrush.x = engine.width - newX;
                s.rightBrush.y = newY;
            } else if (s.activeDrag === 'right') {
                let newX = pos.x - s.dragOffset.x;
                let newY = pos.y - s.dragOffset.y;
                newX = Math.max(engine.width / 2 + 40, Math.min(engine.width - 50, newX));
                newY = Math.max(60, Math.min(engine.height - 60, newY));

                s.rightBrush.x = newX;
                s.rightBrush.y = newY;
                s.leftBrush.x = engine.width - newX;
                s.leftBrush.y = newY;
            }

            if (s.activeDrag) {
                // Hedef kontrolü
                const d1 = Math.hypot(s.leftBrush.x - s.leftTarget.x, s.leftBrush.y - s.leftTarget.y);
                const d2 = Math.hypot(s.rightBrush.x - s.rightTarget.x, s.rightBrush.y - s.rightTarget.y);

                if (d1 < 32 && d2 < 32 && !s.reached) {
                    s.reached = true;
                    s.activeDrag = null;
                    if (window.RhythmMixer) window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'La', 'Do5'], 0.8);
                    engine.particles.burst(s.leftTarget.x, s.leftTarget.y, 22);
                    engine.particles.burst(s.rightTarget.x, s.rightTarget.y, 22);
                    engine._updateHUD("İkiz fırçalar hedefe aynı anda ulaştı! 🪞🎉");
                    engine.triggerComplete();
                }
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            s.activeDrag = null;
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // Ayna Ekseni
            ctx.save();
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(engine.width / 2, 20);
            ctx.lineTo(engine.width / 2, engine.height - 20);
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 12px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('🪞 AYNA EKSENİ', engine.width / 2, 16);
            ctx.restore();

            // Sol Hedef Yuvası
            ctx.save();
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.leftTarget.x, s.leftTarget.y, s.leftTarget.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.fill();
            ctx.restore();

            // Sağ Hedef Yuvası
            ctx.save();
            ctx.strokeStyle = '#EC4899';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.rightTarget.x, s.rightTarget.y, s.rightTarget.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
            ctx.fill();
            ctx.restore();

            // Sol Fırça
            CanvasEngine.drawBrush(ctx, s.leftBrush.x, s.leftBrush.y, 0, 1, '#3B82F6', s.reached);

            // Sağ Fırça (Ayna İkizi)
            CanvasEngine.drawBrush(ctx, s.rightBrush.x, s.rightBrush.y, 0, 1, '#EC4899', s.reached);
        }
    };
})();

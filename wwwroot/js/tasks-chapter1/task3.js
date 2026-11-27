/**
 * Chapter 1 - Task 3: Hedefe Taşıma ve Koordinat
 * Concept: Konumlandırma (X-Y, Snap-to-Target)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[3] = {
        initState(engine) {
            engine.state = {
                star: { x: 120, y: 220, radius: 26, isDragging: false },
                target: { x: 500, y: 140, radius: 36 },
                dragOffset: { x: 0, y: 0 },
                snapped: false
            };
            engine._updateHUD(`X: ${engine.state.star.x} | Y: ${engine.state.star.y} (Yıldızı hedef halkaya sürükle!)`);
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            if (!s.snapped) {
                const dist3 = Math.hypot(pos.x - s.star.x, pos.y - s.star.y);
                if (dist3 <= s.star.radius * 1.6) {
                    s.star.isDragging = true;
                    s.dragOffset = { x: pos.x - s.star.x, y: pos.y - s.star.y };
                    if (window.RhythmMixer) window.RhythmMixer.playPop(350);
                }
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (s.star.isDragging) {
                s.star.x = pos.x - s.dragOffset.x;
                s.star.y = pos.y - s.dragOffset.y;

                const distToTarget = Math.hypot(s.star.x - s.target.x, s.star.y - s.target.y);
                engine._updateHUD(`X: ${Math.round(s.star.x)} | Y: ${Math.round(s.star.y)} (Hedefe mesafe: ${Math.round(distToTarget)} px)`);

                // Manyetik Snap kontrolü
                if (distToTarget < 42) {
                    s.star.x = s.target.x;
                    s.star.y = s.target.y;
                    s.star.isDragging = false;
                    s.snapped = true;
                    if (window.RhythmMixer) {
                        window.RhythmMixer.playNote('Sol', 0.5, 'triangle');
                        window.RhythmMixer.playSparkle();
                    }
                    engine.particles.burst(s.target.x, s.target.y, 25);
                    engine._updateHUD("Hedefe kilitlendi! ⭐ Tebrikler!");
                    engine.triggerComplete();
                }
            }
        },

        handlePointerUp(engine) {
            const s = engine.state;
            if (s.star.isDragging) {
                s.star.isDragging = false;
            }
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // Hedef Yuva (Manyetik Halka)
            ctx.save();
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(s.target.x, s.target.y, s.target.radius + Math.sin(engine.time * 0.08) * 3, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
            ctx.fill();
            ctx.restore();

            // Yıldız Çizimi
            CanvasEngine.drawStar(ctx, s.star.x, s.star.y, 5, s.star.radius, s.star.radius * 0.48, '#FBBF24', '#D97706');
        }
    };
})();

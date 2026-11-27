/**
 * Chapter 1 - Task 10: Asimetrik Engelli Ayna Ekseni
 * Concept: İlişkili Değişkenler (Senkronizasyon & Çift Taraflı Kontrol)
 */
(function () {
    window.TaskChapter1Modules = window.TaskChapter1Modules || {};

    window.TaskChapter1Modules[10] = {
        initState(engine) {
            engine.state = {
                startLeft: { x: 95, y: 298 },
                leftBrush: { x: 95, y: 298 },
                rightBrush: { x: engine.width - 95, y: 298 },
                brushRadius: 17,
                activeDrag: null, // 'left' veya 'right'
                leftTarget: { x: 245, y: 74, radius: 26 },
                rightTarget: { x: engine.width - 245, y: 74, radius: 26 },
                // Sol ve sağ tarafta farklı yerlerde konumlanmış asimetrik engeller
                obstacles: [
                    { side: 'left', x: 44, y: 236, w: 156, h: 24, hitFlash: 0 },
                    { side: 'right', x: 348, y: 136, w: 132, h: 24, hitFlash: 0 },
                    { side: 'left', x: 165, y: 34, w: 24, h: 46, hitFlash: 0 }
                ],
                dragOffset: { x: 0, y: 0 },
                lastHitSound: 0,
                reached: false
            };
            engine._updateHUD("İki tarafın engellerine de dikkat ederek ikiz fırçaları hedefe ulaştır!");
        },

        _circleIntersectsRect(cx, cy, r, rect) {
            const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
            const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
            const dx = cx - closestX;
            const dy = cy - closestY;
            return (dx * dx + dy * dy) < (r * r);
        },

        _findCollision(engine, leftX, leftY) {
            const s = engine.state;
            const rightX = engine.width - leftX;
            const rightY = leftY;

            for (let obs of s.obstacles) {
                if (obs.side === 'left' && this._circleIntersectsRect(leftX, leftY, s.brushRadius, obs)) {
                    return obs;
                }
                if (obs.side === 'right' && this._circleIntersectsRect(rightX, rightY, s.brushRadius, obs)) {
                    return obs;
                }
            }
            return null;
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            if (s.reached) return;

            const dLeft = Math.hypot(pos.x - s.leftBrush.x, pos.y - s.leftBrush.y);
            const dRight = Math.hypot(pos.x - s.rightBrush.x, pos.y - s.rightBrush.y);

            if (dLeft <= 42) {
                s.activeDrag = 'left';
                s.dragOffset = { x: pos.x - s.leftBrush.x, y: pos.y - s.leftBrush.y };
                if (window.RhythmMixer) window.RhythmMixer.playPop(320);
            } else if (dRight <= 42) {
                s.activeDrag = 'right';
                s.dragOffset = { x: pos.x - s.rightBrush.x, y: pos.y - s.rightBrush.y };
                if (window.RhythmMixer) window.RhythmMixer.playPop(320);
            }
        },

        handlePointerMove(engine, pos) {
            const s = engine.state;
            if (!s.activeDrag || s.reached) return;

            let desiredLeftX;
            let desiredLeftY;

            if (s.activeDrag === 'left') {
                desiredLeftX = pos.x - s.dragOffset.x;
                desiredLeftY = pos.y - s.dragOffset.y;
            } else {
                const desiredRightX = pos.x - s.dragOffset.x;
                desiredLeftX = engine.width - desiredRightX;
                desiredLeftY = pos.y - s.dragOffset.y;
            }

            desiredLeftX = Math.max(46, Math.min(engine.width / 2 - 36, desiredLeftX));
            desiredLeftY = Math.max(44, Math.min(engine.height - 44, desiredLeftY));

            // Duvarlardan hızlı sürüklemeyle atlamayı önlemek için adım adım çarpışma kontrolü
            const steps = 8;
            let curX = s.leftBrush.x;
            let curY = s.leftBrush.y;
            const stepX = (desiredLeftX - curX) / steps;
            const stepY = (desiredLeftY - curY) / steps;
            let hitObs = null;

            for (let i = 0; i < steps; i++) {
                const nextX = curX + stepX;
                const nextY = curY + stepY;

                const colBoth = this._findCollision(engine, nextX, nextY);
                if (!colBoth) {
                    curX = nextX;
                    curY = nextY;
                } else {
                    hitObs = colBoth;
                    break;
                }
            }

            if (hitObs) {
                hitObs.hitFlash = 1;
                s.activeDrag = null;
                s.leftBrush.x = s.startLeft.x;
                s.leftBrush.y = s.startLeft.y;
                s.rightBrush.x = engine.width - s.startLeft.x;
                s.rightBrush.y = s.startLeft.y;

                const now = Date.now();
                if (now - s.lastHitSound > 250) {
                    s.lastHitSound = now;
                    if (window.RhythmMixer) window.RhythmMixer.playErrorSoft();
                }
                return;
            }

            s.leftBrush.x = curX;
            s.leftBrush.y = curY;
            s.rightBrush.x = engine.width - curX;
            s.rightBrush.y = curY;

            // Hedef kontrolü
            const d1 = Math.hypot(s.leftBrush.x - s.leftTarget.x, s.leftBrush.y - s.leftTarget.y);
            const d2 = Math.hypot(s.rightBrush.x - s.rightTarget.x, s.rightBrush.y - s.rightTarget.y);

            if (d1 < 28 && d2 < 28 && !s.reached) {
                s.reached = true;
                s.activeDrag = null;
                s.leftBrush.x = s.leftTarget.x;
                s.leftBrush.y = s.leftTarget.y;
                s.rightBrush.x = s.rightTarget.x;
                s.rightBrush.y = s.rightTarget.y;

                if (window.RhythmMixer) window.RhythmMixer.playChord(['Do', 'Mi', 'Sol', 'La', 'Do5'], 0.8);
                engine.particles.burst(s.leftTarget.x, s.leftTarget.y, 26);
                engine.particles.burst(s.rightTarget.x, s.rightTarget.y, 26);
                engine._updateHUD("İkiz fırçalar tüm engelleri aşıp hedefe ulaştı!");
                setTimeout(() => engine.triggerComplete(), 350);
            }
        },

        handlePointerUp(engine) {
            engine.state.activeDrag = null;
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;

            // 1. AYNA EKSENİ
            ctx.save();
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(engine.width / 2, 18);
            ctx.lineTo(engine.width / 2, engine.height - 18);
            ctx.stroke();
            ctx.restore();

            // 2. ASİMETRİK ENGELLER
            for (let obs of s.obstacles) {
                ctx.save();
                if (obs.hitFlash > 0) {
                    obs.hitFlash *= 0.86;
                    if (obs.hitFlash < 0.02) obs.hitFlash = 0;
                }

                const isLeft = obs.side === 'left';
                const baseFill = isLeft ? '#334155' : '#475569';
                const accentStroke = isLeft ? '#60A5FA' : '#F472B6';

                ctx.shadowColor = obs.hitFlash > 0
                    ? `rgba(239, 68, 68, ${obs.hitFlash * 0.75})`
                    : 'rgba(15, 23, 42, 0.14)';
                ctx.shadowBlur = obs.hitFlash > 0 ? 18 : 10;
                ctx.shadowOffsetY = 3;

                ctx.fillStyle = obs.hitFlash > 0 ? '#EF4444' : baseFill;
                ctx.strokeStyle = obs.hitFlash > 0 ? '#991B1B' : accentStroke;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 10);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // 3. SOL VE SAĞ HEDEF YUVALARI
            const drawTarget = (target, color, fillRgba) => {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
                ctx.fillStyle = fillRgba;
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(target.x, target.y, target.radius * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.28;
                ctx.fill();
                ctx.restore();
            };

            drawTarget(s.leftTarget, '#3B82F6', 'rgba(59, 130, 246, 0.14)');
            drawTarget(s.rightTarget, '#EC4899', 'rgba(236, 72, 153, 0.14)');

            // 4. İKİZ FIRÇALAR
            CanvasEngine.drawBrush(ctx, s.leftBrush.x, s.leftBrush.y, 0, 0.95, '#3B82F6', s.reached);
            CanvasEngine.drawBrush(ctx, s.rightBrush.x, s.rightBrush.y, 0, 0.95, '#EC4899', s.reached);
        }
    };
})();

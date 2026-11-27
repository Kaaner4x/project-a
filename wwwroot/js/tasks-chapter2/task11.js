/**
 * Chapter 2 - Task 11: Bit Kavramı (0 ve 1 Durumu)
 * Concept: İkili Durum (Bit: 0 ve 1)
 *
 * Tek bir ampulün Kapalı = 0, Açık = 1 anlamına geldiğini kavrama.
 * Öğrenci ampulü 1 (Açık) konumuna getirip ardından 0 (Kapalı) konumuna döndürdüğünde görev tamamlanır.
 */
(function () {
    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    window.TaskChapter2Modules[11] = {
        initState(engine) {
            engine.state = {
                isOn: false,
                hasTurnedOn: false,
                hasTurnedOff: false,
                batteryX: 125,
                batteryY: 215,
                bulbX: 320,
                bulbY: 152,
                switchX: 320,
                switchY: 278,
                switchW: 78,
                switchH: 52,
                displayX: 515,
                displayY: 215,
                pulse: 0,
                completeTimer: null
            };
            engine._updateHUD("Anahtara dokunarak ampulü Açık (1) yap, ardından Kapalı (0) konumuna getir.");
        },

        toggleSwitch(engine) {
            if (engine.isCompleted) return;
            const s = engine.state;

            if (s.completeTimer) {
                clearTimeout(s.completeTimer);
                s.completeTimer = null;
            }

            s.isOn = !s.isOn;

            if (window.RhythmMixer) {
                if (typeof window.RhythmMixer.playRelayClick === 'function') {
                    window.RhythmMixer.playRelayClick(s.isOn);
                } else {
                    window.RhythmMixer.playPop(s.isOn ? 620 : 320);
                }
            }

            if (s.isOn) {
                s.hasTurnedOn = true;
                engine.particles.burst(s.bulbX, s.bulbY, 24);
                engine._updateHUD("Harika! Ampul yandı ve bit değeri 1 oldu. Şimdi anahtarı tekrar çevirip 0 yap!");
            } else {
                if (s.hasTurnedOn) {
                    s.hasTurnedOff = true;
                    if (window.RhythmMixer && typeof window.RhythmMixer.playDigitalBeep === 'function') {
                        window.RhythmMixer.playDigitalBeep(true);
                    }
                    engine._updateHUD("Tebrikler! Açık (1) ve Kapalı (0) bit durumlarını keşfettin!");
                    s.completeTimer = setTimeout(() => {
                        if (!engine.isCompleted && !s.isOn && s.hasTurnedOn) {
                            engine.triggerComplete();
                        }
                    }, 450);
                } else {
                    engine._updateHUD("Ampul kapalı (0). Önce anahtara dokunarak ampulü Açık (1) yap!");
                }
            }
        },

        handlePointerDown(engine, pos) {
            const s = engine.state;
            const inSwitch = (
                pos.x >= s.switchX - s.switchW / 2 - 8 &&
                pos.x <= s.switchX + s.switchW / 2 + 8 &&
                pos.y >= s.switchY - s.switchH / 2 - 8 &&
                pos.y <= s.switchY + s.switchH / 2 + 8
            );
            const distBulb = Math.hypot(pos.x - s.bulbX, pos.y - s.bulbY);
            const inDisplay = (
                Math.abs(pos.x - s.displayX) <= 54 &&
                Math.abs(pos.y - s.displayY) <= 60
            );

            if (inSwitch || distBulb <= 48 || inDisplay) {
                this.toggleSwitch(engine);
            }
        },

        handlePointerMove(engine, pos) { },
        handlePointerUp(engine) { },

        _drawStepBadges(ctx, s) {
            const y = 44;
            const steps = [
                { x: 244, label: '1 • AÇ', done: s.hasTurnedOn, active: !s.hasTurnedOn },
                { x: 396, label: '0 • KAPA', done: s.hasTurnedOff, active: s.hasTurnedOn && !s.hasTurnedOff }
            ];

            ctx.save();
            // Bağlantı oku
            ctx.fillStyle = s.hasTurnedOn ? '#10B981' : '#94A3B8';
            ctx.font = 'bold 18px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('→', 320, y);

            for (let step of steps) {
                const w = 108;
                const h = 34;

                if (step.active) {
                    ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
                    ctx.shadowBlur = 12;
                } else {
                    ctx.shadowColor = 'transparent';
                }

                ctx.fillStyle = step.done ? '#10B981' : (step.active ? '#FEF3C7' : '#F1F5F9');
                ctx.strokeStyle = step.done ? '#059669' : (step.active ? '#F59E0B' : '#CBD5E1');
                ctx.lineWidth = step.active ? 2.5 : 1.8;
                ctx.beginPath();
                ctx.roundRect(step.x - w / 2, y - h / 2, w, h, 17);
                ctx.fill();
                ctx.stroke();

                ctx.shadowColor = 'transparent';
                ctx.fillStyle = step.done ? '#FFFFFF' : (step.active ? '#92400E' : '#94A3B8');
                ctx.font = 'bold 13px Fredoka, Nunito, sans-serif';
                ctx.fillText(step.done ? `✓ ${step.label}` : step.label, step.x, y + 1);
            }
            ctx.restore();
        },

        _drawBattery(ctx, x, y, isOn) {
            ctx.save();
            ctx.translate(x, y);

            // Gövde gölgesi
            ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 5;

            // Üst metal kutup başı
            ctx.fillStyle = '#94A3B8';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-14, -56, 28, 12, [5, 5, 0, 0]);
            ctx.fill();
            ctx.stroke();

            // Pil gövdesi
            const bodyGrad = ctx.createLinearGradient(-32, -44, 32, 46);
            bodyGrad.addColorStop(0, '#334155');
            bodyGrad.addColorStop(1, '#1E293B');
            ctx.fillStyle = bodyGrad;
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(-34, -44, 68, 92, 12);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            // Enerji doluluk şeridi
            ctx.fillStyle = isOn ? '#F59E0B' : '#10B981';
            ctx.beginPath();
            ctx.roundRect(-24, -18, 48, 42, 7);
            ctx.fill();

            // Şimşek simgesi
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚡', 0, 4);

            // + ve - işaretleri
            ctx.fillStyle = '#FDE047';
            ctx.font = 'bold 14px Fredoka, Nunito, sans-serif';
            ctx.fillText('+', 0, -31);
            ctx.fillStyle = '#94A3B8';
            ctx.fillText('−', 0, 36);

            // Alt etiket
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.fillText('GÜÇ', 0, 64);

            ctx.restore();
        },

        _drawDigitalDisplay(ctx, x, y, isOn, pulse) {
            ctx.save();
            ctx.translate(x, y);

            // Dış çerçeve
            ctx.shadowColor = isOn ? 'rgba(16, 185, 129, 0.35)' : 'rgba(15, 23, 42, 0.14)';
            ctx.shadowBlur = isOn ? 22 : 12;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = '#0F172A';
            ctx.strokeStyle = isOn ? '#10B981' : '#475569';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(-50, -56, 100, 112, 18);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            // İç ekran
            ctx.fillStyle = isOn ? '#064E3B' : '#1E293B';
            ctx.beginPath();
            ctx.roundRect(-40, -44, 80, 82, 12);
            ctx.fill();

            // Büyük LED 0 veya 1 rakamı
            if (isOn) {
                ctx.shadowColor = '#34D399';
                ctx.shadowBlur = 16 + Math.sin(pulse * 2) * 4;
                ctx.fillStyle = '#6EE7B7';
            } else {
                ctx.fillStyle = '#64748B';
            }
            ctx.font = '900 54px Fredoka, Nunito, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isOn ? '1' : '0', 0, -2);
            ctx.shadowColor = 'transparent';

            // Alt durum ışığı
            ctx.fillStyle = isOn ? '#34D399' : '#EF4444';
            ctx.beginPath();
            ctx.arc(-22, 47, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isOn ? '#A7F3D0' : '#94A3B8';
            ctx.font = 'bold 11px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(isOn ? 'AÇIK' : 'KAPALI', -12, 48);

            ctx.restore();
        },

        _drawCircuitPath(ctx, points, isEnergized, pulse) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Dış kablo
            ctx.strokeStyle = isEnergized ? '#F59E0B' : '#CBD5E1';
            ctx.lineWidth = isEnergized ? 6 : 5;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // Akan elektrik akımı noktaları
            if (isEnergized) {
                ctx.strokeStyle = '#FEF08A';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 14]);
                ctx.lineDashOffset = -pulse * 18;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
            }
            ctx.restore();
        },

        render(engine) {
            const ctx = engine.ctx;
            const s = engine.state;
            s.pulse += 0.05;

            // Arka plan ortam ışıması
            if (s.isOn) {
                const ambient = ctx.createRadialGradient(s.bulbX, s.bulbY, 10, s.bulbX, s.bulbY, 270);
                ambient.addColorStop(0, 'rgba(254, 240, 138, 0.36)');
                ambient.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
                ambient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = ambient;
                ctx.fillRect(0, 0, engine.width, engine.height);
            }

            // 1. Üst 2 Adımlı Görev Göstergesi (1 • AÇ → 0 • KAPA)
            this._drawStepBadges(ctx, s);

            // 2. Devre Kabloları (Pil → Anahtar → Ampul → Dijital Ekran)
            this._drawCircuitPath(ctx, [
                { x: s.batteryX + 34, y: s.batteryY + 12 },
                { x: 205, y: s.batteryY + 12 },
                { x: 205, y: s.switchY },
                { x: s.switchX - s.switchW / 2, y: s.switchY }
            ], true, s.pulse);

            this._drawCircuitPath(ctx, [
                { x: s.switchX, y: s.switchY - s.switchH / 2 },
                { x: s.bulbX, y: s.bulbY + 38 }
            ], s.isOn, s.pulse);

            this._drawCircuitPath(ctx, [
                { x: s.bulbX + 26, y: s.bulbY + 18 },
                { x: 420, y: s.bulbY + 18 },
                { x: 420, y: s.displayY },
                { x: s.displayX - 50, y: s.displayY }
            ], s.isOn, s.pulse);

            // 3. Sol: Pil (Güç Kaynağı)
            this._drawBattery(ctx, s.batteryX, s.batteryY, s.isOn);

            // 4. Orta Üst: Ampul (Çakışan kablo yazısı olmadan temiz)
            CanvasEngine.drawBulb(ctx, s.bulbX, s.bulbY, s.isOn, {
                scale: 1.25,
                glowIntensity: s.isOn ? 1.0 + Math.sin(s.pulse * 2) * 0.15 : 0
            });

            // 5. Orta Alt: Dokunsal Anahtar
            CanvasEngine.drawSwitch(ctx, s.switchX, s.switchY, s.isOn, {
                w: s.switchW,
                h: s.switchH,
                label: s.isOn ? 'AÇIK (1)' : 'KAPALI (0)'
            });

            // 6. Sağ: Büyük Dijital 0 / 1 LED Göstergesi
            this._drawDigitalDisplay(ctx, s.displayX, s.displayY, s.isOn, s.pulse);
        }
    };
})();

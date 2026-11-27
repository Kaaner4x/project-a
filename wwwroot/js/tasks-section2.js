/**
 * RhythmCode / Püskül - Chapter 2 Orchestrator & Binary Circuits Engine
 * Tasks 11-22: Binary Number System & Electrical Logic Series
 *
 * Exclusively focused on 2-based (binary) numbers using lightbulbs, switches,
 * bit indicators (0/1), and place weights (16, 8, 4, 2, 1).
 * Strictly NO musical notes or sound scales.
 */

(function () {
    if (typeof CanvasEngine !== 'undefined') {
        /**
         * CanvasEngine.drawBulb - High-DPI tactile binary lightbulb primitive
         */
        CanvasEngine.drawBulb = function (ctx, x, y, isOn, options = {}) {
            ctx.save();
            ctx.translate(x, y);
            const scale = options.scale || 1.0;
            ctx.scale(scale, scale);

            const color = options.color || '#F59E0B';
            const glow = options.glowIntensity || (isOn ? 1.0 : 0);

            // 1. Işık Halesi & Işınlar
            if (isOn && glow > 0) {
                ctx.save();
                const haloGrad = ctx.createRadialGradient(0, -6, 12, 0, -6, 55 * glow);
                haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
                haloGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.28)');
                haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
                ctx.fillStyle = haloGrad;
                ctx.beginPath();
                ctx.arc(0, -6, 55 * glow, 0, Math.PI * 2);
                ctx.fill();

                // 8 Işıma Işını
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
                ctx.lineWidth = 2;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                    const rx1 = Math.cos(a) * 36;
                    const ry1 = -6 + Math.sin(a) * 36;
                    const rx2 = Math.cos(a) * (44 * glow);
                    const ry2 = -6 + Math.sin(a) * (44 * glow);
                    ctx.beginPath();
                    ctx.moveTo(rx1, ry1);
                    ctx.lineTo(rx2, ry2);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // 2. Duy / Soket (Metal Vida Tabanı)
            const baseW = 20;
            const baseH = 14;
            const baseY = 16;
            ctx.fillStyle = '#94A3B8';
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-baseW / 2, baseY, baseW, baseH, 3);
            ctx.fill();
            ctx.stroke();

            // Vida dişleri
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-baseW / 2 + 2, baseY + 4);
            ctx.lineTo(baseW / 2 - 2, baseY + 4);
            ctx.moveTo(-baseW / 2 + 2, baseY + 9);
            ctx.lineTo(baseW / 2 - 2, baseY + 9);
            ctx.stroke();

            // Alt kontak ucu
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(0, baseY + baseH + 2, 4, 0, Math.PI);
            ctx.fill();

            // 3. Cam Ampul Gövdesi
            ctx.beginPath();
            ctx.arc(0, -8, 24, Math.PI * 0.78, Math.PI * 0.22, false);
            ctx.bezierCurveTo(15, 6, 11, 16, 9, 16);
            ctx.lineTo(-9, 16);
            ctx.bezierCurveTo(-11, 16, -15, 6, Math.cos(Math.PI * 0.78) * 24, -8 + Math.sin(Math.PI * 0.78) * 24);
            ctx.closePath();

            if (isOn) {
                const glassGrad = ctx.createRadialGradient(0, -10, 4, 0, -8, 26);
                glassGrad.addColorStop(0, '#FFFFFF');
                glassGrad.addColorStop(0.35, '#FEF08A');
                glassGrad.addColorStop(0.8, color);
                glassGrad.addColorStop(1, '#D97706');
                ctx.fillStyle = glassGrad;
                ctx.fill();

                ctx.strokeStyle = '#F59E0B';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Parlak flaman teli
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = '#FEF08A';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(-7, 8);
                ctx.lineTo(-4, -6);
                ctx.arc(0, -10, 4, Math.PI, 0, false);
                ctx.lineTo(4, -6);
                ctx.lineTo(7, 8);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
                ctx.fill();
                ctx.strokeStyle = '#94A3B8';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Sönük flaman
                ctx.strokeStyle = '#94A3B8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-6, 8);
                ctx.lineTo(-3, -6);
                ctx.arc(0, -9, 3, Math.PI, 0, false);
                ctx.lineTo(3, -6);
                ctx.lineTo(6, 8);
                ctx.stroke();
            }

            // Cam Yansıması
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(-8, -16, 6, 0, Math.PI * 2);
            ctx.fill();

            // Basamak Değeri Etiketi (örn. "16", "8", "4", "2", "1")
            if (options.label) {
                ctx.fillStyle = isOn ? '#1E293B' : '#64748B';
                ctx.font = 'bold 13px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                if (options.labelPosition === 'top') {
                    ctx.fillText(options.label, 0, -34);
                } else {
                    ctx.fillText(options.label, 0, baseY + baseH + 16);
                }
            }

            // Bit Durum Rozeti (0 veya 1)
            if (options.bitState !== undefined) {
                const bit = options.bitState ? '1' : '0';
                const badgeY = options.labelPosition === 'top'
                    ? (baseY + baseH + 16)
                    : (baseY + baseH + (options.label ? 36 : 18));
                const badgeW = 28;
                const badgeH = 20;

                ctx.fillStyle = options.bitState ? '#10B981' : '#E2E8F0';
                ctx.strokeStyle = options.bitState ? '#059669' : '#94A3B8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 6);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = options.bitState ? '#FFFFFF' : '#475569';
                ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(bit, 0, badgeY);
                ctx.textBaseline = 'alphabetic';
            }

            ctx.restore();
        };

        /**
         * CanvasEngine.drawSwitch - Tactile on/off switch component
         */
        CanvasEngine.drawSwitch = function (ctx, x, y, isOn, options = {}) {
            ctx.save();
            ctx.translate(x, y);
            const w = options.w || 64;
            const h = options.h || 50;

            // Taban plakası
            ctx.fillStyle = '#F8FAFC';
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, 14);
            ctx.fill();
            ctx.stroke();

            // İç mekanizma yuvası
            const slotW = w - 20;
            const slotH = h - 22;
            ctx.fillStyle = '#E2E8F0';
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-slotW / 2, -slotH / 2, slotW, slotH, 8);
            ctx.fill();
            ctx.stroke();

            // Gösterge ışığı / LED
            ctx.beginPath();
            ctx.arc(0, -slotH / 2 - 3, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = isOn ? '#10B981' : '#EF4444';
            ctx.fill();

            // Kol / Buton (Toggle Handle)
            const handleW = slotW - 6;
            const handleH = slotH / 2 + 2;
            const handleY = isOn ? (-slotH / 2 + 3) : (slotH / 2 - handleH - 3);

            ctx.fillStyle = isOn ? '#10B981' : '#94A3B8';
            ctx.strokeStyle = isOn ? '#059669' : '#64748B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-handleW / 2, handleY, handleW, handleH, 6);
            ctx.fill();
            ctx.stroke();

            // Tutma yeri çizgisi
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-handleW / 2 + 6, handleY + handleH / 2);
            ctx.lineTo(handleW / 2 - 6, handleY + handleH / 2);
            ctx.stroke();

            // Etiket
            if (options.label) {
                ctx.fillStyle = isOn ? '#059669' : '#64748B';
                ctx.font = 'bold 11px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(options.label, 0, h / 2 + 15);
            }

            ctx.restore();
        };

        /**
         * CanvasEngine.drawWire - Electric circuit wire with current flow
         */
        CanvasEngine.drawWire = function (ctx, x1, y1, x2, y2, isPowered, pulseTime = 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 + 8;
            ctx.quadraticCurveTo(midX, midY, x2, y2);

            if (isPowered) {
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.lineWidth = 6;
                ctx.stroke();

                ctx.strokeStyle = '#38BDF8';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Akan kıvılcım
                const t = (pulseTime * 0.8) % 1;
                const qx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
                const qy = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = '#38BDF8';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(qx, qy, 4, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.strokeStyle = '#94A3B8';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
            ctx.restore();
        };

        /**
         * CanvasEngine.drawBinaryHeader - Sleek dark-slate LED dashboard card for Chapter 2 tasks
         */
        CanvasEngine.drawBinaryHeader = function (ctx, options = {}) {
            const x = options.x || 320;
            const y = options.y || 34;
            const w = options.w || 430;
            const h = options.h || 46;
            const accent = options.accentColor || '#10B981';

            ctx.save();
            ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
            ctx.shadowBlur = 14;
            ctx.shadowOffsetY = 4;

            ctx.fillStyle = '#0F172A';
            ctx.strokeStyle = options.isMatched ? '#10B981' : '#334155';
            ctx.lineWidth = options.isMatched ? 2.5 : 2;
            ctx.beginPath();
            ctx.roundRect(x - w / 2, y - h / 2, w, h, 14);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            ctx.textBaseline = 'middle';

            if (options.titleText) {
                ctx.fillStyle = accent;
                ctx.font = 'bold 16px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(options.titleText, x, y + 1);
                ctx.restore();
                return;
            }

            const items = [];
            if (options.target !== undefined) {
                items.push({ label: 'HEDEF', value: `${options.target}`, color: accent });
            }
            if (options.current !== undefined) {
                items.push({
                    label: options.currentLabel || 'TOPLAM',
                    value: `${options.current}`,
                    color: options.isMatched ? '#34D399' : '#FBBF24'
                });
            }
            if (options.binaryText) {
                items.push({ label: 'KOD', value: options.binaryText, color: '#38BDF8', mono: true });
            }
            if (options.statusText) {
                items.push({
                    label: options.statusLabel || 'DURUM',
                    value: options.statusText,
                    color: options.statusOk ? '#34D399' : '#F87171'
                });
            }

            const slotW = w / Math.max(1, items.length);
            items.forEach((item, idx) => {
                const cx = (x - w / 2) + slotW * idx + slotW / 2;

                if (idx > 0) {
                    ctx.strokeStyle = '#334155';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo((x - w / 2) + slotW * idx, y - h / 2 + 9);
                    ctx.lineTo((x - w / 2) + slotW * idx, y + h / 2 - 9);
                    ctx.stroke();
                }

                ctx.fillStyle = '#94A3B8';
                ctx.font = 'bold 9.5px Fredoka, Nunito, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.label, cx, y - 10);

                ctx.fillStyle = item.color;
                ctx.font = item.mono ? '900 16px Fredoka, monospace' : '900 17px Fredoka, Nunito, sans-serif';
                ctx.fillText(item.value, cx, y + 9);
            });

            ctx.restore();
        };

        /**
         * CanvasEngine.drawPowerBus - Horizontal circuit power rail with animated current flow
         */
        CanvasEngine.drawPowerBus = function (ctx, startX, endX, y, isPowered, pulse = 0) {
            ctx.save();
            ctx.lineCap = 'round';

            ctx.strokeStyle = isPowered ? '#F59E0B' : '#CBD5E1';
            ctx.lineWidth = isPowered ? 6 : 5;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();

            if (isPowered) {
                ctx.strokeStyle = '#FEF08A';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 14]);
                ctx.lineDashOffset = -pulse * 18;
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
                ctx.stroke();
            }
            ctx.restore();
        };

        /**
         * CanvasEngine.drawCircuitButton - Tactile 3D canvas button with press/wobble support
         */
        CanvasEngine.drawCircuitButton = function (ctx, btn, label, options = {}) {
            ctx.save();
            const bg = options.bg || '#10B981';
            const border = options.border || '#059669';
            const textColor = options.textColor || '#FFFFFF';
            const radius = options.radius || 14;

            if (btn.press > 0) {
                btn.press *= 0.82;
                if (btn.press < 0.02) btn.press = 0;
            }
            if (btn.wobble > 0) {
                btn.wobble *= 0.85;
                if (btn.wobble < 0.1) btn.wobble = 0;
            }

            const yOffset = (btn.press || 0) * 3;
            ctx.translate(btn.x, btn.y + yOffset);
            if (btn.wobble) {
                ctx.rotate(Math.sin(btn.wobble * 2.8) * 0.08);
            }

            // 3D alt gölge tabanı
            if (!options.disabled) {
                ctx.fillStyle = border;
                ctx.beginPath();
                ctx.roundRect(-btn.w / 2, -btn.h / 2 + 4, btn.w, btn.h, radius);
                ctx.fill();
            }

            ctx.fillStyle = options.disabled ? '#CBD5E1' : bg;
            ctx.strokeStyle = options.disabled ? '#94A3B8' : border;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, radius);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = options.disabled ? '#64748B' : textColor;
            ctx.font = options.font || 'bold 15px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 1);
            ctx.restore();
        };

        /**
         * CanvasEngine.drawBatteryUnit - Power supply visual for single/multi bit circuits
         */
        CanvasEngine.drawBatteryUnit = function (ctx, x, y, isPowered) {
            ctx.save();
            ctx.translate(x, y);

            ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = '#94A3B8';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-14, -56, 28, 12, [5, 5, 0, 0]);
            ctx.fill();
            ctx.stroke();

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

            ctx.fillStyle = isPowered ? '#F59E0B' : '#10B981';
            ctx.beginPath();
            ctx.roundRect(-24, -18, 48, 42, 7);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚡', 0, 4);

            ctx.fillStyle = '#FDE047';
            ctx.font = 'bold 14px Fredoka, Nunito, sans-serif';
            ctx.fillText('+', 0, -31);
            ctx.fillStyle = '#94A3B8';
            ctx.fillText('−', 0, 36);

            ctx.fillStyle = '#475569';
            ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
            ctx.fillText('GÜÇ', 0, 64);
            ctx.restore();
        };

        /**
         * CanvasEngine.drawDigitalPanel - Glowing dark LED readout panel
         */
        CanvasEngine.drawDigitalPanel = function (ctx, x, y, valueText, subLabel, isActive, pulse = 0) {
            ctx.save();
            ctx.translate(x, y);

            ctx.shadowColor = isActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(15, 23, 42, 0.14)';
            ctx.shadowBlur = isActive ? 22 : 12;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = '#0F172A';
            ctx.strokeStyle = isActive ? '#10B981' : '#475569';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(-50, -56, 100, 112, 18);
            ctx.fill();
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            ctx.fillStyle = isActive ? '#064E3B' : '#1E293B';
            ctx.beginPath();
            ctx.roundRect(-40, -44, 80, 82, 12);
            ctx.fill();

            if (isActive) {
                ctx.shadowColor = '#34D399';
                ctx.shadowBlur = 16 + Math.sin(pulse * 2) * 4;
                ctx.fillStyle = '#6EE7B7';
            } else {
                ctx.fillStyle = '#64748B';
            }
            ctx.font = '900 54px Fredoka, Nunito, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, 0, -2);
            ctx.shadowColor = 'transparent';

            ctx.fillStyle = isActive ? '#34D399' : '#EF4444';
            ctx.beginPath();
            ctx.arc(-22, 47, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isActive ? '#A7F3D0' : '#94A3B8';
            ctx.font = 'bold 11px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(subLabel, -12, 48);
            ctx.restore();
        };
    }

    if (typeof TaskEngine === 'undefined') {
        console.warn('TaskEngine must be loaded before tasks-section2.js');
        return;
    }

    window.TaskChapter2Modules = window.TaskChapter2Modules || {};

    const originalInitTaskState = TaskEngine.prototype._initTaskState;
    const originalHandlePointerDown = TaskEngine.prototype.handlePointerDown;
    const originalHandlePointerMove = TaskEngine.prototype.handlePointerMove;
    const originalHandlePointerUp = TaskEngine.prototype.handlePointerUp;
    const originalLoop = TaskEngine.prototype.loop;

    // Durum Başlatma
    TaskEngine.prototype._initTaskState = function () {
        if (this.taskId <= 10) {
            return originalInitTaskState.call(this);
        }

        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.initState === 'function') {
            mod.initState(this);
        } else {
            console.warn(`Chapter 2 task module for Task ${this.taskId} not found.`);
        }
    };

    // Pointer Basma
    TaskEngine.prototype.handlePointerDown = function (pos) {
        if (window.RhythmMixer && typeof window.RhythmMixer.ensureContext === 'function') {
            window.RhythmMixer.ensureContext();
        }

        if (this.taskId <= 10) {
            if (originalHandlePointerDown) originalHandlePointerDown.call(this, pos);
            return;
        }

        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.handlePointerDown === 'function') {
            mod.handlePointerDown(this, pos);
        }
    };

    // Pointer Taşıma
    TaskEngine.prototype.handlePointerMove = function (pos) {
        if (this.taskId <= 10) {
            if (originalHandlePointerMove) originalHandlePointerMove.call(this, pos);
            return;
        }

        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.handlePointerMove === 'function') {
            mod.handlePointerMove(this, pos);
        }
    };

    // Pointer Bırakma
    TaskEngine.prototype.handlePointerUp = function () {
        if (this.taskId <= 10) {
            if (originalHandlePointerUp) originalHandlePointerUp.call(this);
            return;
        }

        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.handlePointerUp === 'function') {
            mod.handlePointerUp(this);
        }
    };

    // Ana Döngü & Çizim
    TaskEngine.prototype.loop = function () {
        if (this.taskId <= 10) {
            return originalLoop.call(this);
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += 0.03;

        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.render === 'function') {
            mod.render(this);
        }

        this.particles.update();
        this.particles.draw(this.ctx);

        this.animId = requestAnimationFrame(this.loop);
    };

    // ==========================================
    // ACTION DISPATCHER METHODS (Buttons & Tests)
    // ==========================================
    TaskEngine.prototype.toggleSwitch = function () {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.toggleSwitch === 'function') {
            mod.toggleSwitch(this);
        }
    };

    TaskEngine.prototype.toggleBulb = function (index) {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.toggleBulb === 'function') {
            mod.toggleBulb(this, index);
        } else if (mod && typeof mod.lightUpBulb === 'function') {
            mod.lightUpBulb(this, index);
        }
    };

    TaskEngine.prototype.checkAnswer = function () {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.checkAnswer === 'function') {
            mod.checkAnswer(this);
        } else if (mod && typeof mod.checkValueSum === 'function') {
            mod.checkValueSum(this);
        }
    };

    TaskEngine.prototype.selectOption = function (val) {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.selectOption === 'function') {
            mod.selectOption(this, val);
        }
    };

    TaskEngine.prototype.shiftBits = function (direction) {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.shiftBits === 'function') {
            mod.shiftBits(this, direction);
        }
    };

    TaskEngine.prototype.toggleConfirmationSwitch = function () {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.toggleConfirmationSwitch === 'function') {
            mod.toggleConfirmationSwitch(this);
        }
    };

    TaskEngine.prototype.resetBulbs = function () {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod.resetBulbs === 'function') {
            mod.resetBulbs(this);
        }
    };

    // Backward Compatibility Aliases
    TaskEngine.prototype.lightUpBulb = function (index) {
        this.toggleBulb(index);
    };

    TaskEngine.prototype.lightUpNextBulb = function () {
        this.toggleBulb(0);
    };

    TaskEngine.prototype.turnOffBulb = function (index) {
        this.toggleBulb(index);
    };

    TaskEngine.prototype.turnOffNextBulb = function () {
        this.toggleBulb(0);
    };

    TaskEngine.prototype.placeNextBulb = function () {
        this.toggleBulb(0);
    };

    TaskEngine.prototype.resetBaskets = function () {
        this.resetBulbs();
    };

    TaskEngine.prototype.playMelodicScale = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.completePattern = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.toggleGroupSwitch = function () {
        this.toggleSwitch();
    };

    TaskEngine.prototype.connectDominoWire = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.triggerDominoChain = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.toggleValueBulb = function (index) {
        this.toggleBulb(index);
    };

    TaskEngine.prototype.checkValueSum = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.startMasterSymphony = function () {
        this.checkAnswer();
    };

    TaskEngine.prototype.executeChapter2Action = function (actionName, ...args) {
        const mod = window.TaskChapter2Modules[this.taskId];
        if (mod && typeof mod[actionName] === 'function') {
            return mod[actionName](this, ...args);
        }
    };
})();

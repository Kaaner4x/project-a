/**
 * Ritmik Kodlar (RhythmCode) - Canvas Çizim ve Animasyon Çekirdeği
 * Ortak çizim yardımcıları, sevimli fırça karakteri, parçacık sistemi ve dokunmatik koordinat yönetimi.
 */

class CanvasEngine {
    /**
     * Retina ve High-DPI ekranlar için netleştirilmiş Canvas başlatıcı.
     * En az 2x süper-örnekleme (supersampling) ile yatay ve büyük ekranlarda bulanıklığı tamamen yok eder.
     */
    static setupHiDPI(canvas, width, height) {
        if (!canvas) return null;
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        if (!canvas.classList.contains('task-canvas') && canvas.id !== 'taskCanvas') {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
        canvas.style.touchAction = 'none';
        canvas.dataset.logicalWidth = width.toString();
        canvas.dataset.logicalHeight = height.toString();
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(dpr, dpr);
        return { ctx, dpr, width, height };
    }

    /**
     * Dokunma veya Fare olayından doğru Canvas içi koordinatı çeker.
     * Tam ekran veya dinamik olarak esneyen tuval boyutlarında 1:1 hassasiyetle çalışır.
     */
    static getPointerPos(canvas, evt) {
        if (!canvas || !evt) return { x: 0, y: 0 };
        const rect = (typeof canvas.getBoundingClientRect === 'function')
            ? canvas.getBoundingClientRect()
            : { left: 0, top: 0, width: 0, height: 0 };
        let clientX = 0;
        let clientY = 0;

        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        } else if (evt.changedTouches && evt.changedTouches.length > 0) {
            clientX = evt.changedTouches[0].clientX;
            clientY = evt.changedTouches[0].clientY;
        } else if (evt.targetTouches && evt.targetTouches.length > 0) {
            clientX = evt.targetTouches[0].clientX;
            clientY = evt.targetTouches[0].clientY;
        } else if (typeof evt.clientX === 'number') {
            clientX = evt.clientX;
            clientY = evt.clientY;
        }

        const logicalWidth = parseFloat(canvas.dataset.logicalWidth) || canvas.width || 640;
        const logicalHeight = parseFloat(canvas.dataset.logicalHeight) || canvas.height || 360;

        // Cihaz yön değişimi veya sıfır boyut koruması
        const rectWidth = (rect && rect.width > 0) ? rect.width : logicalWidth;
        const rectHeight = (rect && rect.height > 0) ? rect.height : logicalHeight;

        const scaleX = logicalWidth / rectWidth;
        const scaleY = logicalHeight / rectHeight;

        const rectLeft = (rect && typeof rect.left === 'number') ? rect.left : 0;
        const rectTop = (rect && typeof rect.top === 'number') ? rect.top : 0;

        const rawX = (clientX - rectLeft) * scaleX;
        const rawY = (clientY - rectTop) * scaleY;

        return {
            x: Math.max(0, Math.min(logicalWidth, rawX)),
            y: Math.max(0, Math.min(logicalHeight, rawY))
        };
    }

    /**
     * Minik Püskül / Ponpon Çizimi (Canvas üzerinde görüşü kapatmayan, sevimli, tüylü ve zarif mini obje)
     */
    static drawPuskul(ctx, x, y, angle = 0, scale = 1, color = '#3B82F6', isHappy = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.scale(scale, scale);

        // Minik zemin gölgesi
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Hafif dış ışıltı halesi
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Arka püskül tüyleri (Ponpon püskülleri)
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        const tufts = [-0.6, -0.3, 0, 0.3, 0.6];
        for (let t of tufts) {
            const rad = Math.PI * 1.5 + t;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(rad) * 13, Math.sin(rad) * 13);
            ctx.stroke();
        }
        ctx.restore();

        // Ana yumuşak ponpon topu
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
        ctx.fill();

        // Parlak vurgu kubbesi
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(-2.5, -2.5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Sevimli minik yüz (Ponponun ortasında)
        ctx.fillStyle = '#0F172A';
        if (isHappy) {
            // Mutlu kapalı hilal gözler ^^
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(-3, -1, 1.8, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(3, -1, 1.8, Math.PI, 0);
            ctx.stroke();
        } else {
            // Sevimli iki parlak nokta göz
            ctx.beginPath();
            ctx.arc(-3, -1, 1.6, 0, Math.PI * 2);
            ctx.arc(3, -1, 1.6, 0, Math.PI * 2);
            ctx.fill();

            // Minik beyaz parıltı noktaları
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-2.5, -1.5, 0.6, 0, Math.PI * 2);
            ctx.arc(3.5, -1.5, 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Minik pembe yanaklar
        ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
        ctx.beginPath();
        ctx.arc(-5.5, 1.5, 1.6, 0, Math.PI * 2);
        ctx.arc(5.5, 1.5, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Gülümseme
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 1.2, 2.2, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * drawBrush: drawPuskul ile geriye uyumluluk sağlar
     */
    static drawBrush(ctx, x, y, angle = 0, scale = 1, color = '#3B82F6', isHappy = false) {
        CanvasEngine.drawPuskul(ctx, x, y, angle, scale, color, isHappy);
    }

    /**
     * Geometrik Yıldız Çizimi
     */
    static drawStar(ctx, cx, cy, spikes = 5, outerRadius = 20, innerRadius = 10, fill = '#FBBF24', stroke = '#D97706') {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }
        ctx.restore();
    }

    /**
     * Pofuduk Bulut Çizimi (Modern, yumuşak, çizgi/kontursuz gerçekçi bulut)
     */
    static drawCloud(ctx, cx, cy, scale = 1, fill = '#FFFFFF', stroke = null) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Doğal yumuşak bulut gölgesi (Çizim çizgisi yerine yumuşak derinlik)
        ctx.shadowColor = 'rgba(148, 163, 184, 0.28)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(-32, 2, 24, 0, Math.PI * 2);
        ctx.arc(-12, -16, 30, 0, Math.PI * 2);
        ctx.arc(16, -12, 26, 0, Math.PI * 2);
        ctx.arc(38, 4, 20, 0, Math.PI * 2);
        ctx.arc(2, 10, 28, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Üst yumuşak ışık kubbesi (Volumetrik derinlik için)
        ctx.shadowColor = 'transparent';
        const grad = ctx.createLinearGradient(0, -35, 0, 30);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(1, 'rgba(241, 245, 249, 0.3)');
        ctx.fillStyle = grad;
        ctx.fill();

        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Parlayan Gülümseyen Güneş Çizimi
     */
    static drawSun(ctx, cx, cy, radius = 35, rayLength = 16, time = 0) {
        ctx.save();
        ctx.translate(cx, cy);

        // Işınlar (dönen hafif animasyon)
        ctx.save();
        ctx.rotate(time * 0.02);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const rays = 12;
        for (let i = 0; i < rays; i++) {
            const angle = (i * 2 * Math.PI) / rays;
            const x1 = Math.cos(angle) * (radius + 4);
            const y1 = Math.sin(angle) * (radius + 4);
            const x2 = Math.cos(angle) * (radius + rayLength);
            const y2 = Math.sin(angle) * (radius + rayLength);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.restore();

        // Güneş Gövdesi (Hale ve Merkez)
        const grad = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
        grad.addColorStop(0, '#FEF08A');
        grad.addColorStop(1, '#FBBF24');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Güneşin Sevimli Yüzü
        ctx.fillStyle = '#78350F';
        // Gözler
        ctx.beginPath();
        ctx.arc(-10, -6, 3.5, 0, Math.PI * 2);
        ctx.arc(10, -6, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Işıltı
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-8, -7, 1.2, 0, Math.PI * 2);
        ctx.arc(12, -7, 1.2, 0, Math.PI * 2);
        ctx.fill();
        // Gülümseme
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 4, 12, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        // Pembe yanaklar
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(-16, 2, 4, 0, Math.PI * 2);
        ctx.arc(16, 2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Konfeti, Yıldız ve Işıltı Parçacık Sistemi
 */
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    burst(x, y, count = 28, colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6']) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.015 + Math.random() * 0.02,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                shape: Math.random() > 0.4 ? 'circle' : 'star'
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12; // Hafif yerçekimi
            p.vx *= 0.98;
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;

            if (p.shape === 'star') {
                CanvasEngine.drawStar(ctx, p.x, p.y, 4, p.radius * 1.3, p.radius * 0.6, p.color, null);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    hasActive() {
        return this.particles.length > 0;
    }
}

window.CanvasEngine = CanvasEngine;
window.ParticleSystem = ParticleSystem;

/**
 * RhythmCode (Püskül) - PixiJS 2D WebGL/WebGPU Rendering Engine
 * Provides GPU-accelerated rendering, scene graph management, retina resolution auto-scaling,
 * and high-performance interactive visual objects (Püskül mascot, particles, shapes).
 */

class PixiEngine {
    /**
     * Checks if PixiJS is loaded and WebGL is supported
     */
    static isSupported() {
        return typeof PIXI !== 'undefined' && PIXI.utils && !PIXI.utils.isWebGLSupported ? false : (typeof PIXI !== 'undefined');
    }

    /**
     * Creates and mounts an optimized PixiJS Application
     * @param {HTMLCanvasElement} canvas Target canvas element
     * @param {number} width Logical width (e.g. 640)
     * @param {number} height Logical height (e.g. 360)
     * @param {Object} customOptions Optional PixiJS options
     */
    static createApplication(canvas, width = 640, height = 360, customOptions = {}) {
        if (!typeof PIXI === 'undefined') {
            console.warn('[PixiEngine] PixiJS library is not loaded.');
            return null;
        }

        const dpr = Math.max(window.devicePixelRatio || 1, 2);

        const options = {
            view: canvas,
            width: width,
            height: height,
            backgroundColor: 0xFFFFFF,
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
            resolution: dpr,
            powerPreference: 'high-performance',
            ...customOptions
        };

        const app = new PIXI.Application(options);

        // Configure responsive stage scaling
        app.stage.sortableChildren = true;
        app.stage.eventMode = 'static';
        app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);

        return app;
    }

    /**
     * Creates an animated, interactive Püskül mascot container with GPU-accelerated rendering
     * @param {string|number} color Hex color (e.g. '#3B82F6' or 0x3B82F6)
     * @param {number} scale Scale multiplier
     * @param {boolean} isHappy Expression flag
     */
    static createPuskulSprite(color = '#3B82F6', scale = 1, isHappy = false) {
        if (typeof PIXI === 'undefined') return null;

        const numColor = PixiEngine.toHexColor(color);
        const container = new PIXI.Container();
        container.eventMode = 'static';
        container.cursor = 'pointer';

        // 1. Zemin gölgesi
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.12);
        shadow.drawEllipse(0, 10, 10, 4);
        shadow.endFill();
        container.addChild(shadow);

        // 2. Hafif dış ışıltı halesi
        const halo = new PIXI.Graphics();
        halo.beginFill(numColor, 0.2);
        halo.drawCircle(0, 0, 14);
        halo.endFill();
        container.addChild(halo);

        // 3. Püskül tüyleri (Arka ponpon tüyleri)
        const tufts = new PIXI.Graphics();
        tufts.lineStyle({ width: 2.5, color: numColor, cap: PIXI.LINE_CAP.ROUND });
        const angles = [-0.6, -0.3, 0, 0.3, 0.6];
        for (const t of angles) {
            const rad = Math.PI * 1.5 + t;
            tufts.moveTo(0, 0);
            tufts.lineTo(Math.cos(rad) * 13, Math.sin(rad) * 13);
        }
        container.addChild(tufts);

        // 4. Ana ponpon gövdesi
        const body = new PIXI.Graphics();
        body.beginFill(numColor);
        body.drawCircle(0, 0, 9.5);
        body.endFill();

        // Parlak vurgu kubbesi
        body.beginFill(0xFFFFFF, 0.35);
        body.drawCircle(-2.5, -2.5, 5);
        body.endFill();
        container.addChild(body);

        // 5. Sevimli yüz
        const face = new PIXI.Graphics();
        if (isHappy) {
            // Mutlu hilal gözler ^^
            face.lineStyle({ width: 1.4, color: 0x0F172A });
            face.arc(-3, -1, 1.8, Math.PI, 0);
            face.moveTo(3 + 1.8, -1);
            face.arc(3, -1, 1.8, Math.PI, 0);
        } else {
            // Canlı iki nokta göz
            face.beginFill(0x0F172A);
            face.drawCircle(-3, -1, 1.6);
            face.drawCircle(3, -1, 1.6);
            face.endFill();

            // Göz ışıltısı
            face.beginFill(0xFFFFFF);
            face.drawCircle(-2.5, -1.5, 0.6);
            face.drawCircle(3.5, -1.5, 0.6);
            face.endFill();
        }

        // Allık yanaklar
        face.beginFill(0xF43F5E, 0.5);
        face.drawCircle(-5.5, 1.5, 1.6);
        face.drawCircle(5.5, 1.5, 1.6);
        face.endFill();

        // Gülümseme
        face.lineStyle({ width: 1.2, color: 0x0F172A });
        face.arc(0, 1.2, 2.2, 0.2 * Math.PI, 0.8 * Math.PI);

        container.addChild(face);

        container.scale.set(scale);

        // Helper: Animasyonlu zıplama
        container.hop = function() {
            let step = 0;
            const origY = container.y;
            const hopAnim = () => {
                step += 0.2;
                container.y = origY - Math.sin(step) * 12;
                if (step < Math.PI) {
                    requestAnimationFrame(hopAnim);
                } else {
                    container.y = origY;
                }
            };
            hopAnim();
        };

        return container;
    }

    /**
     * Converts CSS hex color string to numeric color
     * @param {string|number} color '#3B82F6' -> 0x3B82F6
     */
    static toHexColor(color) {
        if (typeof color === 'number') return color;
        if (typeof color === 'string') {
            const clean = color.replace('#', '');
            return parseInt(clean, 16) || 0x3B82F6;
        }
        return 0x3B82F6;
    }
}

// Global scope export
if (typeof window !== 'undefined') {
    window.PixiEngine = PixiEngine;
}

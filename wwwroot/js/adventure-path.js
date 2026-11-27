/**
 * RhythmCode - Adventure Path UI Controller (SOLID / SRP)
 * Renders progress bar, biome chapter gate state, interactive 3D node states,
 * and dynamic themed winding SVG roads connecting the nodes.
 */
class AdventurePathUI {
    constructor(config) {
        this.chapterId = config.chapterId || 0;
        this.nodes = Array.from(document.querySelectorAll('.adventure-node-wrapper'));
        this.pathFlows = Array.from(document.querySelectorAll('.adventure-path-flow'));
        this.progressFill = document.getElementById('adventureProgressFill');
        this.progressStarText = document.getElementById('adventureStarText');
        this.progressPercent = document.getElementById('adventurePercentBadge');
        this.continueBtn = document.getElementById('adventureContinueBtn');
        this.continueLabel = document.getElementById('adventureContinueLabel');
        this.chapterGate = document.getElementById('chapterTwoGate');
        this.chapterGatePill = document.getElementById('chapterGatePill');
        this.resizeTimer = null;
    }

    init() {
        const activeTaskId = window.ProgressManager
            ? window.ProgressManager.getActiveTaskForChapter(this.chapterId)
            : 1;

        let completedCount = 0;
        let activeNodeElement = null;
        const totalCount = this.nodes.length;

        this.nodes.forEach((node) => {
            const taskId = parseInt(node.getAttribute('data-task-id'), 10);
            const isCompleted = window.ProgressManager
                ? window.ProgressManager.isTaskCompleted(taskId)
                : false;
            const isUnlocked = window.ProgressManager
                ? window.ProgressManager.isTaskUnlocked(taskId)
                : (taskId === 1);

            const card = document.getElementById(`taskCard-${taskId}`);
            const lockBadge = document.getElementById(`lockBadge-${taskId}`);
            const starBadge = document.getElementById(`starBadge-${taskId}`);
            const indicator = document.getElementById(`puskulIndicator-${taskId}`);

            if (isCompleted) {
                completedCount++;
                node.classList.add('is-completed');
                if (lockBadge) lockBadge.style.display = 'none';
                if (starBadge) starBadge.style.display = 'flex';
            } else if (isUnlocked) {
                node.classList.add('is-unlocked');
                if (lockBadge) lockBadge.style.display = 'none';
            } else {
                node.classList.add('is-locked');
                if (card) {
                    card.setAttribute('tabindex', '-1');
                    card.setAttribute('aria-disabled', 'true');
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.triggerLockedFeedback(node);
                    });
                }
            }

            if (taskId === activeTaskId) {
                node.classList.add('is-active');
                if (indicator) indicator.style.display = 'flex';
                activeNodeElement = node;
            }
        });

        this.updateProgressHud(completedCount, totalCount, activeTaskId);
        this.updateChapterGate();
        this.checkChapterCheer();

        // Layout tamamlandıktan sonra tematik kıvrımlı SVG yolları çiz
        requestAnimationFrame(() => this.renderAllRoads());
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.renderAllRoads(), 120);
        });

        if (activeNodeElement && activeTaskId > 2) {
            setTimeout(() => {
                activeNodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 350);
        }
    }

    renderAllRoads() {
        this.pathFlows.forEach((flow) => this.renderRoadForFlow(flow));
    }

    renderRoadForFlow(flow) {
        const svg = flow.querySelector('.adventure-road-svg');
        if (!svg) return;

        const theme = flow.getAttribute('data-road-theme') || 'meadow';
        const nodeWrappers = Array.from(flow.querySelectorAll('.adventure-node-wrapper'));
        if (nodeWrappers.length < 2) return;

        const flowRect = flow.getBoundingClientRect();
        const width = Math.max(1, Math.round(flowRect.width));
        const height = Math.max(1, Math.round(flowRect.height));

        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        const points = nodeWrappers.map((wrapper) => {
            const target = wrapper.querySelector('.node-badge-circle') || wrapper;
            const rect = target.getBoundingClientRect();
            const isCompleted = wrapper.classList.contains('is-completed');
            const isUnlocked = wrapper.classList.contains('is-unlocked') || wrapper.classList.contains('is-active');
            return {
                x: rect.left - flowRect.left + rect.width / 2,
                y: rect.top - flowRect.top + rect.height / 2,
                isCompleted,
                isUnlocked
            };
        });

        const fullPathData = this.buildSmoothBezierPath(points);

        // Tamamlanan segmentleri (başlangıçtan son açık/tamamlanan düğüme kadar) ayrı çiz
        const completedPoints = [];
        for (let i = 0; i < points.length; i++) {
            if (points[i].isCompleted) {
                completedPoints.push(points[i]);
                if (i + 1 < points.length && points[i + 1].isUnlocked && !points[i + 1].isCompleted) {
                    completedPoints.push(points[i + 1]);
                }
            }
        }
        const completedPathData = completedPoints.length >= 2
            ? this.buildSmoothBezierPath(completedPoints)
            : '';

        svg.innerHTML = '';

        if (theme === 'crystal') {
            this.appendPath(svg, fullPathData, 'road-crystal-glow');
            this.appendPath(svg, fullPathData, 'road-crystal-border');
            this.appendPath(svg, fullPathData, 'road-crystal-surface');
            this.appendPath(svg, fullPathData, 'road-crystal-stardust');
            if (completedPathData) {
                this.appendPath(svg, completedPathData, 'road-crystal-completed');
            }
        } else {
            this.appendPath(svg, fullPathData, 'road-meadow-shadow');
            this.appendPath(svg, fullPathData, 'road-meadow-border');
            this.appendPath(svg, fullPathData, 'road-meadow-surface');
            this.appendPath(svg, fullPathData, 'road-meadow-stones');
            if (completedPathData) {
                this.appendPath(svg, completedPathData, 'road-meadow-completed');
            }
        }
    }

    buildSmoothBezierPath(points) {
        if (!points.length) return '';
        let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const midY = (p1.y + p2.y) / 2;
            d += ` C ${p1.x.toFixed(1)} ${midY.toFixed(1)}, ${p2.x.toFixed(1)} ${midY.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        return d;
    }

    appendPath(svg, d, className) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', className);
        svg.appendChild(path);
    }

    updateProgressHud(completedCount, totalCount, activeTaskId) {
        const safeTotal = Math.max(1, totalCount);
        const percent = Math.round((completedCount / safeTotal) * 100);

        if (this.progressStarText) {
            this.progressStarText.textContent = `${completedCount} / ${totalCount} Yıldız`;
        }
        if (this.progressPercent) {
            this.progressPercent.textContent = `%${percent}`;
        }
        if (this.progressFill) {
            requestAnimationFrame(() => {
                this.progressFill.style.width = `${percent}%`;
            });
        }

        if (this.continueBtn && this.continueLabel) {
            if (completedCount >= totalCount && totalCount > 0) {
                this.continueBtn.href = '/Atolye';
                this.continueBtn.classList.add('is-all-done');
                this.continueLabel.textContent = '🏆 Atölyeye Geç!';
            } else {
                this.continueBtn.href = `/Gorev/${activeTaskId}`;
                this.continueLabel.textContent = `▶ Görev ${activeTaskId} ile Devam Et`;
            }
        }
    }

    updateChapterGate() {
        if (!this.chapterGate) return;

        // Geliştirme modunda tüm bölümler ve geçiş kapıları serbestçe açık
        this.chapterGate.classList.add('is-gate-unlocked');
        if (this.chapterGatePill) {
            this.chapterGatePill.textContent = '🔓 BÖLÜM AÇIK';
        }
    }

    checkChapterCheer() {
        const modal = document.getElementById('chapterCheerModal');
        const closeBtn = document.getElementById('cheerCloseBtn');
        const cheerMsg = document.getElementById('cheerMessage');
        if (!modal || !closeBtn) return;

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        if (!window.ProgressManager) return;

        const ch1Done = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every(id => window.ProgressManager.isTaskCompleted(id));
        const ch2Done = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].every(id => window.ProgressManager.isTaskCompleted(id));

        const cheerKeyCh1 = 'puskul_cheer_ch1_shown';
        const cheerKeyCh2 = 'puskul_cheer_ch2_shown';

        if (ch2Done && !sessionStorage.getItem(cheerKeyCh2)) {
            sessionStorage.setItem(cheerKeyCh2, 'true');
            if (cheerMsg) {
                cheerMsg.textContent = 'İnanılmazsın! Bütün görevleri bitirdin ve Büyük Macera Ustası oldun! Hadi şimdi serbest atölyede kendi ritimlerini yarat! 👑🎉';
            }
            modal.style.display = 'flex';
        } else if (ch1Done && !sessionStorage.getItem(cheerKeyCh1)) {
            sessionStorage.setItem(cheerKeyCh1, 'true');
            if (cheerMsg) {
                cheerMsg.textContent = 'Harikasın! 1. Bölümün ritmini tamamladın! Şimdi 2. Bölümdeki sihirli döngüleri ve kararları keşfetme zamanı! 🌟🚀';
            }
            modal.style.display = 'flex';
        }
    }

    triggerLockedFeedback(node) {
        node.classList.remove('is-shaking');
        void node.offsetWidth;
        node.classList.add('is-shaking');

        if (window.RhythmMixer) {
            window.RhythmMixer.playNote('Re', 0.15, 'sawtooth', 0.15);
        }
    }
}

window.AdventurePathUI = AdventurePathUI;

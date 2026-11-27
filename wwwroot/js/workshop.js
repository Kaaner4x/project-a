/**
 * RhythmCode - Free Canvas & Block Workshop Engine (Workshop)
 * Scratch-style block workspace, visual AST interpreter, HTML5 Canvas, and Web Audio API integration.
 */

class WorkshopEngine {
    constructor() {
        this.canvas = document.getElementById('atolyeCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 500;
        this.height = 500;
        this.dpr = window.devicePixelRatio || 1;
        CanvasEngine.setupHiDPI(this.canvas, this.width, this.height);

        // Fırça Durumu
        this.initialState = {
            x: 250,
            y: 250,
            angle: 0, // 0 = Sağa (Doğu)
            color: '#3B82F6',
            penDown: true
        };
        this.brush = { ...this.initialState };

        // Blok Dizisi (Program AST)
        this.program = [];
        this.isRunning = false;
        this.shouldStop = false;
        this.speed = 400; // ms per step (Normal)
        this.activeLoopId = null; // Aktif seçili hedef döngü

        // Çizim İzi Geçmişi (Paths)
        this.lines = [];

        // DOM Referansları
        this.workspaceEl = document.getElementById('workspaceArea');
        this.statusText = document.getElementById('interpreterStatus');
        this.runBtn = document.getElementById('runProgramBtn');
        this.stopBtn = document.getElementById('stopProgramBtn');

        this._setupPaletteEvents();
        this._initCanvas();
    }

    _initCanvas() {
        this.lines = [];
        this.brush = { ...this.initialState };
        this.renderCanvas();
    }

    renderCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Arka Plan Izgarası
        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Hafif kareli defter ızgarası
        this.ctx.strokeStyle = '#F1F5F9';
        this.ctx.lineWidth = 1;
        for (let x = 25; x < this.width; x += 25) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 25; y < this.height; y += 25) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Çizilen çizgileri yeniden oynat
        for (let line of this.lines) {
            this.ctx.save();
            this.ctx.strokeStyle = line.color;
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Fırça İkonu (Çizim yönüne tam hizalı: brush.angle - 90 çünkü yerel fırça ucu +Y eksenindedir)
        CanvasEngine.drawBrush(this.ctx, this.brush.x, this.brush.y, this.brush.angle - 90, 0.8, this.brush.color, this.isRunning);
    }

    _setupPaletteEvents() {
        // Blok Paletinden Tıklama ile Ekleme
        document.querySelectorAll('.palette-block').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const val = item.getAttribute('data-val');
                const label = item.getAttribute('data-label');
                const cat = item.getAttribute('data-category');
                const icon = item.getAttribute('data-icon');

                const newBlock = {
                    id: 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    type,
                    val,
                    label,
                    category: cat,
                    icon,
                    children: type === 'loop' ? [] : undefined
                };

                // Eğer aktif seçili bir döngü varsa ve eklenen blok döngü değilse döngünün içine ekle
                if (this.activeLoopId && type !== 'loop') {
                    const loopBlock = this._findBlockById(this.program, this.activeLoopId);
                    if (loopBlock && loopBlock.type === 'loop') {
                        loopBlock.children = loopBlock.children || [];
                        loopBlock.children.push(newBlock);
                        this.renderWorkspace();
                        if (window.RhythmMixer) window.RhythmMixer.playPop(480);
                        return;
                    }
                }

                // Normal durumda ana program akışına ekle
                this.addBlockToWorkspace(newBlock);
                if (type === 'loop') {
                    // Yeni döngü eklendiğinde onu otomatik aktif yuva yap ki içine blok eklenebilsin
                    this.activeLoopId = newBlock.id;
                    this.renderWorkspace();
                }

                if (window.RhythmMixer) window.RhythmMixer.playPop(450);
            });
        });
    }

    _findBlockById(list, blockId) {
        for (let b of list) {
            if (b.id === blockId) return b;
            if (b.children) {
                const found = this._findBlockById(b.children, blockId);
                if (found) return found;
            }
        }
        return null;
    }

    addBlockToWorkspace(block, parentBlock = null) {
        if (parentBlock && parentBlock.type === 'loop') {
            parentBlock.children = parentBlock.children || [];
            parentBlock.children.push(block);
        } else {
            this.program.push(block);
        }
        this.renderWorkspace();
    }

    toggleLoopActive(loopId) {
        if (this.activeLoopId === loopId) {
            this.activeLoopId = null;
        } else {
            this.activeLoopId = loopId;
        }
        this.renderWorkspace();
        if (window.RhythmMixer) window.RhythmMixer.playPop(400);
    }

    updateLoopCount(loopId, delta) {
        const loop = this._findBlockById(this.program, loopId);
        if (loop && loop.type === 'loop') {
            let current = parseInt(loop.val, 10) || 2;
            current = Math.max(1, Math.min(10, current + delta));
            loop.val = current.toString();
            loop.label = `Tekrarla (${current} kez)`;
            this.renderWorkspace();
            if (window.RhythmMixer) window.RhythmMixer.playPop(350);
        }
    }

    moveBlockUp(blockId) {
        this._moveBlock(blockId, -1);
    }

    moveBlockDown(blockId) {
        this._moveBlock(blockId, 1);
    }

    _moveBlock(blockId, delta) {
        const moveInList = (list) => {
            const idx = list.findIndex(b => b.id === blockId);
            if (idx !== -1) {
                const targetIdx = idx + delta;
                if (targetIdx >= 0 && targetIdx < list.length) {
                    const temp = list[idx];
                    list[idx] = list[targetIdx];
                    list[targetIdx] = temp;
                    return true;
                }
                return false;
            }
            for (let b of list) {
                if (b.children && moveInList(b.children)) return true;
            }
            return false;
        };

        if (moveInList(this.program)) {
            this.renderWorkspace();
            if (window.RhythmMixer) window.RhythmMixer.playPop(380);
        }
    }

    moveBlockOut(blockId) {
        // Döngü içindeki bloğu döngünün dışına (ana listeye) çıkar
        for (let i = 0; i < this.program.length; i++) {
            const b = this.program[i];
            if (b.children) {
                const cIdx = b.children.findIndex(c => c.id === blockId);
                if (cIdx !== -1) {
                    const [item] = b.children.splice(cIdx, 1);
                    this.program.splice(i + 1, 0, item);
                    this.renderWorkspace();
                    if (window.RhythmMixer) window.RhythmMixer.playWhoosh(false);
                    return;
                }
            }
        }
    }

    removeBlock(blockId) {
        if (this.activeLoopId === blockId) {
            this.activeLoopId = null;
        }

        const removeRecursive = (list) => {
            const idx = list.findIndex(b => b.id === blockId);
            if (idx !== -1) {
                list.splice(idx, 1);
                return true;
            }
            for (let b of list) {
                if (b.children && removeRecursive(b.children)) return true;
            }
            return false;
        };

        removeRecursive(this.program);
        this.renderWorkspace();
        if (window.RhythmMixer) window.RhythmMixer.playWhoosh(false);
    }

    clearWorkspace() {
        this.program = [];
        this.activeLoopId = null;
        this.renderWorkspace();
        this.resetCanvas();
        if (window.RhythmMixer) window.RhythmMixer.playWhoosh(false);
    }

    resetCanvas() {
        this.stopExecution();
        this._initCanvas();
        this._setStatus('Tuval sıfırlandı. Fırça merkezde hazır!');
    }

    renderWorkspace() {
        if (!this.workspaceEl) return;
        this.workspaceEl.innerHTML = '';

        if (this.program.length === 0) {
            this.workspaceEl.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <div class="fs-1 mb-2">🧩</div>
                    <h6 class="fw-bold">Kodlama Alanı Boş</h6>
                    <p class="small mb-0">Sol paletten bloklara tıklayarak algoritmaya başla!</p>
                </div>
            `;
            return;
        }

        // Aktif döngü bildirim çubuğu
        if (this.activeLoopId) {
            const activeLoop = this._findBlockById(this.program, this.activeLoopId);
            if (activeLoop) {
                const banner = document.createElement('div');
                banner.className = 'alert alert-warning py-1.5 px-3 mb-2 small d-flex align-items-center justify-content-between rounded-3 border-0 shadow-sm';
                banner.innerHTML = `
                    <div class="d-flex align-items-center gap-1.5 fw-bold">
                        <span>📍</span>
                        <span>'${activeLoop.label}' döngüsünün içine ekleniyor</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-dark py-0 px-2 fw-bold" onclick="window.atolye.toggleLoopActive('${activeLoop.id}')">
                        Döngüden Çık ↩
                    </button>
                `;
                this.workspaceEl.appendChild(banner);
            }
        }

        const buildBlockDOM = (block, isInsideLoop = false, index = 0, total = 1) => {
            const div = document.createElement('div');
            div.id = `dom_${block.id}`;
            const isLoopActive = this.activeLoopId === block.id;
            div.className = `block-item block-${block.category} ${isLoopActive ? 'block-loop-active ring-4' : ''}`;

            let controlsHtml = `
                <div class="d-flex align-items-center gap-1 ms-auto">
                    ${index > 0 ? `<button type="button" class="btn-block-action" title="Yukarı Taşı" onclick="window.atolye.moveBlockUp('${block.id}')">▲</button>` : ''}
                    ${index < total - 1 ? `<button type="button" class="btn-block-action" title="Aşağı Taşı" onclick="window.atolye.moveBlockDown('${block.id}')">▼</button>` : ''}
                    ${isInsideLoop ? `<button type="button" class="btn-block-action" title="Döngüden Çıkar" onclick="window.atolye.moveBlockOut('${block.id}')">⤴</button>` : ''}
                    <button type="button" class="btn-block-action btn-block-delete" title="Sil" onclick="window.atolye.removeBlock('${block.id}')">✕</button>
                </div>
            `;

            let loopCountHtml = '';
            if (block.type === 'loop') {
                const count = parseInt(block.val, 10) || 2;
                loopCountHtml = `
                    <div class="d-flex align-items-center gap-1 bg-black/25 rounded-pill px-2 py-0.5 ms-2">
                        <button type="button" class="btn btn-sm text-white p-0 fw-bold" style="line-height: 1;" onclick="event.stopPropagation(); window.atolye.updateLoopCount('${block.id}', -1)">-</button>
                        <span class="small fw-bold px-1">${count}x</span>
                        <button type="button" class="btn btn-sm text-white p-0 fw-bold" style="line-height: 1;" onclick="event.stopPropagation(); window.atolye.updateLoopCount('${block.id}', 1)">+</button>
                    </div>
                `;
            }

            div.innerHTML = `
                <div class="d-flex align-items-center gap-2 w-100">
                    <span class="fs-5">${block.icon || '🔹'}</span>
                    <span class="fw-bold">${block.label}</span>
                    ${loopCountHtml}
                    ${controlsHtml}
                </div>
            `;

            if (block.type === 'loop') {
                // Döngü içi buton ve konteyner
                const childContainer = document.createElement('div');
                childContainer.className = `loop-inner-container ${isLoopActive ? 'loop-inner-active' : ''}`;
                childContainer.id = `inner_${block.id}`;

                const toggleActiveBtn = document.createElement('button');
                toggleActiveBtn.type = 'button';
                toggleActiveBtn.className = `btn btn-sm ${isLoopActive ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white'} py-1 px-2 w-100 mb-1 rounded-2 small`;
                toggleActiveBtn.innerHTML = isLoopActive ? '✓ Bloklar Buraya Ekleniyor (Seçili)' : '+ Bu Döngünün İçine Blok Ekle';
                toggleActiveBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleLoopActive(block.id);
                };
                childContainer.appendChild(toggleActiveBtn);

                if (block.children && block.children.length > 0) {
                    block.children.forEach((child, cIdx) => {
                        childContainer.appendChild(buildBlockDOM(child, true, cIdx, block.children.length));
                    });
                } else {
                    const emptyTip = document.createElement('div');
                    emptyTip.className = 'text-white/70 small p-2 text-center fst-italic';
                    emptyTip.textContent = isLoopActive 
                        ? '👈 Sol paletten bloklara tıklayarak bu döngünün içine ekle!' 
                        : 'Döngü boş. Yukarıdaki "+ Bu Döngünün İçine Blok Ekle" düğmesine bas!';
                    childContainer.appendChild(emptyTip);
                }

                div.appendChild(childContainer);
            }

            return div;
        };

        this.program.forEach((block, idx) => {
            this.workspaceEl.appendChild(buildBlockDOM(block, false, idx, this.program.length));
        });
    }

    // ==========================================
    // PROGRAM YORUMLAYICISI (INTERPRETER)
    // ==========================================
    async runProgram() {
        if (this.isRunning) return;
        if (this.program.length === 0) {
            this._setStatus('Lütfen önce sol paletten blok ekleyin!');
            return;
        }

        if (window.RhythmMixer) window.RhythmMixer.ensureContext();

        this.isRunning = true;
        this.shouldStop = false;
        this.stepExecutionCount = 0;
        this._updateControls(true);
        this._setStatus('Program yürütülüyor... ▶');

        try {
            await this.executeBlockList(this.program);
            if (!this.shouldStop) {
                this._setStatus('Tebrikler! Algoritma başarıyla tamamlandı 🎉');
                if (window.RhythmMixer) window.RhythmMixer.playSuccess();
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isRunning = false;
            this.shouldStop = false;
            this._updateControls(false);
            this._clearBlockHighlights();
            this.renderCanvas();
        }
    }

    stopExecution() {
        if (!this.isRunning) return;
        this.shouldStop = true;
        this.isRunning = false;
        this._updateControls(false);
        this._clearBlockHighlights();
        this._setStatus('Program durduruldu ⏹');
    }

    setSpeed(speedMs) {
        this.speed = speedMs;
    }

    async executeBlockList(list) {
        for (let block of list) {
            if (this.shouldStop) break;
            await this.executeSingleBlock(block);
        }
    }

    async executeSingleBlock(block) {
        if (this.shouldStop) return;

        // Sonsuz döngü ve aşırı bellek tüketimini önleyen güvenlik koruması (Max 1000 adım)
        this.stepExecutionCount = (this.stepExecutionCount || 0) + 1;
        if (this.stepExecutionCount > 1000) {
            this.shouldStop = true;
            this._setStatus('Program çok fazla adım çalıştırdı (Limit: 1000 adım). Güvenlik için durduruldu.');
            return;
        }

        // Görsel Blok Vurgusu
        this._highlightBlock(block.id);
        this._setStatus(`Çalışıyor: ${block.label}`);

        switch (block.type) {
            case 'forward': {
                const dist = parseInt(block.val, 10) || 50;
                const rad = (this.brush.angle * Math.PI) / 180;
                const newX = this.brush.x + Math.cos(rad) * dist;
                const newY = this.brush.y + Math.sin(rad) * dist;

                const clampedX = Math.max(10, Math.min(this.width - 10, newX));
                const clampedY = Math.max(10, Math.min(this.height - 10, newY));

                this.lines.push({
                    x1: this.brush.x,
                    y1: this.brush.y,
                    x2: clampedX,
                    y2: clampedY,
                    color: this.brush.color
                });

                this.brush.x = clampedX;
                this.brush.y = clampedY;

                if (window.RhythmMixer) window.RhythmMixer.playNote('Do', 0.2, 'sine', 0.2);
                this.renderCanvas();
                await this._wait(this.speed);
                break;
            }

            case 'backward': {
                const dist = parseInt(block.val, 10) || 50;
                const rad = (this.brush.angle * Math.PI) / 180;
                const newX = this.brush.x - Math.cos(rad) * dist;
                const newY = this.brush.y - Math.sin(rad) * dist;

                const clampedX = Math.max(10, Math.min(this.width - 10, newX));
                const clampedY = Math.max(10, Math.min(this.height - 10, newY));

                this.lines.push({
                    x1: this.brush.x,
                    y1: this.brush.y,
                    x2: clampedX,
                    y2: clampedY,
                    color: this.brush.color
                });

                this.brush.x = clampedX;
                this.brush.y = clampedY;

                if (window.RhythmMixer) window.RhythmMixer.playNote('Re', 0.2, 'sine', 0.2);
                this.renderCanvas();
                await this._wait(this.speed);
                break;
            }

            case 'turnRight': {
                const deg = parseInt(block.val, 10) || 90;
                this.brush.angle = (this.brush.angle + deg) % 360;
                if (window.RhythmMixer) window.RhythmMixer.playPop(380);
                this.renderCanvas();
                await this._wait(this.speed * 0.7);
                break;
            }

            case 'turnLeft': {
                const deg = parseInt(block.val, 10) || 90;
                this.brush.angle = (this.brush.angle - deg + 360) % 360;
                if (window.RhythmMixer) window.RhythmMixer.playPop(340);
                this.renderCanvas();
                await this._wait(this.speed * 0.7);
                break;
            }

            case 'color': {
                this.brush.color = block.val || '#3B82F6';
                if (window.RhythmMixer) window.RhythmMixer.playSparkle();
                this.renderCanvas();
                await this._wait(this.speed * 0.6);
                break;
            }

            case 'note': {
                const noteName = block.val || 'Do';
                if (window.RhythmMixer) window.RhythmMixer.playNote(noteName, 0.45, 'triangle', 0.4);
                this.renderCanvas();
                await this._wait(this.speed);
                break;
            }

            case 'loop': {
                const count = parseInt(block.val, 10) || 2;
                const children = block.children || [];
                for (let i = 0; i < count; i++) {
                    if (this.shouldStop) break;
                    this._setStatus(`Döngü (${i + 1} / ${count} tekrar)`);
                    if (window.RhythmMixer) window.RhythmMixer.playPercussion(false);
                    await this.executeBlockList(children);
                }
                break;
            }
        }
    }

    _highlightBlock(blockId) {
        this._clearBlockHighlights();
        const el = document.getElementById(`dom_${blockId}`);
        if (el) el.classList.add('block-running');
    }

    _clearBlockHighlights() {
        document.querySelectorAll('.block-running').forEach(b => b.classList.remove('block-running'));
    }

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _setStatus(text) {
        if (this.statusText) this.statusText.textContent = text;
    }

    _updateControls(running) {
        if (this.runBtn) this.runBtn.disabled = running;
        if (this.stopBtn) this.stopBtn.disabled = !running;
    }

    // ==========================================
    // HAZIR ŞABLONLAR / PRESETS
    // ==========================================
    loadPreset(name) {
        this.clearWorkspace();

        if (name === 'square') {
            // Kare Çiz: 4 Kez (İleri 60 + Sağa 90 + Nota)
            const loopBlock = {
                id: 'p_sq_loop',
                type: 'loop',
                val: '4',
                label: 'Tekrarla (4 kez)',
                category: 'loop',
                icon: '🔁',
                children: [
                    { id: 'p_sq_fwd', type: 'forward', val: '60', label: 'İleri Git (60 px)', category: 'movement', icon: '🔵' },
                    { id: 'p_sq_trn', type: 'turnRight', val: '90', label: 'Sağa Dön (90°)', category: 'turn', icon: '🔄' },
                    { id: 'p_sq_not', type: 'note', val: 'Mi', label: 'Nota Çal: Mi', category: 'sound', icon: '🎵' }
                ]
            };
            this.program.push(loopBlock);
        } else if (name === 'triangle') {
            // Üçgen Dansı: 3 Kez (İleri 80 + Sağa 120 + Nota)
            const loopBlock = {
                id: 'p_tr_loop',
                type: 'loop',
                val: '3',
                label: 'Tekrarla (3 kez)',
                category: 'loop',
                icon: '🔁',
                children: [
                    { id: 'p_tr_fwd', type: 'forward', val: '80', label: 'İleri Git (80 px)', category: 'movement', icon: '🔵' },
                    { id: 'p_tr_trn', type: 'turnRight', val: '120', label: 'Sağa Dön (120°)', category: 'turn', icon: '🔄' },
                    { id: 'p_tr_not', type: 'note', val: 'Sol', label: 'Nota Çal: Sol', category: 'sound', icon: '🎵' }
                ]
            };
            this.program.push(loopBlock);
        } else if (name === 'star') {
            // Renkli Yıldız
            const loopBlock = {
                id: 'p_st_loop',
                type: 'loop',
                val: '5',
                label: 'Tekrarla (5 kez)',
                category: 'loop',
                icon: '🔁',
                children: [
                    { id: 'p_st_fwd', type: 'forward', val: '90', label: 'İleri Git (90 px)', category: 'movement', icon: '🔵' },
                    { id: 'p_st_trn', type: 'turnRight', val: '144', label: 'Sağa Dön (144°)', category: 'turn', icon: '🔄' },
                    { id: 'p_st_not', type: 'note', val: 'Do5', label: 'Nota Çal: Do5', category: 'sound', icon: '🎵' }
                ]
            };
            this.program.push(loopBlock);
        } else if (name === 'musicScale') {
            // Müzik Merdiveni
            const notes = ['Do', 'Re', 'Mi', 'Sol', 'La', 'Do5'];
            notes.forEach((n, i) => {
                this.program.push({
                    id: `p_sc_${i}`,
                    type: 'note',
                    val: n,
                    label: `Nota Çal: ${n}`,
                    category: 'sound',
                    icon: '🎵'
                });
                this.program.push({
                    id: `p_sc_fwd_${i}`,
                    type: 'forward',
                    val: '35',
                    label: 'İleri Git (35 px)',
                    category: 'movement',
                    icon: '🔵'
                });
            });
        }

        this.renderWorkspace();
        this._setStatus(`'${name}' şablonu yüklendi. 'Çalıştır'a bas!`);
    }
}

window.WorkshopEngine = WorkshopEngine;
window.AtolyeEngine = WorkshopEngine;

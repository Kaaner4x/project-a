/**
 * RhythmCode - Progress & Session State Manager (SOLID / SRP)
 * Handles unlocked tasks, completed status, and current active pointer in sessionStorage.
 */
class ProgressManager {
    static STORAGE_KEY = 'puskul_session_progress';

    /**
     * Get the current session progress state
     * @returns {{ completed: number[] }}
     */
    static getProgress() {
        try {
            const raw = sessionStorage.getItem(ProgressManager.STORAGE_KEY);
            if (!raw) {
                return { completed: [], celebrated: [] };
            }
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') {
                return { completed: [], celebrated: [] };
            }
            const completed = Array.isArray(data.completed)
                ? data.completed.filter(n => Number.isInteger(n) && n > 0)
                : [];
            const celebrated = Array.isArray(data.celebrated)
                ? data.celebrated.filter(n => Number.isInteger(n) && n > 0)
                : [];
            return { completed, celebrated };
        } catch {
            return { completed: [], celebrated: [] };
        }
    }

    /**
     * Mark a task as completed in the current session
     * @param {number} taskId
     */
    static completeTask(taskId) {
        const id = parseInt(taskId, 10);
        if (isNaN(id) || id < 1) return;
        const progress = ProgressManager.getProgress();
        if (!progress.completed.includes(id)) {
            progress.completed.push(id);
            try {
                sessionStorage.setItem(ProgressManager.STORAGE_KEY, JSON.stringify(progress));
            } catch (err) {
                console.warn('SessionStorage write error:', err);
            }
        }
    }

    /**
     * Check if a task is marked completed
     * @param {number} taskId
     * @returns {boolean}
     */
    static isTaskCompleted(taskId) {
        const progress = ProgressManager.getProgress();
        return progress.completed.includes(taskId);
    }

    /**
     * Check if a task is unlocked
     * Geliştirme aşamasında tüm levellar serbestçe açık
     * @param {number} taskId
     * @returns {boolean}
     */
    static isTaskUnlocked(taskId) {
        return true;
    }

    /**
     * Finds the currently active task for a given chapter or entire adventure (first unlocked & uncompleted task)
     * If all are completed, defaults to the last task.
     * @param {number} [chapterId] (0, 1 or 2)
     * @returns {number} taskId
     */
    static getActiveTaskForChapter(chapterId) {
        let startId = 1;
        let endId = 22;

        if (chapterId === 1) {
            startId = 1;
            endId = 10;
        } else if (chapterId === 2) {
            startId = 11;
            endId = 22;
        }

        for (let id = startId; id <= endId; id++) {
            if (!ProgressManager.isTaskCompleted(id)) {
                return id;
            }
        }
        return endId; // all completed, highlight the finale
    }

    /**
     * Check if all tasks in a chapter are completed
     * @param {number} chapterId (1 or 2)
     * @returns {boolean}
     */
    static isChapterCompleted(chapterId) {
        const startId = chapterId === 2 ? 11 : 1;
        const endId = chapterId === 2 ? 22 : 10;
        for (let id = startId; id <= endId; id++) {
            if (!ProgressManager.isTaskCompleted(id)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if a chapter celebration has already been shown in this session
     * @param {number} chapterId
     * @returns {boolean}
     */
    static hasCelebratedChapter(chapterId) {
        const progress = ProgressManager.getProgress();
        return Array.isArray(progress.celebrated) && progress.celebrated.includes(chapterId);
    }

    /**
     * Mark a chapter celebration as shown
     * @param {number} chapterId
     */
    static markChapterCelebrated(chapterId) {
        const progress = ProgressManager.getProgress();
        if (!Array.isArray(progress.celebrated)) {
            progress.celebrated = [];
        }
        if (!progress.celebrated.includes(chapterId)) {
            progress.celebrated.push(chapterId);
            try {
                sessionStorage.setItem(ProgressManager.STORAGE_KEY, JSON.stringify(progress));
            } catch (err) {
                console.warn('SessionStorage write error:', err);
            }
        }
    }

    /**
     * Reset progress (useful for clearing session in dev/teacher tests)
     */
    static resetProgress() {
        try {
            sessionStorage.removeItem(ProgressManager.STORAGE_KEY);
        } catch {
            // ignore
        }
    }
}

if (typeof window !== 'undefined') {
    window.ProgressManager = ProgressManager;
}

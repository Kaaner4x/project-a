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
                return { completed: [] };
            }
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.completed)) {
                return { completed: [] };
            }
            return data;
        } catch {
            return { completed: [] };
        }
    }

    /**
     * Mark a task as completed in the current session
     * @param {number} taskId
     */
    static completeTask(taskId) {
        if (!taskId || taskId < 1) return;
        const progress = ProgressManager.getProgress();
        if (!progress.completed.includes(taskId)) {
            progress.completed.push(taskId);
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
     * In unified adventure path mode:
     * - Task 1 (start) is always unlocked
     * - Any other task N is unlocked if task N-1 is completed
     * @param {number} taskId
     * @returns {boolean}
     */
    static isTaskUnlocked(taskId) {
        if (taskId === 1) {
            return true;
        }
        return ProgressManager.isTaskCompleted(taskId - 1);
    }

    /**
     * Finds the currently active task for a given chapter or entire adventure (first unlocked & uncompleted task)
     * If all are completed, defaults to the last task.
     * @param {number} [chapterId] (0, 1 or 2)
     * @returns {number} taskId
     */
    static getActiveTaskForChapter(chapterId) {
        let startId = 1;
        let endId = 20;

        if (chapterId === 1) {
            startId = 1;
            endId = 10;
        } else if (chapterId === 2) {
            startId = 11;
            endId = 20;
        }

        for (let id = startId; id <= endId; id++) {
            if (!ProgressManager.isTaskCompleted(id)) {
                return id;
            }
        }
        return endId; // all completed, highlight the finale
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

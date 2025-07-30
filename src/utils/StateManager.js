/**
 * StateManager - Handles localStorage operations for canvas state
 * Auto-saves and restores user's page building progress
 */
export class StateManager {
  static STORAGE_KEY = 'pagesmith_canvas_state';

  /**
   * Save current canvas state to localStorage
   * @param {Object} state - Canvas state object
   */
  static saveState(state) {
    try {
      const stateToSave = {
        ...state,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  /**
   * Load canvas state from localStorage
   * @returns {Object|null} Saved state or null if not found
   */
  static loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
    return null;
  }

  /**
   * Clear saved state
   */
  static clearState() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear state:', error);
    }
  }

  /**
   * Check if there's a saved state
   * @returns {boolean}
   */
  static hasSavedState() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
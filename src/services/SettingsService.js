/**
 * Service for application settings management.
 * Persists to localStorage. Planner settings consumed by PlannerEngine.
 */

const STORAGE_KEY = 'daily_planner_settings';

const DEFAULT_SETTINGS = Object.freeze({
  dayStart: '08:00',
  dayEnd: '22:00',
  defaultTaskDuration: 30,
  planningStyle: 'balanced',
  notificationsEnabled: true,
  morningBriefingEnabled: true,
  morningBriefingTime: '08:00',
  overdueRemindersEnabled: true,
  notificationPrivacy: 'minimal',
});

class SettingsService {
  constructor() {
    this._cache = null;
  }

  /**
   * Load settings from localStorage, merged with defaults.
   * @returns {object}
   */
  getSettings() {
    if (this._cache) return this._cache;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      this._cache = { ...DEFAULT_SETTINGS, ...stored };
    } catch {
      this._cache = { ...DEFAULT_SETTINGS };
    }

    return this._cache;
  }

  /**
   * Get a single setting value.
   * @param {string} key
   * @returns {*}
   */
  getSetting(key) {
    return this.getSettings()[key];
  }

  /**
   * Update a specific setting.
   * @param {string} key
   * @param {*} value
   */
  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this._save(settings);
  }

  /**
   * Update multiple settings at once.
   * @param {object} updates
   */
  updateSettings(updates) {
    const settings = this.getSettings();
    Object.assign(settings, updates);
    this._save(settings);
  }

  /**
   * Reset all settings to defaults.
   */
  resetToDefaults() {
    this._cache = { ...DEFAULT_SETTINGS };
    this._save(this._cache);
  }

  /**
   * Persist settings to localStorage.
   * @param {object} settings
   * @private
   */
  _save(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      this._cache = settings;
    } catch {
      // Storage full or unavailable — keep in-memory cache
    }
  }
}

export default SettingsService;

/**
 * ThemeManager — handles theme persistence, application, and system theme watching.
 */

const STORAGE_KEY = 'daily-planner-theme';

export class ThemeManager {
  constructor() {
    this._currentTheme = 'system';
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  /**
   * Initialize: read saved theme, apply it, watch for system changes.
   */
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      this._currentTheme = saved;
    }
    this.applyTheme(this._currentTheme);

    this._mediaQuery.addEventListener('change', () => {
      this.applyTheme(this._currentTheme);
    });
  }

  /**
   * Set the theme and persist it.
   * @param {'light'|'dark'|'system'} theme
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
      return;
    }
    this._currentTheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Get the current saved theme preference.
   * @returns {string}
   */
  getTheme() {
    return this._currentTheme;
  }

  /**
   * Apply theme to the document by setting [data-theme] on <html>.
   * @param {string} theme
   */
  applyTheme(theme) {
    const resolved = theme === 'system'
      ? (this._mediaQuery.matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.toggle('ion-palette-dark', resolved === 'dark');
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }
}

export const themeManager = new ThemeManager();
export default themeManager;

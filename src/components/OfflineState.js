/**
 * Offline state component shown when the app has no network connection.
 */

/**
 * Render an offline state indicator.
 * @returns {string} HTML string
 */
export function renderOfflineState() {
  return `
    <div class="offline-state">
      <ion-icon name="cloud-offline-outline" class="offline-state-icon"></ion-icon>
      <h3 class="offline-state-title">You're offline</h3>
      <p class="offline-state-message">
        No internet connection detected. Some features may be limited.
        Your data is saved locally and will sync when you're back online.
      </p>
    </div>
  `;
}

export default renderOfflineState;

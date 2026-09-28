/**
 * Error state component for displaying error messages with retry action.
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render an error state.
 * @param {object} params
 * @param {string} params.message - Error message to display
 * @param {Function} [params.onRetry] - Retry callback function
 * @returns {string} HTML string
 */
export function renderErrorState({ message, onRetry }) {
  const safeMessage = escapeHtml(message);
  const retryBtn = onRetry
    ? `<ion-button fill="outline" size="small" data-action="retry">Retry</ion-button>`
    : '';

  return `
    <div class="error-state">
      <ion-icon name="alert-circle-outline" class="error-state-icon"></ion-icon>
      <h3 class="error-state-title">Something went wrong</h3>
      <p class="error-state-message">${safeMessage}</p>
      ${retryBtn}
    </div>
  `;
}

export default renderErrorState;

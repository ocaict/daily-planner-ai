/**
 * Reusable loading spinner component.
 */

/**
 * Render a centered loading spinner with optional message.
 * @param {string} [message]
 * @returns {string} HTML string
 */
export function renderLoading(message) {
  const messageHtml = message ? `<p>${message}</p>` : '';

  return `
    <div class="loading-container">
      <ion-spinner name="crescent"></ion-spinner>
      ${messageHtml}
    </div>
  `;
}

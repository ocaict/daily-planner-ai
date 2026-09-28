/**
 * AI suggestion chip component.
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
 * Render an AI suggestion chip.
 * @param {string} text - Suggestion prompt text
 * @returns {string} HTML string
 */
export function renderAiSuggestion(text) {
  const safeText = escapeHtml(text);

  return `
    <ion-chip class="ai-suggestion-chip" data-suggestion="${safeText}" data-action="use-suggestion">
      <ion-icon name="sparkles-outline"></ion-icon>
      <ion-label>${safeText}</ion-label>
    </ion-chip>
  `;
}

export default renderAiSuggestion;

/**
 * Section header with optional action button.
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
 * Render a section header.
 * @param {string} title - Section title
 * @param {string} [actionLabel] - Action button label
 * @param {string} [actionIcon] - Action button icon name
 * @returns {string} HTML string
 */
export function renderSectionHeader(title, actionLabel, actionIcon) {
  const safeTitle = escapeHtml(title);
  const actionHtml = actionLabel
    ? `<ion-button fill="clear" size="small" data-action="section-action">${actionIcon ? `<ion-icon name="${actionIcon}" slot="start"></ion-icon>` : ''}${escapeHtml(actionLabel)}</ion-button>`
    : '';

  return `
    <div class="section-header">
      <h2 class="section-title">${safeTitle}</h2>
      ${actionHtml}
    </div>
  `;
}

export default renderSectionHeader;

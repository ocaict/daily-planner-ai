/**
 * Reusable empty state component.
 */

/**
 * Render a centered empty state with icon, title, message, and optional action button.
 * @param {object} params
 * @param {string} params.icon Ionic icon name
 * @param {string} params.title
 * @param {string} [params.message]
 * @param {string} [params.actionLabel]
 * @param {string} [params.actionIcon]
 * @returns {string} HTML string
 */
export function renderEmptyState({ icon, title, message, actionLabel, actionIcon }) {
  const messageHtml = message ? `<p>${message}</p>` : '';
  const actionHtml = actionLabel
    ? `<ion-button fill="clear" data-action="empty-action">${actionIcon ? `<ion-icon name="${actionIcon}" slot="start"></ion-icon>` : ''}${actionLabel}</ion-button>`
    : '';

  return `
    <div class="empty-state">
      <ion-icon name="${icon}" class="empty-state-icon"></ion-icon>
      <h2>${title}</h2>
      ${messageHtml}
      ${actionHtml}
    </div>
  `;
}

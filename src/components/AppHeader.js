/**
 * Reusable Ionic header component.
 */

/**
 * Render an Ionic header with toolbar and optional back button / action buttons.
 * @param {string} title
 * @param {object} [options]
 * @param {boolean} [options.showBackButton=false]
 * @param {Array<{icon: string, label: string, action: string}>} [options.buttons]
 * @returns {string} HTML string
 */
export function renderAppHeader(title, options = {}) {
  const { showBackButton = false, buttons = [] } = options;

  const backButton = showBackButton
    ? '<ion-buttons slot="start"><ion-back-button default-href="/"></ion-back-button></ion-buttons>'
    : '';

  const actionButtons = buttons
    .map(
      (btn) => `<ion-buttons slot="end"><ion-button data-action="${btn.action}" aria-label="${btn.label}"><ion-icon name="${btn.icon}" slot="icon-only"></ion-icon></ion-button></ion-buttons>`
    )
    .join('');

  return `
    <ion-header>
      <ion-toolbar>
        ${backButton}
        <ion-title>${title}</ion-title>
        ${actionButtons}
      </ion-toolbar>
    </ion-header>
  `;
}

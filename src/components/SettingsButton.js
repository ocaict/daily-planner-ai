/**
 * SettingsButton — Floating action button to access settings
 */

export function renderSettingsButton() {
  return `
    <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="bottom: 80px;">
      <ion-fab-button href="/settings" data-nav size="small" aria-label="Settings">
        <ion-icon name="settings-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `;
}

export default renderSettingsButton;

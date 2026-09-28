import { renderConfirmationDialog } from '../components/ConfirmationDialog.js';
import { showToast } from '../components/Toast.js';
import { themeManager } from '../utils/ThemeManager.js';

export class SettingsPage {
  constructor(taskService, categoryService, plannerService, settingsService) {
    this.taskService = taskService;
    this.settingsService = settingsService;
    this.title = 'Settings';
  }

  render() {
    const currentTheme = themeManager.getTheme();
    const settings = this.settingsService ? this.settingsService.getSettings() : {
      dayStart: '08:00', dayEnd: '22:00', defaultTaskDuration: 30, planningStyle: 'balanced',
    };

    return `
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
      </div>
      <div class="page-content">
        <!-- Planning Section -->
        <div class="app-card">
          <h3 class="settings-section-title">Planning</h3>
          <div class="settings-list">
            <div class="setting-row">
              <span class="setting-label">Day starts at</span>
              <input type="time" class="setting-input-time" id="setting-day-start" value="${settings.dayStart}" />
            </div>
            <div class="setting-row">
              <span class="setting-label">Day ends at</span>
              <input type="time" class="setting-input-time" id="setting-day-end" value="${settings.dayEnd}" />
            </div>
            <div class="setting-row">
              <span class="setting-label">Default task duration</span>
              <select id="setting-default-duration" class="setting-select">
                <option value="15" ${settings.defaultTaskDuration === 15 ? 'selected' : ''}>15 min</option>
                <option value="30" ${settings.defaultTaskDuration === 30 ? 'selected' : ''}>30 min</option>
                <option value="45" ${settings.defaultTaskDuration === 45 ? 'selected' : ''}>45 min</option>
                <option value="60" ${settings.defaultTaskDuration === 60 ? 'selected' : ''}>1 hour</option>
                <option value="90" ${settings.defaultTaskDuration === 90 ? 'selected' : ''}>1.5 hours</option>
                <option value="120" ${settings.defaultTaskDuration === 120 ? 'selected' : ''}>2 hours</option>
              </select>
            </div>
            <div class="setting-row">
              <span class="setting-label">Planning style</span>
              <select id="setting-planning-style" class="setting-select">
                <option value="relaxed" ${settings.planningStyle === 'relaxed' ? 'selected' : ''}>Relaxed</option>
                <option value="balanced" ${settings.planningStyle === 'balanced' ? 'selected' : ''}>Balanced</option>
                <option value="strict" ${settings.planningStyle === 'strict' ? 'selected' : ''}>Strict</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Appearance Section -->
        <div class="app-card">
          <h3 class="settings-section-title">Appearance</h3>
          <div class="settings-list">
            <div class="setting-row setting-row--column">
              <span class="setting-label" style="margin-bottom: 8px;">Theme</span>
              <div class="theme-segment" id="setting-theme">
                <button type="button" class="theme-btn ${currentTheme === 'system' ? 'active' : ''}" data-theme="system">System</button>
                <button type="button" class="theme-btn ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">Light</button>
                <button type="button" class="theme-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">Dark</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="app-card">
          <h3 class="settings-section-title">Notifications</h3>
          <div class="settings-list">
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Enable notifications</span>
                <span class="setting-subtext">Master switch for all notifications</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="setting-notifications-enabled" ${settings.notificationsEnabled ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Morning briefing</span>
                <span class="setting-subtext">Daily planning summary</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="setting-morning-briefing" ${settings.morningBriefingEnabled ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-row">
              <span class="setting-label">Briefing time</span>
              <input type="time" class="setting-input-time" id="setting-briefing-time" value="${settings.morningBriefingTime}" />
            </div>
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Overdue reminders</span>
                <span class="setting-subtext">Notify about overdue tasks</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="setting-overdue-reminders" ${settings.overdueRemindersEnabled ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Notification privacy</span>
                <span class="setting-subtext">Show minimal details on lock screen</span>
              </div>
              <select id="setting-notification-privacy" class="setting-select">
                <option value="minimal" ${settings.notificationPrivacy === 'minimal' ? 'selected' : ''}>Minimal</option>
                <option value="full" ${settings.notificationPrivacy === 'full' ? 'selected' : ''}>Full details</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data Section -->
        <div class="app-card">
          <h3 class="settings-section-title">Data</h3>
          <div class="settings-list">
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Export data</span>
                <span class="setting-subtext">Coming in a future update</span>
              </div>
              <button id="setting-export" class="settings-action-btn" type="button">Export</button>
            </div>
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Import / restore data</span>
                <span class="setting-subtext">Coming in a future update</span>
              </div>
              <button id="setting-import" class="settings-action-btn" type="button">Import</button>
            </div>
            <div class="setting-row">
              <div class="setting-text-col">
                <span class="setting-label">Delete all data</span>
                <span class="setting-subtext">Permanently removes all your data</span>
              </div>
              <button id="setting-delete-all" class="settings-action-btn settings-action-btn--danger" type="button">Delete</button>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="app-card">
          <h3 class="settings-section-title">About</h3>
          <div class="settings-list">
            <div class="setting-row">
              <span class="setting-label">App name</span>
              <span class="setting-value">Daily Planner AI</span>
            </div>
            <div class="setting-row">
              <span class="setting-label">Version</span>
              <span class="setting-value">0.1.0</span>
            </div>
            <div class="setting-row">
              <span class="setting-label">Privacy policy</span>
              <a href="#" id="setting-privacy-link" class="setting-link">View</a>
            </div>
            <div class="setting-row">
              <span class="setting-label">Terms of service</span>
              <a href="#" id="setting-terms-link" class="setting-link">View</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterRender(container) {
    // Theme change handler
    const themeButtons = container.querySelectorAll('.theme-btn');
    themeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        themeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        themeManager.setTheme(theme);
      });
    });

    // Planning settings persistence
    const dayStartInput = container.querySelector('#setting-day-start');
    const dayEndInput = container.querySelector('#setting-day-end');
    const durationSelect = container.querySelector('#setting-default-duration');
    const styleSelect = container.querySelector('#setting-planning-style');

    const persistSetting = (key, value) => {
      if (this.settingsService) {
        this.settingsService.updateSetting(key, value);
      }
    };

    if (dayStartInput) {
      dayStartInput.addEventListener('change', () => persistSetting('dayStart', dayStartInput.value));
    }
    if (dayEndInput) {
      dayEndInput.addEventListener('change', () => persistSetting('dayEnd', dayEndInput.value));
    }
    if (durationSelect) {
      durationSelect.addEventListener('change', () => persistSetting('defaultTaskDuration', parseInt(durationSelect.value, 10)));
    }
    if (styleSelect) {
      styleSelect.addEventListener('change', () => persistSetting('planningStyle', styleSelect.value));
    }

    // Notification settings persistence
    const notifEnabled = container.querySelector('#setting-notifications-enabled');
    const morningBriefing = container.querySelector('#setting-morning-briefing');
    const briefingTime = container.querySelector('#setting-briefing-time');
    const overdueReminders = container.querySelector('#setting-overdue-reminders');
    const notifPrivacy = container.querySelector('#setting-notification-privacy');

    if (notifEnabled) {
      notifEnabled.addEventListener('change', () => persistSetting('notificationsEnabled', notifEnabled.checked));
    }
    if (morningBriefing) {
      morningBriefing.addEventListener('change', () => persistSetting('morningBriefingEnabled', morningBriefing.checked));
    }
    if (briefingTime) {
      briefingTime.addEventListener('change', () => persistSetting('morningBriefingTime', briefingTime.value));
    }
    if (overdueReminders) {
      overdueReminders.addEventListener('change', () => persistSetting('overdueRemindersEnabled', overdueReminders.checked));
    }
    if (notifPrivacy) {
      notifPrivacy.addEventListener('change', () => persistSetting('notificationPrivacy', notifPrivacy.value));
    }

    // Delete all data handler
    const deleteBtn = container.querySelector('#setting-delete-all');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        renderConfirmationDialog({
          title: 'Delete All Data',
          message: 'This will permanently remove all your tasks, plans, and settings. This action cannot be undone.',
          confirmLabel: 'Delete',
          cancelLabel: 'Cancel',
          onConfirm: () => {
            showToast('Coming in a future update');
          },
          onCancel: () => {},
        });
      });
    }

    // Export data handler
    const exportBtn = container.querySelector('#setting-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('Coming in a future update');
      });
    }

    // Import data handler
    const importBtn = container.querySelector('#setting-import');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        showToast('Coming in a future update');
      });
    }
  }
}

export default SettingsPage;

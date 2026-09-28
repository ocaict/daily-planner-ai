/**
 * CapacitorNotificationProvider — Android local notifications via Capacitor.
 * Uses @capacitor/local-notifications plugin.
 */

import NotificationProvider from './NotificationProvider.js';

const CHANNELS = {
  TASK_REMINDERS: 'task-reminders',
  PLANNING: 'planning',
  OVERDUE: 'overdue',
};

export class CapacitorNotificationProvider extends NotificationProvider {
  constructor() {
    super();
    this._plugin = null;
    this._channelsCreated = false;
  }

  /**
   * Get the LocalNotifications plugin instance.
   * @private
   */
  _getPlugin() {
    if (this._plugin) return this._plugin;

    try {
      // Capacitor 7+ uses window.Capacitor
      const { LocalNotifications } = window.Capacitor?.Plugins || {};
      if (LocalNotifications) {
        this._plugin = LocalNotifications;
      }
    } catch {
      // Plugin not available
    }

    return this._plugin;
  }

  /**
   * Check if the plugin is available.
   * @returns {boolean}
   */
  isAvailable() {
    return this._getPlugin() !== null;
  }

  async requestPermission() {
    const plugin = this._getPlugin();
    if (!plugin) return { granted: false };

    try {
      const result = await plugin.requestPermissions();
      return { granted: result.display === 'granted' };
    } catch {
      return { granted: false };
    }
  }

  async hasPermission() {
    const plugin = this._getPlugin();
    if (!plugin) return false;

    try {
      const result = await plugin.checkPermissions();
      return result.display === 'granted';
    } catch {
      return false;
    }
  }

  async createChannel(id, name, options = {}) {
    const plugin = this._getPlugin();
    if (!plugin) return;

    try {
      await plugin.createChannel({
        id,
        name,
        description: options.description || '',
        importance: options.importance || 3,
        visibility: options.visibility || 1,
        sound: options.sound || null,
        vibration: options.vibration !== false,
      });
    } catch {
      // Channel may already exist
    }
  }

  async ensureChannels() {
    if (this._channelsCreated) return;

    await this.createChannel(
      CHANNELS.TASK_REMINDERS,
      'Task Reminders',
      { description: 'Reminders for upcoming tasks', importance: 4 }
    );
    await this.createChannel(
      CHANNELS.PLANNING,
      'Planning',
      { description: 'Morning briefing and planning notifications', importance: 3 }
    );
    await this.createChannel(
      CHANNELS.OVERDUE,
      'Overdue',
      { description: 'Overdue task reminders', importance: 4 }
    );

    this._channelsCreated = true;
  }

  async schedule(notification) {
    const plugin = this._getPlugin();
    if (!plugin) return;

    await this.ensureChannels();

    const channelId = notification.channelId || CHANNELS.TASK_REMINDERS;

    try {
      await plugin.schedule({
        notifications: [
          {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            channelId,
            schedule: { at: notification.fireAt },
            extra: notification.extra || {},
          },
        ],
      });
    } catch (error) {
      console.warn('[CapacitorNotificationProvider] Failed to schedule:', error);
    }
  }

  async cancel(id) {
    const plugin = this._getPlugin();
    if (!plugin) return;

    try {
      await plugin.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.warn('[CapacitorNotificationProvider] Failed to cancel:', error);
    }
  }

  async cancelAll() {
    const plugin = this._getPlugin();
    if (!plugin) return;

    try {
      const pending = await plugin.getPending();
      if (pending.notifications.length > 0) {
        await plugin.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.warn('[CapacitorNotificationProvider] Failed to cancel all:', error);
    }
  }

  async getPending() {
    const plugin = this._getPlugin();
    if (!plugin) return [];

    try {
      const result = await plugin.getPending();
      return result.notifications || [];
    } catch {
      return [];
    }
  }
}

export default CapacitorNotificationProvider;

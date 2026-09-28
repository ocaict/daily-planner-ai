/**
 * NotificationProvider — Abstract interface for platform notifications.
 * Implementations: CapacitorNotificationProvider (Android), MockNotificationProvider (dev/test)
 */

export class NotificationProvider {
  /**
   * Request notification permission.
   * @returns {Promise<{granted: boolean}>}
   */
  async requestPermission() {
    throw new Error('Not implemented');
  }

  /**
   * Check if notification permission is granted.
   * @returns {Promise<boolean>}
   */
  async hasPermission() {
    throw new Error('Not implemented');
  }

  /**
   * Create a notification channel.
   * @param {string} id
   * @param {string} name
   * @param {object} [options]
   */
  async createChannel(id, name, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Schedule a notification.
   * @param {object} notification
   * @param {number} notification.id - Unique notification ID
   * @param {string} notification.title
   * @param {string} notification.body
   * @param {Date} notification.fireAt
   * @param {string} [notification.channelId]
   * @param {object} [notification.extra] - Extra data (taskId, etc.)
   * @returns {Promise<void>}
   */
  async schedule(notification) {
    throw new Error('Not implemented');
  }

  /**
   * Cancel a notification by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async cancel(id) {
    throw new Error('Not implemented');
  }

  /**
   * Cancel all scheduled notifications.
   * @returns {Promise<void>}
   */
  async cancelAll() {
    throw new Error('Not implemented');
  }

  /**
   * Get all pending/scheduled notifications.
   * @returns {Promise<Array>}
   */
  async getPending() {
    throw new Error('Not implemented');
  }
}

export default NotificationProvider;

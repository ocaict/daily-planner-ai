/**
 * Service for notification operations.
 * Stage 0 placeholder — all methods throw "Not implemented".
 */
export default class NotificationService {
  /**
   * Request notification permission from the user.
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    throw new Error('Not implemented');
  }

  /**
   * Schedule a notification.
   * @param {object} notification
   * @returns {Promise<string|number>} Notification ID
   */
  async scheduleNotification(notification) {
    throw new Error('Not implemented');
  }

  /**
   * Cancel a scheduled notification.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async cancelNotification(id) {
    throw new Error('Not implemented');
  }
}

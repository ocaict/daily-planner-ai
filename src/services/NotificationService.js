/**
 * NotificationService — Schedules, cancels, and reconciles local notifications.
 * Owns all notification logic. UI and TaskService never call native APIs directly.
 */

import { CapacitorNotificationProvider } from './notifications/CapacitorNotificationProvider.js';
import {
  combineDateTime,
  getCurrentDate,
  getCurrentTime,
  timeToMinutes,
} from '../utils/DateUtils.js';

const CHANNELS = {
  TASK_REMINDERS: 'task-reminders',
  PLANNING: 'planning',
  OVERDUE: 'overdue',
};

export default class NotificationService {
  /**
   * @param {object} dependencies
   * @param {object} dependencies.taskRepository
   * @param {object} dependencies.settingsService
   * @param {object} [dependencies.provider] - NotificationProvider instance
   */
  constructor({ taskRepository, settingsService, provider } = {}) {
    this.taskRepository = taskRepository;
    this.settingsService = settingsService;
    this.provider = provider || new CapacitorNotificationProvider();
    this._initialized = false;
  }

  /**
   * Initialize the notification service.
   * Requests permission and creates channels.
   */
  async initialize() {
    if (this._initialized) return;

    const settings = this.settingsService.getSettings();
    if (settings.notificationsEnabled) {
      const { granted } = await this.provider.requestPermission();
      if (granted) {
        await this.provider.ensureChannels();
      }
    }

    this._initialized = true;
  }

  /**
   * Schedule a task reminder notification.
   * @param {object} task
   * @returns {Promise<void>}
   */
  async scheduleTaskReminder(task) {
    if (!task.reminderEnabled || task.completed) return;
    if (!task.date) return;

    const reminderTime = this._calculateReminderTime(task);
    if (!reminderTime) return;

    if (reminderTime <= new Date()) return;

    const notificationId = this._getNotificationId(task.id);

    await this.provider.schedule({
      id: notificationId,
      title: task.title,
      body: this._buildReminderBody(task),
      fireAt: reminderTime,
      channelId: CHANNELS.TASK_REMINDERS,
      extra: { taskId: task.id, type: 'task-reminder' },
    });
  }

  /**
   * Cancel a task's reminder notification.
   * @param {number|string} taskId
   * @returns {Promise<void>}
   */
  async cancelTaskReminder(taskId) {
    const notificationId = this._getNotificationId(taskId);
    await this.provider.cancel(notificationId);
  }

  /**
   * Update a task's reminder (cancel old, schedule new).
   * @param {object} task
   * @returns {Promise<void>}
   */
  async updateTaskReminder(task) {
    await this.cancelTaskReminder(task.id);
    await this.scheduleTaskReminder(task);
  }

  /**
   * Schedule the morning briefing notification.
   * @returns {Promise<void>}
   */
  async scheduleMorningBriefing() {
    const settings = this.settingsService.getSettings();
    if (!settings.morningBriefingEnabled) return;

    const briefingTime = settings.morningBriefingTime || '08:00';
    const [hours, minutes] = briefingTime.split(':').map(Number);

    const fireAt = new Date();
    fireAt.setHours(hours, minutes, 0, 0);

    if (fireAt <= new Date()) {
      fireAt.setDate(fireAt.getDate() + 1);
    }

    const taskCount = await this._getTodayTaskCount();

    await this.provider.schedule({
      id: 999999,
      title: 'Good morning',
      body: `You have ${taskCount} task${taskCount !== 1 ? 's' : ''} planned today.`,
      fireAt,
      channelId: CHANNELS.PLANNING,
      extra: { type: 'morning-briefing' },
    });
  }

  /**
   * Cancel the morning briefing.
   * @returns {Promise<void>}
   */
  async cancelMorningBriefing() {
    await this.provider.cancel(999999);
  }

  /**
   * Reconcile all notifications with current task state.
   * Called on app start/resume.
   * @returns {Promise<void>}
   */
  async syncScheduledNotifications() {
    const settings = this.settingsService.getSettings();
    if (!settings.notificationsEnabled) return;

    const hasPermission = await this.provider.hasPermission();
    if (!hasPermission) return;

    const tasks = await this.taskRepository.findAll();
    const pending = await this.provider.getPending();
    const pendingIds = new Set(pending.map((n) => n.id));

    for (const task of tasks) {
      if (!task.reminderEnabled || task.completed || !task.date) continue;

      const reminderTime = this._calculateReminderTime(task);
      if (!reminderTime || reminderTime <= new Date()) continue;

      const notificationId = this._getNotificationId(task.id);
      if (!pendingIds.has(notificationId)) {
        await this.scheduleTaskReminder(task);
      }
    }
  }

  /**
   * Calculate the reminder fire time for a task.
   * @param {object} task
   * @returns {Date|null}
   * @private
   */
  _calculateReminderTime(task) {
    const settings = this.settingsService.getSettings();
    const offset = task.reminderMinutesBefore ?? 0;

    if (task.startTime) {
      const taskDateTime = combineDateTime(task.date, task.startTime);
      return new Date(taskDateTime.getTime() - offset * 60000);
    }

    if (task.dueTime) {
      const taskDateTime = combineDateTime(task.date, task.dueTime);
      return new Date(taskDateTime.getTime() - offset * 60000);
    }

    const dayStart = settings.dayStart || '08:00';
    const taskDateTime = combineDateTime(task.date, dayStart);
    return new Date(taskDateTime.getTime() - offset * 60000);
  }

  /**
   * Build the notification body text.
   * @param {object} task
   * @returns {string}
   * @private
   */
  _buildReminderBody(task) {
    if (task.startTime) {
      return `Due at ${task.startTime}`;
    }
    if (task.dueTime) {
      return `Due at ${task.dueTime}`;
    }
    return 'Task reminder';
  }

  /**
   * Get today's task count for morning briefing.
   * @returns {Promise<number>}
   * @private
   */
  async _getTodayTaskCount() {
    try {
      const tasks = await this.taskRepository.findByDate(getCurrentDate());
      return tasks.filter((t) => !t.completed).length;
    } catch {
      return 0;
    }
  }

  /**
   * Generate a stable notification ID from task ID.
   * @param {number|string} taskId
   * @returns {number}
   * @private
   */
  _getNotificationId(taskId) {
    return Number(taskId) + 1000000;
  }

  /**
   * Check if notifications are available on this platform.
   * @returns {boolean}
   */
  isAvailable() {
    return this.provider.isAvailable();
  }
}

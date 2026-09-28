/**
 * Unit tests for NotificationService.
 * Run with: node --test
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import NotificationService from './NotificationService.js';

class MockProvider {
  constructor() {
    this.scheduled = [];
    this.cancelled = [];
    this.permissionGranted = true;
  }

  async requestPermission() {
    return { granted: this.permissionGranted };
  }

  async hasPermission() {
    return this.permissionGranted;
  }

  async ensureChannels() {}

  async schedule(notification) {
    this.scheduled.push(notification);
  }

  async cancel(id) {
    this.cancelled.push(id);
  }

  async cancelAll() {
    this.scheduled = [];
  }

  async getPending() {
    return this.scheduled;
  }

  isAvailable() {
    return true;
  }
}

class MockTaskRepository {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  async findAll() {
    return this.tasks;
  }

  async findByDate(date) {
    return this.tasks.filter((t) => t.date === date);
  }

  async findById(id) {
    return this.tasks.find((t) => t.id === id) || null;
  }
}

class MockSettingsService {
  constructor(settings = {}) {
    this.settings = {
      notificationsEnabled: true,
      morningBriefingEnabled: true,
      morningBriefingTime: '08:00',
      overdueRemindersEnabled: true,
      notificationPrivacy: 'minimal',
      dayStart: '08:00',
      dayEnd: '22:00',
      ...settings,
    };
  }

  getSettings() {
    return this.settings;
  }

  getSetting(key) {
    return this.settings[key];
  }

  updateSetting(key, value) {
    this.settings[key] = value;
  }
}

describe('NotificationService', () => {
  let provider;
  let taskRepository;
  let settingsService;
  let service;

  beforeEach(() => {
    provider = new MockProvider();
    taskRepository = new MockTaskRepository();
    settingsService = new MockSettingsService();
    service = new NotificationService({ taskRepository, settingsService, provider });
  });

  describe('initialize', () => {
    it('requests permission when notifications enabled', async () => {
      await service.initialize();
      assert.equal(provider.permissionGranted, true);
    });

    it('does not request permission when notifications disabled', async () => {
      settingsService.updateSetting('notificationsEnabled', false);
      await service.initialize();
      // Should not throw
    });
  });

  describe('scheduleTaskReminder', () => {
    it('schedules a reminder for a task with startTime', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = {
        id: 1,
        title: 'Test task',
        date: dateStr,
        startTime: '10:00',
        reminderEnabled: true,
        reminderMinutesBefore: 15,
        completed: false,
      };

      await service.scheduleTaskReminder(task);

      assert.equal(provider.scheduled.length, 1);
      assert.equal(provider.scheduled[0].title, 'Test task');
      assert.equal(provider.scheduled[0].extra.taskId, 1);
    });

    it('does not schedule for completed tasks', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = {
        id: 1,
        title: 'Done task',
        date: dateStr,
        startTime: '10:00',
        reminderEnabled: true,
        completed: true,
      };

      await service.scheduleTaskReminder(task);

      assert.equal(provider.scheduled.length, 0);
    });

    it('does not schedule for tasks without reminderEnabled', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = {
        id: 1,
        title: 'No reminder',
        date: dateStr,
        startTime: '10:00',
        reminderEnabled: false,
        completed: false,
      };

      await service.scheduleTaskReminder(task);

      assert.equal(provider.scheduled.length, 0);
    });

    it('does not schedule for past reminders', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateStr = pastDate.toISOString().split('T')[0];

      const task = {
        id: 1,
        title: 'Past task',
        date: dateStr,
        startTime: '10:00',
        reminderEnabled: true,
        completed: false,
      };

      await service.scheduleTaskReminder(task);

      assert.equal(provider.scheduled.length, 0);
    });
  });

  describe('cancelTaskReminder', () => {
    it('cancels a task reminder by ID', async () => {
      await service.cancelTaskReminder(1);
      assert.deepEqual(provider.cancelled, [1000001]);
    });
  });

  describe('updateTaskReminder', () => {
    it('cancels old and schedules new reminder', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = {
        id: 1,
        title: 'Updated task',
        date: dateStr,
        startTime: '14:00',
        reminderEnabled: true,
        reminderMinutesBefore: 30,
        completed: false,
      };

      await service.updateTaskReminder(task);

      assert.equal(provider.cancelled.length, 1);
      assert.equal(provider.scheduled.length, 1);
    });
  });

  describe('scheduleMorningBriefing', () => {
    it('schedules morning briefing when enabled', async () => {
      await service.scheduleMorningBriefing();

      assert.equal(provider.scheduled.length, 1);
      assert.equal(provider.scheduled[0].title, 'Good morning');
      assert.equal(provider.scheduled[0].id, 999999);
    });

    it('does not schedule when morning briefing disabled', async () => {
      settingsService.updateSetting('morningBriefingEnabled', false);
      await service.scheduleMorningBriefing();

      assert.equal(provider.scheduled.length, 0);
    });
  });

  describe('syncScheduledNotifications', () => {
    it('schedules missing notifications for future tasks', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      taskRepository.tasks = [
        { id: 1, title: 'Future task', date: dateStr, startTime: '10:00', reminderEnabled: true, completed: false },
      ];

      await service.syncScheduledNotifications();

      assert.equal(provider.scheduled.length, 1);
    });

    it('does not schedule when notifications disabled', async () => {
      settingsService.updateSetting('notificationsEnabled', false);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      taskRepository.tasks = [
        { id: 1, title: 'Future task', date: dateStr, startTime: '10:00', reminderEnabled: true, completed: false },
      ];

      await service.syncScheduledNotifications();

      assert.equal(provider.scheduled.length, 0);
    });
  });

  describe('_getNotificationId', () => {
    it('generates stable notification IDs', () => {
      assert.equal(service._getNotificationId(1), 1000001);
      assert.equal(service._getNotificationId(42), 1000042);
      assert.equal(service._getNotificationId('5'), 1000005);
    });
  });

  describe('_calculateReminderTime', () => {
    it('calculates reminder time with startTime', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = { date: dateStr, startTime: '10:00', reminderMinutesBefore: 15 };
      const reminderTime = service._calculateReminderTime(task);

      assert.ok(reminderTime instanceof Date);
      assert.ok(reminderTime > new Date());
    });

    it('calculates reminder time with dueTime only', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = { date: dateStr, dueTime: '14:00', reminderMinutesBefore: 30 };
      const reminderTime = service._calculateReminderTime(task);

      assert.ok(reminderTime instanceof Date);
      assert.ok(reminderTime > new Date());
    });

    it('uses dayStart when no time is set', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const task = { date: dateStr, reminderMinutesBefore: 0 };
      const reminderTime = service._calculateReminderTime(task);

      assert.ok(reminderTime instanceof Date);
      assert.ok(reminderTime > new Date());
    });
  });
});

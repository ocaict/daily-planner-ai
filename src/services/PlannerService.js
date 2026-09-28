/**
 * Service for daily planning operations.
 * Connects PlannerEngine to TaskRepository and SettingsService.
 */

import PlannerEngine from './PlannerEngine.js';
import { getCurrentDate } from '../utils/DateUtils.js';

export default class PlannerService {
  /**
   * @param {object} dependencies
   * @param {object} dependencies.taskRepository
   * @param {object} dependencies.settingsService
   */
  constructor({ taskRepository, settingsService } = {}) {
    this.taskRepository = taskRepository;
    this.settingsService = settingsService;
    this.engine = new PlannerEngine();
  }

  /**
   * Generate a proposed plan for a specific date.
   * @param {string} [date] - YYYY-MM-DD, defaults to today
   * @returns {Promise<object>}
   */
  async generateDailyPlan(date = getCurrentDate()) {
    const settings = this.settingsService.getSettings();
    const tasks = await this.taskRepository.findByDate(date);

    const allTasks = await this.taskRepository.findOverdue();
    const planningTasks = [...tasks, ...allTasks.filter((t) => !tasks.find((pt) => pt.id === t.id))];

    const input = {
      date,
      dayStart: settings.dayStart,
      dayEnd: settings.dayEnd,
      tasks: planningTasks,
      existingBlocks: [],
      preferences: { planningStyle: settings.planningStyle },
    };

    return this.engine.generatePlan(input);
  }

  /**
   * Get today's daily plan.
   * @returns {Promise<object>}
   */
  async getTodayPlan() {
    return this.generateDailyPlan(getCurrentDate());
  }

  /**
   * Apply a confirmed plan — updates task times via TaskService.
   * @param {object} plan - The confirmed plan from generateDailyPlan
   * @param {object} taskService - TaskService instance for persistence
   * @returns {Promise<void>}
   */
  async applyPlan(plan, taskService) {
    if (!plan || !plan.scheduledItems) return;

    for (const item of plan.scheduledItems) {
      if (item.task && item.task.startTime !== item.startTime) {
        await taskService.updateTask(item.task.id, {
          startTime: item.startTime,
          dueTime: item.endTime,
        });
      }
    }
  }

  /**
   * Get planner settings.
   * @returns {object}
   */
  getSettings() {
    return this.settingsService.getSettings();
  }

  /**
   * Update planner settings.
   * @param {string} key
   * @param {*} value
   */
  updateSetting(key, value) {
    this.settingsService.updateSetting(key, value);
  }
}

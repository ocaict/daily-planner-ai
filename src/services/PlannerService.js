/**
 * Service for daily planning operations.
 * Stage 0 placeholder — all methods throw "Not implemented".
 */
export default class PlannerService {
  /**
   * @param {object} [dependencies] - Service dependencies (repositories, etc.)
   */
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
  }

  /**
   * Get today's daily plan.
   * @returns {Promise<object|null>}
   */
  async getTodayPlan() {
    throw new Error('Not implemented');
  }

  /**
   * Create a daily plan for a specific date.
   * @param {string|Date} date
   * @returns {Promise<object>}
   */
  async createDailyPlan(date) {
    throw new Error('Not implemented');
  }

  /**
   * Update an existing daily plan.
   * @param {string|number} id
   * @param {object} data
   * @returns {Promise<object>}
   */
  async updateDailyPlan(id, data) {
    throw new Error('Not implemented');
  }
}

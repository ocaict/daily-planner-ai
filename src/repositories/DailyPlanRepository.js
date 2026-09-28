import BaseRepository from './BaseRepository.js';

/**
 * Repository for DailyPlan entities.
 * Stage 0 placeholder — returns empty results.
 */
export default class DailyPlanRepository extends BaseRepository {
  /**
   * @param {object} connection - Database connection instance
   */
  constructor(connection) {
    super(connection);
  }

  /**
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return null;
  }

  /**
   * @returns {Promise<Array>}
   */
  async findAll() {
    return [];
  }

  /**
   * @param {object} entity
   * @returns {Promise<object>}
   */
  async create(entity) {
    return entity;
  }

  /**
   * @param {object} entity
   * @returns {Promise<object>}
   */
  async update(entity) {
    return entity;
  }

  /**
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    return undefined;
  }
}

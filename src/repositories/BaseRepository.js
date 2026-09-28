/**
 * Abstract base class for all repositories.
 * Provides the common interface for CRUD operations.
 * Subclasses must override all methods.
 */
export default class BaseRepository {
  /**
   * @param {object} connection - Database connection instance
   */
  constructor(connection) {
    if (new.target === BaseRepository) {
      throw new Error('BaseRepository is abstract and cannot be instantiated directly');
    }
    this.connection = connection;
  }

  /**
   * Find an entity by its ID.
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Find all entities.
   * @returns {Promise<Array>}
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new entity.
   * @param {object} entity
   * @returns {Promise<object>}
   */
  async create(entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing entity.
   * @param {object} entity
   * @returns {Promise<object>}
   */
  async update(entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete an entity by its ID.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}

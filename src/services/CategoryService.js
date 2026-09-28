import { AppError } from '../utils/ErrorHandler.js';

/**
 * Service for category-related operations.
 */
export default class CategoryService {
  /**
   * @param {import('../repositories/CategoryRepository.js').default} categoryRepository
   */
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  /**
   * Get all categories.
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw new AppError(
        `Failed to get categories: ${error.message}`,
        'Unable to load categories.',
        'CATEGORIES_FETCH_ERROR'
      );
    }
  }

  /**
   * Get a single category by ID.
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async getCategoryById(id) {
    try {
      return await this.categoryRepository.findById(id);
    } catch (error) {
      throw new AppError(
        `Failed to get category ${id}: ${error.message}`,
        'Unable to load category.',
        'CATEGORY_FETCH_ERROR'
      );
    }
  }

  /**
   * Get a Map of category id -> category for quick lookup.
   * @returns {Promise<Map<string|number, object>>}
   */
  async getCategoryMap() {
    const categories = await this.getCategories();
    const map = new Map();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }
}

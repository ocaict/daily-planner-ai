import BaseRepository from './BaseRepository.js';
import { Category } from '../models/Category.js';

export default class CategoryRepository extends BaseRepository {
  constructor(connection) {
    super(connection);
  }

  async findAll() {
    const result = await this.connection.query(
      'SELECT * FROM categories ORDER BY sort_order ASC'
    );
    return result.values.map((row) => Category.fromRow(row));
  }

  async findById(id) {
    const result = await this.connection.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return result.values.length > 0 ? Category.fromRow(result.values[0]) : null;
  }
}

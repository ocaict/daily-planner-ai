import { DatabaseConnection } from './Connection.js';

class DatabaseManager {
  constructor() {
    this._connection = null;
  }

  async initialize() {
    if (this._connection) return;
    this._connection = new DatabaseConnection();
    await this._connection.open();
  }

  getConnection() {
    if (!this._connection) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this._connection;
  }

  async close() {
    if (this._connection) {
      await this._connection.close();
      this._connection = null;
    }
  }
}

export const databaseManager = new DatabaseManager();
export { DatabaseManager };

import { CapacitorSQLite } from '@capacitor-community/sqlite';

const DB_NAME = 'daily_planner.db';

class DatabaseConnection {
  constructor() {
    this._isOpen = false;
  }

  async open() {
    if (this._isOpen) return;
    await CapacitorSQLite.createConnection({ database: DB_NAME });
    await CapacitorSQLite.open({ database: DB_NAME });
    this._isOpen = true;
  }

  async close() {
    if (!this._isOpen) return;
    await CapacitorSQLite.closeConnection({ database: DB_NAME });
    this._isOpen = false;
  }

  async execute(query, params = []) {
    if (params && params.length > 0) {
      return CapacitorSQLite.run({ database: DB_NAME, statement: query, values: params });
    }
    return CapacitorSQLite.execute({ database: DB_NAME, statements: query });
  }

  async run(query, params = []) {
    return CapacitorSQLite.run({ database: DB_NAME, statement: query, values: params });
  }

  async query(query, params = []) {
    return CapacitorSQLite.query({ database: DB_NAME, statement: query, values: params });
  }

  async beginTransaction() {
    return CapacitorSQLite.beginTransaction({ database: DB_NAME });
  }

  async commitTransaction() {
    return CapacitorSQLite.commitTransaction({ database: DB_NAME });
  }

  async rollbackTransaction() {
    return CapacitorSQLite.rollbackTransaction({ database: DB_NAME });
  }

  isOpen() {
    return this._isOpen;
  }
}

export { DatabaseConnection };

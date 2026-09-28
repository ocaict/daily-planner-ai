const v1_initial = {
  version: 1,
  name: 'initial_schema',
  async up(connection) {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schema_version (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        name TEXT NOT NULL,
        applied_at INTEGER NOT NULL
      )
    `);
  },
};

export default v1_initial;

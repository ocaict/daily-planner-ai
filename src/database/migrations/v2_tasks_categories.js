const v2_tasks_categories = {
  version: 2,
  name: 'tasks_and_categories',
  async up(connection) {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT,
        icon TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        notes TEXT,
        date TEXT,
        start_time TEXT,
        due_time TEXT,
        duration_minutes INTEGER,
        priority TEXT DEFAULT 'medium',
        category_id INTEGER,
        reminder_enabled INTEGER DEFAULT 0,
        reminder_minutes_before INTEGER,
        repeat_rule TEXT DEFAULT 'none',
        completed INTEGER DEFAULT 0,
        completed_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date)
    `);

    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)
    `);

    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id)
    `);

    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_updated ON tasks(updated_at)
    `);

    const defaultCategories = [
      { name: 'Work', color: '#4A90D9', icon: 'briefcase', sort_order: 1 },
      { name: 'Personal', color: '#7B61FF', icon: 'person', sort_order: 2 },
      { name: 'Study', color: '#E85D75', icon: 'book', sort_order: 3 },
      { name: 'Health', color: '#2ECC71', icon: 'heart', sort_order: 4 },
      { name: 'Shopping', color: '#F39C12', icon: 'cart', sort_order: 5 },
      { name: 'Finance', color: '#1ABC9C', icon: 'cash', sort_order: 6 },
      { name: 'Other', color: '#95A5A6', icon: 'ellipsis-horizontal', sort_order: 7 },
    ];

    for (const cat of defaultCategories) {
      await connection.execute(
        `INSERT OR IGNORE INTO categories (name, color, icon, sort_order) VALUES (?, ?, ?, ?)`,
        [cat.name, cat.color, cat.icon, cat.sort_order]
      );
    }
  },
};

export default v2_tasks_categories;

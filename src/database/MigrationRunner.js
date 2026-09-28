async function getCurrentVersion(connection) {
  try {
    const result = await connection.query(
      'SELECT version FROM schema_version ORDER BY id DESC LIMIT 1'
    );
    return result.values && result.values.length > 0 ? Number(result.values[0].version) : 0;
  } catch {
    // Table doesn't exist yet — fresh database
    return 0;
  }
}

export async function migrateToLatest(migrations, connection) {
  const currentVersion = await getCurrentVersion(connection);

  const pending = migrations
    .filter((m) => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  if (pending.length === 0) return;

  // NOTE: CapacitorSQLite's execute() wraps DDL in its own internal transaction
  // automatically, so we must NOT nest a manual beginTransaction() around execute()
  // calls. We run each migration sequentially and track version with run() which
  // does NOT auto-wrap.
  for (const migration of pending) {
    try {
      await migration.up(connection);
      await connection.run(
        'INSERT INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)',
        [migration.version, migration.name, Date.now()]
      );
    } catch (error) {
      throw new Error(`Migration "${migration.name}" (v${migration.version}) failed: ${error.message}`);
    }
  }
}

class DailyPlan {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.date = data.date ?? '';
    this.taskIds = data.taskIds ?? [];
    this.notes = data.notes ?? '';
    this.createdAt = data.createdAt ?? Date.now();
  }

  static fromRow(row) {
    return new DailyPlan({
      id: row.id,
      date: row.date,
      taskIds: row.task_ids ? JSON.parse(row.task_ids) : [],
      notes: row.notes,
      createdAt: row.created_at,
    });
  }

  toRow() {
    return {
      id: this.id,
      date: this.date,
      task_ids: JSON.stringify(this.taskIds),
      notes: this.notes,
      created_at: this.createdAt,
    };
  }
}

export { DailyPlan };

import BaseRepository from './BaseRepository.js';
import { Task } from '../models/Task.js';

export default class TaskRepository extends BaseRepository {
  constructor(connection) {
    super(connection);
  }

  async findById(id) {
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return result.values.length > 0 ? Task.fromRow(result.values[0]) : null;
  }

  async findAll() {
    const result = await this.connection.query(
      'SELECT * FROM tasks ORDER BY date ASC, start_time ASC'
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async create(taskOrData) {
    const task = taskOrData instanceof Task ? taskOrData : new Task(taskOrData);
    const row = task.toRow();
    const now = Date.now();
    row.created_at = now;
    row.updated_at = now;

    const result = await this.connection.execute(
      `INSERT INTO tasks (title, description, notes, date, start_time, due_time, duration_minutes, priority, category_id, reminder_enabled, reminder_minutes_before, repeat_rule, completed, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.title,
        row.description,
        row.notes,
        row.date,
        row.start_time,
        row.due_time,
        row.duration_minutes,
        row.priority,
        row.category_id,
        row.reminder_enabled,
        row.reminder_minutes_before,
        row.repeat_rule,
        row.completed,
        row.completed_at,
        row.created_at,
        row.updated_at,
      ]
    );

    task.id = result?.changes?.lastId ?? result?.changes?.id ?? result?.lastId ?? task.id;
    task.createdAt = row.created_at;
    task.updatedAt = row.updated_at;
    return task;
  }

  async update(taskOrId, maybeData) {
    let task;
    if (maybeData !== undefined) {
      task = maybeData instanceof Task ? maybeData : new Task({ ...maybeData, id: taskOrId });
    } else {
      task = taskOrId instanceof Task ? taskOrId : new Task(taskOrId);
    }
    const row = task.toRow();
    row.updated_at = Date.now();

    await this.connection.execute(
      `UPDATE tasks SET title = ?, description = ?, notes = ?, date = ?, start_time = ?, due_time = ?, duration_minutes = ?, priority = ?, category_id = ?, reminder_enabled = ?, reminder_minutes_before = ?, repeat_rule = ?, completed = ?, completed_at = ?, updated_at = ?
       WHERE id = ?`,
      [
        row.title,
        row.description,
        row.notes,
        row.date,
        row.start_time,
        row.due_time,
        row.duration_minutes,
        row.priority,
        row.category_id,
        row.reminder_enabled,
        row.reminder_minutes_before,
        row.repeat_rule,
        row.completed,
        row.completed_at,
        row.updated_at,
        row.id,
      ]
    );

    task.updatedAt = row.updated_at;
    return task;
  }

  async delete(id) {
    await this.connection.execute(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
  }

  async search(searchTerm) {
    const term = `%${searchTerm}%`;
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? OR notes LIKE ?',
      [term, term, term]
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async findByDate(date) {
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE date = ? ORDER BY start_time ASC',
      [date]
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async findOverdue() {
    const today = new Date().toISOString().split('T')[0];
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE completed = 0 AND date < ? ORDER BY date ASC',
      [today]
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async findCompleted() {
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE completed = 1 ORDER BY completed_at DESC'
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async findUpcoming() {
    const today = new Date().toISOString().split('T')[0];
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE completed = 0 AND date > ? ORDER BY date ASC',
      [today]
    );
    return result.values.map((row) => Task.fromRow(row));
  }

  async completeTask(id) {
    const now = Date.now();
    await this.connection.execute(
      'UPDATE tasks SET completed = 1, completed_at = ?, updated_at = ? WHERE id = ?',
      [now, now, id]
    );
  }

  async uncompleteTask(id) {
    const now = Date.now();
    await this.connection.execute(
      'UPDATE tasks SET completed = 0, completed_at = NULL, updated_at = ? WHERE id = ?',
      [now, id]
    );
  }
}

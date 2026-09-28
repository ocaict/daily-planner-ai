class Task {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = (data.title ?? '').trim();
    this.description = data.description ?? '';
    this.notes = data.notes ?? '';
    this.date = data.date || data.dueDate || null;
    this.dueDate = this.date;
    this.startTime = data.startTime || null;
    this.dueTime = data.dueTime || null;
    const rawDuration = data.durationMinutes ?? data.duration;
    this.durationMinutes = rawDuration !== undefined && rawDuration !== null && rawDuration !== '' && !isNaN(Number(rawDuration))
      ? Number(rawDuration)
      : null;
    this.duration = this.durationMinutes;
    this.priority = data.priority ?? 'medium';
    this.categoryId = data.categoryId !== undefined && data.categoryId !== null && data.categoryId !== ''
      ? Number(data.categoryId)
      : null;
    this.reminderEnabled = Boolean(data.reminderEnabled ?? data.hasReminder ?? false);
    this.hasReminder = this.reminderEnabled;
    const rawReminder = data.reminderMinutesBefore ?? data.reminderMinutes;
    this.reminderMinutesBefore = rawReminder !== undefined && rawReminder !== null && rawReminder !== '' && !isNaN(Number(rawReminder))
      ? Number(rawReminder)
      : null;
    this.reminderMinutes = this.reminderMinutesBefore;
    this.repeatRule = data.repeatRule ?? 'none';
    this.completed = Boolean(data.completed ?? false);
    this.completedAt = data.completedAt ?? null;
    this.createdAt = data.createdAt ?? Date.now();
    this.updatedAt = data.updatedAt ?? Date.now();
    this.category = data.category ?? data.categoryName ?? '';
    this.categoryName = data.categoryName ?? data.category ?? '';
    this.categoryColor = data.categoryColor ?? null;
  }

  get isToday() {
    if (this.completed || !this.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return this.date === today;
  }

  get isUpcoming() {
    if (this.completed || !this.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return this.date > today;
  }

  get isOverdue() {
    if (this.completed || !this.date) return false;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (this.date < today) return true;
    if (this.date === today && this.dueTime) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      return this.dueTime < currentTime;
    }
    return false;
  }

  static fromRow(row) {
    return new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      notes: row.notes,
      date: row.date,
      startTime: row.start_time,
      dueTime: row.due_time,
      durationMinutes: row.duration_minutes,
      priority: row.priority,
      categoryId: row.category_id,
      category: row.category_name || row.category || '',
      categoryName: row.category_name || row.category || '',
      categoryColor: row.category_color || null,
      reminderEnabled: Boolean(row.reminder_enabled),
      reminderMinutesBefore: row.reminder_minutes_before,
      repeatRule: row.repeat_rule,
      completed: Boolean(row.completed),
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  toRow() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      notes: this.notes,
      date: this.date,
      start_time: this.startTime,
      due_time: this.dueTime,
      duration_minutes: this.durationMinutes,
      priority: this.priority,
      category_id: this.categoryId,
      reminder_enabled: this.reminderEnabled ? 1 : 0,
      reminder_minutes_before: this.reminderMinutesBefore,
      repeat_rule: this.repeatRule,
      completed: this.completed ? 1 : 0,
      completed_at: this.completedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Title must be 200 characters or fewer');
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(this.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }

    if (this.durationMinutes !== null && (isNaN(this.durationMinutes) || this.durationMinutes <= 0)) {
      errors.push('Duration must be a positive number');
    }

    const validRepeatRules = ['none', 'daily', 'weekly', 'monthly'];
    if (!validRepeatRules.includes(this.repeatRule)) {
      errors.push(`Repeat rule must be one of: ${validRepeatRules.join(', ')}`);
    }

    if (this.reminderEnabled && (this.reminderMinutesBefore === null || this.reminderMinutesBefore < 0)) {
      errors.push('Reminder minutes before must be a non-negative number');
    }

    return errors;
  }
}

export { Task };

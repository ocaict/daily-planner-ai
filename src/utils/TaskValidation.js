/**
 * Standalone task validation utilities.
 */

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_REPEAT_RULES = ['none', 'daily', 'weekly', 'monthly'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Validate task data.
 * @param {object} data
 * @returns {{isValid: boolean, errors: string[]}}
 */
export function validateTaskData(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Task data is required'] };
  }

  // Title validation
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Title is required');
  } else if (data.title.trim().length > 200) {
    errors.push('Title must be at most 200 characters');
  }

  // Priority validation
  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  // Duration validation
  const rawDuration = data.durationMinutes ?? data.duration;
  if (rawDuration !== undefined && rawDuration !== null && rawDuration !== '') {
    const duration = Number(rawDuration);
    if (isNaN(duration) || duration <= 0) {
      errors.push('Duration must be a positive number');
    } else if (duration > 1440) {
      errors.push('Duration must be at most 1440 minutes (24 hours)');
    }
  }

  // Repeat rule validation
  if (data.repeatRule !== undefined && !VALID_REPEAT_RULES.includes(data.repeatRule)) {
    errors.push('Repeat rule must be none, daily, weekly, or monthly');
  }

  // Reminder validation
  if (data.reminderEnabled || data.hasReminder) {
    const rawReminder = data.reminderMinutesBefore ?? data.reminderMinutes;
    if (rawReminder !== undefined && rawReminder !== null && rawReminder !== '') {
      const reminder = Number(rawReminder);
      if (isNaN(reminder) || reminder < 0) {
        errors.push('Reminder minutes must be a non-negative number');
      }
    }
  }

  // Date validation
  const dateVal = data.date || data.dueDate;
  if (dateVal !== undefined && dateVal !== null && dateVal !== '') {
    if (!DATE_REGEX.test(dateVal)) {
      errors.push('Date must be in YYYY-MM-DD format');
    } else {
      const date = new Date(dateVal);
      if (isNaN(date.getTime())) {
        errors.push('Date is not a valid calendar date');
      }
    }
  }

  // Time validation
  if (data.dueTime !== undefined && data.dueTime !== null && data.dueTime !== '') {
    if (!TIME_REGEX.test(data.dueTime)) {
      errors.push('Time must be in HH:MM format');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Sanitize task data by trimming strings, converting types, and normalizing aliases.
 * @param {object} data
 * @returns {object}
 */
export function sanitizeTaskData(data) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const allowedFields = [
    'id', 'title', 'description', 'notes', 'completed', 'priority',
    'date', 'dueDate', 'startTime', 'dueTime', 'categoryId',
    'duration', 'durationMinutes', 'repeatRule',
    'hasReminder', 'reminderEnabled', 'reminderMinutes', 'reminderMinutesBefore',
    'createdAt', 'updatedAt',
  ];

  const sanitized = {};

  for (const field of allowedFields) {
    if (data[field] === undefined) continue;

    let value = data[field];

    // Trim string values
    if (typeof value === 'string') {
      value = value.trim();
    }

    // Convert boolean fields
    if (field === 'completed' || field === 'reminderEnabled' || field === 'hasReminder') {
      value = Boolean(value);
    }

    // Convert numeric fields
    if (
      field === 'duration' ||
      field === 'durationMinutes' ||
      field === 'reminderMinutes' ||
      field === 'reminderMinutesBefore' ||
      field === 'categoryId'
    ) {
      if (value !== null && value !== '') {
        const num = Number(value);
        if (!isNaN(num)) {
          value = num;
        }
      }
    }

    sanitized[field] = value;
  }

  // Normalize aliases
  if (sanitized.date && !sanitized.dueDate) sanitized.dueDate = sanitized.date;
  if (sanitized.dueDate && !sanitized.date) sanitized.date = sanitized.dueDate;
  if (sanitized.duration && !sanitized.durationMinutes) sanitized.durationMinutes = sanitized.duration;
  if (sanitized.hasReminder !== undefined && sanitized.reminderEnabled === undefined) sanitized.reminderEnabled = sanitized.hasReminder;
  if (sanitized.reminderMinutes && !sanitized.reminderMinutesBefore) sanitized.reminderMinutesBefore = sanitized.reminderMinutes;

  return sanitized;
}

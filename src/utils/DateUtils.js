/**
 * Date utility functions.
 */

/**
 * Format a date as 'YYYY-MM-DD' or 'MMM D, YYYY'.
 * @param {Date} date
 * @param {'iso'|'display'} [format='iso']
 * @returns {string}
 */
export function formatDate(date, format = 'iso') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  if (format === 'display') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month]} ${day}, ${year}`;
  }

  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Check if a date is today.
 * @param {Date} date
 * @returns {boolean}
 */
export function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

/**
 * Check if a date is tomorrow.
 * @param {Date} date
 * @returns {boolean}
 */
export function isTomorrow(date) {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate();
}

/**
 * Check if a date is yesterday.
 * @param {Date} date
 * @returns {boolean}
 */
export function isYesterday(date) {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
}

/**
 * Get the start of a day (00:00:00.000).
 * @param {Date} date
 * @returns {Date}
 */
export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of a day (23:59:59.999).
 * @param {Date} date
 * @returns {Date}
 */
export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get a relative label for a date: 'Today', 'Tomorrow', 'Yesterday', or formatted.
 * @param {Date} date
 * @returns {string}
 */
export function getRelativeLabel(date) {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date, 'display');
}

/**
 * Get the current date as a YYYY-MM-DD string.
 * @returns {string}
 */
export function getCurrentDate() {
  return formatDate(new Date(), 'iso');
}

/**
 * Get the current time as a HH:MM string.
 * @returns {string}
 */
export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Convert a 24-hour time string (HH:MM) to 12-hour format.
 * @param {string} time24 - Time in HH:MM format
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
export function formatTime12h(time24) {
  if (!time24 || typeof time24 !== 'string') return '';

  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return '';

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Check if a task is overdue (incomplete and date/time in the past).
 * @param {string} date - YYYY-MM-DD format
 * @param {string} [time] - HH:MM format
 * @param {boolean} [completed=false]
 * @returns {boolean}
 */
export function isOverdue(date, time, completed = false) {
  if (completed) return false;
  if (!date) return false;

  const now = new Date();

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    const dueDate = new Date(date);
    dueDate.setHours(hours, minutes, 0, 0);
    return dueDate < now;
  }

  // If no time, check if the date is before today
  const dueDate = new Date(date);
  dueDate.setHours(23, 59, 59, 999);
  return dueDate < now;
}

/**
 * Combine a date (YYYY-MM-DD) and time (HH:MM) into a Date object.
 * @param {string} date - YYYY-MM-DD format
 * @param {string} time - HH:MM format
 * @returns {Date}
 */
export function combineDateTime(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

/**
 * Get the Monday of the week containing the given date.
 * @param {Date} date
 * @returns {Date}
 */
export function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Add days to a date.
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Get the number of days in a month.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week for the first day of a month (0 = Sunday).
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Convert minutes since midnight to HH:MM string.
 * @param {number} minutes
 * @returns {string}
 */
export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Convert HH:MM string to minutes since midnight.
 * @param {string} time
 * @returns {number}
 */
export function timeToMinutes(time) {
  if (!time || typeof time !== 'string') return 0;
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Check if two dates are the same day.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * Check if a date is before another date (day-level).
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isBefore(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return da < db;
}

/**
 * Check if a date is after another date (day-level).
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isAfter(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return da > db;
}

/**
 * Get the difference in days between two dates.
 * @param {Date} a
 * @param {Date} b
 * @returns {number}
 */
export function diffInDays(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

/**
 * Get the start of a week containing the given date (Monday).
 * @param {Date} date
 * @returns {Date}
 */
export function startOfWeek(date) {
  return getStartOfWeek(date);
}

/**
 * Get the end of a week containing the given date (Sunday).
 * @param {Date} date
 * @returns {Date}
 */
export function endOfWeek(date) {
  const start = getStartOfWeek(date);
  const end = addDays(start, 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get all dates in a month grid (including leading/trailing days from adjacent months).
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {Array<{date: Date, inMonth: boolean, dateKey: string}>}
 */
export function getMonthGrid(year, month) {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const cells = [];

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const d = new Date(year, month - 1, day);
    cells.push({ date: d, inMonth: false, dateKey: formatDate(d, 'iso') });
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    cells.push({ date: d, inMonth: true, dateKey: formatDate(d, 'iso') });
  }

  // Trailing days from next month to fill 6 rows (42 cells)
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const d = new Date(year, month + 1, day);
    cells.push({ date: d, inMonth: false, dateKey: formatDate(d, 'iso') });
  }

  return cells;
}

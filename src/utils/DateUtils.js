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

/**
 * Calendar month grid component.
 */

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDateKey(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

/**
 * Render a calendar month grid.
 * @param {number} year - Full year (e.g. 2026)
 * @param {number} month - 0-indexed month (0 = January)
 * @param {string} selectedDate - Selected date key 'YYYY-MM-DD'
 * @param {Map<string, number>} tasksByDay - Map of 'YYYY-MM-DD' to task count
 * @returns {string} HTML string
 */
export function renderCalendarGrid(year, month, selectedDate, tasksByDay) {
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build 6x7 grid cells
  const cells = [];

  // Leading empty cells from previous month
  for (let i = 0; i < firstDay; i++) {
    cells.push('<div class="calendar-cell calendar-cell--empty"></div>');
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    const isToday = dateKey === todayKey;
    const isSelected = dateKey === selectedDate;
    const taskCount = tasksByDay.get(dateKey) || 0;
    const hasTasks = taskCount > 0;

    const classes = ['calendar-cell'];
    if (isToday) classes.push('calendar-cell--today');
    if (isSelected) classes.push('calendar-cell--selected');
    if (hasTasks) classes.push('calendar-cell--has-tasks');

    const taskDots = hasTasks
      ? `<span class="calendar-cell-dots">${'\u2022'.repeat(Math.min(taskCount, 3))}</span>`
      : '';

    cells.push(`
      <div class="${classes.join(' ')}" data-date="${dateKey}">
        <span class="calendar-cell-day">${day}</span>
        ${taskDots}
      </div>
    `);
  }

  // Trailing empty cells to complete 6 rows
  const totalCells = cells.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 0; i < remaining; i++) {
    cells.push('<div class="calendar-cell calendar-cell--empty"></div>');
  }

  // Ensure exactly 42 cells (6 rows)
  while (cells.length < 42) {
    cells.push('<div class="calendar-cell calendar-cell--empty"></div>');
  }

  const dayHeader = DAY_NAMES.map((d) => `<div class="calendar-day-header">${d}</div>`).join('');
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  return `
    <div class="calendar-grid">
      <div class="calendar-header">
        <ion-button fill="clear" size="small" class="calendar-nav-btn" data-action="prev-month">
          <ion-icon name="chevron-back-outline" slot="icon-only"></ion-icon>
        </ion-button>
        <span class="calendar-month-label">${escapeHtml(monthLabel)}</span>
        <ion-button fill="clear" size="small" class="calendar-nav-btn" data-action="next-month">
          <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
      <div class="calendar-dow-row">
        ${dayHeader}
      </div>
      <div class="calendar-cells">
        ${cells.join('')}
      </div>
    </div>
  `;
}

export default renderCalendarGrid;

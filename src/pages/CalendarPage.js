/**
 * Calendar Page — Full calendar view with month navigation and day details.
 * Stage 1: UI only with mock data.
 */

import { renderCalendarGrid } from '../components/CalendarGrid.js';
import { formatDate, isToday } from '../utils/DateUtils.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Generate mock task data for a given month.
 * @param {number} year - Full year (e.g. 2026)
 * @param {number} month - 0-indexed month (0-11)
 * @returns {Object} Map of "YYYY-MM-DD" to task arrays
 */
function generateMockTasks(year, month) {
  const tasks = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const taskTemplates = [
    ['Team standup', 'Review PRs'],
    ['Gym session'],
    ['Project meeting', 'Update roadmap'],
    ['Dentist appointment'],
    ['Coffee with Sarah', 'Discuss proposal'],
    ['Weekly review', 'Plan next week'],
    ['Submit report'],
    ['Call mom', 'Grocery run'],
  ];

  const taskDays = [2, 5, 8, 12, 15, 18, 21, 24, 27];

  for (let i = 0; i < taskDays.length; i++) {
    const day = taskDays[i];
    if (day <= daysInMonth) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const template = taskTemplates[i % taskTemplates.length];
      tasks[dateKey] = template.map((title, j) => ({
        title,
        completed: (i + j) % 2 === 0,
      }));
    }
  }

  return tasks;
}

export class CalendarPage {
  constructor() {
    this.title = 'Calendar';
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this.tasksByDay = {};

    this._onGridClick = this._onGridClick.bind(this);
    this._onToday = this._onToday.bind(this);
  }

  render() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const selectedKey = formatDate(this.selectedDate, 'iso');

    this.tasksByDay = generateMockTasks(year, month);
    const tasksMap = new Map(Object.entries(this.tasksByDay));

    const gridHtml = renderCalendarGrid(year, month, selectedKey, tasksMap);
    const detailHtml = this._renderDayDetail();

    return `
      <div class="page-header">
        <h1 class="page-title">Calendar</h1>
        <ion-button fill="clear" data-action="today" aria-label="Go to today">
          <ion-icon name="today-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
      <div class="page-content">
        <div class="calendar-grid-container">
          ${gridHtml}
        </div>
        <div class="day-detail-container">
          ${detailHtml}
        </div>
      </div>
    `;
  }

  afterRender(container) {
    // Grid clicks (nav buttons + day cells) via delegation —
    // the grid innerHTML is replaced on month change, so we listen
    // on the stable container element.
    const gridContainer = container.querySelector('.calendar-grid-container');
    if (gridContainer) {
      gridContainer.addEventListener('click', this._onGridClick);
    }

    // Today button (stable element in page header)
    const todayBtn = container.querySelector('[data-action="today"]');
    if (todayBtn) todayBtn.addEventListener('click', this._onToday);
  }

  _onGridClick(event) {
    const prevBtn = event.target.closest('[data-action="prev-month"]');
    const nextBtn = event.target.closest('[data-action="next-month"]');
    const dayCell = event.target.closest('[data-date]');

    if (prevBtn) {
      this._onPrevMonth();
    } else if (nextBtn) {
      this._onNextMonth();
    } else if (dayCell) {
      this._onDayClick(dayCell);
    }
  }

  _onPrevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this._refreshGrid();
  }

  _onNextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this._refreshGrid();
  }

  _onToday() {
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this._refreshGrid();
    this._refreshDetail();
  }

  _onDayClick(dayCell) {
    const dateStr = dayCell.getAttribute('data-date');
    if (!dateStr) return;

    const [year, month, day] = dateStr.split('-').map(Number);
    const clickedDate = new Date(year, month - 1, day);

    // If the clicked date is outside the visible month, navigate to it
    if (
      year !== this.currentMonth.getFullYear() ||
      month - 1 !== this.currentMonth.getMonth()
    ) {
      this.currentMonth = new Date(year, month - 1, 1);
    }

    this.selectedDate = clickedDate;
    this._refreshGrid();
    this._refreshDetail();
  }

  _refreshGrid() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const selectedKey = formatDate(this.selectedDate, 'iso');

    this.tasksByDay = generateMockTasks(year, month);
    const tasksMap = new Map(Object.entries(this.tasksByDay));

    const gridContainer = document.querySelector('.calendar-grid-container');
    if (gridContainer) {
      gridContainer.innerHTML = renderCalendarGrid(year, month, selectedKey, tasksMap);
    }
  }

  _refreshDetail() {
    const container = document.querySelector('.day-detail-container');
    if (container) {
      container.innerHTML = this._renderDayDetail();
    }
  }

  _renderDayDetail() {
    const dateKey = formatDate(this.selectedDate, 'iso');
    const tasks = this.tasksByDay[dateKey] || [];
    const today = isToday(this.selectedDate);
    const dateLabel = today ? 'Today' : formatDate(this.selectedDate, 'display');

    if (tasks.length === 0) {
      return `
        <div class="app-card">
          <div class="day-detail-header">
            <h3>${dateLabel}</h3>
          </div>
          <div class="empty-state" style="padding: var(--app-spacing-lg);">
            <ion-icon name="calendar-outline"></ion-icon>
            <p>No tasks for this day</p>
          </div>
        </div>
      `;
    }

    const taskItems = tasks
      .map(
        (task) => `
        <ion-item>
          <ion-checkbox slot="start" ${task.completed ? 'checked' : ''} disabled></ion-checkbox>
          <ion-label class="${task.completed ? 'task-completed' : ''}">${task.title}</ion-label>
        </ion-item>
      `
      )
      .join('');

    return `
      <div class="app-card">
        <div class="day-detail-header">
          <h3>${dateLabel}</h3>
          <span class="app-text-muted app-text-sm">${tasks.length} task${tasks.length !== 1 ? 's' : ''}</span>
        </div>
        <ion-list>
          ${taskItems}
        </ion-list>
      </div>
    `;
  }
}

export default CalendarPage;

/**
 * Calendar Page — Full calendar view with month navigation and day details.
 * Stage 3: Connected to real task data via TaskService.
 */

import { renderCalendarGrid } from '../components/CalendarGrid.js';
import { formatDate, isToday, getMonthGrid } from '../utils/DateUtils.js';
import { openTaskFormModal } from '../components/TaskFormModal.js';
import { openTaskDetailModal } from '../components/TaskDetailModal.js';
import { showToast } from '../components/Toast.js';

export class CalendarPage {
  constructor(taskService, categoryService, plannerService, settingsService) {
    this.taskService = taskService;
    this.categoryService = categoryService;
    this.plannerService = plannerService;
    this.settingsService = settingsService;
    this.title = 'Calendar';
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this.tasksByDay = {};
    this.isLoading = false;

    this._onGridClick = this._onGridClick.bind(this);
    this._onToday = this._onToday.bind(this);
    this._onAddTask = this._onAddTask.bind(this);
  }

  async loadData() {
    this.isLoading = true;
    try {
      const tasks = await this.taskService.getTasks();
      this.tasksByDay = this._groupTasksByDay(tasks);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
      this.tasksByDay = {};
    }
    this.isLoading = false;
  }

  _groupTasksByDay(tasks) {
    const map = {};
    for (const task of tasks) {
      if (!task.date) continue;
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }

  render() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const selectedKey = formatDate(this.selectedDate, 'iso');

    const tasksMap = new Map();
    for (const [dateKey, tasks] of Object.entries(this.tasksByDay)) {
      tasksMap.set(dateKey, tasks.length);
    }

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

  async afterRender(container) {
    await this.loadData();
    this._refreshGrid();
    this._refreshDetail();

    const gridContainer = container.querySelector('.calendar-grid-container');
    if (gridContainer) {
      gridContainer.addEventListener('click', this._onGridClick);
    }

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

    const tasksMap = new Map();
    for (const [dateKey, tasks] of Object.entries(this.tasksByDay)) {
      tasksMap.set(dateKey, tasks.length);
    }

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

    const addBtn = `
      <ion-button fill="clear" size="small" data-action="add-task" aria-label="Add task">
        <ion-icon name="add-circle-outline" slot="icon-only"></ion-icon>
      </ion-button>
    `;

    if (tasks.length === 0) {
      return `
        <div class="app-card">
          <div class="day-detail-header">
            <h3>${dateLabel}</h3>
            ${addBtn}
          </div>
          <div class="empty-state" style="padding: var(--app-spacing-lg);">
            <ion-icon name="calendar-outline"></ion-icon>
            <p>No tasks for this day</p>
          </div>
        </div>
      `;
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      if (a.startTime) return -1;
      if (b.startTime) return 1;
      return 0;
    });

    const taskItems = sortedTasks
      .map(
        (task) => `
        <ion-item data-task-id="${task.id}">
          <ion-checkbox slot="start" ${task.completed ? 'checked' : ''} disabled></ion-checkbox>
          <ion-label class="${task.completed ? 'task-completed' : ''}">
            <h3>${this._escapeHtml(task.title)}</h3>
            ${task.startTime ? `<p>${task.startTime}${task.durationMinutes ? ' · ' + task.durationMinutes + 'min' : ''}</p>` : ''}
            ${task.priority ? `<p class="task-priority priority-${task.priority}">${task.priority}</p>` : ''}
          </ion-label>
        </ion-item>
      `
      )
      .join('');

    return `
      <div class="app-card">
        <div class="day-detail-header">
          <h3>${dateLabel}</h3>
          ${addBtn}
        </div>
        <ion-list>
          ${taskItems}
        </ion-list>
      </div>
    `;
  }

  _onAddTask() {
    const dateKey = formatDate(this.selectedDate, 'iso');
    openTaskFormModal({
      defaultDate: dateKey,
      onSave: async (taskData) => {
        await this.taskService.createTask(taskData);
        showToast('Task created successfully', 'success');
        await this.loadData();
        this._refreshGrid();
        this._refreshDetail();
      },
      onCancel: () => {},
    });
  }

  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  destroy() {
    this.tasksByDay = {};
  }
}

export default CalendarPage;

/**
 * Calendar Page — Full calendar view with month navigation and day details.
 * Stage 3: Connected to real task data via TaskService.
 * Uses native HTML + inline SVGs (no ion-button/ion-icon) for Android webview compatibility.
 */

import { renderCalendarGrid } from '../components/CalendarGrid.js';
import { formatDate, isToday } from '../utils/DateUtils.js';
import { openTaskFormModal } from '../components/TaskFormModal.js';
import { openTaskDetailModal } from '../components/TaskDetailModal.js';
import { showToast } from '../components/Toast.js';

const ICONS = {
  today: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
    <rect x="48" y="80" width="416" height="384" rx="48" stroke="currentColor" stroke-width="32" fill="none"/>
    <circle cx="296" cy="232" r="24" fill="currentColor"/>
    <circle cx="376" cy="232" r="24" fill="currentColor"/>
    <circle cx="296" cy="312" r="24" fill="currentColor"/>
    <circle cx="216" cy="312" r="24" fill="currentColor"/>
    <circle cx="376" cy="312" r="24" fill="currentColor"/>
    <circle cx="216" cy="392" r="24" fill="currentColor"/>
    <circle cx="296" cy="392" r="24" fill="currentColor"/>
    <line x1="128" y1="48" x2="128" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="384" y1="48" x2="384" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="48" y1="160" x2="464" y2="160" stroke="currentColor" stroke-width="32"/>
  </svg>`,
  add: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
    <line x1="256" y1="112" x2="256" y2="400" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
    <line x1="112" y1="256" x2="400" y2="256" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
  </svg>`,
  chevronForward: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
    <polyline points="184 112 328 256 184 400" stroke="currentColor" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  calendar: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
    <rect x="48" y="80" width="416" height="384" rx="48" stroke="currentColor" stroke-width="32" fill="none"/>
    <line x1="128" y1="48" x2="128" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="384" y1="48" x2="384" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="48" y1="160" x2="464" y2="160" stroke="currentColor" stroke-width="32"/>
  </svg>`,
};

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
        <button class="page-action-btn" data-action="today" aria-label="Go to today">
          ${ICONS.today}
        </button>
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

    const addBtn = container.querySelector('[data-action="add-task"]');
    if (addBtn) addBtn.addEventListener('click', this._onAddTask);
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
      <button class="page-action-btn" data-action="add-task" aria-label="Add task">
        ${ICONS.add}
      </button>
    `;

    if (tasks.length === 0) {
      return `
        <div class="app-card">
          <div class="day-detail-header">
            <h3>${dateLabel}</h3>
            ${addBtn}
          </div>
          <div class="empty-state" style="padding: var(--app-spacing-lg);">
            ${ICONS.calendar}
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
        <div class="task-item" data-task-id="${task.id}">
          <div class="task-item-checkbox ${task.completed ? 'task-item-checkbox--done' : ''}">
            ${task.completed
              ? '<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"><polyline points="176 176 272 272 480 64" stroke="currentColor" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
              : ''}
          </div>
          <div class="task-item-body">
            <div class="task-item-title ${task.completed ? 'task-completed' : ''}">${this._escapeHtml(task.title)}</div>
            ${task.startTime ? `<div class="task-item-meta">${task.startTime}${task.durationMinutes ? ' · ' + task.durationMinutes + 'min' : ''}</div>` : ''}
            ${task.priority ? `<div class="task-item-priority priority-${task.priority}">${task.priority}</div>` : ''}
          </div>
          <div class="task-item-chevron">${ICONS.chevronForward}</div>
        </div>
      `
      )
      .join('');

    return `
      <div class="app-card">
        <div class="day-detail-header">
          <h3>${dateLabel}</h3>
          ${addBtn}
        </div>
        <div class="task-list">
          ${taskItems}
        </div>
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

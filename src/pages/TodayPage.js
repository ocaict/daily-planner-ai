/**
 * Today Page — Full dashboard for daily planning (Stage 2)
 * Connected to real task data via TaskService.
 */

import { renderProgressCard } from '../components/ProgressCard.js';
import { renderSectionHeader } from '../components/SectionHeader.js';
import { showToast } from '../components/Toast.js';
import { renderConfirmationDialog } from '../components/ConfirmationDialog.js';
import { openTaskFormModal } from '../components/TaskFormModal.js';
import { openTaskDetailModal } from '../components/TaskDetailModal.js';
import { renderLoading } from '../components/LoadingSpinner.js';

export class TodayPage {
  constructor(taskService) {
    this.taskService = taskService;
    this.title = 'Today';
    this.todayTasks = [];
    this.overdueTasks = [];
    this.upcomingTasks = [];
    this.progress = { completed: 0, total: 0 };
    this.isLoading = false;
    this._isActive = false;
    this._clickHandler = null;
  }

  /**
   * Get a time-appropriate greeting.
   * @returns {string}
   */
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /**
   * Format today's date as "Weekday, Month Day".
   * @returns {string}
   */
  getFormattedDate() {
    const now = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${weekdays[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }

  /**
   * Format a time string for display.
   * @param {string} timeStr - Time in "HH:MM" format
   * @returns {string}
   */
  formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  /**
   * Format a date string as a short label.
   * @param {string} dateStr - Date in "YYYY-MM-DD" format
   * @returns {string}
   */
  formatDateShort(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  /**
   * Escape HTML special characters.
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Render a single schedule timeline item.
   * @param {object} task
   * @returns {string}
   */
  renderScheduleItem(task) {
    const time = this.formatTime(task.dueTime);
    const completedClass = task.completed ? ' schedule-item--completed' : '';
    const checkIcon = task.completed
      ? '<ion-icon name="checkmark-circle" class="schedule-item-check schedule-item-check--done"></ion-icon>'
      : '<ion-icon name="ellipse-outline" class="schedule-item-check"></ion-icon>';
    const categoryIcon = task.category
      ? `<ion-icon name="pricetag-outline" class="schedule-item-category"></ion-icon>`
      : '';

    return `
      <div class="schedule-item${completedClass}" data-task-id="${task.id}">
        <div class="schedule-item-time">${time || 'All day'}</div>
        <div class="schedule-item-body">
          <div class="schedule-item-title">${this.escapeHtml(task.title)}</div>
          ${categoryIcon}
        </div>
        ${checkIcon}
      </div>
    `;
  }

  /**
   * Render an overdue task item.
   * @param {object} task
   * @returns {string}
   */
  renderOverdueItem(task) {
    const priorityClass = task.priority ? ` overdue-item--${task.priority}` : '';
    const dueDate = task.dueDate ? this.formatDateShort(task.dueDate) : 'No due date';
    return `
      <div class="overdue-item${priorityClass}" data-task-id="${task.id}">
        <ion-icon name="warning-outline" class="overdue-item-icon"></ion-icon>
        <div class="overdue-item-body">
          <div class="overdue-item-title">${this.escapeHtml(task.title)}</div>
          <div class="overdue-item-date">${dueDate}</div>
        </div>
        <ion-icon name="chevron-forward-outline" class="overdue-item-chevron"></ion-icon>
      </div>
    `;
  }

  /**
   * Render an upcoming task item.
   * @param {object} task
   * @returns {string}
   */
  renderUpcomingItem(task) {
    const categoryBadge = task.category
      ? `<span class="app-badge upcoming-item-badge">${this.escapeHtml(task.category)}</span>`
      : '';
    const dueDate = task.dueDate ? this.formatDateShort(task.dueDate) : 'No date';
    return `
      <div class="upcoming-item" data-task-id="${task.id}">
        <div class="upcoming-item-body">
          <div class="upcoming-item-title">${this.escapeHtml(task.title)}</div>
          <div class="upcoming-item-meta">
            <span class="upcoming-item-date">${dueDate}</span>
            ${categoryBadge}
          </div>
        </div>
        <ion-icon name="chevron-forward-outline" class="upcoming-item-chevron"></ion-icon>
      </div>
    `;
  }

  /**
   * Load all data from the task service.
   */
  async loadData() {
    const [todayTasks, progress, overdueTasks, upcomingTasks] = await Promise.all([
      this.taskService.getTodayTasks(),
      this.taskService.getTodayProgress(),
      this.taskService.getOverdueTasks(),
      this.taskService.getUpcomingTasks(),
    ]);
    this.todayTasks = todayTasks || [];
    this.progress = progress || { completed: 0, total: 0 };
    this.overdueTasks = overdueTasks || [];
    this.upcomingTasks = upcomingTasks || [];
  }

  /**
   * Render the page HTML structure.
   * @returns {string}
   */
  render() {
    const greeting = this.getGreeting();
    const formattedDate = this.getFormattedDate();

    return `
      <div class="page-header">
        <div class="page-toolbar">
          <h1 class="page-title">${greeting}</h1>
          <button class="page-action-btn" id="settings-btn" aria-label="Settings">
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="page-action-icon">
              <path d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.1 16.1 0 0015.16-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="page-content">
        <div class="today-date">${formattedDate}</div>

        <!-- Progress Card -->
        <div id="progress-container">
          ${renderLoading('Loading progress...')}
        </div>

        <!-- Today's Schedule -->
        ${renderSectionHeader("Today's Schedule", 'View All', 'list-outline')}
        <div class="app-card schedule-list" id="schedule-list">
          ${renderLoading('Loading tasks...')}
        </div>

        <!-- Overdue -->
        <div id="overdue-container" style="display: none;">
          ${renderSectionHeader('Overdue', null, null)}
          <div class="app-card overdue-list" id="overdue-list"></div>
        </div>

        <!-- Upcoming -->
        ${renderSectionHeader('Upcoming', 'View All', 'calendar-outline')}
        <div class="app-card upcoming-list" id="upcoming-list">
          ${renderLoading('Loading upcoming...')}
        </div>

        <!-- Ask AI Button -->
        <div class="ask-ai-section">
          <button class="ask-ai-button" id="ask-ai-btn" aria-label="Ask AI">
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="ask-ai-icon">
              <path d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0L156.08 262.91a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17z" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M399 66a9 9 0 00-16.8 0l-20.55 53.3a9 9 0 01-5.17 5.17L302.77 145a9 9 0 000 16.8l54.71 21.08a9 9 0 015.17 5.17L383.2 242a9 9 0 0016.8 0l20.55-53.3a9 9 0 015.17-5.17L481.23 162a9 9 0 000-16.8l-54.71-21.08a9 9 0 01-5.17-5.17z" stroke="currentColor" stroke-width="28" fill="none"/>
            </svg>
            Ask AI
          </button>
        </div>

        <!-- Floating Action Button -->
        <button class="quick-add-fab" id="quick-add-fab" aria-label="Quick add task">
          <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="quick-add-fab-icon">
            <line x1="256" y1="112" x2="256" y2="400" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
            <line x1="112" y1="256" x2="400" y2="256" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Post-render hook: attach event listeners and load data.
   * @param {HTMLElement} container
   */
  async afterRender(container) {
    this._isActive = true;

    // Attach event listeners
    this._clickHandler = (e) => this.handleClick(e);
    container.addEventListener('click', this._clickHandler);

    // Load data
    await this.refreshData();
  }

  /**
   * Handle click events via delegation.
   * @param {Event} e
   */
  async handleClick(e) {
    // Handle FAB click
    if (e.target.closest('#quick-add-fab')) {
      this.handleQuickAdd();
      return;
    }

    // Handle settings button
    if (e.target.closest('#settings-btn')) {
      window.app && window.app.navigate('/settings');
      return;
    }

    // Handle Ask AI button
    if (e.target.closest('#ask-ai-btn')) {
      window.app && window.app.navigate('/ai');
      return;
    }

    // Handle "View All" section actions
    const sectionAction = e.target.closest('[data-action="section-action"]');
    if (sectionAction) {
      const section = sectionAction.closest('.section-header');
      if (section) {
        const title = section.querySelector('.section-title')?.textContent;
        if (title === "Today's Schedule") {
          window.app && window.app.navigate('/tasks');
        } else if (title === 'Upcoming') {
          window.app && window.app.navigate('/tasks');
        }
      }
      return;
    }

    // Handle task item clicks
    const taskItem = e.target.closest('[data-task-id]');
    if (taskItem) {
      const taskId = taskItem.getAttribute('data-task-id');
      await this.handleTaskClick(taskId);
    }
  }

  /**
   * Handle quick-add FAB click.
   */
  handleQuickAdd() {
    openTaskFormModal({
      onSave: async (taskData) => {
        await this.taskService.createTask(taskData);
        showToast('Task created successfully', 'success');
        await this.refreshData();
      },
      onCancel: () => {},
    });
  }

  /**
   * Handle task item click — open detail modal.
   * @param {string|number} taskId
   */
  async handleTaskClick(taskId) {
    try {
      const task = await this.taskService.getTaskById(taskId);
      if (!task) {
        showToast('Task not found', 'error');
        return;
      }

      openTaskDetailModal({
        task,
        onEdit: (updatedTask) => {
          openTaskFormModal({
            task: updatedTask,
            onSave: async (taskData) => {
              await this.taskService.updateTask(taskId, taskData);
              showToast('Task updated successfully', 'success');
              await this.refreshData();
            },
            onCancel: () => {},
          });
        },
        onDelete: async () => {
          const confirmed = await renderConfirmationDialog({
            title: 'Delete Task',
            message: `Are you sure you want to delete "${task.title}"?`,
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
          });
          if (confirmed) {
            await this.taskService.deleteTask(taskId);
            showToast('Task deleted', 'info');
            await this.refreshData();
          }
        },
        onComplete: async () => {
          await this.taskService.toggleTaskComplete(taskId);
          showToast('Task completed', 'success');
          await this.refreshData();
        },
        onClose: () => {},
      });
    } catch (error) {
      showToast('Failed to load task details', 'error');
    }
  }

  /**
   * Handle task completion toggle.
   * @param {string|number} taskId
   */
  async handleToggleComplete(taskId) {
    try {
      await this.taskService.toggleTaskComplete(taskId);
      await this.refreshData();
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  }

  /**
   * Refresh all data and update the DOM.
   */
  async refreshData() {
    try {
      await this.loadData();
      this.updateDOM();
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  }

  /**
   * Update the DOM with loaded data.
   */
  updateDOM() {
    if (!this._isActive) return;

    const container = document.getElementById('app-content');
    if (!container) return;

    // Update progress
    const progressContainer = container.querySelector('#progress-container');
    if (progressContainer) {
      progressContainer.innerHTML = renderProgressCard(this.progress);
    }

    // Update schedule
    const scheduleList = container.querySelector('#schedule-list');
    if (scheduleList) {
      if (this.todayTasks.length > 0) {
        scheduleList.innerHTML = this.todayTasks
          .map((task) => this.renderScheduleItem(task))
          .join('');
      } else {
        scheduleList.innerHTML = `
          <div class="empty-state">
            <ion-icon name="calendar-outline" class="empty-state-icon"></ion-icon>
            <h3>No tasks for today</h3>
            <p>Tap the + button to add a task</p>
          </div>
        `;
      }
    }

    // Update overdue
    const overdueContainer = container.querySelector('#overdue-container');
    const overdueList = container.querySelector('#overdue-list');
    if (overdueContainer && overdueList) {
      if (this.overdueTasks.length > 0) {
        overdueContainer.style.display = '';
        overdueList.innerHTML = this.overdueTasks
          .map((task) => this.renderOverdueItem(task))
          .join('');
      } else {
        overdueContainer.style.display = 'none';
      }
    }

    // Update upcoming
    const upcomingList = container.querySelector('#upcoming-list');
    if (upcomingList) {
      if (this.upcomingTasks.length > 0) {
        upcomingList.innerHTML = this.upcomingTasks
          .map((task) => this.renderUpcomingItem(task))
          .join('');
      } else {
        upcomingList.innerHTML = `
          <div class="empty-state">
            <ion-icon name="calendar-outline" class="empty-state-icon"></ion-icon>
            <h3>No upcoming tasks</h3>
            <p>Tasks due in the future will appear here</p>
          </div>
        `;
      }
    }
  }

  /**
   * Clean up event listeners and state.
   */
  destroy() {
    this._isActive = false;
    const container = document.getElementById('app-content');
    if (container && this._clickHandler) {
      container.removeEventListener('click', this._clickHandler);
    }
    this._clickHandler = null;
    this.todayTasks = [];
    this.overdueTasks = [];
    this.upcomingTasks = [];
    this.progress = { completed: 0, total: 0 };
  }
}

export default TodayPage;

/**
 * Tasks Page — Full task management view (Stage 2)
 * Connected to real task data via TaskService.
 */

import { renderFilterChips } from '../components/FilterChips.js';
import { renderEmptyState } from '../components/EmptyState.js';
import { renderLoading } from '../components/LoadingSpinner.js';
import { renderErrorState } from '../components/ErrorState.js';
import { renderTaskList } from '../components/TaskList.js';
import { showToast } from '../components/Toast.js';
import { renderConfirmationDialog } from '../components/ConfirmationDialog.js';
import { openTaskFormModal } from '../components/TaskFormModal.js';
import { openTaskDetailModal } from '../components/TaskDetailModal.js';

export class TasksPage {
  constructor(taskService) {
    this.taskService = taskService;
    this.title = 'Tasks';
    this.activeFilter = 'all';
    this.filters = [
      { id: 'all', label: 'All' },
      { id: 'today', label: 'Today' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'overdue', label: 'Overdue' },
      { id: 'completed', label: 'Completed' },
    ];
    this.tasks = [];
    this.filterCounts = {};
    this.searchQuery = '';
    this.isLoading = false;
    this.isSearchVisible = false;
    this._isActive = false;
    this._clickHandler = null;
    this._searchTimeout = null;
  }

  /**
   * Get the label for a filter key.
   * @param {string} filter
   * @returns {string}
   */
  getFilterLabel(filter) {
    const labels = {
      all: 'All',
      today: 'Today',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      completed: 'Completed',
    };
    return labels[filter] || filter;
  }

  /**
   * Calculate filter counts from the full task list.
   * @param {Array} tasks
   * @returns {Object}
   */
  calculateFilterCounts(tasks) {
    const counts = {
      all: tasks.length,
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0,
    };

    tasks.forEach((task) => {
      if (task.completed) {
        counts.completed++;
      } else if (task.isOverdue) {
        counts.overdue++;
      } else if (task.isToday) {
        counts.today++;
      } else if (task.isUpcoming) {
        counts.upcoming++;
      }
    });

    return counts;
  }

  /**
   * Load all tasks and calculate filter counts.
   */
  async loadData() {
    const allTasks = await this.taskService.getTasks();
    this.filterCounts = this.calculateFilterCounts(allTasks || []);
  }

  /**
   * Get tasks for the active filter.
   * @param {string} filter
   * @returns {Promise<Array>}
   */
  async getFilteredTasks(filter) {
    switch (filter) {
      case 'today':
        return this.taskService.getTodayTasks();
      case 'upcoming':
        return this.taskService.getUpcomingTasks();
      case 'overdue':
        return this.taskService.getOverdueTasks();
      case 'completed':
        return this.taskService.getCompletedTasks();
      case 'all':
      default:
        return this.taskService.getTasks();
    }
  }

  /**
   * Render the page HTML structure.
   * @returns {string}
   */
  render() {
    const filterChips = renderFilterChips(this.filters, this.activeFilter);

    return `
      <ion-header>
        <ion-toolbar>
          <ion-title>Tasks</ion-title>
          <ion-buttons slot="end">
            <ion-button id="search-toggle" aria-label="Search tasks">
              <ion-icon name="search-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button id="add-task-btn" aria-label="Add task">
              <ion-icon name="add-outline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Search Input -->
        <div id="search-container" style="display: none; margin-bottom: var(--app-spacing-md);">
          <ion-searchbar
            id="search-input"
            placeholder="Search tasks..."
            debounce="300"
            aria-label="Search tasks"
          ></ion-searchbar>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips-container">
          ${filterChips}
        </div>

        <!-- Task List -->
        <div class="task-list" id="task-list">
          ${renderLoading('Loading tasks...')}
        </div>
      </ion-content>
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

    // Attach search input listener
    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('ionInput', (e) => this.handleSearchInput(e));
    }

    // Load data
    await this.refreshData();
  }

  /**
   * Handle click events via delegation.
   * @param {Event} e
   */
  async handleClick(e) {
    // Handle search toggle
    if (e.target.closest('#search-toggle')) {
      this.toggleSearch();
      return;
    }

    // Handle add task button
    if (e.target.closest('#add-task-btn')) {
      this.handleAddTask();
      return;
    }

    // Handle filter chip clicks
    const chip = e.target.closest('.filter-chip');
    if (chip) {
      const filterId = chip.getAttribute('data-filter-id');
      if (filterId) {
        await this.handleFilterChange(filterId);
      }
      return;
    }

    // Handle checkbox toggles
    const checkbox = e.target.closest('ion-checkbox');
    if (checkbox) {
      e.stopPropagation();
      const taskId = checkbox.getAttribute('data-task-id') ||
        checkbox.closest('[data-task-id]')?.getAttribute('data-task-id');
      if (taskId) {
        await this.handleToggleComplete(taskId);
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
   * Toggle search input visibility.
   */
  toggleSearch() {
    const container = document.getElementById('app-content');
    if (!container) return;

    const searchContainer = container.querySelector('#search-container');
    const searchInput = container.querySelector('#search-input');

    if (searchContainer) {
      this.isSearchVisible = !this.isSearchVisible;
      searchContainer.style.display = this.isSearchVisible ? '' : 'none';

      if (this.isSearchVisible && searchInput) {
        searchInput.setFocus();
      } else if (searchInput) {
        searchInput.value = '';
        this.searchQuery = '';
        this.refreshData();
      }
    }
  }

  /**
   * Handle search input with debouncing.
   * @param {CustomEvent} e
   */
  handleSearchInput(e) {
    const query = e.target.value;
    this.searchQuery = query;

    // Clear existing timeout
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
    }

    // Debounce search
    this._searchTimeout = setTimeout(async () => {
      await this.performSearch(query);
    }, 300);
  }

  /**
   * Perform search and update the task list.
   * @param {string} query
   */
  async performSearch(query) {
    if (!query || query.trim() === '') {
      await this.refreshData();
      return;
    }

    try {
      const results = await this.taskService.searchTasks(query);
      this.updateTaskList(results || []);
    } catch (error) {
      showToast('Search failed', 'error');
    }
  }

  /**
   * Handle filter chip change.
   * @param {string} filterId
   */
  async handleFilterChange(filterId) {
    this.activeFilter = filterId;
    this.searchQuery = '';

    // Update filter chip active state
    const container = document.getElementById('app-content');
    if (container) {
      const chips = container.querySelectorAll('.filter-chip');
      chips.forEach((chip) => {
        const id = chip.getAttribute('data-filter-id');
        if (id === filterId) {
          chip.classList.add('filter-chip--active');
          chip.setAttribute('aria-checked', 'true');
        } else {
          chip.classList.remove('filter-chip--active');
          chip.setAttribute('aria-checked', 'false');
        }
      });
    }

    await this.refreshData();
  }

  /**
   * Handle add task button click.
   */
  handleAddTask() {
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
    if (!this._isActive) return;

    try {
      // Show loading state
      const container = document.getElementById('app-content');
      if (container) {
        const taskList = container.querySelector('#task-list');
        if (taskList) {
          taskList.innerHTML = renderLoading('Loading tasks...');
        }
      }

      // Update filter counts
      await this.loadData();

      // Load data based on active filter
      const tasks = await this.getFilteredTasks(this.activeFilter);
      this.tasks = tasks || [];

      // Update the task list
      this.updateTaskList(this.tasks);
    } catch (error) {
      const container = document.getElementById('app-content');
      if (container) {
        const taskList = container.querySelector('#task-list');
        if (taskList) {
          taskList.innerHTML = renderErrorState({
            message: 'Failed to load tasks. Please try again.',
            onRetry: () => this.refreshData(),
          });
        }
      }
      showToast('Failed to load tasks', 'error');
    }
  }

  /**
   * Update the task list DOM.
   * @param {Array} tasks
   */
  updateTaskList(tasks) {
    if (!this._isActive) return;

    const container = document.getElementById('app-content');
    if (!container) return;

    const taskList = container.querySelector('#task-list');
    if (!taskList) return;

    if (tasks.length > 0) {
      taskList.innerHTML = renderTaskList(tasks, { showCheckbox: true });
    } else {
      const emptyMessages = {
        all: { icon: 'list-outline', title: 'No tasks yet', message: 'Tap the + button to add your first task.' },
        today: { icon: 'today-outline', title: 'No tasks for today', message: 'Enjoy your day! Add a task to get started.' },
        upcoming: { icon: 'calendar-outline', title: 'No upcoming tasks', message: 'Tasks due in the future will appear here.' },
        overdue: { icon: 'checkmark-circle-outline', title: 'No overdue tasks', message: "You're all caught up!" },
        completed: { icon: 'checkmark-done-outline', title: 'No completed tasks', message: 'Complete a task to see it here.' },
      };
      const msg = emptyMessages[this.activeFilter] || emptyMessages.all;
      taskList.innerHTML = renderEmptyState(msg);
    }
  }

  /**
   * Clean up event listeners and state.
   */
  destroy() {
    this._isActive = false;

    // Clear search timeout
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
      this._searchTimeout = null;
    }

    // Remove event listeners
    const container = document.getElementById('app-content');
    if (container && this._clickHandler) {
      container.removeEventListener('click', this._clickHandler);
    }
    this._clickHandler = null;

    // Reset state
    this.tasks = [];
    this.filterCounts = {};
    this.searchQuery = '';
    this.isLoading = false;
    this.isSearchVisible = false;
  }
}

export default TasksPage;

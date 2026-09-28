/**
 * Task List — Reusable task list component (Stage 2)
 *
 * Renders a list of task cards with clickable items that open a detail modal.
 * Supports empty state and loading indicator.
 */

import { renderTaskCard } from './TaskCard.js';
import { renderTaskActions, attachTaskActionsListeners } from './TaskActions.js';
import { openTaskDetailModal } from './TaskDetailModal.js';
import { openTaskFormModal } from './TaskFormModal.js';
import { showToast } from './Toast.js';
import { serviceContainer } from '../services/ServiceContainer.js';

/**
 * Escape HTML special characters to prevent XSS.
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render a list of tasks as clickable cards.
 * Returns an HTML string. After inserting into the DOM, call
 * attachTaskListeners to wire up click handlers.
 *
 * @param {Array} tasks - Array of task objects
 * @param {object} [options]
 * @param {Function} [options.onTaskClick] - Called when a task card is tapped
 * @param {Function} [options.onComplete] - Called when complete action is tapped
 * @param {Function} [options.onEdit] - Called when edit action is tapped
 * @param {Function} [options.onDelete] - Called when delete action is confirmed
 * @param {string} [options.emptyMessage] - Message to show when no tasks
 * @returns {string} HTML string
 */
export function renderTaskList(tasks, {
  onTaskClick,
  onComplete,
  onEdit,
  onDelete,
  emptyMessage = 'No tasks yet. Tap + to add one.',
} = {}) {
  if (!tasks || tasks.length === 0) {
    return `
      <div class="empty-state">
        <ion-icon name="checkbox-outline"></ion-icon>
        <h3>No Tasks</h3>
        <p>${escapeHtml(emptyMessage)}</p>
      </div>
    `;
  }

  const cardsHtml = tasks.map((task) => {
    const cardHtml = renderTaskCard(task);
    const actionsHtml = renderTaskActions(task, { onComplete, onEdit, onDelete });

    return `
      <div class="task-list-item" data-task-id="${escapeHtml(task.id)}" data-task-card="${escapeHtml(task.id)}">
        <div class="task-list-item-card">
          ${cardHtml}
        </div>
        <div class="task-list-item-actions">
          ${actionsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `<div class="task-list-container">${cardsHtml}</div>`;
}

/**
 * Attach event listeners to a rendered task list.
 * Call this after inserting the HTML into the DOM.
 *
 * @param {HTMLElement} container - The element containing the task list
 * @param {Array} tasks - Array of task objects (same as passed to renderTaskList)
 * @param {object} [options]
 * @param {Function} [options.onTaskClick] - Called when a task card is tapped
 * @param {Function} [options.onComplete] - Called when complete action is tapped
 * @param {Function} [options.onEdit] - Called when edit action is tapped
 * @param {Function} [options.onDelete] - Called when delete action is confirmed
 */
export function attachTaskListeners(container, tasks, {
  onTaskClick,
  onComplete,
  onEdit,
  onDelete,
} = {}) {
  if (!container || !tasks) return;

  // Attach action button listeners
  const actionsContainers = container.querySelectorAll('[data-task-actions]');
  actionsContainers.forEach((actionsEl) => {
    const taskId = actionsEl.getAttribute('data-task-actions');
    const task = tasks.find((t) => String(t.id) === String(taskId));
    if (task) {
      attachTaskActionsListeners(actionsEl, task, { onComplete, onEdit, onDelete });
    }
  });

  // Attach card click listeners
  const cardElements = container.querySelectorAll('[data-task-card]');
  cardElements.forEach((cardEl) => {
    const taskId = cardEl.getAttribute('data-task-card');
    const task = tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    cardEl.addEventListener('click', (e) => {
      // Don't open detail if clicking on action buttons or checkbox
      if (e.target.closest('[data-task-actions]') || e.target.closest('ion-checkbox')) {
        return;
      }

      if (onTaskClick) {
        onTaskClick(task);
      } else {
        // Default: open detail modal
        openTaskDetailModal({
          task,
          onEdit: (t) => openTaskFormModal({ task: t }),
          onDelete: async (t) => {
            try {
              await serviceContainer.taskService.deleteTask(t.id);
              showToast('Task deleted', 'success');
            } catch (err) {
              showToast('Failed to delete task', 'error');
            }
          },
          onComplete: async (t) => {
            try {
              const updated = await serviceContainer.taskService.toggleTaskComplete(t.id);
              showToast(updated.completed ? 'Task completed' : 'Task marked pending', 'success');
              return updated;
            } catch (err) {
              showToast('Failed to update task', 'error');
              throw err;
            }
          },
        });
      }
    });
  });
}

/**
 * Render a loading indicator for task lists.
 * @returns {string} HTML string
 */
export function renderTaskListLoading() {
  return `
    <div class="task-list-loading">
      <ion-spinner name="crescent" color="primary"></ion-spinner>
      <p class="app-text-muted">Loading tasks...</p>
    </div>
  `;
}

export default renderTaskList;

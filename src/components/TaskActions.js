/**
 * Task Actions — Quick action buttons for task lists (Stage 2)
 *
 * Renders icon-only action buttons for complete, edit, and delete operations.
 * Delete action shows a confirmation dialog before proceeding.
 */

import { renderConfirmationDialog } from './ConfirmationDialog.js';

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
 * Render quick action buttons for a task.
 * Returns an HTML string with icon buttons for complete, edit, and delete.
 *
 * @param {object} task - Task object
 * @param {object} [options]
 * @param {Function} [options.onComplete] - Called when complete button is tapped
 * @param {Function} [options.onEdit] - Called when edit button is tapped
 * @param {Function} [options.onDelete] - Called when delete is confirmed
 * @returns {string} HTML string
 */
export function renderTaskActions(task, { onComplete, onEdit, onDelete } = {}) {
  if (!task) return '';

  const taskId = escapeHtml(task.id);
  const isCompleted = Boolean(task.completed);
  const title = escapeHtml(task.title);

  const completeIcon = isCompleted ? 'refresh-outline' : 'checkmark-outline';
  const completeLabel = isCompleted ? 'Mark as pending' : 'Mark as complete';
  const completeColor = isCompleted ? 'medium' : 'success';

  return `
    <div class="task-actions" data-task-actions="${taskId}">
      <ion-button
        class="task-action-btn"
        data-action="complete"
        data-task-id="${taskId}"
        fill="clear"
        color="${completeColor}"
        aria-label="${completeLabel}"
        title="${completeLabel}"
      >
        <ion-icon name="${completeIcon}" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button
        class="task-action-btn"
        data-action="edit"
        data-task-id="${taskId}"
        fill="clear"
        color="primary"
        aria-label="Edit task"
        title="Edit task"
      >
        <ion-icon name="create-outline" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button
        class="task-action-btn"
        data-action="delete"
        data-task-id="${taskId}"
        fill="clear"
        color="danger"
        aria-label="Delete task"
        title="Delete task"
      >
        <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
      </ion-button>
    </div>
  `;
}

/**
 * Attach event listeners to a rendered task actions container.
 * Call this after inserting the HTML into the DOM.
 *
 * @param {HTMLElement} container - The element containing the task actions
 * @param {object} task - The task object
 * @param {object} [options]
 * @param {Function} [options.onComplete] - Called when complete button is tapped
 * @param {Function} [options.onEdit] - Called when edit button is tapped
 * @param {Function} [options.onDelete] - Called when delete is confirmed
 */
export function attachTaskActionsListeners(container, task, { onComplete, onEdit, onDelete } = {}) {
  if (!container || !task) return;

  const completeBtn = container.querySelector('[data-action="complete"]');
  const editBtn = container.querySelector('[data-action="edit"]');
  const deleteBtn = container.querySelector('[data-action="delete"]');

  if (completeBtn && onComplete) {
    completeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onComplete(task);
    });
  }

  if (editBtn && onEdit) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onEdit(task);
    });
  }

  if (deleteBtn && onDelete) {
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const confirmed = await renderConfirmationDialog({
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      });

      if (confirmed) {
        onDelete(task);
      }
    });
  }
}

export default renderTaskActions;

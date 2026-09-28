/**
 * Task Detail Modal — Read-only task detail view (Stage 2)
 *
 * Opens an ion-modal displaying full task details with action buttons
 * for complete/uncomplete, edit, and delete operations.
 */

import { formatTime12h, formatDate } from '../utils/DateUtils.js';
import { showToast } from './Toast.js';
import { renderConfirmationDialog } from './ConfirmationDialog.js';

let modalCounter = 0;

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
 * Get priority display info with color.
 * @param {string} priority
 * @returns {{label: string, color: string, class: string}}
 */
function getPriorityInfo(priority) {
  const map = {
    low: { label: 'Low', color: 'var(--app-success)', class: 'priority-indicator--low' },
    medium: { label: 'Medium', color: 'var(--app-warning)', class: 'priority-indicator--medium' },
    high: { label: 'High', color: 'var(--app-danger)', class: 'priority-indicator--high' },
  };
  return map[priority] || map.medium;
}

/**
 * Get repeat rule display label.
 * @param {string} rule
 * @returns {string}
 */
function getRepeatLabel(rule) {
  const labels = { none: 'None', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  return labels[rule] || 'None';
}

/**
 * Format a timestamp for display.
 * @param {number|string|Date} timestamp
 * @returns {string}
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  try {
    const d = new Date(timestamp);
    return d.toLocaleString();
  } catch {
    return '—';
  }
}

/**
 * Build a detail row HTML.
 * @param {string} label
 * @param {string} valueHtml
 * @returns {string}
 */
function detailRow(label, valueHtml) {
  return `
    <div class="detail-row">
      <span class="detail-label">${escapeHtml(label)}</span>
      <span class="detail-value">${valueHtml}</span>
    </div>
  `;
}

/**
 * Open the task detail modal.
 * @param {object} params
 * @param {object} params.task - Task object to display
 * @param {Function} [params.onEdit] - Called when edit button is tapped
 * @param {Function} [params.onDelete] - Called when delete is confirmed
 * @param {Function} [params.onComplete] - Called when complete/uncomplete is toggled
 * @param {Function} [params.onClose] - Called when modal is dismissed
 * @returns {Promise<HTMLIonModalElement>}
 */
export async function openTaskDetailModal({ task, onEdit, onDelete, onComplete, onClose } = {}) {
  if (!task) {
    console.error('[TaskDetailModal] No task provided');
    return null;
  }

  modalCounter++;
  const modalId = `task-detail-modal-${modalCounter}`;

  const priorityInfo = getPriorityInfo(task.priority);
  const isCompleted = Boolean(task.completed);

  // Build time display
  let timeDisplay = '';
  if (task.startTime || task.dueTime) {
    const parts = [];
    if (task.startTime) parts.push(`Start: ${formatTime12h(task.startTime)}`);
    if (task.dueTime) parts.push(`Due: ${formatTime12h(task.dueTime)}`);
    timeDisplay = escapeHtml(parts.join(' · '));
  }

  // Build reminder display
  let reminderDisplay = 'None';
  if (task.hasReminder) {
    const mins = task.reminderMinutes || 15;
    reminderDisplay = `${mins} minute${mins !== 1 ? 's' : ''} before`;
  }

  // Build category display
  let categoryDisplay = 'None';
  if (task.category) {
    const iconHtml = task.categoryIcon
      ? `<ion-icon name="${escapeHtml(task.categoryIcon)}" class="detail-category-icon"></ion-icon>`
      : '';
    categoryDisplay = `${iconHtml}<span>${escapeHtml(task.category)}</span>`;
  } else if (task.categoryId) {
    categoryDisplay = `<span class="app-text-muted">Category #${escapeHtml(task.categoryId)}</span>`;
  }

  const modal = document.createElement('ion-modal');
  modal.id = modalId;
  modal.className = 'task-detail-modal';
  modal.setAttribute('show-backdrop', 'true');
  modal.setAttribute('can-dismiss', 'true');

  modal.innerHTML = `
    <ion-header>
      <ion-toolbar>
        <ion-title>Task Details</ion-title>
        <ion-buttons slot="end">
          <ion-button data-action="close-modal" aria-label="Close details">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="detail-header">
        <div class="detail-title-row">
          <h2 class="detail-title ${isCompleted ? 'detail-title--completed' : ''}">${escapeHtml(task.title)}</h2>
          <span class="detail-status-badge ${isCompleted ? 'detail-status-badge--completed' : 'detail-status-badge--pending'}">
            ${isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>
        ${task.description ? `<p class="detail-description">${escapeHtml(task.description)}</p>` : ''}
      </div>

      <ion-list lines="none" class="detail-list">
        ${detailRow('Date', `<span>${escapeHtml(task.dueDate ? formatDate(task.dueDate, 'display') : '—')}</span>`)}
        ${timeDisplay ? detailRow('Time', `<span>${timeDisplay}</span>`) : ''}
        ${task.duration ? detailRow('Duration', `<span>${escapeHtml(task.duration)} min</span>`) : ''}
        ${detailRow('Priority', `
          <span class="detail-priority">
            <span class="priority-indicator ${priorityInfo.class}"></span>
            ${priorityInfo.label}
          </span>
        `)}
        ${detailRow('Category', `<span class="detail-category">${categoryDisplay}</span>`)}
        ${detailRow('Reminder', `<span>${escapeHtml(reminderDisplay)}</span>`)}
        ${detailRow('Repeat', `<span>${escapeHtml(getRepeatLabel(task.repeatRule))}</span>`)}
        ${task.notes ? detailRow('Notes', `<span>${escapeHtml(task.notes)}</span>`) : ''}
        ${detailRow('Created', `<span class="app-text-muted">${escapeHtml(formatTimestamp(task.createdAt))}</span>`)}
        ${detailRow('Updated', `<span class="app-text-muted">${escapeHtml(formatTimestamp(task.updatedAt))}</span>`)}
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button
            data-action="toggle-complete"
            id="${modalId}-complete-btn"
            fill="${isCompleted ? 'outline' : 'solid'}"
            color="${isCompleted ? 'medium' : 'success'}"
          >
            <ion-icon name="${isCompleted ? 'refresh-outline' : 'checkmark-outline'}" slot="start"></ion-icon>
            ${isCompleted ? 'Mark Pending' : 'Complete'}
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button data-action="edit-task" fill="clear" color="primary">
            <ion-icon name="create-outline" slot="start"></ion-icon>
            Edit
          </ion-button>
          <ion-button data-action="delete-task" fill="clear" color="danger">
            <ion-icon name="trash-outline" slot="start"></ion-icon>
            Delete
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `;

  document.body.appendChild(modal);

  /**
   * Close the modal.
   */
  function closeModal() {
    modal.dismiss();
  }

  // Close button
  modal.querySelector('[data-action="close-modal"]').addEventListener('click', () => {
    closeModal();
  });

  // Toggle complete button
  const completeBtn = modal.querySelector(`#${modalId}-complete-btn`);
  completeBtn.addEventListener('click', async () => {
    completeBtn.disabled = true;
    try {
      if (onComplete) {
        const updatedTask = await onComplete(task);
        // Update the UI to reflect new state
        if (updatedTask) {
          closeModal();
        }
      } else {
        closeModal();
      }
    } catch (err) {
      console.error('[TaskDetailModal] Complete toggle failed:', err);
      showToast(err.message || 'Failed to update task', 'error');
      completeBtn.disabled = false;
    }
  });

  // Edit button
  modal.querySelector('[data-action="edit-task"]').addEventListener('click', () => {
    closeModal();
    if (onEdit) onEdit(task);
  });

  // Delete button — show confirmation first
  modal.querySelector('[data-action="delete-task"]').addEventListener('click', async () => {
    const confirmed = await renderConfirmationDialog({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        if (onDelete) {
          await onDelete(task);
        }
        closeModal();
      } catch (err) {
        console.error('[TaskDetailModal] Delete failed:', err);
        showToast(err.message || 'Failed to delete task', 'error');
      }
    }
  });

  // Handle modal dismissal
  modal.onDidDismiss().then(() => {
    modal.remove();
    if (onClose) onClose();
  });

  await modal.present();
  return modal;
}

export default openTaskDetailModal;

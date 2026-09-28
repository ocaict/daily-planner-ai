/**
 * Reusable task card component.
 * Displays a full-featured task card with checkbox, title, time, priority,
 * category badge, and reminder indicator.
 */

const PRIORITY_COLORS = {
  low: 'var(--app-success)',
  medium: 'var(--app-warning)',
  high: 'var(--app-danger)'
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render a task card.
 * @param {object} task - Task object with id, title, completed, priority, time, category, hasReminder
 * @returns {string} HTML string
 */
export function renderTaskCard(task) {
  const title = escapeHtml(task.title);
  const time = escapeHtml(task.time || task.dueTime || task.startTime || '');
  const category = escapeHtml(task.category || task.categoryName || '');
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const checked = task.completed ? 'checked' : '';
  const reminderIcon = (task.hasReminder || task.reminderEnabled)
    ? `<ion-icon name="notifications-outline" class="task-card-reminder"></ion-icon>`
    : '';

  return `
    <div class="task-card ${task.completed ? 'task-card--completed' : ''}" data-task-id="${task.id}" data-priority="${task.priority}">
      <div class="task-card-left">
        <ion-checkbox class="task-card-checkbox" ${checked} data-action="toggle-task" data-task-id="${task.id}"></ion-checkbox>
      </div>
      <div class="task-card-body">
        <div class="task-card-header">
          <span class="task-card-title">${title}</span>
          ${reminderIcon}
        </div>
        <div class="task-card-meta">
          ${time ? `<span class="task-card-time"><ion-icon name="time-outline"></ion-icon>${time}</span>` : ''}
          <span class="task-card-category">${category}</span>
          <span class="task-card-priority" style="color:${priorityColor}">
            <span class="priority-dot"></span>
            ${task.priority}
          </span>
        </div>
      </div>
    </div>
  `;
}

export default renderTaskCard;

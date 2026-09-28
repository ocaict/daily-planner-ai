/**
 * Compact horizontal task row variant for list views.
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
 * Render a compact task row.
 * @param {object} task - Task object with id, title, completed, priority, time, category, hasReminder
 * @returns {string} HTML string
 */
export function renderTaskRow(task) {
  const title = escapeHtml(task.title);
  const time = escapeHtml(task.time || '');
  const category = escapeHtml(task.category || '');
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const checked = task.completed ? 'checked' : '';
  const reminderIcon = task.hasReminder
    ? `<ion-icon name="notifications-outline" class="task-row-reminder"></ion-icon>`
    : '';

  return `
    <div class="task-row ${task.completed ? 'task-row--completed' : ''}" data-task-id="${task.id}" data-priority="${task.priority}">
      <ion-checkbox class="task-row-checkbox" ${checked} data-action="toggle-task" data-task-id="${task.id}"></ion-checkbox>
      <div class="task-row-body">
        <span class="task-row-title">${title}</span>
        <div class="task-row-meta">
          ${time ? `<span class="task-row-time">${time}</span>` : ''}
          <span class="task-row-category">${category}</span>
        </div>
      </div>
      <span class="task-row-priority" style="color:${priorityColor}">
        <span class="priority-dot"></span>
      </span>
      ${reminderIcon}
    </div>
  `;
}

export default renderTaskRow;

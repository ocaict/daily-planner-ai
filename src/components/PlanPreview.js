/**
 * PlanPreview component — displays a proposed daily plan.
 */

import { formatTime12h } from '../utils/DateUtils.js';

/**
 * Render a plan preview.
 * @param {object} plan - The proposed plan from PlannerEngine
 * @returns {string} HTML string
 */
export function renderPlanPreview(plan) {
  if (!plan) return '<div class="empty-state"><p>No plan to preview</p></div>';

  if (plan.reason) {
    return `
      <div class="app-card">
        <div class="empty-state">
          <ion-icon name="alert-circle-outline"></ion-icon>
          <p>${plan.reason}</p>
        </div>
      </div>
    `;
  }

  const scheduledItems = plan.scheduledItems || [];
  const unscheduledTasks = plan.unscheduledTasks || [];
  const conflicts = plan.conflicts || [];

  const scheduledHtml = scheduledItems.length > 0
    ? scheduledItems
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map(
          (item) => `
        <div class="plan-item">
          <div class="plan-item-time">${formatTime12h(item.startTime)} – ${formatTime12h(item.endTime)}</div>
          <div class="plan-item-body">
            <div class="plan-item-title">${escapeHtml(item.task?.title || 'Task')}</div>
            <div class="plan-item-reason">${escapeHtml(item.reason || '')}</div>
          </div>
        </div>
      `
        )
        .join('')
    : '<div class="empty-state"><p>No tasks scheduled</p></div>';

  const unscheduledHtml = unscheduledTasks.length > 0
    ? `
      <div class="plan-section">
        <h4>Unscheduled</h4>
        ${unscheduledTasks
          .map(
            (task) => `
          <div class="plan-item plan-item--unscheduled">
            <div class="plan-item-title">${escapeHtml(task.title)}</div>
            <div class="plan-item-meta">${task.durationMinutes || 30} min · ${task.priority || 'medium'}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
    : '';

  const conflictsHtml = conflicts.length > 0
    ? `
      <div class="plan-section">
        <h4>Conflicts</h4>
        ${conflicts
          .map(
            (c) => `
          <div class="plan-conflict">
            <ion-icon name="warning-outline"></ion-icon>
            <span>${escapeHtml(c.message)}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `
    : '';

  const unusedHtml = plan.unusedMinutes > 0
    ? `<div class="plan-unused">${plan.unusedMinutes} minutes unused</div>`
    : '';

  return `
    <div class="app-card">
      <div class="plan-header">
        <h3>Proposed Plan</h3>
        <span class="app-text-muted">${plan.date}</span>
      </div>
      <div class="plan-content">
        ${scheduledHtml}
        ${unscheduledHtml}
        ${conflictsHtml}
        ${unusedHtml}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default renderPlanPreview;

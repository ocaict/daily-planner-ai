/**
 * Daily progress component showing completion stats.
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render a daily progress card.
 * @param {object} params
 * @param {number} params.completed - Number of completed tasks
 * @param {number} params.total - Total number of tasks
 * @returns {string} HTML string
 */
export function renderProgressCard({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return `
    <div class="progress-card">
      <div class="progress-card-header">
        <h3 class="progress-card-title">Today's progress</h3>
        <span class="progress-card-count">${completed} of ${total} tasks completed</span>
      </div>
      <ion-progress-bar class="progress-card-bar" value="${pct / 100}"></ion-progress-bar>
      <span class="progress-card-pct">${pct}%</span>
    </div>
  `;
}

export default renderProgressCard;

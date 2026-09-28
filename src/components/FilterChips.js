/**
 * Filter chip bar for task/category filtering.
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
 * Render a filter chip bar.
 * @param {Array<{id: string, label: string}>} filters - Filter options
 * @param {string} activeFilter - Currently active filter id
 * @returns {string} HTML string
 */
export function renderFilterChips(filters, activeFilter) {
  const chips = filters.map((filter) => {
    const isActive = filter.id === activeFilter;
    const activeAttr = isActive ? 'aria-checked="true"' : '';
    const highlightClass = isActive ? 'filter-chip--active' : '';

    return `
      <ion-chip
        class="filter-chip ${highlightClass}"
        data-filter-id="${escapeHtml(filter.id)}"
        ${activeAttr}
      >
        <ion-label>${escapeHtml(filter.label)}</ion-label>
      </ion-chip>
    `;
  }).join('');

  return `
    <div class="filter-chips">
      ${chips}
    </div>
  `;
}

export default renderFilterChips;

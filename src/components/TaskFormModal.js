/**
 * Task Form Modal — Create/Edit task form (Stage 2)
 *
 * Opens an ion-modal with a full task form. Supports both create and edit modes.
 * Validates input using validateTaskData, shows field-level errors, and calls
 * onSave with sanitized data on successful submission.
 */

import { serviceContainer } from '../services/ServiceContainer.js';
import { validateTaskData, sanitizeTaskData } from '../utils/TaskValidation.js';
import { getCurrentDate } from '../utils/DateUtils.js';
import { showToast } from './Toast.js';

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
 * Get priority options for the select.
 * @returns {Array<{value: string, label: string}>}
 */
function getPriorityOptions() {
  return [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];
}

/**
 * Get repeat rule options for the select.
 * @returns {Array<{value: string, label: string}>}
 */
function getRepeatOptions() {
  return [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
}

/**
 * Build category options HTML from category list.
 * @param {Array} categories
 * @param {string|number|null} selectedId
 * @returns {string}
 */
function buildCategoryOptions(categories, selectedId) {
  const options = [`<ion-select-option value="">No category</ion-select-option>`];
  for (const cat of categories) {
    const selected = String(cat.id) === String(selectedId) ? ' selected' : '';
    options.push(`<ion-select-option value="${escapeHtml(cat.id)}"${selected}>${escapeHtml(cat.name)}</ion-select-option>`);
  }
  return options.join('');
}

/**
 * Build the form field HTML with optional error message.
 * @param {string} fieldId - Unique ID for the field
 * @param {string} label - Field label
 * @param {string} inputHtml - The input element HTML
 * @param {string} [error=''] - Error message to display
 * @returns {string}
 */
function formField(fieldId, label, inputHtml, error = '') {
  const errorHtml = error
    ? `<div class="form-field-error" id="${fieldId}-error">${escapeHtml(error)}</div>`
    : '';
  return `
    <div class="form-field" data-field="${fieldId}">
      <ion-label position="stacked" class="form-field-label">${escapeHtml(label)}</ion-label>
      ${inputHtml}
      ${errorHtml}
    </div>
  `;
}

/**
 * Open the task form modal.
 * @param {object} params
 * @param {object|null} [params.task=null] - Task to edit, or null for create mode
 * @param {string|null} [params.defaultDate=null] - Default date in YYYY-MM-DD format for create mode
 * @param {Function} [params.onSave] - Called with sanitized data on successful save
 * @param {Function} [params.onCancel] - Called when modal is dismissed without saving
 * @returns {Promise<HTMLIonModalElement>}
 */
export async function openTaskFormModal({ task = null, defaultDate = null, onSave, onCancel } = {}) {
  modalCounter++;
  const modalId = `task-form-modal-${modalCounter}`;
  const isEditMode = task !== null && task !== undefined;

  // Fetch categories for the select
  let categories = [];
  try {
    categories = await serviceContainer.categoryService.getCategories();
  } catch (err) {
    console.error('[TaskFormModal] Failed to load categories:', err);
  }

  // Pre-populate values for edit mode
  const values = {
    title: task?.title || '',
    description: task?.description || '',
    date: task?.dueDate || task?.date || defaultDate || getCurrentDate(),
    startTime: task?.startTime || '',
    dueTime: task?.dueTime || '',
    duration: task?.duration || '',
    priority: task?.priority || 'medium',
    categoryId: task?.categoryId || '',
    hasReminder: task?.hasReminder || false,
    reminderMinutes: task?.reminderMinutes || 15,
    repeatRule: task?.repeatRule || 'none',
    notes: task?.notes || '',
  };

  const priorityOptions = getPriorityOptions()
    .map((o) => `<ion-select-option value="${o.value}"${values.priority === o.value ? ' selected' : ''}>${o.label}</ion-select-option>`)
    .join('');

  const repeatOptions = getRepeatOptions()
    .map((o) => `<ion-select-option value="${o.value}"${values.repeatRule === o.value ? ' selected' : ''}>${o.label}</ion-select-option>`)
    .join('');

  const categoryOptions = buildCategoryOptions(categories, values.categoryId);

  const modal = document.createElement('ion-modal');
  modal.id = modalId;
  modal.className = 'task-form-modal';
  modal.setAttribute('show-backdrop', 'true');
  modal.setAttribute('can-dismiss', 'true');

  modal.innerHTML = `
    <ion-header>
      <ion-toolbar>
        <ion-title>${isEditMode ? 'Edit Task' : 'New Task'}</ion-title>
        <ion-buttons slot="end">
          <ion-button data-action="close-modal" aria-label="Close form">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form id="${modalId}-form" novalidate>
        ${formField('title', 'Title *', `
          <ion-input
            id="${modalId}-title"
            name="title"
            type="text"
            placeholder="What needs to be done?"
            value="${escapeHtml(values.title)}"
            required
            maxlength="200"
            autocomplete="off"
          ></ion-input>
        `)}

        ${formField('description', 'Description', `
          <ion-textarea
            id="${modalId}-description"
            name="description"
            placeholder="Add details..."
            rows="3"
            maxlength="2000"
            auto-grow="true"
          >${escapeHtml(values.description)}</ion-textarea>
        `)}

        ${formField('date', 'Date', `
          <ion-input
            id="${modalId}-date"
            name="date"
            type="date"
            value="${escapeHtml(values.date)}"
          ></ion-input>
        `)}

        <div class="form-row">
          ${formField('startTime', 'Start Time', `
            <ion-input
              id="${modalId}-startTime"
              name="startTime"
              type="time"
              value="${escapeHtml(values.startTime)}"
            ></ion-input>
          `)}

          ${formField('dueTime', 'Due Time', `
            <ion-input
              id="${modalId}-dueTime"
              name="dueTime"
              type="time"
              value="${escapeHtml(values.dueTime)}"
            ></ion-input>
          `)}
        </div>

        <div class="form-row">
          ${formField('duration', 'Duration (min)', `
            <ion-input
              id="${modalId}-duration"
              name="duration"
              type="number"
              placeholder="30"
              min="1"
              max="1440"
              value="${escapeHtml(values.duration)}"
            ></ion-input>
          `)}

          ${formField('priority', 'Priority', `
            <ion-select id="${modalId}-priority" name="priority" value="${escapeHtml(values.priority)}">
              ${priorityOptions}
            </ion-select>
          `)}
        </div>

        ${formField('category', 'Category', `
          <ion-select id="${modalId}-category" name="categoryId" value="${escapeHtml(values.categoryId)}">
            ${categoryOptions}
          </ion-select>
        `)}

        <div class="form-field" data-field="reminder">
          <ion-item lines="none" class="form-toggle-item">
            <ion-label>Set Reminder</ion-label>
            <ion-toggle
              id="${modalId}-hasReminder"
              name="hasReminder"
              ${values.hasReminder ? 'checked' : ''}
              aria-label="Toggle reminder"
            ></ion-toggle>
          </ion-item>
        </div>

        <div id="${modalId}-reminder-minutes-wrapper" class="form-field form-field--reminder-minutes" data-field="reminderMinutes" style="display:${values.hasReminder ? 'block' : 'none'}">
          <ion-label position="stacked" class="form-field-label">Remind me before (minutes)</ion-label>
          <ion-input
            id="${modalId}-reminderMinutes"
            name="reminderMinutes"
            type="number"
            min="0"
            max="10080"
            value="${escapeHtml(values.reminderMinutes)}"
          ></ion-input>
        </div>

        ${formField('repeatRule', 'Repeat', `
          <ion-select id="${modalId}-repeatRule" name="repeatRule" value="${escapeHtml(values.repeatRule)}">
            ${repeatOptions}
          </ion-select>
        `)}

        ${formField('notes', 'Notes', `
          <ion-textarea
            id="${modalId}-notes"
            name="notes"
            placeholder="Additional notes..."
            rows="2"
            maxlength="1000"
            auto-grow="true"
          >${escapeHtml(values.notes)}</ion-textarea>
        `)}
      </form>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button data-action="close-modal" fill="clear">Cancel</ion-button>
          <ion-button data-action="submit-task" id="${modalId}-submit" fill="solid">
            <ion-spinner id="${modalId}-spinner" style="display:none" slot="start"></ion-spinner>
            <span id="${modalId}-submit-label">${isEditMode ? 'Update' : 'Create'}</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `;

  document.body.appendChild(modal);

  // Track if we're currently saving to prevent double-submits
  let isSaving = false;

  /**
   * Collect form data into a plain object.
   * @returns {object}
   */
  function collectFormData() {
    const form = modal.querySelector(`#${modalId}-form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Convert checkbox/toggle values
    data.hasReminder = modal.querySelector(`#${modalId}-hasReminder`).checked;

    // Convert numeric fields
    if (data.duration) data.duration = parseInt(data.duration, 10);
    if (data.reminderMinutes) data.reminderMinutes = parseInt(data.reminderMinutes, 10);

    // Map categoryId: empty string means no category
    if (data.categoryId === '') data.categoryId = null;

    return data;
  }

  /**
   * Display field-level validation errors.
   * @param {object} errors - Map of field name to error message
   */
  function showFieldErrors(errors) {
    // Clear all existing errors
    modal.querySelectorAll('.form-field-error').forEach((el) => el.remove());
    modal.querySelectorAll('.form-field--invalid').forEach((el) => el.classList.remove('form-field--invalid'));

    for (const [field, message] of Object.entries(errors)) {
      const fieldEl = modal.querySelector(`[data-field="${field}"]`);
      if (fieldEl) {
        fieldEl.classList.add('form-field--invalid');
        const errorEl = document.createElement('div');
        errorEl.className = 'form-field-error';
        errorEl.id = `${modalId}-${field}-error`;
        errorEl.textContent = message;
        fieldEl.appendChild(errorEl);
      }
    }
  }

  /**
   * Clear all field-level errors.
   */
  function clearFieldErrors() {
    modal.querySelectorAll('.form-field-error').forEach((el) => el.remove());
    modal.querySelectorAll('.form-field--invalid').forEach((el) => el.classList.remove('form-field--invalid'));
  }

  /**
   * Set the saving state — disables submit and shows spinner.
   * @param {boolean} saving
   */
  function setSavingState(saving) {
    isSaving = saving;
    const submitBtn = modal.querySelector(`#${modalId}-submit`);
    const spinner = modal.querySelector(`#${modalId}-spinner`);
    const label = modal.querySelector(`#${modalId}-submit-label`);

    submitBtn.disabled = saving;
    spinner.style.display = saving ? 'inline-block' : 'none';
    label.textContent = saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create');
  }

  /**
   * Close the modal.
   */
  function closeModal() {
    modal.dismiss();
  }

  // Toggle reminder minutes visibility
  const reminderToggle = modal.querySelector(`#${modalId}-hasReminder`);
  const reminderWrapper = modal.querySelector(`#${modalId}-reminder-minutes-wrapper`);
  reminderToggle.addEventListener('ionChange', () => {
    reminderWrapper.style.display = reminderToggle.checked ? 'block' : 'none';
  });

  // Close modal handlers
  modal.querySelectorAll('[data-action="close-modal"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal();
      if (onCancel) onCancel();
    });
  });

  // Submit handler
  const submitBtn = modal.querySelector(`#${modalId}-submit`);
  submitBtn.addEventListener('click', async () => {
    if (isSaving) return;

    clearFieldErrors();

    const rawData = collectFormData();
    const validation = validateTaskData(rawData);

    if (!validation.isValid) {
      showFieldErrors(validation.errors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const sanitizedData = sanitizeTaskData(rawData);
    setSavingState(true);

    try {
      if (onSave) {
        await onSave(sanitizedData);
      }
      closeModal();
    } catch (err) {
      console.error('[TaskFormModal] Save failed:', err);
      showToast(err.message || 'Failed to save task', 'error');
      setSavingState(false);
    }
  });

  // Handle modal dismissal (backdrop tap, swipe, etc.)
  modal.onDidDismiss().then(() => {
    modal.remove();
  });

  // Keyboard handling: dismiss on Escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && !isSaving) {
      closeModal();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  await modal.present();
  return modal;
}

export default openTaskFormModal;

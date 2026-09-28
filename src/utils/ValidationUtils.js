/**
 * Input validation utilities.
 */

import { AppError } from './ErrorHandler.js';

/**
 * Validate that a value is not null, undefined, or empty.
 * @param {*} value
 * @param {string} fieldName
 * @throws {AppError}
 */
export function validateRequired(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    throw new AppError(
      `${fieldName} is required`,
      `${fieldName} is required`,
      'VALIDATION_REQUIRED'
    );
  }
}

/**
 * Validate a string value with optional length constraints.
 * @param {*} value
 * @param {string} fieldName
 * @param {object} [options]
 * @param {number} [options.minLength]
 * @param {number} [options.maxLength]
 * @throws {AppError}
 */
export function validateString(value, fieldName, options = {}) {
  validateRequired(value, fieldName);

  if (typeof value !== 'string') {
    throw new AppError(
      `${fieldName} must be a string`,
      `${fieldName} must be a valid text value`,
      'VALIDATION_TYPE'
    );
  }

  const trimmed = value.trim();

  if (options.minLength !== undefined && trimmed.length < options.minLength) {
    throw new AppError(
      `${fieldName} must be at least ${options.minLength} characters`,
      `${fieldName} must be at least ${options.minLength} characters`,
      'VALIDATION_MIN_LENGTH'
    );
  }

  if (options.maxLength !== undefined && trimmed.length > options.maxLength) {
    throw new AppError(
      `${fieldName} must be at most ${options.maxLength} characters`,
      `${fieldName} must be at most ${options.maxLength} characters`,
      'VALIDATION_MAX_LENGTH'
    );
  }
}

/**
 * Validate that a value is a valid date.
 * @param {*} value
 * @param {string} fieldName
 * @throws {AppError}
 */
export function validateDate(value, fieldName) {
  validateRequired(value, fieldName);

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new AppError(
      `${fieldName} is not a valid date`,
      `${fieldName} must be a valid date`,
      'VALIDATION_DATE'
    );
  }
}

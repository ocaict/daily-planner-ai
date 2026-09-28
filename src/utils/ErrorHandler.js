/**
 * Consistent error handling utilities.
 */

/**
 * Application error with optional user-facing message and code.
 */
export class AppError extends Error {
  /**
   * @param {string} message Technical message for logs
   * @param {string} [userMessage] Safe message to show users
   * @param {string} [code] Machine-readable error code
   */
  constructor(message, userMessage, code) {
    super(message);
    this.name = 'AppError';
    this.userMessage = userMessage || 'Something went wrong. Please try again.';
    this.code = code || 'UNKNOWN_ERROR';
  }
}

/**
 * Log error details in development and return a user-friendly message.
 * @param {Error} error
 * @param {string} [context] Where the error occurred
 * @returns {string} User-friendly message
 */
export function handleError(error, context) {
  const prefix = context ? `[${context}] ` : '';

  if (error instanceof AppError) {
    if (import.meta.env.MODE === 'development') {
      console.error(`${prefix}${error.name} (${error.code}):`, error.message);
    }
    return error.userMessage;
  }

  if (import.meta.env.MODE === 'development') {
    console.error(`${prefix}Unexpected error:`, error);
  }

  return 'Something went wrong. Please try again.';
}

/**
 * Wrap an async function with try/catch, returning a fallback on error.
 * @param {Function} fn Async function to wrap
 * @param {*} [fallback] Value to return on error
 * @returns {Function}
 */
export function withErrorHandling(fn, fallback) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, fn.name);
      return fallback;
    }
  };
}

/**
 * Get a human-readable message from any error.
 * Never exposes raw technical details to users.
 * @param {Error} error
 * @returns {string}
 */
export function getDisplayableMessage(error) {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  return 'Something went wrong. Please try again.';
}


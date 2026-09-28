/**
 * DOM helper utilities.
 */

/**
 * Query for a single element.
 * @param {string} selector
 * @returns {Element|null}
 */
export function querySelector(selector) {
  return document.querySelector(selector);
}

/**
 * Query for all matching elements.
 * @param {string} selector
 * @returns {NodeList}
 */
export function querySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Create a new element with optional class and inner HTML.
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [innerHTML]
 * @returns {HTMLElement}
 */
export function createElement(tag, className, innerHTML) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML !== undefined) el.innerHTML = innerHTML;
  return el;
}

/**
 * Attach an event listener to an element.
 * @param {Element} element
 * @param {string} event
 * @param {Function} handler
 */
export function onEvent(element, event, handler) {
  if (!element) return;
  element.addEventListener(event, handler);
}

import AIProvider from './AIProvider.js';

/**
 * Groq AI provider implementation.
 * Stage 0 placeholder — not yet implemented.
 *
 * SECURITY: The API key is accepted but never stored in a way that gets
 * bundled into the client. This provider will throw if instantiated in a
 * browser context to prevent accidental key exposure.
 */
export default class GroqProvider extends AIProvider {
  /**
   * @param {string} apiKey - Groq API key (never persisted or bundled)
   */
  constructor(apiKey) {
    super();

    // Guard against browser context to prevent key exposure in client bundles
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      throw new Error(
        'GroqProvider cannot be instantiated in a browser context. ' +
        'API keys must never be exposed in client-side code.'
      );
    }

    // Store key in a non-enumerable property to reduce accidental exposure
    Object.defineProperty(this, '_apiKey', {
      value: apiKey,
      enumerable: false,
      writable: false,
      configurable: false
    });
  }

  /**
   * @param {string} message
   * @param {object} [context]
   * @returns {Promise<string>}
   */
  async sendMessage(message, context = {}) {
    throw new Error('Groq provider not yet implemented');
  }

  /**
   * @param {Array<{role: string, content: string}>} messages
   * @returns {Promise<string>}
   */
  async chat(messages) {
    throw new Error('Groq provider not yet implemented');
  }

  /**
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('Groq provider not yet implemented');
  }
}

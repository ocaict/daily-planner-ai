/**
 * Abstract base class for AI providers.
 * Defines the interface that all AI providers must implement.
 */
export default class AIProvider {
  constructor() {
    if (new.target === AIProvider) {
      throw new Error('AIProvider is abstract and cannot be instantiated directly');
    }
  }

  /**
   * Send a single message to the AI.
   * @param {string} message
   * @param {object} [context] - Additional context for the message
   * @returns {Promise<string>} AI response
   */
  async sendMessage(message, context = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Have a multi-turn conversation with the AI.
   * @param {Array<{role: string, content: string}>} messages
   * @returns {Promise<string>} AI response
   */
  async chat(messages) {
    throw new Error('Not implemented');
  }

  /**
   * Initialize the provider (e.g., set up connections, validate config).
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('Not implemented');
  }
}

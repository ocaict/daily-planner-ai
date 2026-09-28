/**
 * AI service that delegates to an AI provider.
 * Stage 0 placeholder — all methods throw "Not implemented".
 */
export default class AIService {
  /**
   * @param {import('./AIProvider.js').default} aiProvider
   */
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Initialize the AI service and its underlying provider.
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('Not implemented');
  }

  /**
   * Send a chat message through the AI provider.
   * @param {string} message
   * @returns {Promise<string>}
   */
  async chat(message) {
    throw new Error('Not implemented');
  }

  /**
   * Get AI-powered suggestions based on context.
   * @param {object} context
   * @returns {Promise<Array<string>|string>}
   */
  async getSuggestions(context) {
    throw new Error('Not implemented');
  }
}

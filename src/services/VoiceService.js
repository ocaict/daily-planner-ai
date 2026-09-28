/**
 * Service for voice input/output operations.
 * Stage 0 placeholder — all methods throw "Not implemented".
 */
export default class VoiceService {
  /**
   * Start listening for voice input.
   * @returns {Promise<string>} Transcribed text
   */
  async startListening() {
    throw new Error('Not implemented');
  }

  /**
   * Stop listening for voice input.
   * @returns {Promise<void>}
   */
  async stopListening() {
    throw new Error('Not implemented');
  }

  /**
   * Speak text aloud.
   * @param {string} text
   * @returns {Promise<void>}
   */
  async speak(text) {
    throw new Error('Not implemented');
  }

  /**
   * Stop any ongoing speech.
   * @returns {Promise<void>}
   */
  async stopSpeaking() {
    throw new Error('Not implemented');
  }
}

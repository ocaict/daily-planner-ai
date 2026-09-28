/**
 * AI Page — AI assistant interface with conversation and suggestions.
 * Stage 1: UI only with mock data.
 */

import { renderAiMessage } from '../components/AiMessage.js';
import { renderAiSuggestion } from '../components/AiSuggestion.js';
import { showToast } from '../components/Toast.js';

const MOCK_MESSAGES = [
  { role: 'assistant', text: "Hi! I'm your AI assistant. How can I help you plan your day?" },
  { role: 'user', text: 'What do I have scheduled today?' },
  { role: 'assistant', text: "You have a team standup at 9:00, a design review at 2:00, and you need to write documentation. Would you like me to help prioritize these?" },
];

const MOCK_SUGGESTIONS = [
  'Plan my day',
  'What tasks are due soon?',
  'Help me prioritize',
  'Summarize my schedule',
];

const MOCK_ASSISTANT_RESPONSE =
  "I'm still learning! Full AI capabilities will be available in Stage 2.";
const ASSISTANT_DELAY = 800;

export class AIPage {
  constructor(taskService, categoryService, plannerService, settingsService) {
    this.taskService = taskService;
    this.categoryService = categoryService;
    this.plannerService = plannerService;
    this.settingsService = settingsService;
    this.title = 'AI';
    this.messages = [...MOCK_MESSAGES];
    this.isAssistantTyping = false;

    this._onSuggestionClick = this._onSuggestionClick.bind(this);
    this._onSend = this._onSend.bind(this);
    this._onMicClick = this._onMicClick.bind(this);
    this._onInputKeydown = this._onInputKeydown.bind(this);
  }

  render() {
    const messagesHtml = this.messages.map((msg) => renderAiMessage(msg)).join('');
    const suggestionsHtml = MOCK_SUGGESTIONS.map((text) => renderAiSuggestion(text)).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">AI Assistant</h1>
          <p class="app-text-muted app-text-sm">Plan your day, organize tasks, or ask about your schedule.</p>
        </div>
      </div>
      <div class="page-content ai-page-content">
        <div class="ai-conversation" id="ai-conversation">
          ${messagesHtml}
        </div>
        <div class="ai-suggestions">
          ${suggestionsHtml}
        </div>
        <div class="ai-input-area">
          <input
            type="text"
            id="ai-input"
            class="ai-input-field"
            placeholder="Ask me anything..."
            aria-label="Ask AI"
          />
          <button id="ai-send-btn" class="ai-input-btn ai-send-btn" aria-label="Send message">
            <ion-icon name="send"></ion-icon>
          </button>
          <button id="ai-mic-btn" class="ai-input-btn ai-mic-btn" aria-label="Voice input">
            <ion-icon name="mic"></ion-icon>
          </button>
        </div>
      </div>
    `;
  }

  afterRender(container) {
    // Suggestion chips
    const suggestionChips = container.querySelectorAll('.ai-suggestion-chip');
    suggestionChips.forEach((chip) => {
      chip.addEventListener('click', this._onSuggestionClick);
    });

    // Send button
    const sendBtn = container.querySelector('#ai-send-btn');
    if (sendBtn) sendBtn.addEventListener('click', this._onSend);

    // Microphone button
    const micBtn = container.querySelector('#ai-mic-btn');
    if (micBtn) micBtn.addEventListener('click', this._onMicClick);

    // Input Enter key
    const input = container.querySelector('#ai-input');
    if (input) input.addEventListener('keydown', this._onInputKeydown);

    // Scroll conversation to bottom
    this._scrollToBottom();
  }

  _onSuggestionClick(event) {
    const text = event.currentTarget.getAttribute('data-suggestion');
    if (!text) return;

    const input = document.querySelector('#ai-input');
    if (input) {
      input.value = text;
      input.focus?.();
    }
  }

  _onSend() {
    const input = document.querySelector('#ai-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    this._addMessage('user', text);
    input.value = '';

    // Show mock assistant response after a brief delay
    this.isAssistantTyping = true;
    setTimeout(() => {
      this._addMessage('assistant', MOCK_ASSISTANT_RESPONSE);
      this.isAssistantTyping = false;
    }, ASSISTANT_DELAY);
  }

  _onMicClick() {
    showToast('Voice input coming in Stage 2', 'info', 2000);
  }

  _onInputKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this._onSend();
    }
  }

  _addMessage(role, text) {
    this.messages.push({ role, text });

    const conversation = document.querySelector('#ai-conversation');
    if (conversation) {
      conversation.insertAdjacentHTML('beforeend', renderAiMessage({ role, text }));
      this._scrollToBottom();
    }
  }

  _scrollToBottom() {
    const conversation = document.querySelector('#ai-conversation');
    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight;
    }
  }
}

export default AIPage;

/**
 * AI chat message bubble component.
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
 * Render an AI chat message bubble.
 * @param {object} message - Message object
 * @param {'user'|'assistant'} message.role - Who sent the message
 * @param {string} message.text - Message text content
 * @returns {string} HTML string
 */
export function renderAiMessage(message) {
  const isUser = message.role === 'user';
  const alignmentClass = isUser ? 'ai-message--user' : 'ai-message--assistant';
  const text = escapeHtml(message.text);

  return `
    <div class="ai-message ${alignmentClass}">
      <div class="ai-message-bubble">
        <p class="ai-message-text">${text}</p>
      </div>
    </div>
  `;
}

export default renderAiMessage;

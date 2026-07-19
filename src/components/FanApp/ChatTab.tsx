import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import { QUICK_SUGGESTIONS } from '../../mockData';

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string, imagePreview: string | null) => void;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function MarkdownMessage({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className="msg-text">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator" role="status" aria-label="NexusAI is thinking">
      <div className="typing-dot" style={{ animationDelay: '0ms' }} />
      <div className="typing-dot" style={{ animationDelay: '160ms' }} />
      <div className="typing-dot" style={{ animationDelay: '320ms' }} />
      <span className="typing-label">NEXUS is thinking...</span>
    </div>
  );
}

export function ChatTab({ messages, isTyping, sendMessage }: Props) {
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() && !imagePreview) return;
    sendMessage(inputText, imagePreview);
    setInputText('');
    setImagePreview(null);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text, null);
    setInputText('');
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chat-panel" id="tabpanel-chat" role="tabpanel" aria-labelledby="tab-chat">
      {/* Gemini Badge */}
      <div className="gemini-banner" aria-label="Powered by Google Gemini 2.5 Flash with RAG and function calling">
        <span className="gemini-star" aria-hidden="true">✨</span>
        <span>Powered by <strong>Google Gemini 2.5 Flash</strong> · RAG · Function Calling · Streaming · Multimodal</span>
        <span className="gemini-tokens">↗ active</span>
      </div>

      {/* Messages */}
      <div className="messages-area" role="log" aria-live="polite" aria-label="Conversation with NEXUS AI">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message-row ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}
          >
            {msg.role === 'assistant' && (
              <div className="msg-avatar ai-avatar" aria-hidden="true">⚡</div>
            )}
            <div className={`message-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              {msg.attachments && msg.attachments.map(att => (
                <div key={att.url} className="msg-attachment">
                  {att.type === 'image' && <img src={att.url} alt="Uploaded image for AI analysis" className="msg-image" />}
                  <div className="att-label">
                    <span>🖼️ Image analyzed by Gemini Vision</span>
                  </div>
                </div>
              ))}
              <MarkdownMessage content={msg.content} />
              <div className="msg-meta">
                <span>{formatTime(msg.timestamp)}</span>
                {msg.metadata && (
                  <>
                    <span>·</span>
                    <span>{msg.metadata.agent}</span>
                    {msg.metadata.tokens && <span>· {msg.metadata.tokens} tokens</span>}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="quick-suggestions" role="list" aria-label="Quick question suggestions">
          {QUICK_SUGGESTIONS.map(sugg => (
            <button
              key={sugg.text}
              className="quick-sugg-btn"
              onClick={() => handleSuggestionClick(sugg.text)}
              role="listitem"
              aria-label={`Ask: ${sugg.text}`}
            >
              <span aria-hidden="true">{sugg.icon}</span>
              <span>{sugg.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview-bar" role="status">
          <img src={imagePreview} alt="Preview of uploaded image" className="preview-thumb" />
          <span className="preview-label">Image ready to send</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setImagePreview(null)}
            aria-label="Remove image attachment"
          >✕</button>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area" role="form" aria-label="Chat with NEXUS AI">
        <button
          className="input-action-btn"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image for AI analysis"
          title="Upload image"
          id="upload-image-btn"
        >📷</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleImageUpload}
          aria-label="Select image file"
        />
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask NEXUS anything... food, directions, score, transport 🏆"
          aria-label="Type your message to NEXUS AI"
          id="chat-input"
          autoComplete="off"
        />
        <button
          className="btn btn-primary send-btn"
          onClick={handleSend}
          disabled={!inputText.trim() && !imagePreview}
          aria-label="Send message"
          id="send-message-btn"
        >
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  );
}

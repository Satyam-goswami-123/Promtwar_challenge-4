import { useState, useRef, useEffect } from 'react';
import type { Language } from '../types';
import {
  MULTILINGUAL_GREETINGS, QUICK_SUGGESTIONS,
  AI_LANGUAGES, STADIUM_VENUES, MOCK_TRANSPORT, MATCH_EVENTS
} from '../mockData';
import { useChat } from '../hooks/useChat';
import { useLiveTimer } from '../hooks/useLiveTimer';
import './FanApp.css';

interface Props {
  onBack: () => void;
}

type FanTab = 'chat' | 'stadium' | 'match' | 'transport' | 'accessibility';

const venue = STADIUM_VENUES[0];

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

export default function FanApp({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<FanTab>('chat');
  const [language, setLanguage] = useState<Language>('en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const { messages, setMessages, isTyping, sendMessage } = useChat([]);
  
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const liveMinute = useLiveTimer(30000, 90, 67);
  const [score, setScore] = useState({ home: 2, away: 1 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const greeting = MULTILINGUAL_GREETINGS[language];
    setMessages([{
      id: 'init',
      role: 'assistant',
      content: `${greeting.greeting}\n\n${greeting.prompt}\n\nI'm **NEXUS**, your personal FIFA World Cup 2026 AI guide. I can help you navigate AT&T Stadium, check live scores, find food and restrooms, arrange transport, and much more. Ask me anything — I understand ${greeting.lang} and 49 other languages! 🌍`,
      timestamp: new Date(),
      metadata: { agent: 'FanAssistantAgent', model: 'gemini-1.5-pro', ragSources: ['stadium-kb', 'faq-db'] }
    }]);
  }, [language]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    if (highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
    
    if (largeText) document.body.classList.add('large-text');
    else document.body.classList.remove('large-text');
  }, [highContrast, largeText]);

  const currentGreeting = MULTILINGUAL_GREETINGS[language];

  return (
    <div className="fan-app" role="main" aria-label="NexusAI Fan App">
      {/* Top Nav */}
      <nav className="fan-nav" role="navigation" aria-label="Fan app navigation">
        <div className="fan-nav-inner">
          <button
            className="btn btn-ghost btn-sm back-btn"
            onClick={onBack}
            aria-label="Back to portal selection"
            id="fan-back-btn"
          >
            ← Back
          </button>

          <div className="fan-logo">
            <span className="fan-logo-icon">⚡</span>
            <div>
              <div className="fan-logo-name">NEXUS</div>
              <div className="fan-logo-sub">Fan AI Assistant</div>
            </div>
          </div>

          <div className="fan-nav-actions">
            {/* Language Picker */}
            <div className="lang-picker-wrap">
              <button
                className="btn btn-ghost btn-sm lang-btn"
                onClick={() => setShowLangPicker(!showLangPicker)}
                aria-label={`Language: ${currentGreeting.lang}. Click to change`}
                aria-expanded={showLangPicker}
                id="language-picker-btn"
              >
                🌐 {language.toUpperCase()}
              </button>
              {showLangPicker && (
                <div className="lang-dropdown" role="listbox" aria-label="Select language">
                  {AI_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      className={`lang-option ${language === lang.code ? 'lang-active' : ''}`}
                      onClick={() => { setLanguage(lang.code as Language); setShowLangPicker(false); }}
                      role="option"
                      aria-selected={language === lang.code}
                      id={`lang-${lang.code}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="fan-seat-badge" aria-label="Your seat: Section 14C, Row 8, Gate 3">
              🎫 14C · R8 · G3
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="fan-tabs" role="tablist" aria-label="Fan app sections">
          {([
            { id: 'chat', icon: '🤖', label: 'AI Chat' },
            { id: 'stadium', icon: '🏟️', label: 'Stadium' },
            { id: 'match', icon: '⚽', label: 'Match' },
            { id: 'transport', icon: '🚌', label: 'Transport' },
            { id: 'accessibility', icon: '♿', label: 'Access' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              className={`fan-tab ${activeTab === tab.id ? 'fan-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <div className="fan-content">

        {/* ---- CHAT TAB ---- */}
        {activeTab === 'chat' && (
          <div className="chat-panel" id="tabpanel-chat" role="tabpanel" aria-labelledby="tab-chat">
            {/* Gemini Badge */}
            <div className="gemini-banner" aria-label="Powered by Google Gemini 1.5 Pro with RAG and function calling">
              <span className="gemini-star" aria-hidden="true">✨</span>
              <span>Powered by <strong>Google Gemini 1.5 Pro</strong> · RAG · Function Calling · Streaming · Multimodal</span>
              <span className="gemini-tokens">↗ 0ms latency</span>
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
                  {msg.role === 'user' && (
                    <div className="msg-avatar user-avatar" aria-hidden="true">👤</div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message-row msg-ai">
                  <div className="msg-avatar ai-avatar" aria-hidden="true">⚡</div>
                  <TypingIndicator />
                </div>
              )}
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
        )}

        {/* ---- STADIUM TAB ---- */}
        {activeTab === 'stadium' && (
          <div className="stadium-panel page-enter" id="tabpanel-stadium" role="tabpanel" aria-labelledby="tab-stadium">
            <div className="panel-header">
              <h2>AT&T Stadium — Live Crowd Map</h2>
              <div className="panel-meta">
                <span className="status-dot live" aria-hidden="true"></span>
                <span>Real-time density · Updated 5s ago</span>
              </div>
            </div>

            {/* Weather Bar */}
            <div className="weather-bar glass-card">
              <div className="weather-item">
                <span className="weather-icon" aria-hidden="true">{venue.weather.icon}</span>
                <div>
                  <div className="weather-val">{venue.weather.temp}°C</div>
                  <div className="weather-label">{venue.weather.condition}</div>
                </div>
              </div>
              <div className="weather-item">
                <span>💨</span>
                <div>
                  <div className="weather-val">{venue.weather.wind_speed} km/h</div>
                  <div className="weather-label">Wind</div>
                </div>
              </div>
              <div className="weather-item">
                <span>💧</span>
                <div>
                  <div className="weather-val">{venue.weather.humidity}%</div>
                  <div className="weather-label">Humidity</div>
                </div>
              </div>
              <div className="weather-item heat-warning">
                <span>☀️</span>
                <div>
                  <div className="weather-val">UV {venue.weather.uv_index}</div>
                  <div className="weather-label" style={{ color: 'var(--nexus-gold)' }}>⚠️ High</div>
                </div>
              </div>
              <div className="weather-item">
                <span>👥</span>
                <div>
                  <div className="weather-val">{venue.currentAttendance.toLocaleString()}</div>
                  <div className="weather-label">Attendance</div>
                </div>
              </div>
            </div>

            {/* Crowd Zones */}
            <div className="zones-grid">
              {venue.zones.map(zone => (
                <div
                  key={zone.id}
                  className={`zone-card glass-card zone-${zone.status}`}
                  role="article"
                  aria-label={`${zone.name}: ${zone.density}% density, status ${zone.status}`}
                >
                  <div className="zone-header">
                    <div className="zone-name">{zone.name}</div>
                    <span className={`badge ${
                      zone.status === 'critical' ? 'badge-red' :
                      zone.status === 'crowded' ? 'badge-gold' :
                      zone.status === 'moderate' ? 'badge-blue' : 'badge-green'
                    }`}>
                      {zone.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="zone-density">
                    <div className="density-number">{zone.density}<span>%</span></div>
                    <div className="density-label">Crowd Density</div>
                  </div>

                  <div className="progress-bar" role="progressbar" aria-valuenow={zone.density} aria-valuemin={0} aria-valuemax={100} aria-label={`Density: ${zone.density}%`}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${zone.density}%`,
                        background: zone.density > 85 ? 'var(--nexus-red)' : zone.density > 65 ? 'var(--nexus-gold)' : 'var(--nexus-green)'
                      }}
                    />
                  </div>

                  <div className="zone-stats">
                    <div className="zone-stat">
                      <span>👥</span>
                      <span>{zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                    </div>
                    <div className="zone-stat">
                      <span>↗</span>
                      <span>{zone.flowRate}/min</span>
                    </div>
                    {zone.prediction15min !== undefined && (
                      <div className="zone-stat ai-pred">
                        <span>🔮</span>
                        <span>→ {zone.prediction15min}% in 15min</span>
                      </div>
                    )}
                  </div>

                  {zone.alerts.length > 0 && (
                    <div className="zone-alert" role="alert">
                      <span aria-hidden="true">⚠️</span>
                      <span>{zone.alerts[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* My Seat Card */}
            <div className="my-seat-card glass-card">
              <div className="seat-icon" aria-hidden="true">🎫</div>
              <div className="seat-info">
                <div className="seat-title">Your Seat</div>
                <div className="seat-detail">Section 14C · Row 8 · Seat 22</div>
                <div className="seat-gate">Gate 3 · Level 3 · Upper West Stand</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setActiveTab('chat'); sendMessage('How do I get to my seat from Gate 3?'); }}
                aria-label="Get AI directions to your seat"
                id="get-directions-btn"
              >
                Get Directions 🗺️
              </button>
            </div>
          </div>
        )}

        {/* ---- MATCH TAB ---- */}
        {activeTab === 'match' && (
          <div className="match-panel page-enter" id="tabpanel-match" role="tabpanel" aria-labelledby="tab-match">
            <div className="panel-header">
              <h2>Live Match Center</h2>
              <div className="panel-meta">
                <span className="status-dot live" aria-hidden="true"></span>
                <span>Quarter-Final · AT&T Stadium</span>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="scoreboard glass-card" aria-label={`Live score: Brazil ${score.home} Argentina ${score.away}, ${liveMinute} minutes played`}>
              <div className="stage-tag">⚽ Quarter-Final · FIFA World Cup 2026</div>
              <div className="score-row">
                <div className="team-block">
                  <div className="team-flag" aria-hidden="true">🇧🇷</div>
                  <div className="team-name">Brazil</div>
                  <div className="team-code">BRA</div>
                </div>
                <div className="score-center">
                  <div className="score-display">{score.home} – {score.away}</div>
                  <div className="match-clock">
                    <span className="status-dot live" aria-hidden="true"></span>
                    <span>{liveMinute}'</span>
                  </div>
                  <div className="ht-info">Second Half</div>
                </div>
                <div className="team-block">
                  <div className="team-flag" aria-hidden="true">🇦🇷</div>
                  <div className="team-name">Argentina</div>
                  <div className="team-code">ARG</div>
                </div>
              </div>

              {/* Possession bar */}
              <div className="possession-bar">
                <span className="poss-val">54%</span>
                <div className="poss-track">
                  <div className="poss-fill" style={{ width: '54%', background: '#009C3B' }} />
                </div>
                <span className="poss-val">46%</span>
              </div>
              <div className="poss-label">Possession</div>
            </div>

            {/* Match Events */}
            <div className="events-section">
              <h3 className="events-title">Match Timeline</h3>
              <div className="events-list" role="list" aria-label="Match events">
                {MATCH_EVENTS.slice().reverse().map((ev, i) => (
                  <div key={i} className="event-item" role="listitem">
                    <div className={`event-minute ${ev.team === 'BRA' ? 'ev-green' : 'ev-blue'}`}>
                      {ev.minute}'
                    </div>
                    <div className="event-icon">
                      {ev.type === 'goal' ? '⚽' : ev.type === 'yellow_card' ? '🟨' : '🔄'}
                    </div>
                    <div className="event-details">
                      <div className="event-player">{ev.player}</div>
                      <div className="event-desc">{ev.description}</div>
                    </div>
                    <div className={`event-team-flag ${ev.type === 'goal' ? 'goal-flag' : ''}`}>
                      {ev.team === 'BRA' ? '🇧🇷' : '🇦🇷'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="match-stats glass-card">
              <h3 className="stats-title">Match Statistics</h3>
              {[
                { label: 'Shots on Target', bra: 8, arg: 6 },
                { label: 'Total Shots', bra: 12, arg: 9 },
                { label: 'Corners', bra: 7, arg: 4 },
                { label: 'Fouls', bra: 9, arg: 12 },
                { label: 'Yellow Cards', bra: 1, arg: 2 },
              ].map(stat => (
                <div key={stat.label} className="stat-row-match">
                  <span className="stat-num-left">{stat.bra}</span>
                  <div className="stat-bar-wrap">
                    <div className="stat-label-center">{stat.label}</div>
                    <div className="dual-bar">
                      <div className="bar-bra" style={{ width: `${(stat.bra / (stat.bra + stat.arg)) * 100}%` }} />
                      <div className="bar-arg" style={{ width: `${(stat.arg / (stat.bra + stat.arg)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="stat-num-right">{stat.arg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- TRANSPORT TAB ---- */}
        {activeTab === 'transport' && (
          <div className="transport-panel page-enter" id="tabpanel-transport" role="tabpanel" aria-labelledby="tab-transport">
            <div className="panel-header">
              <h2>Transport & Exit Planning</h2>
              <div className="panel-meta">
                <span className="status-dot live" aria-hidden="true"></span>
                <span>AI-optimized recommendations · Live wait times</span>
              </div>
            </div>

            {/* AI Transport Insight */}
            <div className="ai-insight-card">
              <div className="insight-header">
                <span className="insight-icon" aria-hidden="true">🔮</span>
                <div>
                  <div className="insight-title">AI Post-Match Prediction</div>
                  <div className="insight-sub">Based on match status (67') and historical patterns</div>
                </div>
                <span className="badge badge-red">89% Confidence</span>
              </div>
              <p className="insight-body">
                Rapid simultaneous exit predicted in <strong>~23 minutes</strong>.
                Book rideshare NOW for best price (1.4x surge). Metro Orange Line is the fastest option.
                Recommend staying seated for <strong>15 min post-match</strong> to avoid peak crush.
              </p>
            </div>

            {/* Transport Options */}
            <div className="transport-list" role="list" aria-label="Transport options">
              {MOCK_TRANSPORT.map((t, i) => (
                <div
                  key={i}
                  className={`transport-card glass-card transport-${t.status}`}
                  role="listitem"
                  aria-label={`${t.name}: ${t.waitTime} minute wait, status ${t.status}`}
                >
                  <div className="transport-icon">
                    {t.type === 'metro' ? '🚇' : t.type === 'shuttle' ? '🚌' : t.type === 'parking' ? '🅿️' : t.type === 'rideshare' ? '🚗' : '🚌'}
                  </div>
                  <div className="transport-info">
                    <div className="transport-name">{t.name}</div>
                    {t.aiRecommendation && (
                      <div className="transport-ai-rec">
                        <span aria-hidden="true">✨</span>
                        {t.aiRecommendation}
                      </div>
                    )}
                    {t.capacity && (
                      <div className="transport-capacity">
                        <div className="progress-bar transport-bar">
                          <div className="progress-fill" style={{
                            width: `${((t.occupancy || 0) / t.capacity) * 100}%`,
                            background: ((t.occupancy || 0) / t.capacity) > 0.8 ? 'var(--nexus-red)' : 'var(--nexus-green)'
                          }} />
                        </div>
                        <span className="cap-label">{t.occupancy}/{t.capacity}</span>
                      </div>
                    )}
                  </div>
                  <div className="transport-wait">
                    <div className={`wait-time ${t.status === 'delayed' ? 'wait-delayed' : ''}`}>
                      {t.waitTime}m
                    </div>
                    <div className="wait-label">wait</div>
                    <span className={`badge ${t.status === 'normal' ? 'badge-green' : t.status === 'delayed' ? 'badge-gold' : 'badge-red'}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- ACCESSIBILITY TAB ---- */}
        {activeTab === 'accessibility' && (
          <div className="access-panel page-enter" id="tabpanel-accessibility" role="tabpanel" aria-labelledby="tab-accessibility">
            <div className="panel-header">
              <h2>Accessibility Services</h2>
              <div className="panel-meta">
                <span className="status-dot live" aria-hidden="true"></span>
                <span>WCAG 2.2 AA · All services active</span>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="access-grid" role="list">
              {[
                { icon: '♿', title: 'Wheelchair Routes', desc: 'AI-guided accessible paths to any location', btn: 'Find Route', color: 'var(--nexus-blue)' },
                { icon: '🦺', title: 'Request Assistance', desc: 'A volunteer will reach you within 3 minutes', btn: 'Request Now', color: 'var(--nexus-green)' },
                { icon: '🔊', title: 'Audio Descriptions', desc: 'Live crowd and match audio narration', btn: 'Enable Audio', color: 'var(--nexus-purple)' },
                { icon: '🔤', title: 'Sign Language', desc: 'Video interpreter available for key moments', btn: 'Connect', color: 'var(--nexus-cyan)' },
                { icon: '🚿', title: 'Accessible Restrooms', desc: '3 accessible facilities near your section', btn: 'Navigate', color: 'var(--nexus-gold)' },
                { icon: '🅿️', title: 'Accessible Parking', desc: 'Lot A3 reserved spots — 8 available', btn: 'Reserve', color: 'var(--nexus-red)' },
              ].map(item => (
                <div
                  key={item.title}
                  className="access-card glass-card"
                  role="listitem"
                  aria-label={`${item.title}: ${item.desc}`}
                >
                  <div className="access-icon" style={{ background: `${item.color}22`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="access-content">
                    <div className="access-title">{item.title}</div>
                    <div className="access-desc">{item.desc}</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm access-btn"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
                    onClick={() => { setActiveTab('chat'); sendMessage(`I need ${item.title.toLowerCase()}`); }}
                    aria-label={`${item.btn} for ${item.title}`}
                    id={`access-${item.title.toLowerCase().replace(/\s/g, '-')}-btn`}
                  >
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <div className="emergency-card glass-card" role="region" aria-label="Emergency contacts">
              <div className="emergency-header">
                <span aria-hidden="true">🚨</span>
                <strong>Emergency Contacts</strong>
              </div>
              <div className="emergency-contacts">
                <div className="emergency-contact">
                  <span>🏥 Medical Emergency</span>
                  <a href="tel:+18003426245" className="btn btn-danger btn-sm" aria-label="Call medical emergency">Call EMS</a>
                </div>
                <div className="emergency-contact">
                  <span>🔒 Security</span>
                  <a href="tel:+18003426245" className="btn btn-ghost btn-sm" aria-label="Call security">Call Security</a>
                </div>
                <div className="emergency-contact">
                  <span>♿ Accessibility Coordinator</span>
                  <a href="tel:+18003426245" className="btn btn-ghost btn-sm" aria-label="Call accessibility coordinator">Call +1-800-FIFA-ACC</a>
                </div>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="contrast-toggle glass-card" role="region" aria-label="Display settings">
              <span>🎨 Display Settings</span>
              <div className="toggle-group">
                <label className="toggle-label">
                  <input type="checkbox" aria-label="Enable high contrast mode" id="high-contrast-toggle" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} />
                  <span>High Contrast Mode</span>
                </label>
                <label className="toggle-label">
                  <input type="checkbox" aria-label="Enable large text mode" id="large-text-toggle" checked={largeText} onChange={e => setLargeText(e.target.checked)} />
                  <span>Large Text</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

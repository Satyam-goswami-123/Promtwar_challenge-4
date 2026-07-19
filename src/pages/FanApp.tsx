import { useState, useEffect } from 'react';
import type { Language } from '../types';
import { MULTILINGUAL_GREETINGS, AI_LANGUAGES } from '../mockData';
import { useChat } from '../hooks/useChat';
import { useLiveTimer } from '../hooks/useLiveTimer';
import './FanApp.css';

// Import modular tab components
import { ChatTab } from '../components/FanApp/ChatTab';
import { StadiumTab } from '../components/FanApp/StadiumTab';
import { MatchTab } from '../components/FanApp/MatchTab';
import { TransportTab } from '../components/FanApp/TransportTab';
import { AccessibilityTab } from '../components/FanApp/AccessibilityTab';

interface Props {
  onBack: () => void;
}

type FanTab = 'chat' | 'stadium' | 'match' | 'transport' | 'accessibility';

export default function FanApp({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<FanTab>('chat');
  const [language, setLanguage] = useState<Language>('en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const { messages, setMessages, isTyping, sendMessage } = useChat([]);
  const liveMinute = useLiveTimer(30000, 90, 67);

  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Initialize with greeting
  useEffect(() => {
    const greeting = MULTILINGUAL_GREETINGS[language];
    setMessages([{
      id: 'init',
      role: 'assistant',
      content: `${greeting.greeting}\n\n${greeting.prompt}\n\nI'm **NEXUS**, your personal FIFA World Cup 2026 AI guide. I can help you navigate AT&T Stadium, check live scores, find food and restrooms, arrange transport, and much more. Ask me anything — I understand ${greeting.lang} and 49 other languages! 🌍`,
      timestamp: new Date(),
      metadata: { agent: 'FanAssistantAgent', model: 'gemini-2.5-flash', ragSources: ['stadium-kb', 'faq-db'] }
    }]);
  }, [language, setMessages]);

  // Display toggles
  useEffect(() => {
    if (highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
    
    if (largeText) document.body.classList.add('large-text');
    else document.body.classList.remove('large-text');
  }, [highContrast, largeText]);

  const currentGreeting = MULTILINGUAL_GREETINGS[language];

  const handleNavigateToChat = (prompt: string) => {
    setActiveTab('chat');
    sendMessage(prompt, null);
  };

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
        {activeTab === 'chat' && (
          <ChatTab
            messages={messages}
            isTyping={isTyping}
            sendMessage={sendMessage}
          />
        )}

        {activeTab === 'stadium' && (
          <StadiumTab
            onNavigateToChat={handleNavigateToChat}
          />
        )}

        {activeTab === 'match' && (
          <MatchTab
            liveMinute={liveMinute}
          />
        )}

        {activeTab === 'transport' && (
          <TransportTab />
        )}

        {activeTab === 'accessibility' && (
          <AccessibilityTab
            onNavigateToChat={handleNavigateToChat}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            largeText={largeText}
            setLargeText={setLargeText}
          />
        )}
      </div>
    </div>
  );
}

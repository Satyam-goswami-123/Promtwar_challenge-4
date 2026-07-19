interface Props {
  onNavigateToChat: (message: string) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
}

export function AccessibilityTab({
  onNavigateToChat,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText
}: Props) {
  return (
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
              onClick={() => onNavigateToChat(`I need ${item.title.toLowerCase()}`)}
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
  );
}

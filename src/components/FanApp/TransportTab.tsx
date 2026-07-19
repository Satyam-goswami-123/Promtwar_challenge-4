import { MOCK_TRANSPORT } from '../../mockData';

export function TransportTab() {
  return (
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
  );
}

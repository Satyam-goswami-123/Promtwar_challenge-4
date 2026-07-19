import { STADIUM_VENUES } from '../../mockData';

interface Props {
  onNavigateToChat: (message: string) => void;
}

const venue = STADIUM_VENUES[0];

export function StadiumTab({ onNavigateToChat }: Props) {
  return (
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
          onClick={() => onNavigateToChat('How do I get to my seat from Gate 3?')}
          aria-label="Get AI directions to your seat"
          id="get-directions-btn"
        >
          Get Directions 🗺️
        </button>
      </div>
    </div>
  );
}

import { MATCH_EVENTS } from '../../mockData';

interface Props {
  liveMinute: number;
}

export function MatchTab({ liveMinute }: Props) {
  return (
    <div className="match-panel page-enter" id="tabpanel-match" role="tabpanel" aria-labelledby="tab-match">
      <div className="panel-header">
        <h2>Live Match Center</h2>
        <div className="panel-meta">
          <span className="status-dot live" aria-hidden="true"></span>
          <span>Quarter-Final · AT&T Stadium</span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard glass-card" aria-label={`Live score: Brazil 2 Argentina 1, ${liveMinute} minutes played`}>
        <div className="stage-tag">⚽ Quarter-Final · FIFA World Cup 2026</div>
        <div className="score-row">
          <div className="team-block">
            <div className="team-flag" aria-hidden="true">🇧🇷</div>
            <div className="team-name">Brazil</div>
            <div className="team-code">BRA</div>
          </div>
          <div className="score-center">
            <div className="score-display">2 – 1</div>
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
  );
}

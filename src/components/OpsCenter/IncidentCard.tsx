import type { Incident } from '../../types';
import { SeverityBadge, TypeIcon } from './Shared';

export function IncidentCard({ incident, isSelected, onClick }: {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}) {
  const elapsed = Math.floor((Date.now() - incident.reportedAt.getTime()) / 60000);

  return (
    <button
      className={`incident-card glass-card ${isSelected ? 'incident-selected' : ''} severity-${incident.severity}`}
      onClick={onClick}
      aria-label={`${incident.severity} ${incident.type} incident: ${incident.title}. ${elapsed} minutes ago. Status: ${incident.status}`}
      aria-pressed={isSelected}
      id={`incident-${incident.id}`}
    >
      <div className="inc-header">
        <TypeIcon type={incident.type} />
        <div className="inc-title">{incident.title}</div>
        <div className="inc-right">
          <SeverityBadge severity={incident.severity} />
          {incident.severity === 'critical' || incident.severity === 'high' ? (
            <span className="status-dot critical" aria-hidden="true" />
          ) : (
            <span className="status-dot warning" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="inc-meta">
        <span>📍 {incident.location.description}</span>
        <span>⏱ {elapsed}m ago</span>
        <span className={`inc-status-badge ${incident.status}`}>
          {incident.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      {incident.assignedTo && incident.assignedTo.length > 0 && (
        <div className="inc-assigned">
          Assigned: {incident.assignedTo.join(' · ')}
        </div>
      )}
    </button>
  );
}

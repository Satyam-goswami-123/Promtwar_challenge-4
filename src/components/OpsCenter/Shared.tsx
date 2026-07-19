export function SeverityBadge({ severity }: { severity: string }) {
  const cls = severity === 'critical' ? 'badge-red' : severity === 'high' ? 'badge-red' : severity === 'medium' ? 'badge-gold' : 'badge-green';
  return <span className={`badge ${cls}`}>{severity.toUpperCase()}</span>;
}

export function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = { medical: '🏥', security: '🔒', crowd: '👥', fire: '🔥', infrastructure: '⚙️', weather: '🌩️', vip: '⭐' };
  return <span aria-hidden="true">{icons[type] || '⚠️'}</span>;
}

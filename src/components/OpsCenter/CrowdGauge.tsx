export function CrowdGauge({ density, name, status }: { density: number; name: string; status: string }) {
  const color = density > 85 ? 'var(--nexus-red)' : density > 65 ? 'var(--nexus-gold)' : 'var(--nexus-green)';
  const angle = (density / 100) * 180 - 90;

  return (
    <div className="crowd-gauge" role="img" aria-label={`${name}: ${density}% crowd density, ${status}`}>
      <svg viewBox="0 0 120 70" className="gauge-svg">
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(density / 100) * 157} 157`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <g transform={`translate(60,60) rotate(${angle})`}>
          <line x1="0" y1="0" x2="0" y2="-35" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="4" fill={color} />
        </g>
        <text x="60" y="52" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="900" fontFamily="Outfit,sans-serif">{density}%</text>
      </svg>
      <div className="gauge-name">{name}</div>
      <span className={`badge ${status === 'critical' ? 'badge-red' : status === 'crowded' ? 'badge-gold' : 'badge-green'}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}

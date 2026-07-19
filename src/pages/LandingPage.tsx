import { useState, useEffect } from 'react';
import type { AppView, UserRole } from '../types';
import './LandingPage.css';

interface Props {
  onNavigate: (view: AppView['current'], role?: UserRole) => void;
}

const STATS = [
  { value: '48', label: 'AI Agents Active', suffix: '' },
  { value: '74', label: 'Fans Served', suffix: 'K+' },
  { value: '99.7', label: 'Uptime', suffix: '%' },
  { value: '50', label: 'Languages Supported', suffix: '+' },
];

const PORTALS = [
  {
    id: 'fan',
    icon: '🏟️',
    title: 'Fan Super App',
    subtitle: 'Your AI stadium companion',
    description: 'Multimodal AI assistant • Live scores • Seat navigation • Food ordering • Multilingual support in 50+ languages',
    badge: 'FAN EXPERIENCE',
    badgeClass: 'badge-blue',
    cta: 'Enter Fan App',
    role: 'fan' as UserRole,
    gradient: 'linear-gradient(135deg, #0057FF 0%, #00D4FF 100%)',
    glow: 'rgba(0, 87, 255, 0.3)',
    features: ['🤖 Gemini AI Assistant', '🗺️ AR Wayfinding', '🍔 Smart Food Orders', '⚽ Live Match Intel'],
  },
  {
    id: 'ops',
    icon: '⚡',
    title: 'Ops Command Center',
    subtitle: 'Real-time stadium intelligence',
    description: 'AI-powered incident management • Crowd flow analytics • Predictive alerts • Multi-agency coordination dashboard',
    badge: 'OPERATIONS',
    badgeClass: 'badge-gold',
    cta: 'Enter Ops Center',
    role: 'ops' as UserRole,
    gradient: 'linear-gradient(135deg, #FFB800 0%, #FF6B00 100%)',
    glow: 'rgba(255, 184, 0, 0.3)',
    features: ['📊 Live Crowd Analytics', '🚨 AI Incident Response', '🔮 Predictive Alerts', '📋 Auto Situation Reports'],
  },
  {
    id: 'volunteer',
    icon: '🤝',
    title: 'Volunteer Co-Pilot',
    subtitle: 'AI-prioritized task management',
    description: 'Smart task queue • Voice-to-action • Resource locator • Real-time coordination with ops and security teams',
    badge: 'VOLUNTEER',
    badgeClass: 'badge-green',
    cta: 'Enter Volunteer App',
    role: 'volunteer' as UserRole,
    gradient: 'linear-gradient(135deg, #00E87A 0%, #00B8D4 100%)',
    glow: 'rgba(0, 232, 122, 0.3)',
    features: ['📋 AI Task Queue', '🎙️ Voice Commands', '📍 Resource Locator', '⚡ Priority Scoring'],
  },
];

export default function LandingPage({ onNavigate }: Props) {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="landing-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Header */}
      <header className="landing-header" role="banner">
        <div className="container">
          <div className="header-inner">
            <div className="logo-group">
              <div className="logo-icon" aria-hidden="true">⚡</div>
              <div className="logo-text">
                <span className="logo-name">NexusAI Stadium</span>
                <span className="logo-tagline">FIFA World Cup 2026</span>
              </div>
            </div>
            <div className="header-meta">
              <div className="live-indicator" role="status" aria-live="polite">
                <span className="status-dot live" aria-hidden="true"></span>
                <span className="live-text">LIVE</span>
              </div>
              <div className="current-time" aria-label={`Current time: ${liveTime.toLocaleTimeString()}`}>
                {liveTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="match-live-badge">
                <span>🇧🇷 BRA 2–1 ARG 🇦🇷</span>
                <span className="match-min">67'</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="landing-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge-group">
              <span className="badge badge-blue">Powered by Google Gemini</span>
              <span className="badge badge-gold">FIFA 2026 Innovation Platform</span>
            </div>

            <h1 className="hero-title">
              The AI Brain of
              <span className="title-gradient"> FIFA World Cup 2026</span>
            </h1>

            <p className="hero-description">
              NexusAI Stadium is a production-grade Generative AI platform unifying{' '}
              <strong>fans, operations, security, volunteers, and accessibility teams</strong> through
              real-time multi-agent intelligence — serving 1 billion+ moments across 16 FIFA venues.
            </p>

            {/* Stats Row */}
            <div className="stats-row" role="list" aria-label="Platform statistics">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`stat-card ${animatedStats ? 'stat-visible' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  role="listitem"
                >
                  <div className="stat-value">
                    {stat.value}
                    <span className="stat-suffix">{stat.suffix}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Architecture badges */}
            <div className="arch-badges" aria-label="Technology stack">
              {['Gemini 1.5 Pro', 'Multi-Agent AI', 'RAG + Vector DB', 'Real-Time WebSockets', 'WCAG 2.2 AA', '50+ Languages'].map(tech => (
                <span key={tech} className="arch-badge">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Portal Selection */}
      <section className="portals-section" aria-labelledby="portals-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="portals-heading" className="section-title">Choose Your Experience</h2>
            <p className="section-subtitle">
              Every stakeholder. Every role. One intelligent platform.
            </p>
          </div>

          <div className="portals-grid" role="list">
            {PORTALS.map((portal) => (
              <article
                key={portal.id}
                className={`portal-card glass-card ${activePortal === portal.id ? 'portal-active' : ''}`}
                onMouseEnter={() => setActivePortal(portal.id)}
                onMouseLeave={() => setActivePortal(null)}
                role="listitem"
                aria-label={`${portal.title}: ${portal.subtitle}`}
              >
                <div
                  className="portal-top-bar"
                  style={{ background: portal.gradient }}
                  aria-hidden="true"
                />

                <div className="portal-body">
                  <div className="portal-icon" style={{ background: portal.gradient }} aria-hidden="true">
                    {portal.icon}
                  </div>

                  <span className={`badge ${portal.badgeClass}`}>{portal.badge}</span>

                  <h3 className="portal-title">{portal.title}</h3>
                  <p className="portal-subtitle">{portal.subtitle}</p>
                  <p className="portal-description">{portal.description}</p>

                  <ul className="portal-features" aria-label="Features">
                    {portal.features.map(f => (
                      <li key={f} className="portal-feature">
                        <span aria-hidden="true">{f.split(' ')[0]}</span>
                        <span>{f.split(' ').slice(1).join(' ')}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn btn-primary btn-lg portal-cta"
                    style={{ background: portal.gradient, boxShadow: `0 8px 32px ${portal.glow}` }}
                    onClick={() => onNavigate(portal.id as AppView['current'], portal.role)}
                    aria-label={`${portal.cta} — ${portal.title}`}
                    id={`portal-${portal.id}-btn`}
                  >
                    {portal.cta}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI Architecture Section */}
      <section className="arch-section" aria-labelledby="arch-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="arch-heading" className="section-title">Multi-Agent AI Architecture</h2>
            <p className="section-subtitle">6 specialized Gemini agents working in concert</p>
          </div>

          <div className="arch-diagram" role="img" aria-label="AI system architecture diagram">
            <div className="arch-layer layer-frontend">
              <div className="layer-label">FRONTEND</div>
              <div className="arch-nodes">
                {['Fan PWA', 'Ops Dashboard', 'Volunteer App', 'Accessibility Kiosk'].map(n => (
                  <div key={n} className="arch-node node-blue">{n}</div>
                ))}
              </div>
            </div>

            <div className="arch-arrows" aria-hidden="true">
              <div className="arrow-line">WSS / HTTPS ↕</div>
            </div>

            <div className="arch-layer layer-bff">
              <div className="layer-label">BFF GATEWAY</div>
              <div className="arch-nodes">
                {['Auth (Firebase)', 'WebSocket Hub', 'RBAC Middleware', 'Rate Limiting'].map(n => (
                  <div key={n} className="arch-node node-gold">{n}</div>
                ))}
              </div>
            </div>

            <div className="arch-arrows" aria-hidden="true">
              <div className="arrow-line">gRPC / REST ↕</div>
            </div>

            <div className="arch-layer layer-ai">
              <div className="layer-label">AI ORCHESTRATOR</div>
              <div className="arch-nodes">
                {['Fan Agent', 'Crowd Agent', 'Incident Agent', 'Transport Agent', 'Volunteer Agent', 'Accessibility Agent'].map(n => (
                  <div key={n} className="arch-node node-cyan">{n}</div>
                ))}
              </div>
              <div className="gemini-core" aria-label="Google Gemini 1.5 Pro core">
                <span className="gemini-icon">✨</span>
                Google Gemini 1.5 Pro
                <span className="gemini-sub">Multimodal · Function Calling · Streaming</span>
              </div>
            </div>

            <div className="arch-arrows" aria-hidden="true">
              <div className="arrow-line">pgvector / Redis ↕</div>
            </div>

            <div className="arch-layer layer-data">
              <div className="layer-label">DATA LAYER</div>
              <div className="arch-nodes">
                {['PostgreSQL 16', 'Redis 7 Pub/Sub', 'Vector DB', 'Firebase Storage'].map(n => (
                  <div key={n} className="arch-node node-purple">{n}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon" aria-hidden="true">⚡</span>
              <span>NexusAI Stadium</span>
            </div>
            <div className="footer-meta">
              <span>FIFA World Cup 2026 Innovation Challenge</span>
              <span className="footer-sep">·</span>
              <span>Powered by Google Gemini 1.5 Pro</span>
              <span className="footer-sep">·</span>
              <span>React · TypeScript · FastAPI · PostgreSQL</span>
            </div>
            <div className="footer-badges">
              <span className="badge badge-green">WCAG 2.2 AA</span>
              <span className="badge badge-blue">50+ Languages</span>
              <span className="badge badge-gold">Production Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

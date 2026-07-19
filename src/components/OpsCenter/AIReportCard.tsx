import { useState } from 'react';
import type { AIInsight } from '../../types';
import { SeverityBadge } from './Shared';

export function AIReportCard({ insight }: { insight: AIInsight }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`ai-report-card glass-card ai-report-${insight.severity}`}
      role="article"
      aria-label={`${insight.type}: ${insight.title}`}
    >
      <div className="report-header" onClick={() => setExpanded(!expanded)}>
        <div className="report-type-icon">
          {insight.type === 'prediction' ? '🔮' : insight.type === 'alert' ? '🚨' : insight.type === 'recommendation' ? '💡' : '📋'}
        </div>
        <div className="report-meta">
          <div className="report-title">{insight.title}</div>
          <div className="report-time">{insight.timestamp.toLocaleTimeString()}</div>
        </div>
        <div className="report-right">
          <SeverityBadge severity={insight.severity} />
          <div className="confidence-pill" aria-label={`AI Confidence: ${insight.confidence}%`}>
            {insight.confidence}% confidence
          </div>
          <button className="expand-btn" aria-expanded={expanded} aria-label={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="report-body">
          <pre className="report-content">{insight.content}</pre>
          {insight.actionItems && insight.actionItems.length > 0 && (
            <div className="report-actions">
              <div className="actions-label">Recommended Actions:</div>
              {insight.actionItems.map((action, i) => (
                <div key={i} className="action-item">
                  <span className="action-num">{i + 1}</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

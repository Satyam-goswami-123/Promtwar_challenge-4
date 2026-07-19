import { useState, useEffect, useMemo } from 'react';
import type { VolunteerTask } from '../types';
import { MOCK_VOLUNTEER_TASKS } from '../mockData';
import './VolunteerApp.css';

interface Props { onBack: () => void; }

type VolTab = 'tasks' | 'map' | 'resources' | 'comms';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'var(--nexus-red)',
  high: 'var(--nexus-gold)',
  normal: 'var(--nexus-cyan)',
  low: 'var(--text-muted)',
};

const RESOURCES = [
  { icon: '💊', name: 'First Aid Kit', zone: 'Section 112 Entrance', status: 'available', quantity: 3 },
  { icon: '⚡', name: 'AED Defibrillator', zone: 'Section 12 Pillar A', status: 'available', quantity: 1 },
  { icon: '💧', name: 'Water Station', zone: 'Gate B, Level 1', status: 'low', quantity: 12 },
  { icon: '♿', name: 'Wheelchair', zone: 'Gate C Accessibility', status: 'available', quantity: 4 },
  { icon: '📡', name: 'Radio Unit', zone: 'Volunteer HQ', status: 'available', quantity: 8 },
  { icon: '🔦', name: 'Emergency Torch', zone: 'Control Room A', status: 'available', quantity: 6 },
  { icon: '🩹', name: 'Stretcher', zone: 'Medical Bay 2', status: 'in_use', quantity: 2 },
  { icon: '🔑', name: 'Access Key Card', zone: 'Volunteer HQ', status: 'available', quantity: 5 },
];

const COMMS = [
  { id: 'c1', from: 'OPS Command', message: 'All volunteers: Gate A surge incoming. Report to overflow positions immediately.', time: '21:43', priority: true, isAi: false },
  { id: 'c2', from: '✨ AI Orchestrator', message: 'TASK ALERT: EMS route to Section 112 requires crowd buffer. Volunteer Team 3 — hold position at Row 12.', time: '21:41', priority: true, isAi: true },
  { id: 'c3', from: 'Security_Unit_7', message: 'Perimeter at Section 112 secured. EMS has clear access. Stand down buffer team.', time: '21:40', priority: false, isAi: false },
  { id: 'c4', from: '✨ AI Orchestrator', message: 'Weather update: UV index rising in upper deck east. Recommend water distribution check at Sections 200-220.', time: '21:35', priority: false, isAi: true },
  { id: 'c5', from: 'Volunteer_Lead_Kim', message: 'Info Booth 3: Lost child situation resolved. Parents reunited. Case closed.', time: '21:32', priority: false, isAi: false },
];

export default function VolunteerApp({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<VolTab>('tasks');
  const [tasks, setTasks] = useState<VolunteerTask[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_volunteer_tasks');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_VOLUNTEER_TASKS;
  });
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [myZone] = useState('Section 112 / Gate A');
  const [checkedIn] = useState(true);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_volunteer_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Simulate AI priority score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => ({
        ...t,
        priorityScore: Math.min(100, Math.max(0, t.priorityScore + (Math.random() - 0.5) * 4))
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const simulateVoice = () => {
    setListening(true);
    setVoiceText('');
    const phrases = [
      'Medical situation at Section 112, fan unresponsive, need EMS immediately.',
      'Gate A overflow, requesting 4 volunteers to redirect fans to Gate C.',
      'Wheelchair user needs assistance at Section 200A, name Maria Santos.',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let i = 0;
    const interval = setInterval(() => {
      if (i <= phrase.length) {
        setVoiceText(phrase.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setListening(false);
      }
    }, 30);
  };

  const acceptTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'in_progress' as const } : t));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' as const } : t));
  };

  const { pendingTasks, activeTasks, completedTasks } = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore);
    return {
      pendingTasks: sorted.filter(t => t.status === 'pending'),
      activeTasks: sorted.filter(t => t.status === 'in_progress'),
      completedTasks: sorted.filter(t => t.status === 'completed')
    };
  }, [tasks]);

  return (
    <div className="volunteer-app" role="main" aria-label="NexusAI Volunteer Co-Pilot">
      {/* Header */}
      <header className="vol-header" role="banner">
        <div className="vol-header-inner">
          <div className="vol-logo-group">
            <button className="btn btn-ghost btn-sm" onClick={onBack} id="vol-back-btn" aria-label="Back to portal">← Back</button>
            <div className="vol-logo">
              <div className="vol-logo-icon">🤝</div>
              <div>
                <div className="vol-logo-name">VOLUNTEER CO-PILOT</div>
                <div className="vol-logo-sub">NexusAI Stadium · {myZone}</div>
              </div>
            </div>
          </div>

          <div className="vol-meta">
            <div className={`checkin-badge ${checkedIn ? 'checkin-active' : ''}`} role="status" aria-label={checkedIn ? 'Checked in' : 'Not checked in'}>
              <span className={`status-dot ${checkedIn ? 'live' : 'offline'}`} aria-hidden="true"></span>
              {checkedIn ? 'Checked In' : 'Check In'}
            </div>
            <div className="vol-queue-count" aria-label={`${pendingTasks.length} tasks pending`}>
              <span>{pendingTasks.length}</span>
              <span>Tasks</span>
            </div>
          </div>
        </div>

        <div className="vol-tabs" role="tablist">
          {([
            { id: 'tasks', icon: '📋', label: `Tasks (${activeTasks.length + pendingTasks.length})` },
            { id: 'map', icon: '📍', label: 'Resources' },
            { id: 'comms', icon: '📡', label: 'Comms' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              className={`vol-tab ${activeTab === tab.id ? 'vol-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              id={`vol-tab-${tab.id}`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="vol-content">

        {/* ====== TASKS TAB ====== */}
        {activeTab === 'tasks' && (
          <div className="tasks-tab page-enter">
            {/* Voice Command Panel */}
            <div className="voice-panel glass-card">
              <div className="voice-header">
                <div className="voice-title-group">
                  <span className="voice-icon">🎙️</span>
                  <div>
                    <div className="voice-title">Voice-to-Action</div>
                    <div className="voice-sub">Speak an incident — NEXUS converts to task instantly</div>
                  </div>
                </div>
                <button
                  className={`voice-btn ${listening ? 'voice-listening' : ''}`}
                  onClick={simulateVoice}
                  disabled={listening}
                  aria-label={listening ? 'Listening...' : 'Start voice input'}
                  id="voice-input-btn"
                >
                  {listening ? (
                    <span className="voice-wave" aria-hidden="true">◉ LISTENING</span>
                  ) : (
                    <span>🎤 Tap to Speak</span>
                  )}
                </button>
              </div>
              {voiceText && (
                <div className="voice-transcript" role="status" aria-live="polite" aria-label="Voice transcription">
                  <span className="transcript-icon" aria-hidden="true">✨</span>
                  <span className="transcript-text">"{voiceText}"</span>
                </div>
              )}
            </div>

            {/* Urgent Tasks */}
            {activeTasks.length > 0 && (
              <div className="task-section">
                <div className="task-section-header">
                  <span className="status-dot critical" aria-hidden="true"></span>
                  <h3>In Progress ({activeTasks.length})</h3>
                </div>
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAccept={acceptTask} onComplete={completeTask} />
                ))}
              </div>
            )}

            {/* Pending Tasks */}
            <div className="task-section">
              <div className="task-section-header">
                <span className="status-dot warning" aria-hidden="true"></span>
                <h3>AI-Prioritized Queue ({pendingTasks.length})</h3>
                <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Gemini Priority Scoring</span>
              </div>
              {pendingTasks.length === 0 ? (
                <div className="empty-queue">
                  <span>✅</span>
                  <p>Queue clear — great work!</p>
                </div>
              ) : (
                pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAccept={acceptTask} onComplete={completeTask} />
                ))
              )}
            </div>

            {/* Completed */}
            {completedTasks.length > 0 && (
              <div className="task-section">
                <div className="task-section-header">
                  <span className="status-dot live" aria-hidden="true"></span>
                  <h3>Completed Today ({completedTasks.length})</h3>
                </div>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onAccept={acceptTask} onComplete={completeTask} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== RESOURCES TAB ====== */}
        {activeTab === 'map' && (
          <div className="resources-tab page-enter">
            <div className="resources-header">
              <h3>Nearest Resources</h3>
              <p>Your zone: {myZone} · AI locates nearest items in real-time</p>
            </div>

            <div className="resources-grid" role="list">
              {RESOURCES.map(res => (
                <div
                  key={res.name}
                  className={`resource-card glass-card resource-${res.status}`}
                  role="listitem"
                  aria-label={`${res.name} at ${res.zone}, status: ${res.status}, quantity: ${res.quantity}`}
                >
                  <div className="res-icon">{res.icon}</div>
                  <div className="res-info">
                    <div className="res-name">{res.name}</div>
                    <div className="res-zone">📍 {res.zone}</div>
                    <div className="res-qty">Qty: {res.quantity}</div>
                  </div>
                  <div className="res-status-col">
                    <span className={`badge ${res.status === 'available' ? 'badge-green' : res.status === 'low' ? 'badge-gold' : 'badge-red'}`}>
                      {res.status.toUpperCase()}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      id={`navigate-${res.name.toLowerCase().replace(/\s/g, '-')}-btn`}
                      aria-label={`Get directions to ${res.name}`}
                    >
                      Navigate →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== COMMS TAB ====== */}
        {activeTab === 'comms' && (
          <div className="comms-tab page-enter">
            <div className="comms-header">
              <h3>Team Communications</h3>
              <div className="comms-meta">
                <span className="status-dot live" aria-hidden="true"></span>
                <span>Real-time channel · AT&T Stadium</span>
              </div>
            </div>

            <div className="comms-feed" role="log" aria-live="polite" aria-label="Team communications feed">
              {COMMS.map(msg => (
                <div
                  key={msg.id}
                  className={`comm-message ${msg.priority ? 'comm-priority' : ''} ${msg.isAi ? 'comm-ai' : ''}`}
                  role="article"
                  aria-label={`Message from ${msg.from} at ${msg.time}: ${msg.message}`}
                >
                  <div className="comm-header">
                    <span className="comm-from">{msg.from}</span>
                    <span className="comm-time">{msg.time}</span>
                    {msg.priority && <span className="badge badge-red" style={{ fontSize: 9 }}>PRIORITY</span>}
                    {msg.isAi && <span className="badge badge-blue" style={{ fontSize: 9 }}>AI</span>}
                  </div>
                  <p className="comm-body">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="comms-input-area">
              <input
                type="text"
                className="input-field"
                placeholder="Broadcast to all teams..."
                aria-label="Type message to broadcast to all teams"
                id="comms-input"
              />
              <button className="btn btn-primary" id="comms-send-btn" aria-label="Send message">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onAccept, onComplete }: {
  task: VolunteerTask;
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const color = PRIORITY_COLORS[task.priority];
  const isCompleted = task.status === 'completed';
  const isActive = task.status === 'in_progress';

  return (
    <div
      className={`task-card glass-card task-${task.priority} ${isCompleted ? 'task-done' : ''}`}
      role="article"
      aria-label={`Task: ${task.title}, Priority: ${task.priority}, Zone: ${task.zone}, Status: ${task.status}`}
    >
      <div className="task-priority-bar" style={{ background: color }} aria-hidden="true" />
      <div className="task-body">
        <div className="task-header-row">
          <div className="task-badges">
            <span className={`badge ${task.priority === 'urgent' ? 'badge-red' : task.priority === 'high' ? 'badge-gold' : task.priority === 'normal' ? 'badge-blue' : ''}`}>
              {task.priority.toUpperCase()}
            </span>
            {task.aiGenerated && (
              <span className="badge badge-blue">✨ AI</span>
            )}
          </div>
          <div className="ai-score" aria-label={`AI Priority Score: ${Math.round(task.priorityScore)}`}>
            <span className="score-label">AI Score</span>
            <span className="score-value" style={{ color }}>{Math.round(task.priorityScore)}</span>
          </div>
        </div>

        <div className="task-title">{task.title}</div>
        <div className="task-description">{task.description}</div>

        <div className="task-meta-row">
          <span className="task-zone">📍 {task.zone}</span>
          {task.requiredSkills && (
            <span className="task-skills">🔧 {task.requiredSkills.join(', ')}</span>
          )}
        </div>

        {!isCompleted && (
          <div className="task-actions">
            {!isActive ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onAccept(task.id)}
                aria-label={`Accept task: ${task.title}`}
                id={`accept-task-${task.id}`}
              >
                ✅ Accept Task
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onComplete(task.id)}
                style={{ background: 'linear-gradient(135deg, var(--nexus-green), #00A055)' }}
                aria-label={`Mark complete: ${task.title}`}
                id={`complete-task-${task.id}`}
              >
                ✓ Mark Complete
              </button>
            )}
            {isActive && (
              <span className="btn btn-ghost btn-sm" aria-label="Task in progress">🔄 In Progress</span>
            )}
          </div>
        )}
        {isCompleted && (
          <div className="task-completed-badge">
            <span>✅ Completed</span>
            <span className="task-time">{task.createdAt.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// NexusAI Stadium — Mock Data & AI Response Engine
// ============================================================

import type {
  StadiumVenue, Incident, VolunteerTask, AIInsight,
  TransportInfo, ChatMessage, MatchInfo
} from './types';

// ---- Stadium Venues ----
export const STADIUM_VENUES: StadiumVenue[] = [
  {
    id: 'att-dallas',
    name: 'AT&T Stadium',
    city: 'Dallas, TX',
    country: 'USA',
    capacity: 80000,
    currentAttendance: 74320,
    zones: [
      { id: 'gate-a', name: 'Gate A Plaza', capacity: 8000, currentOccupancy: 6800, density: 85, flowRate: 340, status: 'crowded', alerts: ['High density — recommend diverting to Gate C'], prediction15min: 72 },
      { id: 'gate-b', name: 'Gate B Entry', capacity: 8000, currentOccupancy: 4200, density: 52, flowRate: 210, status: 'moderate', alerts: [], prediction15min: 58 },
      { id: 'gate-c', name: 'Gate C South', capacity: 8000, currentOccupancy: 3100, density: 39, flowRate: 155, status: 'clear', alerts: [], prediction15min: 44 },
      { id: 'concourse-1', name: 'Lower Concourse', capacity: 12000, currentOccupancy: 9800, density: 82, flowRate: 490, status: 'crowded', alerts: ['Food court backup — 18 min wait'], prediction15min: 68 },
      { id: 'section-112', name: 'Section 112', capacity: 1500, currentOccupancy: 1480, density: 99, flowRate: 0, status: 'critical', alerts: ['⚠️ CRITICAL — near capacity, flow blocked'], prediction15min: 99 },
      { id: 'parking-north', name: 'North Parking', capacity: 15000, currentOccupancy: 12100, density: 81, flowRate: 180, status: 'crowded', alerts: ['Lot P3 at 95% — directing to P7'], prediction15min: 75 },
    ],
    weather: { temp: 29, feels_like: 34, condition: 'Partly Cloudy', humidity: 65, wind_speed: 14, icon: '⛅', uv_index: 7 },
    match: {
      id: 'm001',
      homeTeam: { id: 'bra', name: 'Brazil', code: 'BRA', flag: '🇧🇷', color: '#009C3B' },
      awayTeam: { id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', color: '#74ACDF' },
      score: { home: 2, away: 1, homePossession: 54, homeShots: 12, awayShots: 9 },
      status: 'live',
      minute: 67,
      stage: 'Quarter-Final',
    }
  },
  {
    id: 'metlife-nyc',
    name: 'MetLife Stadium',
    city: 'New York, NJ',
    country: 'USA',
    capacity: 82500,
    currentAttendance: 81200,
    zones: [
      { id: 'gate-1', name: 'Gate 1 Main', capacity: 9000, currentOccupancy: 7800, density: 87, flowRate: 390, status: 'crowded', alerts: [], prediction15min: 79 },
      { id: 'gate-2', name: 'Gate 2 East', capacity: 9000, currentOccupancy: 5500, density: 61, flowRate: 275, status: 'moderate', alerts: [], prediction15min: 65 },
      { id: 'vip-lounge', name: 'VIP Level 3', capacity: 2000, currentOccupancy: 1850, density: 93, flowRate: 45, status: 'critical', alerts: ['VIP zone near capacity'], prediction15min: 90 },
    ],
    weather: { temp: 22, feels_like: 20, condition: 'Clear', humidity: 45, wind_speed: 18, icon: '☀️', uv_index: 6 },
    match: {
      id: 'm002',
      homeTeam: { id: 'fra', name: 'France', code: 'FRA', flag: '🇫🇷', color: '#002395' },
      awayTeam: { id: 'eng', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CF111A' },
      score: { home: 1, away: 1, homePossession: 48, homeShots: 8, awayShots: 11 },
      status: 'halftime',
      stage: 'Semi-Final',
    }
  }
];

// ---- Live Incidents ----
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    type: 'medical',
    severity: 'high',
    title: 'Fan Medical Emergency — Section 112',
    description: 'Fan reported unresponsive. Possible heat exhaustion. Crowd preventing access.',
    location: { zone: 'section-112', section: '112', level: 1, description: 'Row 14, Seat 8, AT&T Stadium' },
    status: 'in_progress',
    reportedBy: 'Volunteer_Team_3',
    reportedAt: new Date(Date.now() - 4 * 60000),
    updatedAt: new Date(Date.now() - 90000),
    aiPlan: `**AI-Generated Incident Action Plan (ICS-202)**\n\n**Incident:** Heat Exhaustion — Section 112\n**Severity:** HIGH | **Time:** T+4min\n\n**Immediate Actions:**\n1. ✅ EMS Team Alpha dispatched (ETA: 2 min via Access Tunnel B)\n2. ✅ Section 112 crowd buffer created — 3 volunteers holding perimeter\n3. 🔄 Cooling station on Level 1 activated\n4. 🔄 Crowd diversion: Sections 110-114 asked to hold via PA\n\n**AI Crowd Prediction:** Density in Sec 112 expected to reduce from 99% → 78% in 12 minutes if current diversion holds.\n\n**Recommendation:** Request additional cooling unit from inventory B3. Weather conditions (34°C feels-like) indicate 3 more at-risk individuals in adjacent sections.`,
    assignedTo: ['EMS Alpha', 'Volunteer_Team_3', 'Security_Unit_7'],
    updates: [
      { id: 'u1', author: 'AI Orchestrator', content: 'EMS team dispatched. Predicted arrival T+2min via Access Tunnel B.', timestamp: new Date(Date.now() - 3.5 * 60000), isAiGenerated: true },
      { id: 'u2', author: 'Security_Unit_7', content: 'Perimeter secured. EMS has access.', timestamp: new Date(Date.now() - 2 * 60000), isAiGenerated: false },
      { id: 'u3', author: 'AI Orchestrator', content: 'Crowd density in Sec 112 decreasing. PA diversion effective. Predicted: 78% in 8 min.', timestamp: new Date(Date.now() - 60000), isAiGenerated: true },
    ]
  },
  {
    id: 'inc-002',
    type: 'crowd',
    severity: 'medium',
    title: 'Crowd Surge Predicted — Gate A',
    description: 'AI model predicts dangerous crowd surge at Gate A within 8 minutes based on external queue growth.',
    location: { zone: 'gate-a', description: 'Gate A Plaza, South Entrance' },
    status: 'open',
    reportedBy: 'AI Crowd Analytics Agent',
    reportedAt: new Date(Date.now() - 2 * 60000),
    updatedAt: new Date(Date.now() - 2 * 60000),
    aiPlan: `**PREDICTIVE ALERT — Action Required**\n\nExternal camera feeds show 2,400 fans in Gate A queue. Current flow rate at 340/min suggests dangerous surge in **8 minutes**.\n\n**Recommended Actions:**\n1. Open Gate A2 auxiliary lanes immediately\n2. Redirect 800+ fans to Gate C via digital signage\n3. Deploy 4 additional volunteers to Gate A\n4. Alert Ground Control for traffic hold on Access Road 7`,
    assignedTo: [],
    updates: [
      { id: 'u1', author: 'AI Crowd Agent', content: 'Predictive surge detected. Confidence: 89%. Recommending immediate Gate A2 activation.', timestamp: new Date(Date.now() - 2 * 60000), isAiGenerated: true },
    ]
  },
  {
    id: 'inc-003',
    type: 'infrastructure',
    severity: 'low',
    title: 'Concession Stand B7 Equipment Failure',
    description: 'POS system at concession B7 offline. 60+ fans in queue.',
    location: { zone: 'concourse-1', section: 'B7', level: 1, description: 'Lower Concourse, Food Court B' },
    status: 'in_progress',
    reportedBy: 'Staff_Martinez',
    reportedAt: new Date(Date.now() - 12 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    aiPlan: `**Infrastructure Resolution Plan**\n\nPOS system B7 offline. Backup payment terminal deployed. Estimated resolution: 15 minutes.\n\nAI Recommendation: Offer 10% digital voucher to affected fans in queue to reduce complaint escalations.`,
    assignedTo: ['Tech_Team_2'],
    updates: []
  }
];

// ---- Volunteer Tasks ----
export const MOCK_VOLUNTEER_TASKS: VolunteerTask[] = [
  { id: 'vt-001', title: 'Emergency Crowd Buffer — Section 112', description: 'Form perimeter around medical incident at Row 14. Hold 3-meter buffer.', priority: 'urgent', priorityScore: 98, zone: 'Section 112', status: 'in_progress', createdAt: new Date(Date.now() - 4 * 60000), aiGenerated: true, requiredSkills: ['crowd-management'] },
  { id: 'vt-002', title: 'Gate A — Overflow Redirect', description: 'Direct incoming fans to Gate C. Use multilingual signage pack #3.', priority: 'high', priorityScore: 87, zone: 'Gate A Plaza', status: 'pending', createdAt: new Date(Date.now() - 2 * 60000), aiGenerated: true },
  { id: 'vt-003', title: 'Cooling Station Activation — Level 1', description: 'Activate cooling mist station CL-01B. Confirm water supply connected.', priority: 'high', priorityScore: 82, zone: 'Level 1 Concourse', status: 'pending', createdAt: new Date(Date.now() - 3 * 60000), aiGenerated: true },
  { id: 'vt-004', title: 'Accessibility Escort — Gate C', description: 'Fan in wheelchair requires escort to accessible seating Section 200A. Fan name: Maria Santos.', priority: 'high', priorityScore: 79, zone: 'Gate C', status: 'pending', createdAt: new Date(Date.now() - 7 * 60000), aiGenerated: false },
  { id: 'vt-005', title: 'Lost Child Assistance — Info Booth 3', description: 'Child (approx. 8 years, red jersey) found near Gate B. Reunification protocol in progress.', priority: 'urgent', priorityScore: 95, zone: 'Info Booth 3', status: 'in_progress', createdAt: new Date(Date.now() - 8 * 60000), aiGenerated: false },
  { id: 'vt-006', title: 'Merchandise Queue Management', description: 'Official store queue exceeds 90 fans. Implement timed entry system.', priority: 'normal', priorityScore: 45, zone: 'Retail Zone A', status: 'pending', createdAt: new Date(Date.now() - 15 * 60000), aiGenerated: true },
];

// ---- AI Insights ----
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  { id: 'ai-001', type: 'prediction', title: 'Post-Match Exodus Surge Predicted', content: 'Based on match momentum (67\'), crowd behavior patterns indicate 89% probability of rapid simultaneous exit attempt in 23-28 minutes. Recommend pre-staging transport at Gates B and C now.', severity: 'high', timestamp: new Date(), affectedZones: ['gate-a', 'gate-b', 'gate-c', 'parking-north'], actionItems: ['Dispatch 6 additional shuttles to Gate B/C', 'Open emergency exit Route 7', 'Alert Metro Line 3 for capacity surge', 'Deploy 12 volunteers to exit corridors'], confidence: 89 },
  { id: 'ai-002', type: 'alert', title: 'Heat Risk — 3 High-Risk Zones Identified', content: 'Temperature modeling shows heat index >38°C in sections 108-115 and upper deck east. Vulnerable fans (elderly, children) are statistically concentrated in these zones based on accessibility registration data.', severity: 'medium', timestamp: new Date(Date.now() - 5 * 60000), affectedZones: ['section-112', 'concourse-1'], actionItems: ['Activate misting stations SB-3, SB-4', 'Increase water distribution frequency', 'PA announcement in 6 languages'], confidence: 76 },
  { id: 'ai-003', type: 'recommendation', title: 'Concession Revenue Optimization', content: 'Queue analysis shows Section 112 fans have avg. 18-min wait for concessions. AI recommends activating mobile ordering for Sections 108-120 to reduce walkout rate and recover ~$14,000 in lost revenue.', severity: 'low', timestamp: new Date(Date.now() - 10 * 60000), confidence: 91 },
  { id: 'ai-004', type: 'summary', title: 'Match Day Situation Report — 67\'', content: 'OPERATIONAL STATUS: YELLOW\n\n✅ Security: No active threats. 3 access control alerts resolved.\n⚠️ Medical: 1 active incident (Sec 112 — heat). 2 minor cases resolved.\n⚠️ Crowd: Gate A trending critical. 2 zones at >80% density.\n✅ Transport: All transit lines normal. Minor parking delays at P3.\n✅ Weather: Conditions stable. UV index 7 — heat advisory active.\n\nAI Recommendation: Elevate operational status to ORANGE if Sec 112 density doesn\'t resolve in next 10 minutes.', severity: 'medium', timestamp: new Date(Date.now() - 2 * 60000), confidence: 95 },
];

// ---- Transport ----
export const MOCK_TRANSPORT: TransportInfo[] = [
  { type: 'metro', name: 'Orange Line (AT&T Stadium)', status: 'normal', waitTime: 8, capacity: 2000, occupancy: 1340, nextDeparture: new Date(Date.now() + 8 * 60000), aiRecommendation: 'Recommended: Best post-match option. Pre-stage departure +5min early.' },
  { type: 'shuttle', name: 'Official FIFA Shuttle A', status: 'normal', waitTime: 12, capacity: 80, occupancy: 62, aiRecommendation: 'Moderate wait. Shuttle B arriving in 7 minutes from Parking P3.' },
  { type: 'shuttle', name: 'Accessibility Shuttle', status: 'normal', waitTime: 5, capacity: 20, occupancy: 8, aiRecommendation: 'Priority boarding available. Direct to hotel district.' },
  { type: 'parking', name: 'Lot P3 North', status: 'delayed', waitTime: 25, capacity: 3000, occupancy: 2850, aiRecommendation: 'Avoid P3 — 95% full. AI redirect to P7 West: 15 min drive, 40% empty.' },
  { type: 'rideshare', name: 'Surge Prediction', status: 'normal', waitTime: 6, aiRecommendation: 'Current surge: 1.4x. Expected to hit 3.2x in 25 min post-match. Book now.' },
];



// ---- Multilingual Greetings ----
export const MULTILINGUAL_GREETINGS: Record<string, { greeting: string; prompt: string; lang: string }> = {
  en: { greeting: 'Welcome to FIFA World Cup 2026! 🏆', prompt: 'How can NEXUS help you today?', lang: 'English' },
  es: { greeting: '¡Bienvenido a la Copa del Mundo FIFA 2026! 🏆', prompt: '¿En qué puede ayudarte NEXUS hoy?', lang: 'Español' },
  pt: { greeting: 'Bem-vindo à Copa do Mundo FIFA 2026! 🏆', prompt: 'Como o NEXUS pode ajudá-lo hoje?', lang: 'Português' },
  fr: { greeting: 'Bienvenue à la Coupe du Monde FIFA 2026! 🏆', prompt: 'Comment NEXUS peut-il vous aider?', lang: 'Français' },
  ar: { greeting: 'مرحباً بكم في كأس العالم فيفا 2026! 🏆', prompt: 'كيف يمكن لـ NEXUS مساعدتك اليوم؟', lang: 'العربية' },
  de: { greeting: 'Willkommen zur FIFA Weltmeisterschaft 2026! 🏆', prompt: 'Wie kann NEXUS Ihnen helfen?', lang: 'Deutsch' },
  ja: { greeting: 'FIFA ワールドカップ 2026 へようこそ！🏆', prompt: 'NEXUSはどのようにお手伝いできますか？', lang: '日本語' },
  ko: { greeting: 'FIFA 월드컵 2026에 오신 것을 환영합니다! 🏆', prompt: 'NEXUS가 어떻게 도와드릴까요?', lang: '한국어' },
  zh: { greeting: '欢迎来到2026年FIFA世界杯！🏆', prompt: 'NEXUS今天怎么帮助您？', lang: '中文' },
  hi: { greeting: 'FIFA विश्व कप 2026 में आपका स्वागत है! 🏆', prompt: 'NEXUS आज आपकी कैसे मदद कर सकता है?', lang: 'हिन्दी' },
};

export const MATCH_EVENTS = [
  { minute: 12, type: 'goal', team: 'BRA', player: 'Rodrygo', description: 'Tap-in from close range' },
  { minute: 34, type: 'yellow_card', team: 'ARG', player: 'De Paul', description: 'Tactical foul' },
  { minute: 41, type: 'goal', team: 'ARG', player: 'Alvarez', description: 'Header from corner' },
  { minute: 61, type: 'goal', team: 'BRA', player: 'Vinicius Jr', description: 'Stunning long-range curler' },
  { minute: 63, type: 'substitution', team: 'ARG', player: 'Messi → Dybala', description: 'Tactical change' },
];

export const QUICK_SUGGESTIONS = [
  { icon: '🚻', text: 'Nearest restroom?' },
  { icon: '🍔', text: 'Best food options?' },
  { icon: '🏟️', text: 'Find my seat' },
  { icon: '⚽', text: 'Live score update' },
  { icon: '🚌', text: 'Transport options' },
  { icon: '♿', text: 'Accessibility help' },
  { icon: '🆘', text: 'Emergency help' },
  { icon: '📍', text: 'Lost & Found' },
];

export const AI_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

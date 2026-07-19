// ============================================================
// NexusAI Stadium — Shared TypeScript Types
// ============================================================

export type UserRole = 'fan' | 'ops' | 'security' | 'volunteer' | 'medic' | 'transport' | 'exec';
export type Language = 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'de' | 'ja' | 'ko' | 'zh' | 'hi';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type IncidentType = 'medical' | 'security' | 'crowd' | 'fire' | 'infrastructure' | 'weather' | 'vip';
export type ZoneStatus = 'clear' | 'moderate' | 'crowded' | 'critical' | 'closed';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  language: Language;
  seatInfo?: SeatInfo;
  accessibilityNeeds?: AccessibilityNeeds;
  avatar?: string;
}

export interface SeatInfo {
  stadium: string;
  section: string;
  row: string;
  seat: string;
  gate: string;
}

export interface AccessibilityNeeds {
  wheelchair: boolean;
  visuallyImpaired: boolean;
  hearingImpaired: boolean;
  mobility: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: Language;
  attachments?: MessageAttachment[];
  functionCalls?: FunctionCall[];
  isStreaming?: boolean;
  metadata?: {
    agent: string;
    model: string;
    tokens?: number;
    ragSources?: string[];
  };
}

export interface MessageAttachment {
  type: 'image' | 'audio' | 'document';
  url: string;
  name: string;
}

export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: SeverityLevel;
  title: string;
  description: string;
  location: StadiumLocation;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  aiPlan?: string;
  assignedTo?: string[];
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAiGenerated: boolean;
}

export interface StadiumLocation {
  zone: string;
  section?: string;
  level?: number;
  coordinates?: { x: number; y: number };
  description: string;
}

export interface CrowdZone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  density: number; // 0-100
  flowRate: number; // people/min
  status: ZoneStatus;
  alerts: string[];
  prediction15min?: number; // predicted density
}

export interface StadiumVenue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  currentAttendance: number;
  match?: MatchInfo;
  zones: CrowdZone[];
  weather: WeatherInfo;
}

export interface MatchInfo {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  status: 'pre' | 'live' | 'halftime' | 'full_time';
  minute?: number;
  stage: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  color: string;
}

export interface Score {
  home: number;
  away: number;
  homeShots?: number;
  awayShots?: number;
  homePossession?: number;
}

export interface WeatherInfo {
  temp: number;
  feels_like: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  uv_index: number;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  priorityScore: number; // AI-generated 0-100
  zone: string;
  assigneeId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  dueBy?: Date;
  aiGenerated: boolean;
  requiredSkills?: string[];
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'alert' | 'recommendation' | 'summary';
  title: string;
  content: string;
  severity: SeverityLevel;
  timestamp: Date;
  affectedZones?: string[];
  actionItems?: string[];
  confidence: number; // 0-100
}

export interface TransportInfo {
  type: 'metro' | 'shuttle' | 'bus' | 'rideshare' | 'parking';
  name: string;
  status: 'normal' | 'delayed' | 'disrupted' | 'full';
  waitTime: number; // minutes
  capacity?: number;
  occupancy?: number;
  nextDeparture?: Date;
  aiRecommendation?: string;
}

export interface AppView {
  current: 'landing' | 'fan' | 'ops' | 'volunteer' | 'security' | 'transport' | 'accessibility';
}

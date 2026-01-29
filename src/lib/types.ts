export type MetricStatus = 'up' | 'down' | 'neutral';

export enum JobRole {
  Frontend = 'Frontend Engineer',
  Backend = 'Backend Engineer',
  Fullstack = 'Full Stack Engineer',
}

export enum OutreachType {
  EmailAgent = 'Email Agent',
  FounderOutreach = 'Founder Outreach',
}

export enum ApplicationStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
}


export enum ResumeStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  WAITING = 'Waiting',
  REJECTED = 'Rejected',
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  status: MetricStatus;
}

export interface DailyEmailDataPoint {
  date: string;
  [JobRole.Frontend]: number;
  [JobRole.Backend]: number;
  [JobRole.Fullstack]: number;
}

export interface RoleDistributionDataPoint {
  name: JobRole;
  value: number;
  color: string;
}

export interface ActivityLog {
  id: string;
  company: string;
  role: JobRole;
  date: string;
  status: ApplicationStatus;
  type: OutreachType;
}

export enum LogStatus {
  Success = 'Success',
  Failed = 'Failed',
  Warning = 'Warning',
}

export enum LogType {
  ResumeGeneration = 'Resume Generation',
  EmailAutomation = 'Email Automation',
  FounderOutreach = 'Founder Outreach',
  JobParsing = 'Job Parsing',
}

export interface LogTokenUsage {
  cost: number;
  input: number;
  total: number;
  output: number;
}

export interface LogExecutionStep {
  step: string;
  status: string; // 'START' | 'SUCCESS' | 'FAILED' etc
  timestamp: string;
  workerId?: string;
  duration_ms?: number;
  token_usage?: LogTokenUsage;
}

export interface LogEntry {
  id: string;
  userId: string;
  type: string;
  endpoint: string;
  requestPayload: {
    role?: string;
    target_email?: string;
    job_description?: string;
    [key: string]: any;
  };
  responsePayload: {
    cover_letter?: string;
    email_subject?: string;
    resume_content?: any;
    [key: string]: any;
  } | null;
  status: string;
  statusCode: number;
  executionLogs: LogExecutionStep[];
  durationMs: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  company: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  icon: 'layout-dashboard' | 'file-text' | 'settings' | 'bar-chart' | 'mail' | 'users' | 'list' | 'briefcase';
}

export interface HeatmapDataPoint {
  date: string;
  count: number;
}

export interface UserSettings {
  appPassword?: string;
  blockedEmails: string[];
  blockedDomains: string[];
  dailyLimit: number;
}

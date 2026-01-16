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
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
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

export interface LogEntry {
  id: string;
  timestamp: string;
  status: LogStatus;
  type: LogType;
  company: string;
  role: JobRole;
  jobDescription: string;
  subject: string;
  coverLetter: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: 'layout-dashboard' | 'file-text' | 'settings' | 'bar-chart' | 'mail' | 'users' | 'list';
}

export interface HeatmapDataPoint {
  date: string;
  count: number;
}

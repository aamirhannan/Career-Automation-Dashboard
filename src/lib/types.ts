export type MetricStatus = 'up' | 'down' | 'neutral';

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  status: MetricStatus;
  icon: 'briefcase' | 'file-text' | 'send' | 'check-circle' | 'bar-chart';
}

export interface VelocityDataPoint {
  date: string;
  applications: number;
  interviews: number;
}

export interface StatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface ActivityLog {
  id: string;
  company: string;
  role: string;
  date: string;
  status: ApplicationStatus;
  platform: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: 'layout-dashboard' | 'file-text' | 'settings' | 'bar-chart' | 'mail' | 'users';
}

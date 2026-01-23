import { MetricItem, DailyEmailDataPoint, RoleDistributionDataPoint, ActivityLog, NavItem, JobRole, OutreachType, ApplicationStatus, LogEntry, LogStatus, LogType, HeatmapDataPoint } from './types';
import { subDays, format } from 'date-fns';

const generateMockHeatmapData = (): HeatmapDataPoint[] => {
  const data: HeatmapDataPoint[] = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = subDays(today, i);
    // Random count between 0 and 15, weighted towards 0-5
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 5);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      count: count,
    });
  }
  return data.reverse();
};

export const MOCK_HEATMAP_DATA = generateMockHeatmapData();


export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Resume PDF Generator', href: '/generate-reseum', icon: 'file-text' },
  { label: 'Email Automation', href: '/email-agent', icon: 'mail' },
  { label: 'Founder Outreach', href: '/founder-outreach', icon: 'users' },
  { label: 'Logs', href: '/logs', icon: 'list' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'l1',
    userId: 'mock-user-1',
    type: 'EMAIL_AUTOMATION',
    endpoint: '/create-email',
    status: 'SUCCESS',
    statusCode: 200,
    requestPayload: { role: 'Frontend', company: 'Google' },
    responsePayload: { success: true },
    executionLogs: [],
    durationMs: 1500,
    errorMessage: null,
    createdAt: '2026-01-16T18:28:17',
    updatedAt: '2026-01-16T18:28:18',
    company: 'Google',
    role: 'Frontend Engineer'
  },
  {
    id: 'l2',
    userId: 'mock-user-2',
    type: 'FOUNDER_OUTREACH',
    endpoint: '/founder-outreach',
    status: 'FAILED',
    statusCode: 500,
    requestPayload: { role: 'Backend', company: 'Acme' },
    responsePayload: null,
    executionLogs: [],
    durationMs: 500,
    errorMessage: 'Connection timeout',
    createdAt: '2026-01-16T18:25:22',
    updatedAt: '2026-01-16T18:25:23',
    company: 'Acme Corp',
    role: 'Backend Engineer'
  },
  {
    id: 'l3',
    userId: 'mock-user-3',
    type: 'RESUME_GENERATION',
    endpoint: '/generate-resume',
    status: 'PENDING',
    statusCode: 0,
    requestPayload: { role: 'Fullstack' },
    responsePayload: null,
    executionLogs: [],
    durationMs: null,
    errorMessage: null,
    createdAt: '2026-01-16T18:20:10',
    updatedAt: '2026-01-16T18:20:10',
    company: null,
    role: 'Fullstack Engineer'
  }
];

export const MOCK_METRICS: MetricItem[] = [
  {
    id: 'total-sent',
    label: 'Total Email Sent',
    value: '369',
    trend: '+12% this week',
    status: 'up',
  },
  {
    id: 'email-agent',
    label: 'Email Agent',
    value: '123',
    trend: '+8% this week',
    status: 'up',
  },
  {
    id: 'founder-outreach',
    label: 'Founders Outreach Sent',
    value: '246',
    trend: '+15% this week',
    status: 'up',
  },{
    id: 'resume-pdf-generator',
    label: 'Resume PDF Generator',
    value: '246',
    trend: '+15% this week',
    status: 'up',
  }
];

export const MOCK_DAILY_EMAILS: DailyEmailDataPoint[] = [
  { date: 'Mon', [JobRole.Frontend]: 12, [JobRole.Backend]: 8, [JobRole.Fullstack]: 5 },
  { date: 'Tue', [JobRole.Frontend]: 18, [JobRole.Backend]: 12, [JobRole.Fullstack]: 8 },
  { date: 'Wed', [JobRole.Frontend]: 15, [JobRole.Backend]: 15, [JobRole.Fullstack]: 10 },
  { date: 'Thu', [JobRole.Frontend]: 25, [JobRole.Backend]: 10, [JobRole.Fullstack]: 12 },
  { date: 'Fri', [JobRole.Frontend]: 20, [JobRole.Backend]: 18, [JobRole.Fullstack]: 15 },
  { date: 'Sat', [JobRole.Frontend]: 8, [JobRole.Backend]: 5, [JobRole.Fullstack]: 3 },
  { date: 'Sun', [JobRole.Frontend]: 10, [JobRole.Backend]: 4, [JobRole.Fullstack]: 4 },
];

export const MOCK_ROLE_DISTRIBUTION: RoleDistributionDataPoint[] = [
  { name: JobRole.Frontend, value: 45, color: '#7c3aed' }, // primary
  { name: JobRole.Backend, value: 30, color: '#22d3ee' }, // secondary
  { name: JobRole.Fullstack, value: 25, color: '#f59e0b' }, // warning/amber
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: 'a1',
    company: 'Google',
    role: JobRole.Frontend,
    date: '2 Days Ago',
    status: ApplicationStatus.SUCCESS,
    type: OutreachType.EmailAgent,
  },
  {
    id: 'a2',
    company: 'StartupAI',
    role: JobRole.Fullstack,
    date: '3 Days Ago',
    status: ApplicationStatus.PENDING,
    type: OutreachType.FounderOutreach,
  },
  {
    id: 'a3',
    company: 'Netflix',
    role: JobRole.Backend,
    date: '4 Days Ago',
    status: ApplicationStatus.FAILED,
    type: OutreachType.EmailAgent,
  },
  {
    id: 'a4',
    company: 'Meta',
    role: JobRole.Frontend,
    date: '5 Days Ago',
    status: ApplicationStatus.SUCCESS,
    type: OutreachType.FounderOutreach,
  },
];

export const JOB_ROLE_OPTIONS = [
    { value: 'FRONTEND', label: 'FRONTEND' },
    { value: 'BACKEND', label: 'BACKEND' },
    { value: 'FULLSTACK', label: 'FULLSTACK' },
    { value: 'SOFTWAREENGINEER', label: 'SOFTWAREENGINEER' },
];

export const JOB_ROLE_MATCHERS = [
    { key: 'FRONTEND', regex: /front[-\s]?end/i },
    { key: 'BACKEND', regex: /back[-\s]?end/i },
    { key: 'FULLSTACK', regex: /full[-\s]?stack/i },
    { key: 'SOFTWAREENGINEER', regex: /software[-\s]?engineer/i }
];

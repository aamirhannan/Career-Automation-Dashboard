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
    timestamp: '2026-01-16T18:28:17',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'Google',
    role: JobRole.Frontend,
    jobDescription: 'Senior Frontend Engineer needed with 5+ years of React experience. Must have deep understanding of V8 engine, browser rendering, and modern CSS layouts. Experience with Next.js and TypeScript is mandatory.',
    subject: 'Application for Senior Frontend Engineer Role',
    coverLetter: 'Dear Hiring Manager, I am writing to express my interest in the Senior Frontend Engineer position at Google. With extensive experience in building high-performance web applications using React and Next.js, I believe I can contribute significantly to your team...',
    inputTokens: 450,
    outputTokens: 280,
    totalTokens: 730,
    cost: 0.000155
  },
  {
    id: 'l2',
    timestamp: '2026-01-16T18:28:15',
    status: LogStatus.Success,
    type: LogType.FounderOutreach,
    company: 'Acme Corp',
    role: JobRole.Backend,
    jobDescription: 'Looking for a backend specialist to optimize our high-throughput transaction systems. Proficient in Node.js, PostgreSQL, and Redis. Knowledge of distributed systems and microservices architecture is a plus.',
    subject: 'Backend Optimization Opportunities at Acme Corp',
    coverLetter: 'Hi [Founder Name], I have been following Acme Corp\'s growth in the fintech space and noticed your recent scaling challenges. My background in optimizing distributed Node.js systems might be relevant...',
    inputTokens: 320,
    outputTokens: 150,
    totalTokens: 470,
    cost: 0.000318
  },
  {
    id: 'l3',
    timestamp: '2026-01-16T18:28:10',
    status: LogStatus.Warning,
    type: LogType.JobParsing,
    company: 'Netflix',
    role: JobRole.Fullstack,
    jobDescription: 'Full Stack Engineer to join our Core UI team. You will be working on internal tools that power our content delivery network. React/Node stack.',
    subject: 'N/A',
    coverLetter: 'N/A',
    inputTokens: 1200,
    outputTokens: 50,
    totalTokens: 1250,
    cost: 0.000403
  },
  {
    id: 'l4',
    timestamp: '2026-01-16T18:26:55',
    status: LogStatus.Failed,
    type: LogType.ResumeGeneration,
    company: 'Anthropic',
    role: JobRole.Frontend,
    jobDescription: 'AI Interface Engineer. Build the next generation of conversational AI interfaces. Strong UX focus required.',
    subject: 'N/A',
    coverLetter: 'N/A',
    inputTokens: 150,
    outputTokens: 0,
    totalTokens: 150,
    cost: 0.001250
  },
  {
    id: 'l5',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
    },
    {
    id: 'l6',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l7',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l8',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l9',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l10',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l11',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l12',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l13',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
  },  {
    id: 'l14',
    timestamp: '2026-01-16T18:25:22',
    status: LogStatus.Success,
    type: LogType.EmailAutomation,
    company: 'OpenAI',
    role: JobRole.Backend,
    jobDescription: 'Infrastructure Engineer for our API team. Python/Go experience required. Kubernetes expert.',
    subject: 'Application for Infrastructure Engineer',
    coverLetter: 'Dear Hiring Team, I am excited to apply for the Infrastructure Engineer role. My experience scaling Kubernetes clusters...',
    inputTokens: 800,
    outputTokens: 400,
    totalTokens: 1200,
    cost: 0.000210
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
    status: ApplicationStatus.Success,
    type: OutreachType.EmailAgent,
  },
  {
    id: 'a2',
    company: 'StartupAI',
    role: JobRole.Fullstack,
    date: '3 Days Ago',
    status: ApplicationStatus.Pending,
    type: OutreachType.FounderOutreach,
  },
  {
    id: 'a3',
    company: 'Netflix',
    role: JobRole.Backend,
    date: '4 Days Ago',
    status: ApplicationStatus.Failed,
    type: OutreachType.EmailAgent,
  },
  {
    id: 'a4',
    company: 'Meta',
    role: JobRole.Frontend,
    date: '5 Days Ago',
    status: ApplicationStatus.Success,
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

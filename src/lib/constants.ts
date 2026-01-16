import { MetricItem, VelocityDataPoint, StatusDataPoint, ActivityLog, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Resume Builder', href: '/generate-reseum', icon: 'file-text' },
  { label: 'Email Agent', href: '/email-agent', icon: 'mail' },
  { label: 'Founder Outreach', href: '/founder-outreach', icon: 'users' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

export const MOCK_METRICS: MetricItem[] = [
  {
    id: '1',
    label: 'Total Applied',
    value: '142',
    trend: '+12% this week',
    status: 'up',
    icon: 'send',
  },
  {
    id: '2',
    label: 'Interviews',
    value: '8',
    trend: '3 scheduled',
    status: 'neutral',
    icon: 'briefcase',
  },
  {
    id: '3',
    label: 'Response Rate',
    value: '5.6%',
    trend: '-0.4% this week',
    status: 'down',
    icon: 'bar-chart',
  },
  {
    id: '4',
    label: 'Offers',
    value: '1',
    trend: 'Pending negotiation',
    status: 'up',
    icon: 'check-circle',
  },
];

export const MOCK_VELOCITY_DATA: VelocityDataPoint[] = [
  { date: 'Mon', applications: 12, interviews: 0 },
  { date: 'Tue', applications: 18, interviews: 1 },
  { date: 'Wed', applications: 15, interviews: 0 },
  { date: 'Thu', applications: 22, interviews: 2 },
  { date: 'Fri', applications: 10, interviews: 1 },
  { date: 'Sat', applications: 5, interviews: 0 },
  { date: 'Sun', applications: 8, interviews: 0 },
];

export const MOCK_STATUS_DATA: StatusDataPoint[] = [
  { name: 'Applied', value: 65, color: '#7c3aed' }, // primary
  { name: 'Screening', value: 20, color: '#22d3ee' }, // secondary
  { name: 'Rejected', value: 10, color: '#272a34' }, // dark-700
  { name: 'Offer', value: 5, color: '#10b981' }, // success
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: 'a1',
    company: 'TechCorp Inc.',
    role: 'Senior Frontend Engineer',
    date: '2 mins ago',
    status: 'Applied',
    platform: 'LinkedIn',
  },
  {
    id: 'a2',
    company: 'StartupAI',
    role: 'Full Stack Developer',
    date: '1 hour ago',
    status: 'Screening',
    platform: 'Wellfound',
  },
  {
    id: 'a3',
    company: 'Global Systems',
    role: 'React Specialist',
    date: '4 hours ago',
    status: 'Rejected',
    platform: 'Indeed',
  },
  {
    id: 'a4',
    company: 'Nebula Stream',
    role: 'UI/UX Engineer',
    date: '1 day ago',
    status: 'Interview',
    platform: 'Referral',
  },
];

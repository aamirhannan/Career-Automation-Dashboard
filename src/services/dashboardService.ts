
import api from '@/lib/axios';
import { MetricItem, RoleDistributionDataPoint, DailyEmailDataPoint, HeatmapDataPoint, ActivityLog } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';

export interface DashboardMetrics {
  totalSent: { count: number; growth: number };
  emailAgent: { count: number; growth: number };
  founderOutreach: { count: number; growth: number };
  resumeGenerated: { count: number; growth: number };
}

export const DashboardService = {
  async getMetrics(startDate?: Date, endDate?: Date): Promise<MetricItem[]> {
    const params = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() };
    const { data } = await api.get<DashboardMetrics>('/dashboard/metrics', { params });

    return [
      {
        id: 'total-sent',
        label: 'Total Email Sent',
        value: data.totalSent.count,
        trend: `${data.totalSent.growth > 0 ? '+' : ''}${data.totalSent.growth}% this week`, // Assuming weekly growth logic from backend
        status: data.totalSent.growth >= 0 ? 'up' : 'down',
      },
      {
        id: 'email-agent',
        label: 'Email Agent',
        value: data.emailAgent.count,
        trend: `${data.emailAgent.growth > 0 ? '+' : ''}${data.emailAgent.growth}% this week`,
        status: data.emailAgent.growth >= 0 ? 'up' : 'down',
      },
      {
        id: 'founder-outreach',
        label: 'Founders Outreach Sent',
        value: data.founderOutreach.count,
        trend: `${data.founderOutreach.growth > 0 ? '+' : ''}${data.founderOutreach.growth}% this week`,
        status: data.founderOutreach.growth >= 0 ? 'up' : 'down',
      },
      {
        id: 'resume-pdf-generator',
        label: 'Resume PDF Generator',
        value: data.resumeGenerated.count,
        trend: `${data.resumeGenerated.growth > 0 ? '+' : ''}${data.resumeGenerated.growth}% this week`,
        status: data.resumeGenerated.growth >= 0 ? 'up' : 'down',
      }
    ];
  },

  async getRoleDistribution(startDate?: Date, endDate?: Date): Promise<RoleDistributionDataPoint[]> {
    const params = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() };
    // Backend returns { role: string, count: number, fill: string }[]
    // We map role to name, count to value, fill to color
    const { data } = await api.get<any[]>('/dashboard/charts/role-distribution', { params });
    
    return data.map((item: any) => ({
      name: item.role,
      value: item.count,
      color: item.fill || '#cccccc',
    }));
  },

  async getDailyVelocity(startDate?: Date, endDate?: Date): Promise<DailyEmailDataPoint[]> {
    const params = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() };
    // Backend returns array of { date: string, [Role]: count }
    const { data } = await api.get<any[]>('/dashboard/charts/daily-velocity', { params });
    return data;
  },

  async getHeatmap(startDate?: Date, endDate?: Date): Promise<HeatmapDataPoint[]> {
    const params = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() };
    const { data } = await api.get<HeatmapDataPoint[]>('/dashboard/charts/heatmap', { params });
    return data;
  },

  async getRecentActivity(limit: number = 20): Promise<ActivityLog[]> {
    const { data } = await api.get<any[]>('/dashboard/recent-activity', { params: { limit } });
    
    return data.map((item: any) => ({
      id: item.id,
      company: item.company,
      role: item.role,
      date: item.date ? formatDistanceToNow(parseISO(item.date), { addSuffix: true }) : 'N/A', // Convert ISO to "2 days ago"
      status: item.status, // Ensure backend status matches enum or map it here
      type: item.type,
    }));
  }
};

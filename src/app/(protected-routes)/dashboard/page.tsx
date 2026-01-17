'use client';

import { MOCK_METRICS, MOCK_DAILY_EMAILS, MOCK_ROLE_DISTRIBUTION, MOCK_ACTIVITY, MOCK_HEATMAP_DATA } from '@/lib/constants';
import TotalEmailsCard from '@/components/metrics/TotalEmailsCard';
import DailyEmailVelocityChart from '@/components/charts/DailyEmailVelocityChart';
import RoleDistributionDonut from '@/components/charts/RoleDistributionDonut';
import RecentActivityTable from '@/components/table/RecentActivityTable';
import DashboardFilter from '@/components/ui/DashboardFilter';
import ApplicationHeatmap from '@/components/charts/ApplicationHeatmap';
import NoDataFallback from '@/components/ui/NoDataFallback';
import { useEffect, useState, useCallback } from 'react';
import { DashboardService } from '@/services/dashboardService';
import { MetricItem, DailyEmailDataPoint, RoleDistributionDataPoint, ActivityLog, HeatmapDataPoint } from '@/lib/types';
import { startOfDay, endOfDay } from 'date-fns';

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<MetricItem[]>([]);
    const [dailyEmails, setDailyEmails] = useState<DailyEmailDataPoint[]>([]);
    const [roleDistribution, setRoleDistribution] = useState<RoleDistributionDataPoint[]>([]);
    const [activity, setActivity] = useState<ActivityLog[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);

    // Loading states
    const [loading, setLoading] = useState(true);

    // Filters
    const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const range = dateRange ? {
                startDate: startOfDay(dateRange.startDate),
                endDate: endOfDay(dateRange.endDate)
            } : undefined;

            const [
                fetchedMetrics,
                fetchedRoles,
                fetchedVelocity,
                fetchedHeatmap,
                fetchedActivity
            ] = await Promise.all([
                DashboardService.getMetrics(range?.startDate, range?.endDate),
                DashboardService.getRoleDistribution(range?.startDate, range?.endDate),
                DashboardService.getDailyVelocity(range?.startDate, range?.endDate),
                DashboardService.getHeatmap(range?.startDate, range?.endDate),
                DashboardService.getRecentActivity()
            ]);

            setMetrics(fetchedMetrics);
            setRoleDistribution(fetchedRoles);
            setDailyEmails(fetchedVelocity);
            setHeatmapData(fetchedHeatmap);
            setActivity(fetchedActivity);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            // Optional: Set defaults or empty states on error
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDateRangeChange = (range: { startDate: Date; endDate: Date } | null) => {
        setDateRange(range);
    };

    if (loading && metrics.length === 0) {
        // Simple loading state - can be improved with skeletons
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-sm text-gray-400">Overview of your automated job application performance</p>
                </div>
                <DashboardFilter onDateRangeChange={handleDateRangeChange} />
            </div>

            {/* Metrics Row */}
            <section className="mb-8">
                {metrics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {metrics.map((item) => (
                            <TotalEmailsCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <NoDataFallback message="No metrics found" className="min-h-[10rem]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-full p-4">
                            {MOCK_METRICS.map((item) => (
                                <TotalEmailsCard key={item.id} item={item} />
                            ))}
                        </div>
                    </NoDataFallback>
                )}
            </section>


            {/* Charts Row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {roleDistribution.length > 0 ? (
                    <RoleDistributionDonut data={roleDistribution} />
                ) : (
                    <NoDataFallback message="No role data">
                        <div className="w-full h-full pointer-events-none">
                            <RoleDistributionDonut data={MOCK_ROLE_DISTRIBUTION} />
                        </div>
                    </NoDataFallback>
                )}

                {dailyEmails.length > 0 ? (
                    <DailyEmailVelocityChart data={dailyEmails} />
                ) : (
                    <NoDataFallback message="No velocity data" className="col-span-1 lg:col-span-2">
                        <div className="w-full h-full pointer-events-none">
                            <DailyEmailVelocityChart data={MOCK_DAILY_EMAILS} />
                        </div>
                    </NoDataFallback>
                )}
            </section>

            {/* Heatmap Row */}
            <section className="mb-8">
                {heatmapData.length > 0 ? (
                    <ApplicationHeatmap data={heatmapData} />
                ) : (
                    <NoDataFallback message="No activity heatmap">
                        <div className="w-full h-full pointer-events-none">
                            <ApplicationHeatmap data={MOCK_HEATMAP_DATA} />
                        </div>
                    </NoDataFallback>
                )}
            </section>

            {/* Activity Table Row */}
            <section className="grid grid-cols-1 gap-6">
                {activity.length > 0 ? (
                    <RecentActivityTable data={activity} />
                ) : (
                    <NoDataFallback message="No recent activity">
                        <div className="w-full h-full pointer-events-none">
                            <RecentActivityTable data={MOCK_ACTIVITY} />
                        </div>
                    </NoDataFallback>
                )}
            </section>
        </>
    );
}

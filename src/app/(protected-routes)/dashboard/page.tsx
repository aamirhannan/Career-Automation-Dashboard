'use client';

import { MOCK_METRICS, MOCK_DAILY_EMAILS, MOCK_ROLE_DISTRIBUTION, MOCK_ACTIVITY, MOCK_HEATMAP_DATA } from '@/lib/constants';
import TotalEmailsCard from '@/components/metrics/TotalEmailsCard';
import DailyEmailVelocityChart from '@/components/charts/DailyEmailVelocityChart';
import RoleDistributionDonut from '@/components/charts/RoleDistributionDonut';
import RecentActivityTable from '@/components/table/RecentActivityTable';
import DashboardFilter from '@/components/ui/DashboardFilter';
import ApplicationHeatmap from '@/components/charts/ApplicationHeatmap';
import { useState } from 'react';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export default function DashboardPage() {
    const [dailyEmails, setDailyEmails] = useState(MOCK_DAILY_EMAILS);
    const [activity, setActivity] = useState(MOCK_ACTIVITY);
    const [heatmapData, setHeatmapData] = useState(MOCK_HEATMAP_DATA);

    const handleDateRangeChange = (range: { startDate: Date; endDate: Date } | null) => {
        if (!range) {
            // Reset to original data
            setDailyEmails(MOCK_DAILY_EMAILS);
            setActivity(MOCK_ACTIVITY);
            setHeatmapData(MOCK_HEATMAP_DATA);
            return;
        }

        const { startDate, endDate } = range;
        const normalizedStart = startOfDay(startDate);
        const normalizedEnd = endOfDay(endDate);

        // Filter Daily Emails
        const filteredEmails = MOCK_DAILY_EMAILS.filter(item => {
            // assuming item.date is YYYY-MM-DD or similar string
            const itemDate = new Date(item.date);
            return isWithinInterval(itemDate, { start: normalizedStart, end: normalizedEnd });
        });
        setDailyEmails(filteredEmails);

        // Filter Activity
        const filteredActivity = MOCK_ACTIVITY.filter(item => {
            const itemDate = new Date(item.date); // Adjust format parsing if needed
            // If date is "Jan 14, 2026", new Date() usually parses it correctly in browsers
            // Just being safe
            return isWithinInterval(itemDate, { start: normalizedStart, end: normalizedEnd });
        });
        setActivity(filteredActivity);

        // Filter Heatmap
        const filteredHeatmap = MOCK_HEATMAP_DATA.filter(item => {
            const itemDate = new Date(item.date);
            return isWithinInterval(itemDate, { start: normalizedStart, end: normalizedEnd });
        });
        setHeatmapData(filteredHeatmap);
    };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_METRICS.map((item) => (
                        <TotalEmailsCard key={item.id} item={item} />
                    ))}
                </div>
            </section>


            {/* Charts Row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <RoleDistributionDonut data={MOCK_ROLE_DISTRIBUTION} />
                <DailyEmailVelocityChart data={dailyEmails} />
            </section>

            {/* Heatmap Row */}
            <section className="mb-8">
                <ApplicationHeatmap data={heatmapData} />
            </section>

            {/* Activity Table Row */}
            <section className="grid grid-cols-1 gap-6">
                <RecentActivityTable data={activity} />
            </section>
        </>
    );
}

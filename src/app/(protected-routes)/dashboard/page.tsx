import { MOCK_METRICS, MOCK_VELOCITY_DATA, MOCK_STATUS_DATA, MOCK_ACTIVITY } from '@/lib/constants';
import MetricCard from '@/components/metrics/MetricCard';
import ApplicationVelocityChart from '@/components/charts/ApplicationVelocityChart';
import ApplicationStatusDonut from '@/components/charts/ApplicationStatusDonut';
import RecentActivityTable from '@/components/table/RecentActivityTable';

export default function DashboardPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, Alex</h1>
                <p className="text-gray-400">Here's what's happening with your job applications today.</p>
            </div>

            {/* Metrics Row */}
            <section className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_METRICS.map((item) => (
                        <MetricCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            {/* Charts Row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <ApplicationVelocityChart data={MOCK_VELOCITY_DATA} />
                <ApplicationStatusDonut data={MOCK_STATUS_DATA} />
            </section>

            {/* Activity Table Row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RecentActivityTable data={MOCK_ACTIVITY} />
            </section>
        </>
    );
}

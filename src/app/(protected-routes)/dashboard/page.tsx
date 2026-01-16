import { MOCK_METRICS, MOCK_DAILY_EMAILS, MOCK_ROLE_DISTRIBUTION, MOCK_ACTIVITY } from '@/lib/constants';
import TotalEmailsCard from '@/components/metrics/TotalEmailsCard';
import DailyEmailVelocityChart from '@/components/charts/DailyEmailVelocityChart';
import RoleDistributionDonut from '@/components/charts/RoleDistributionDonut';
import RecentActivityTable from '@/components/table/RecentActivityTable';
import DashboardFilter from '@/components/ui/DashboardFilter';

export default function DashboardPage() {
    return (
        <>
            <div className="flex items-start justify-between mb-8">
                <div>
                    {/* Replaced generic Title with nothing or could add it back if needed, 
               but design shows simple layout. I'll keep the filter align to top right */}
                </div>
                <DashboardFilter />
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
                <DailyEmailVelocityChart data={MOCK_DAILY_EMAILS} />
            </section>

            {/* Activity Table Row */}
            <section className="grid grid-cols-1 gap-6">
                <RecentActivityTable data={MOCK_ACTIVITY} />
            </section>
        </>
    );
}

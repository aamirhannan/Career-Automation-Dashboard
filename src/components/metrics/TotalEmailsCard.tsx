import GlassCard from '@/components/ui/GlassCard';
import { MetricItem } from '@/lib/types';
import StatNumber from '@/components/ui/StatNumber';

interface TotalEmailsCardProps {
    item: MetricItem;
}

export default function TotalEmailsCard({ item }: TotalEmailsCardProps) {
    return (
        <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-primary/30 transition-colors group">
            <h3 className="text-gray-400 font-medium text-sm group-hover:text-primary transition-colors">{item.label}</h3>
            <div className="mt-4">
                <StatNumber
                    value={item.value}
                    trend={item.status}
                    trendValue={item.trend}
                    size="lg"
                />
            </div>
        </GlassCard>
    );
}

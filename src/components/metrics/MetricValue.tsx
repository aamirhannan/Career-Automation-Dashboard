import StatNumber from '@/components/ui/StatNumber';
import { MetricItem } from '@/lib/types';

interface MetricValueProps {
    item: MetricItem;
}

export default function MetricValue({ item }: MetricValueProps) {
    return (
        <StatNumber
            value={item.value}
            trend={item.status}
            trendValue={item.trend}
            size="lg"
        />
    );
}

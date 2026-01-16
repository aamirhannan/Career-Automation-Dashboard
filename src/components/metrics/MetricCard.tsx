import GlassCard from '@/components/ui/GlassCard';
import MetricIcon from './MetricIcon';
import MetricValue from './MetricValue';
import { MetricItem } from '@/lib/types';

interface MetricCardProps {
    item: MetricItem;
}

export default function MetricCard({ item }: MetricCardProps) {
    // Determine specific styles based on metric type for subtle differentiation
    const getIconContainerStyle = (id: string) => {
        // Just using simple index-based or id-based logic for demo visual variance
        switch (item.icon) {
            case 'file-text': return 'bg-blue-500/10 text-blue-400';
            case 'send': return 'bg-primary/10 text-primary';
            case 'briefcase': return 'bg-purple-500/10 text-purple-400';
            case 'check-circle': return 'bg-success/10 text-success';
            default: return 'bg-white/5 text-gray-400';
        }
    };

    return (
        <GlassCard className="p-6 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-400 font-medium text-sm">{item.label}</h3>
                <div className={`p-2.5 rounded-xl ${getIconContainerStyle(item.id)}`}>
                    <MetricIcon icon={item.icon} />
                </div>
            </div>
            <MetricValue item={item} />
        </GlassCard>
    );
}

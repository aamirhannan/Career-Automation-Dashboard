import { ApplicationStatus } from '@/lib/types';

interface StatusBadgeProps {
    status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<ApplicationStatus, string> = {
        Applied: 'bg-primary/10 text-primary border-primary/20',
        Screening: 'bg-secondary/10 text-secondary border-secondary/20',
        Interview: 'bg-warning/10 text-warning border-warning/20',
        Offer: 'bg-success/10 text-success border-success/20',
        Rejected: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]} inline-flex items-center`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'Rejected' ? 'bg-gray-400' : 'bg-current animate-pulse'}`} />
            {status}
        </span>
    );
}

import { ApplicationStatus } from '@/lib/types';

interface StatusBadgeProps {
    status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<ApplicationStatus, string> = {
        Success: 'bg-success/10 text-success border-success/20',
        Failed: 'bg-error/10 text-error border-error/20',
        Pending: 'bg-warning/10 text-warning border-warning/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]} uppercase`}>
            {status}
        </span>
    );
}

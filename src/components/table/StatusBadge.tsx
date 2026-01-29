import { ApplicationStatus, ResumeStatus } from '@/lib/types';

interface StatusBadgeProps {
    status: ResumeStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<ResumeStatus, string> = {
        Success: 'bg-success/10 text-success border-success/20',
        Failed: 'bg-error/10 text-error border-error/20',
        Pending: 'bg-warning/10 text-warning border-warning/20',
        'In Progress': 'bg-info/10 text-info border-info/20',
        Waiting: 'bg-gray-100/10 text-gray-100 border-gray-100/20',
        Rejected: 'bg-error/10 text-error border-error/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]} uppercase`}>
            {status}
        </span>
    );
}

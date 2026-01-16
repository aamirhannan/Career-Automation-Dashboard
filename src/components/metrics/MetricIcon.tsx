import { Briefcase, FileText, Send, CheckCircle, LucideIcon } from 'lucide-react';

interface MetricIconProps {
    icon: 'briefcase' | 'file-text' | 'send' | 'check-circle';
    className?: string;
}

export default function MetricIcon({ icon, className = '' }: MetricIconProps) {
    const icons: Record<string, LucideIcon> = {
        briefcase: Briefcase,
        'file-text': FileText,
        send: Send,
        'check-circle': CheckCircle,
    };

    const IconComponent = icons[icon];

    if (!IconComponent) return null;

    return <IconComponent className={className} size={24} />;
}

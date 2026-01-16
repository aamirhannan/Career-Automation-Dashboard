import { ReactNode } from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export default function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div>
                <h2 className="text-xl font-semibold text-white tracking-wide">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

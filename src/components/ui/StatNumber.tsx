interface StatNumberProps {
    value: string | number;
    size?: 'sm' | 'md' | 'lg';
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    className?: string;
}

export default function StatNumber({
    value,
    size = 'md',
    trend,
    trendValue,
    className = ''
}: StatNumberProps) {
    const sizeClasses = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
    };

    const trendColor = {
        up: 'text-success',
        down: 'text-error',
        neutral: 'text-gray-400',
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <span className={`font-bold text-white tracking-tight ${sizeClasses[size]}`}>
                {value}
            </span>
            {trendValue && trend && (
                <span className={`text-xs font-medium mt-1 ${trendColor[trend]} flex items-center gap-1`}>
                    {trendValue}
                </span>
            )}
        </div>
    );
}

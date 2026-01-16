import { ReactNode } from 'react';

interface GlowBorderProps {
    children: ReactNode;
    className?: string;
    intensity?: 'low' | 'high';
}

export default function GlowBorder({ children, className = '', intensity = 'low' }: GlowBorderProps) {
    const ringOpacity = intensity === 'high' ? 'ring-primary/60' : 'ring-primary/40';
    const shadow = intensity === 'high' ? 'shadow-[0_0_30px_-5px_var(--primary-glow)]' : 'shadow-glow';

    return (
        <div
            className={`relative rounded-2xl ring-1 ${ringOpacity} ${shadow} ${className}`}
        >
            {children}
        </div>
    );
}

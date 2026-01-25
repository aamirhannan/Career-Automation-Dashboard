import { ReactNode, MouseEventHandler } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-dark-800/60 backdrop-blur-xl border border-white/10 shadow-glass ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}


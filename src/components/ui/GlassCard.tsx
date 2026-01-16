import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-dark-800/60 backdrop-blur-xl border border-white/10 shadow-glass ${className}`}
        >
            {children}
        </div>
    );
}

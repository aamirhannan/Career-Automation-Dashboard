import { ReactNode } from 'react';

interface MainGridProps {
    children: ReactNode;
}

export default function MainGrid({ children }: MainGridProps) {
    return (
        <main className="pt-24 pb-4 px-4 lg:ml-64 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-dark-900">
            <div className="max-w-full mx-auto space-y-6 animate-fade-in">
                {children}
            </div>
        </main>
    );
}

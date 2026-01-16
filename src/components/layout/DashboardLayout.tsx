import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import MainGrid from './MainGrid';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-primary/30 selection:text-white">
            <Sidebar />
            <TopNav />
            <MainGrid>
                {children}
            </MainGrid>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { LayoutDashboard, FileText, Settings, BarChart, Mail, Users, List, Briefcase } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    // Mapping string icon names to components
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'layout-dashboard': return <LayoutDashboard size={20} />;
            case 'file-text': return <FileText size={20} />;
            case 'settings': return <Settings size={20} />;
            case 'bar-chart': return <BarChart size={20} />;
            case 'mail': return <Mail size={20} />;
            case 'users': return <Users size={20} />;
            case 'list': return <List size={20} />;
            case 'briefcase': return <Briefcase size={20} />;
            default: return <LayoutDashboard size={20} />;
        }
    };

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname?.startsWith(href)) return true;
        return false;
    };

    return (
        <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-dark-900 border-r border-white/5 hidden lg:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
                </div>
                <span className="text-lg font-bold tracking-wider text-white">AUTO<span className="text-primary">APPLY</span></span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
              ${active
                                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={active ? 'text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}>
                                {getIcon(item.icon)}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-full translate-x-10 -translate-y-10" />
                <h4 className="text-sm font-semibold text-white mb-1 relative z-10">Pro Plan</h4>
                <p className="text-xs text-gray-500 mb-3 relative z-10">1,240 credits left</p>
                <div className="w-full bg-dark-900 h-1.5 rounded-full overflow-hidden relative z-10">
                    <div className="bg-primary h-full w-[75%] shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                </div>
            </div>
        </aside>
    );
}

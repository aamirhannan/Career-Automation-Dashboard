'use client';

import { Bell, Search, User } from 'lucide-react';
import { IconButton, Avatar, Tooltip } from '@mui/material';
import UserProfile from './UserProfile';

export default function TopNav() {
    return (
        <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 z-40 bg-dark-900/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full h-10 bg-dark-800/50 border border-white/5 rounded-xl pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Tooltip title="Notifications">
                    <IconButton sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                        <div className="relative">
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_#ef4444]" />
                        </div>
                    </IconButton>
                </Tooltip>

                <div className="h-8 w-[1px] bg-white/10 mx-1" />

                <UserProfile />
            </div>
        </header>
    );
}

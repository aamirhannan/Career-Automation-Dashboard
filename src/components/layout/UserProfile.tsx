'use client';

import { useAuth } from '@/context/AuthContext';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { User, LogOut, Settings, CreditCard } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        handleClose();
        await signOut();
    };

    if (!user) {
        // Should technically be redirected by middleware, but good fallback/loading state
        return null;
    }

    // Extract user details
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const email = user.email || '';
    const avatarUrl = user.user_metadata?.avatar_url;

    return (
        <>
            <div
                onClick={handleClick}
                className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors select-none"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white leading-none">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-none">{email}</p>
                </div>
                <Avatar
                    src={avatarUrl}
                    sx={{ width: 36, height: 36, bgcolor: '#272a34', color: '#7c3aed', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    {!avatarUrl && <User size={18} />}
                </Avatar>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        bgcolor: '#1a1c23',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: '#1a1c23',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            borderLeft: '1px solid rgba(255,255,255,0.1)',
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Avatar src={avatarUrl} /> Profile
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon>
                        <Settings style={{ color: 'white' }} size={18} />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleSignOut} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon>
                        <LogOut style={{ color: '#ef4444' }} size={18} />
                    </ListItemIcon>
                    <span className="text-red-500">Sign out</span>
                </MenuItem>
            </Menu>
        </>
    );
}

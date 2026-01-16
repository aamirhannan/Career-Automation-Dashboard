'use client';

import { Calendar } from 'lucide-react';
import { IconButton, Popover } from '@mui/material';
import { useState } from 'react';

export default function DashboardFilter() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: '#94a3b8',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    '&:hover': {
                        bgcolor: 'rgba(124, 58, 237, 0.1)',
                        color: '#7c3aed',
                        borderColor: 'rgba(124, 58, 237, 0.3)'
                    }
                }}
            >
                <Calendar size={18} />
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        p: 2,
                        bgcolor: '#1a1c23',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                        mt: 1
                    }
                }}
            >
                <div className="text-sm text-gray-400">Date picker coming soon...</div>
            </Popover>
        </>
    );
}

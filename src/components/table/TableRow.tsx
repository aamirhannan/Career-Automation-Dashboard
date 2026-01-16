'use client';

import { ActivityLog, ApplicationStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import RetryButton from './RetryButton';
import { MoreHorizontal } from 'lucide-react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

interface TableRowProps {
    row: ActivityLog;
}

export default function TableRow({ row }: TableRowProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-4">
                <div>
                    <p className="text-sm font-medium text-white">{row.company}</p>
                    <p className="text-xs text-secondary">{row.role}</p>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-400">
                {row.date}
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 text-sm text-gray-300">
                {row.type}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {row.status !== 'Success' && <RetryButton />}
                    <IconButton
                        size="small"
                        onClick={handleClick}
                        sx={{ color: '#64748b', '&:hover': { color: '#f8fafc' } }}
                    >
                        <MoreHorizontal size={16} />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                bgcolor: '#1a1c23',
                                color: '#e2e8f0',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                minWidth: '140px'
                            }
                        }}
                    >
                        <MenuItem onClick={handleClose} sx={{ fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>View Details</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>Archive</MenuItem>
                    </Menu>
                </div>
            </td>
        </tr>
    );
}

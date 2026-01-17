'use client';

import { Calendar as CalendarIcon, X } from 'lucide-react';
import { IconButton, Popover, Button, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { format, subDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DashboardFilterProps {
    onDateRangeChange?: (range: { startDate: Date; endDate: Date } | null) => void;
}

export default function DashboardFilter({ onDateRangeChange }: DashboardFilterProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: subDays(new Date(), 7),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [appliedRange, setAppliedRange] = useState<{ startDate: Date; endDate: Date } | null>(null);

    // Close popover
    const handleClose = () => {
        setAnchorEl(null);
        // Reset local state to applied state if exists, else default
        if (appliedRange) {
            setDateRange([{ ...appliedRange, key: 'selection' }]);
        } else {
            // Optional: Reset to default if nothing applied? Or keep selection?
            // Let's keep selection as is but maybe we want to reset to last applied.
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelect = (ranges: RangeKeyDict) => {
        const selection = ranges.selection;
        setDateRange([selection as any]);
    };

    const handleApply = () => {
        const { startDate, endDate } = dateRange[0];
        if (startDate && endDate) {
            const newRange = { startDate, endDate };
            setAppliedRange(newRange);
            if (onDateRangeChange) {
                onDateRangeChange(newRange);
            }
        }
        setAnchorEl(null);
    };

    const handleReset = () => {
        setAppliedRange(null);
        setDateRange([{
            startDate: subDays(new Date(), 7),
            endDate: new Date(),
            key: 'selection'
        }]);
        if (onDateRangeChange) {
            onDateRangeChange(null);
        }
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    // Formatted label for the trigger button
    const getButtonLabel = () => {
        if (appliedRange) {
            return `${format(appliedRange.startDate, 'MMM d')} - ${format(appliedRange.endDate, 'MMM d')}`;
        }
        return 'Filter Date';
    };

    return (
        <>
            <Button
                onClick={handleClick}
                startIcon={<CalendarIcon size={18} />}
                endIcon={appliedRange ? <span onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                }} className="hover:text-white transition-colors"><X size={14} /></span> : null}
                sx={{
                    color: appliedRange ? '#e2e8f0' : '#94a3b8',
                    bgcolor: appliedRange ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: appliedRange ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    height: 40,
                    textTransform: 'none',
                    padding: '0 16px',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    '&:hover': {
                        bgcolor: appliedRange ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.1)',
                        color: '#f8fafc',
                        borderColor: 'rgba(124, 58, 237, 0.3)'
                    }
                }}
            >
                {getButtonLabel()}
            </Button>

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
                    className: 'glass-panel',
                    sx: {
                        p: 0,
                        bgcolor: '#1a1c23', // Fallback
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px 0 rgba(0,0,0,0.5)',
                        mt: 1,
                        overflow: 'hidden'
                    }
                }}
            >
                <div className="p-4 bg-dark-800/50 backdrop-blur-xl">
                    <div className="calendar-dark-override">
                        <DateRange
                            ranges={dateRange}
                            onChange={handleSelect}
                            rangeColors={['#7c3aed']}
                            months={1}
                            direction="horizontal"
                            showDateDisplay={false}
                            fixedHeight={true}
                        />
                    </div>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />

                    <div className="flex items-center justify-between">
                        <Button
                            size="small"
                            onClick={handleReset}
                            sx={{ color: '#94a3b8', textTransform: 'none' }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApply}
                            sx={{
                                bgcolor: '#7c3aed',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#6d28d9' }
                            }}
                        >
                            Apply Filter
                        </Button>
                    </div>
                </div>
            </Popover>
        </>
    );
}

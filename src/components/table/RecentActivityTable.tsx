'use client';

import { ActivityLog } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

interface RecentActivityTableProps {
    data: ActivityLog[];
}

export default function RecentActivityTable({ data }: RecentActivityTableProps) {
    return (
        <div className="col-span-1 lg:col-span-3">
            <SectionTitle
                title="Recent Activity"
                subtitle="Latest automated application actions"
                action={
                    <Button
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                            color: '#7c3aed',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.1)' }
                        }}
                    >
                        View All
                    </Button>
                }
            />

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <TableHeader />
                        <tbody>
                            {data.map((row) => (
                                <TableRow key={row.id} row={row} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

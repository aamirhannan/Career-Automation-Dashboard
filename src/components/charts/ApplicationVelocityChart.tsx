'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { VelocityDataPoint } from '@/lib/types';

interface VelocityChartProps {
    data: VelocityDataPoint[];
}

export default function ApplicationVelocityChart({ data }: VelocityChartProps) {
    return (
        <div className="col-span-1 lg:col-span-2">
            <SectionTitle title="Application Velocity" subtitle="Daily breakdown of applications vs interviews" />
            <GlassCard className="h-[350px] p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1c23',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        />
                        <Bar
                            dataKey="applications"
                            fill="#7c3aed"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                        <Bar
                            dataKey="interviews"
                            fill="#22d3ee"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </GlassCard>
        </div>
    );
}

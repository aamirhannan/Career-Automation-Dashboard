'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { DailyEmailDataPoint, JobRole } from '@/lib/types';

interface DailyEmailVelocityChartProps {
    data: DailyEmailDataPoint[];
}

export default function DailyEmailVelocityChart({ data }: DailyEmailVelocityChartProps) {
    return (
        <div className="col-span-1 lg:col-span-2">
            <SectionTitle title="Daily line graph for mail sent each day" />
            <GlassCard className="h-[350px] p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey={JobRole.Frontend}
                            stroke="#7c3aed"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey={JobRole.Backend}
                            stroke="#22d3ee"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey={JobRole.Fullstack}
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </GlassCard>
        </div>
    );
}

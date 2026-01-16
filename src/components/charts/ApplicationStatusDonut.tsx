'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { StatusDataPoint } from '@/lib/types';

interface StatusDonutProps {
    data: StatusDataPoint[];
}

export default function ApplicationStatusDonut({ data }: StatusDonutProps) {
    return (
        <div className="col-span-1">
            <SectionTitle title="Status Overview" subtitle="Current pipeline distribution" />
            <GlassCard className="h-[350px] p-6 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">90</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Active</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1c23',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="w-full grid grid-cols-2 gap-3 mt-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-gray-300">{item.name}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}

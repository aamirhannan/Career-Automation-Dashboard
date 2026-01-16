'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { RoleDistributionDataPoint } from '@/lib/types';

interface RoleDistributionDonutProps {
    data: RoleDistributionDataPoint[];
}

export default function RoleDistributionDonut({ data }: RoleDistributionDonutProps) {
    return (
        <div className="col-span-1">
            <SectionTitle title="Role Distribution" />
            <GlassCard className="h-[350px] p-6 flex flex-col items-center justify-center relative">
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            // Adding labels to match design roughly
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
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

                <div className="w-full flex flex-wrap justify-center gap-4 mt-2">
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

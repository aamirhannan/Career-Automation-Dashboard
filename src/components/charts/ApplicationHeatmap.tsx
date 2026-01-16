'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import { HeatmapDataPoint } from '@/lib/types';
import { subDays, format } from 'date-fns';
import GlassCard from '@/components/ui/GlassCard';

interface ApplicationHeatmapProps {
    data: HeatmapDataPoint[];
}

export default function ApplicationHeatmap({ data }: ApplicationHeatmapProps) {
    const today = new Date();

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Application Activity</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#1a1c23]/50 border border-white/5"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/80"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[800px]">
                    <CalendarHeatmap
                        startDate={subDays(today, 365)}
                        endDate={today}
                        values={data}
                        classForValue={(value) => {
                            const typedValue = value as HeatmapDataPoint;
                            if (!typedValue || typedValue.count === 0) {
                                return 'color-empty';
                            }
                            if (typedValue.count < 3) return 'color-scale-1';
                            if (typedValue.count < 6) return 'color-scale-2';
                            if (typedValue.count < 9) return 'color-scale-3';
                            return 'color-scale-4';
                        }}
                        tooltipDataAttrs={(value: any) => {
                            const typedValue = value as HeatmapDataPoint;
                            const date = typedValue.date ? format(new Date(typedValue.date), 'MMM d, yyyy') : '';
                            const count = typedValue.count ? typedValue.count : 0;
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': `${count} applications on ${date}`,
                            } as any;
                        }}
                        showWeekdayLabels
                        gutterSize={3}
                    />
                    <Tooltip id="heatmap-tooltip" style={{ backgroundColor: '#0d0e12', color: '#fff', padding: '8px 12px', borderRadius: '8px', zIndex: 100 }} />
                </div>
            </div>

            <style jsx global>{`
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: #64748b;
        }
        .react-calendar-heatmap .color-empty {
          fill: rgba(255, 255, 255, 0.03);
          rx: 2px;
          ry: 2px;
        }
        .react-calendar-heatmap .color-scale-1 { fill: rgba(124, 58, 237, 0.2); rx: 2px; ry: 2px; }
        .react-calendar-heatmap .color-scale-2 { fill: rgba(124, 58, 237, 0.4); rx: 2px; ry: 2px; }
        .react-calendar-heatmap .color-scale-3 { fill: rgba(124, 58, 237, 0.6); rx: 2px; ry: 2px; }
        .react-calendar-heatmap .color-scale-4 { fill: rgba(124, 58, 237, 0.8); rx: 2px; ry: 2px; }
        
        .react-calendar-heatmap rect:hover {
            stroke: #fff;
            stroke-width: 1px;
        }
      `}</style>
        </GlassCard>
    );
}

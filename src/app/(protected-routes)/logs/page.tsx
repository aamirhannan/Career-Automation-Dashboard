'use client';

import { MOCK_LOGS } from '@/lib/constants';
import { LogEntry } from '@/lib/types';
import LogsTable from '@/components/logs/LogsTable';
import DashboardFilter from '@/components/ui/DashboardFilter';
import { useState } from 'react';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export default function LogsPage() {
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(MOCK_LOGS as unknown as LogEntry[]);

    const handleDateRangeChange = (range: { startDate: Date; endDate: Date } | null) => {
        if (!range) {
            setFilteredLogs(MOCK_LOGS as unknown as LogEntry[]);
            return;
        }

        const { startDate, endDate } = range;
        const normalizedStart = startOfDay(startDate);
        const normalizedEnd = endOfDay(endDate);

        const filtered = (MOCK_LOGS as unknown as LogEntry[]).filter(log => {
            // timestamp might be ISO string or other format. MOCK_LOGS usually nice ISO strings.
            const logDate = new Date(log.timestamp);
            return isWithinInterval(logDate, { start: normalizedStart, end: normalizedEnd });
        });
        setFilteredLogs(filtered);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Logs</h1>
                    <p className="text-sm text-gray-400">Monitor and debug your AI agent runs</p>
                </div>
                <DashboardFilter onDateRangeChange={handleDateRangeChange} />
            </div>

            <div className="flex-1">
                <LogsTable logs={filteredLogs} />
            </div>
        </div>
    );
}

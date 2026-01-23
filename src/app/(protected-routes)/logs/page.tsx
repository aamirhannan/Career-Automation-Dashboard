'use client';

import { MOCK_LOGS } from '@/lib/constants';
import { LogEntry } from '@/lib/types';
import LogsTable from '@/components/logs/LogsTable';
import DashboardFilter from '@/components/ui/DashboardFilter';
import { useEffect, useState } from 'react';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { LogService } from '@/services/logService';

export default function LogsPage() {
    const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logs = await LogService.getAllRequestLogs();
                setAllLogs(logs);
                setFilteredLogs(logs);
            } catch (error) {
                console.error("Failed to fetch logs in LogsPage:", error);
                // Fallback to mock data if API fails (optional, good for dev)
                // setAllLogs(MOCK_LOGS);
                // setFilteredLogs(MOCK_LOGS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const handleDateRangeChange = (range: { startDate: Date; endDate: Date } | null) => {
        if (!range) {
            setFilteredLogs(allLogs);
            return;
        }

        const { startDate, endDate } = range;
        const normalizedStart = startOfDay(startDate);
        const normalizedEnd = endOfDay(endDate);

        const filtered = allLogs.filter(log => {
            const logDate = new Date(log.createdAt);
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
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">Loading logs...</div>
                ) : (
                    <LogsTable logs={filteredLogs} />
                )}
            </div>
        </div>
    );
}

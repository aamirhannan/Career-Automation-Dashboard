'use client';

import { MOCK_LOGS } from '@/lib/constants';
import { LogEntry } from '@/lib/types';
import LogsTable from '@/components/logs/LogsTable';

export default function LogsPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white mb-1">Logs</h1>
                <p className="text-sm text-gray-400">Monitor and debug your AI agent runs</p>
            </div>

            <div className="flex-1">
                <LogsTable logs={MOCK_LOGS as unknown as LogEntry[]} />
            </div>
        </div>
    );
}

import api from '@/lib/axios';
import { LogEntry } from '@/lib/types';

// API response wrapper type
interface LogsApiResponse {
    data: LogEntry[];
}

export const LogService = {
    /**
     * Fetches all request logs.
     * Endpoint: /api-request-logs/get-all-request-logs
     */
    async getAllRequestLogs(): Promise<LogEntry[]> {
        const { data } = await api.get<LogsApiResponse>('/api-request-logs/get-all-logs');
        return data.data;
    }
};

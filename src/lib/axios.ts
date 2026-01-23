import axios from 'axios';
import { createClient } from '@/utils/supabase/client';
import { getSettingsStore, getUserEmail } from './settingsStore';

// Create a singleton instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attaches auth token and user settings to every request
api.interceptors.request.use(
    async (config) => {
        const supabase = createClient();
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        // Get user settings from the global store
        const settings = getSettingsStore();
        const userEmail = getUserEmail();

        // Attach user email
        if (userEmail) {
            config.headers['x-user-email'] = userEmail;
        }

        // Attach app password (for SMTP)
        if (settings.appPassword) {
            config.headers['x-app-password'] = settings.appPassword;
        }

        // Attach blocked emails as JSON string
        if (settings.blockedEmails && settings.blockedEmails.length > 0) {
            config.headers['x-blocked-emails'] = JSON.stringify(settings.blockedEmails);
        }

        // Attach blocked domains as JSON string
        if (settings.blockedDomains && settings.blockedDomains.length > 0) {
            config.headers['x-blocked-domains'] = JSON.stringify(settings.blockedDomains);
        }

        // Attach daily limit
        if (settings.dailyLimit !== undefined) {
            config.headers['x-daily-limit'] = String(settings.dailyLimit);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Optional global error handling (e.g. 401 force logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Could add logic here to redirect to /login if 401 is received
        return Promise.reject(error);
    }
);

export default api;

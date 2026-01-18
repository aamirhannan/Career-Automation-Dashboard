import axios from 'axios';
import { createClient } from '@/utils/supabase/client';

// Create a singleton instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api/v1', // Default to local Node backend
    headers: {
        'Content-Type': 'application/json',
        

    },
});

// Request Interceptor: Attaches the Supabase JWT to every request
api.interceptors.request.use(
    async (config) => {
        const supabase = createClient();
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();

        console.log("Session:", session);

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        // Attach SMTP credentials if available
        const smtpEmail = process.env.NEXT_PUBLIC_SMTP_EMAIL;
        const smtpPassword = process.env.NEXT_PUBLIC_SMTP_PASSWORD;

        if (smtpEmail) {
            config.headers['x-smtp-email'] = smtpEmail;
        }
        if (smtpPassword) {
            config.headers['x-smtp-password'] = smtpPassword;
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
        // You could add logic here to redirect to /login if 401 is received
        // console.error("API Error:", error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export default api;
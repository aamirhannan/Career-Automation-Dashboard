import axios from 'axios';
import { createClient } from '@/utils/supabase/client';

// Create a singleton instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // Default to local Node backend
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

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
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

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { SnackbarProvider } from '@/context/SnackbarContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SnackbarProvider>
                {children}
            </SnackbarProvider>
        </AuthProvider>
    );
}

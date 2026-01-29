'use client';

import { AuthProvider } from '@/context/AuthContext';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { UserSettingsProvider } from '@/context/UserSettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <UserSettingsProvider>
                <SnackbarProvider>
                    {children}
                </SnackbarProvider>
            </UserSettingsProvider>
        </AuthProvider>
    );
}

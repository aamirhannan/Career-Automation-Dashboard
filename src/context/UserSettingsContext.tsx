'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserSettings } from '@/lib/types';
import { SettingsService } from '@/services/settingsService';
import { setSettingsStore, clearSettingsStore } from '@/lib/settingsStore';
import { useAuth } from './AuthContext';

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
    appPassword: '',
    blockedEmails: [],
    blockedDomains: [],
    dailyLimit: 0,
};

interface UserSettingsContextType {
    settings: UserSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    updateSettings: (newSettings: Partial<UserSettings>) => Promise<UserSettings>;
    refreshSettings: () => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch settings when user is authenticated
    const fetchSettings = useCallback(async () => {
        if (!user) {
            setSettings(DEFAULT_SETTINGS);
            clearSettingsStore();
            setIsLoading(false);
            setIsInitialized(true);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const fetchedSettings = await SettingsService.getUserSettings();

            if (fetchedSettings) {
                setSettings(fetchedSettings);
                // Sync to module-level store for axios
                setSettingsStore(fetchedSettings, user.email || '');
            }
        } catch (err) {
            console.warn('Failed to fetch user settings:', err);
            // Use defaults if settings don't exist yet
            setSettings(DEFAULT_SETTINGS);
            setSettingsStore(DEFAULT_SETTINGS, user.email || '');
            setError('Failed to load settings. Using defaults.');
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [user]);

    // Fetch settings after auth is ready
    useEffect(() => {
        if (!isAuthLoading) {
            fetchSettings();
        }
    }, [isAuthLoading, fetchSettings]);

    // Clear settings on logout
    useEffect(() => {
        if (!user && isInitialized) {
            clearSettingsStore();
            setSettings(DEFAULT_SETTINGS);
        }
    }, [user, isInitialized]);

    // Update settings
    const updateSettings = useCallback(async (newSettings: Partial<UserSettings>): Promise<UserSettings> => {
        try {
            const updated = await SettingsService.updateUserSettings(newSettings);
            setSettings(updated);
            // Sync to module-level store
            setSettingsStore(updated, user?.email || '');
            return updated;
        } catch (err) {
            console.error('Failed to update settings:', err);
            throw err;
        }
    }, [user?.email]);

    // Refresh settings from server
    const refreshSettings = useCallback(async () => {
        await fetchSettings();
    }, [fetchSettings]);

    return (
        <UserSettingsContext.Provider
            value={{
                settings,
                isLoading,
                isInitialized,
                error,
                updateSettings,
                refreshSettings,
            }}
        >
            {children}
        </UserSettingsContext.Provider>
    );
}

export const useUserSettings = () => {
    const context = useContext(UserSettingsContext);
    if (context === undefined) {
        throw new Error('useUserSettings must be used within a UserSettingsProvider');
    }
    return context;
};

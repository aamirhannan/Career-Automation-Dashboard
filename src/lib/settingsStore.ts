/**
 * Module-level settings store for axios interceptor access.
 * This allows the axios interceptor (which runs outside React) to read user settings.
 */

import { UserSettings } from './types';

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
    appPassword: '',
    blockedEmails: [],
    blockedDomains: [],
    dailyLimit: 0,
};

// Module-level store
let currentSettings: UserSettings = { ...DEFAULT_SETTINGS };
let userEmail: string = '';

/**
 * Updates the settings store. Called by UserSettingsContext when settings change.
 */
export function setSettingsStore(settings: UserSettings, email?: string): void {
    currentSettings = { ...settings };
    if (email) {
        userEmail = email;
    }
}

/**
 * Gets the current settings. Used by axios interceptor.
 */
export function getSettingsStore(): UserSettings {
    return currentSettings;
}

/**
 * Gets the user email. Used by axios interceptor.
 */
export function getUserEmail(): string {
    return userEmail;
}

/**
 * Resets the settings store to defaults. Called on logout.
 */
export function clearSettingsStore(): void {
    currentSettings = { ...DEFAULT_SETTINGS };
    userEmail = '';
}

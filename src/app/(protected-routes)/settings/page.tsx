'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Globe,
    Zap,
    Edit2,
    X,
    Plus,
    Save,
    CheckCircle2,
    Eye,
    EyeOff,
    Key
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { UserSettings } from '@/lib/types';
import { SettingsService } from '@/services/settingsService';
import { createClient } from '@/utils/supabase/client';

// Mock Data Types
interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    avatarUrl?: string;
}

// Initial Empty Data
const INITIAL_PROFILE: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    location: '',
    // Default placeholder if none provided
    avatarUrl: '',
};

const INITIAL_SETTINGS: UserSettings = {
    appPassword: '',
    blockedEmails: [],
    blockedDomains: [],
    dailyLimit: 0,
};

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Edit States
    // Profile is read-only from Google/Auth
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Temporary State for edits
    const [tempSettings, setTempSettings] = useState<UserSettings>(INITIAL_SETTINGS);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const supabase = createClient();

            // 1. Fetch Auth Profile
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Extract what we can from user metadata (Google usually provides these)
                const metadata = user.user_metadata || {};
                setProfile({
                    firstName: metadata.full_name?.split(' ')[0] || metadata.given_name || 'User',
                    lastName: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.family_name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    role: 'User', // Placeholder or from metadata if available
                    location: '', // Placeholder
                    avatarUrl: metadata.avatar_url || metadata.picture || '',
                });

                // Initialize settings with userId even if fetch fails
                setSettings(prev => ({ ...prev, userId: user.id }));
                setTempSettings(prev => ({ ...prev, userId: user.id }));
            }

            // 2. Fetch User Settings
            try {
                const fetchedSettings = await SettingsService.getUserSettings();
                if (fetchedSettings) {
                    setSettings(fetchedSettings);
                    setTempSettings(fetchedSettings);
                }
            } catch (error) {
                console.warn('Failed to fetch settings or they do not exist yet:', error);
                // If 404 or similar, we just stick with defaults which allows the user to 'create' them on save
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveSettings = async () => {
        try {
            // Ensure userId is present if it wasn't fetched
            const payload = { ...tempSettings };
            // if (!payload.userId && settings.userId) {
            //     payload.userId = settings.userId;
            // }

            // Service now expects partial UserSettings (camelCase)
            const updated = await SettingsService.updateUserSettings(payload);
            setSettings(updated);
            setTempSettings(updated);
            setIsEditingSettings(false);
        } catch (error) {
            console.error('Failed to update settings:', error);
            alert('Failed to save settings. Please try again.');
        }
    };

    const toggleSettingsEdit = () => {
        if (isEditingSettings) {
            setTempSettings(settings); // Reset on cancel
        } else {
            setTempSettings(settings); // Init on edit
        }
        setIsEditingSettings(!isEditingSettings);
    };

    // Tag Input Handlers
    const addTag = (field: 'blockedEmails' | 'blockedDomains', value: string) => {
        if (!value.trim()) return;
        setTempSettings(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));
    };

    const removeTag = (field: 'blockedEmails' | 'blockedDomains', index: number) => {
        setTempSettings(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-gray-400">Manage your profile and automation preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* My Profile Header Card */}
                    <GlassCard className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/50 shadow-lg shadow-primary-500/20 bg-dark-800">
                                        {profile.avatarUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={profile.avatarUrl}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-primary-500">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <p className="text-primary-400 font-medium mb-1">{profile.email}</p>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <Shield size={12} /> Managed by Google Auth
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Personal Information (Read Only) */}
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="text-primary-500" size={20} />
                                    Personal Information
                                </h3>
                                <p className="text-sm text-gray-500 ml-7 mt-1">
                                    These details are managed by your login provider and cannot be changed here.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 opacity-80">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">First Name</label>
                                <p className="text-white font-medium text-lg border-b border-white/5 pb-1">{profile.firstName || '-'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Last Name</label>
                                <p className="text-white font-medium text-lg border-b border-white/5 pb-1">{profile.lastName || '-'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email Address</label>
                                <div className="flex items-center gap-2 border-b border-white/5 pb-1">
                                    <p className="text-white font-medium text-lg">{profile.email || '-'}</p>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Phone</label>
                                <p className="text-white font-medium text-lg border-b border-white/5 pb-1">{profile.phone || '-'}</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Automation & Safety Settings (DB Schema Fields) */}
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield className="text-primary-500" size={20} />
                                Automation & Safety
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={toggleSettingsEdit}
                                    className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${isEditingSettings
                                        ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {isEditingSettings ? <X size={16} /> : <Edit2 size={16} />}
                                    {isEditingSettings ? 'Cancel' : 'Edit'}
                                </button>
                                {isEditingSettings && (
                                    <button
                                        onClick={handleSaveSettings}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all"
                                    >
                                        <Save size={16} /> Save
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">

                            {/* App Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
                                <div>
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-2">
                                        <Key size={18} className="text-green-500" />
                                        App Password
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Your email app password for sending automated emails. This is stored securely.
                                    </p>
                                    <a
                                        href="https://myaccount.google.com/apppasswords"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 mt-2 transition-colors"
                                    >
                                        Generate app password →
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    {isEditingSettings ? (
                                        <div className="relative w-full max-w-[300px]">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={tempSettings.appPassword || ''}
                                                onChange={(e) => setTempSettings({ ...tempSettings, appPassword: e.target.value })}
                                                placeholder="Enter app password..."
                                                className="w-full bg-dark-900/50 border border-white/10 rounded-lg pl-4 pr-12 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-white font-mono">
                                            {settings.appPassword ? (
                                                <span className="text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 size={16} />
                                                    ••••••••••••
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 italic">Not set</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Daily Limit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
                                <div>
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-2">
                                        <Zap size={18} className="text-yellow-500" />
                                        Daily Limit
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Maximum number of applications/emails to process per day.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {isEditingSettings ? (
                                        <div className="relative w-full max-w-[200px]">
                                            <input
                                                type="number"
                                                min="0"
                                                value={tempSettings.dailyLimit}
                                                onChange={(e) => setTempSettings({ ...tempSettings, dailyLimit: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-dark-900/50 border border-white/10 rounded-lg pl-4 pr-12 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                            />
                                            <span className="absolute right-4 top-2.5 text-gray-500 text-sm">/ day</span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-white">
                                            {settings.dailyLimit} <span className="text-sm font-normal text-gray-500">requests / day</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Blocked Emails */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/5">
                                <div className="md:col-span-1">
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-2">
                                        <Mail size={18} className="text-blue-400" />
                                        Blocked Emails
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Emails that should never be contacted or processed.
                                    </p>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    {isEditingSettings && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add email to block..."
                                                className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addTag('blockedEmails', e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                                id="add-email-input"
                                            />
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById('add-email-input') as HTMLInputElement;
                                                    if (input) {
                                                        addTag('blockedEmails', input.value);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {(isEditingSettings ? tempSettings.blockedEmails : settings.blockedEmails)?.map((email, idx) => (
                                            <div key={idx} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                                                <span>{email}</span>
                                                {isEditingSettings && (
                                                    <button
                                                        onClick={() => removeTag('blockedEmails', idx)}
                                                        className="p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {(!settings.blockedEmails || settings.blockedEmails.length === 0) && (!isEditingSettings || !tempSettings.blockedEmails?.length) && (
                                            <span className="text-gray-600 italic text-sm">No blocked emails</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Blocked Domains */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-2">
                                        <Globe size={18} className="text-purple-400" />
                                        Blocked Domains
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Entire domains to exclude from outreach or applications.
                                    </p>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    {isEditingSettings && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add domain to block (e.g. gmail.com)..."
                                                className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addTag('blockedDomains', e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                                id="add-domain-input"
                                            />
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById('add-domain-input') as HTMLInputElement;
                                                    if (input) {
                                                        addTag('blockedDomains', input.value);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {(isEditingSettings ? tempSettings.blockedDomains : settings.blockedDomains)?.map((domain, idx) => (
                                            <div key={idx} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                                                <span>{domain}</span>
                                                {isEditingSettings && (
                                                    <button
                                                        onClick={() => removeTag('blockedDomains', idx)}
                                                        className="p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {(!settings.blockedDomains || settings.blockedDomains.length === 0) && (!isEditingSettings || !tempSettings.blockedDomains?.length) && (
                                            <span className="text-gray-600 italic text-sm">No blocked domains</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </GlassCard>

                    {/* Read-Only Metadata */}
                    {settings.workspaceId && (
                        <GlassCard className="p-6 opacity-60">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 font-mono">
                                <div>User ID: {settings.userId}</div>
                                <div>Workspace ID: {settings.workspaceId}</div>
                                <div>Last Updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}</div>
                            </div>
                        </GlassCard>
                    )}

                </div>
            </div>
        </div>
    );
}

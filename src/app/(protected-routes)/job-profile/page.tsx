'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    User,
    Briefcase,
    Building2,
    Clock,
    ChevronRight,
    FileText,
    Trash2
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { JobProfileCard } from '@/lib/jobProfileTypes';
import { JobProfileService } from '@/services/jobProfileService';

export default function JobProfileListPage() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<JobProfileCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            setIsLoading(true);
            const data = await JobProfileService.getAllProfiles();
            setProfiles(data);
        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this profile?')) return;

        try {
            setDeleteId(id);
            await JobProfileService.deleteProfile(id);
            setProfiles(profiles.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete profile:', error);
            alert('Failed to delete profile');
        } finally {
            setDeleteId(null);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Profiles</h1>
                    <p className="text-gray-400">
                        Manage your resume profiles for different job roles. These will be used for email automation and resume generation.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/job-profile/new')}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all"
                >
                    <Plus size={20} />
                    New Profile
                </button>
            </div>

            {/* Profiles Grid */}
            {profiles.length === 0 ? (
                <GlassCard className="p-12 text-center">
                    <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">No Profiles Yet</h3>
                    <p className="text-gray-400 mb-6">
                        Create your first job profile to get started with automated resume generation.
                    </p>
                    <button
                        onClick={() => router.push('/job-profile/new')}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg inline-flex items-center gap-2 transition-all"
                    >
                        <Plus size={20} />
                        Create Your First Profile
                    </button>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                        <GlassCard
                            key={profile.id}
                            className="p-6 cursor-pointer hover:border-primary-500/50 transition-all group relative"
                            onClick={() => router.push(`/job-profile/${profile.id}`)}
                        >
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDelete(profile.id, e)}
                                disabled={deleteId === profile.id}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                {deleteId === profile.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-red-400"></div>
                                ) : (
                                    <Trash2 size={18} />
                                )}
                            </button>

                            {/* Profile Type Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium mb-4">
                                <Briefcase size={14} />
                                {profile.profileName}
                            </div>

                            {/* Name */}
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <User size={18} className="text-gray-500" />
                                {profile.fullName}
                            </h3>

                            {/* Current Position */}
                            {profile.currentRole ? (
                                <p className="text-gray-400 flex items-center gap-2 mb-4">
                                    <Building2 size={16} className="text-gray-600" />
                                    {profile.currentRole}
                                    {profile.currentCompany && (
                                        <span className="text-gray-600">@ {profile.currentCompany}</span>
                                    )}
                                </p>
                            ) : profile.professionalSummary ? (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {profile.professionalSummary}
                                </p>
                            ) : null}

                            {/* Skills Preview */}
                            {profile.skillsPreview && profile.skillsPreview.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profile.skillsPreview.slice(0, 4).map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {profile.skillsPreview.length > 4 && (
                                        <span className="px-2 py-1 text-xs text-gray-600">
                                            +{profile.skillsPreview.length - 4} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                    <Clock size={12} />
                                    Updated {formatDate(profile.updatedAt)}
                                </span>
                                <ChevronRight
                                    size={20}
                                    className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                                />
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}

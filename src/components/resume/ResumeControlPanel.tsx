import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@mui/material';
import { FileText, Wand2, Loader2 } from 'lucide-react';
import { JobProfileService } from '@/services/jobProfileService';

// Type for dropdown options
interface ProfileOption {
    value: string;
    label: string;
}

interface ResumeControlPanelProps {
    onGenerate: (profile: string, jobDescription: string) => void;
    isGenerating: boolean;
}

export default function ResumeControlPanel({ onGenerate, isGenerating }: ResumeControlPanelProps) {
    const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Fetch job profiles on mount
    useEffect(() => {
        const fetchJobProfiles = async () => {
            try {
                const profiles = await JobProfileService.getAllProfiles();
                const options: ProfileOption[] = profiles.map(profile => ({
                    value: profile.id,
                    label: profile.profileName
                }));
                setProfileOptions(options);
                // Set default selection to first profile if available
                if (options.length > 0) {
                    setSelectedProfile(options[0].value);
                }
            } catch (error) {
                console.error('Failed to fetch job profiles:', error);
            } finally {
                setIsLoadingProfiles(false);
            }
        };

        fetchJobProfiles();
    }, []);

    const handleGenerate = () => {
        if (!jobDescription.trim() || !selectedProfile) return;
        onGenerate(selectedProfile, jobDescription);
    };

    return (
        <GlassCard className="h-full flex flex-col p-6 space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-purple-400" size={24} />
                    Input Details
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                    Select your base profile and paste the job description to tailor your resume.
                </p>
            </div>

            {/* Profile Selector */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Base Resume Profile</label>
                <div className="relative">
                    <select
                        value={selectedProfile}
                        onChange={(e) => setSelectedProfile(e.target.value)}
                        disabled={isLoadingProfiles}
                        className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingProfiles ? (
                            <option value="" className="bg-gray-900 text-white">Loading profiles...</option>
                        ) : profileOptions.length === 0 ? (
                            <option value="" className="bg-gray-900 text-white">No profiles found</option>
                        ) : (
                            profileOptions.map((profile) => (
                                <option key={profile.value} value={profile.value} className="bg-gray-900 text-white">
                                    {profile.label}
                                </option>
                            ))
                        )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        {isLoadingProfiles ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Description Input */}
            <div className="space-y-2 flex-grow flex flex-col">
                <label className="text-sm font-medium text-gray-300">Job Description (JD)</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description or URL here..."
                    className="w-full flex-grow min-h-[200px] bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
            </div>

            {/* Action Button */}
            <Button
                onClick={handleGenerate}
                disabled={isGenerating || !jobDescription.trim() || !selectedProfile}
                variant="contained"
                startIcon={!isGenerating && <Wand2 size={18} />}
                className="w-full py-3 rounded-xl font-semibold shadow-lg shadow-purple-900/20"
                sx={{
                    bgcolor: '#7c3aed',
                    '&:hover': { bgcolor: '#6d28d9' },
                    '&:disabled': { bgcolor: 'rgba(124, 58, 237, 0.5)' },
                    textTransform: 'none',
                    fontSize: '1rem'
                }}
            >
                {isGenerating ? 'Analyzing & Tailoring...' : 'Tailor Resume'}
            </Button>
        </GlassCard>
    );
}


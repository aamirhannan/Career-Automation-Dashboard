'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Link as LinkIcon,
    Briefcase,
    GraduationCap,
    Code,
    FolderGit2,
    Plus,
    Trash2,
    Edit2,
    X,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Eye,
    EyeOff,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import ResumeRender, { ResumeData } from '@/components/resume/ResumeRender';
import { JobProfile, ProfileExperience, ProfileProject, CreateJobProfilePayload } from '@/lib/jobProfileTypes';
import { JobProfileService } from '@/services/jobProfileService';
import { useSnackbar } from '@/context/SnackbarContext';

// Default empty profile structure
const getEmptyProfile = (): CreateJobProfilePayload => ({
    profileName: '',
    header: {
        fullName: '',
        contact: {
            phone: '',
            location: '',
            email: '',
            links: {
                linkedin: '',
                github: '',
                leetcode: '',
            }
        }
    },
    professionalSummary: '',
    education: {
        degree: '',
        institution: '',
        duration: { start: '', end: '' }
    },
    technicalSkills: {
        programmingLanguages: [],
        frontend: [],
        performanceAndTesting: [],
        backendAndDatabases: [],
        devOpsAndTools: [],
        architectureAndMiddleware: []
    },
    experience: [],
    projects: []
});

const getEmptyExperience = (): ProfileExperience => ({
    role: '',
    company: '',
    employmentType: 'Full-time',
    location: '',
    duration: { start: '', end: '' },
    responsibilitiesAndAchievements: [''],
    technologies: []
});

const getEmptyProject = (): ProfileProject => ({
    title: '',
    links: { github: '', live: '' },
    description: [''],
    technologyStack: []
});

// Helper components moved outside to prevent re-renders
// They receive isEditing as a prop to avoid being recreated on each render

interface InputFieldProps {
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    isEditing?: boolean;
}

const InputField = ({ label, value, onChange, placeholder, type = 'text', disabled = false, isEditing = false }: InputFieldProps) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        {isEditing && !disabled ? (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
            />
        ) : (
            <p className="text-white font-medium border-b border-white/5 pb-1">{value || '-'}</p>
        )}
    </div>
);

interface TextAreaFieldProps {
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    isEditing?: boolean;
}

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, isEditing = false }: TextAreaFieldProps) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        {isEditing ? (
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600 resize-none"
            />
        ) : (
            <p className="text-white whitespace-pre-wrap">{value || '-'}</p>
        )}
    </div>
);

interface TagInputProps {
    label: string;
    tags: string[] | undefined;
    onAdd: (value: string) => void;
    onRemove: (index: number) => void;
    placeholder?: string;
    isEditing?: boolean;
}

const TagInput = ({ label, tags, onAdd, onRemove, placeholder, isEditing = false }: TagInputProps) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        {isEditing && (
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            e.preventDefault();
                            onAdd(e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input.value.trim()) {
                            onAdd(input.value.trim());
                            input.value = '';
                        }
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>
        )}
        <div className="flex flex-wrap gap-2">
            {tags?.map((tag: string, idx: number) => (
                <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                >
                    {tag}
                    {isEditing && (
                        <button
                            onClick={() => onRemove(idx)}
                            className="p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </span>
            ))}
            {(!tags || tags.length === 0) && (
                <span className="text-gray-600 italic text-sm">None added</span>
            )}
        </div>
    </div>
);

interface SectionHeaderProps {
    title: string;
    icon: any;
    section: string;
    expanded: boolean;
    onToggle: (section: string) => void;
}

const SectionHeader = ({ title, icon: Icon, section, expanded, onToggle }: SectionHeaderProps) => (
    <button
        onClick={() => onToggle(section)}
        className="w-full flex items-center justify-between text-xl font-bold text-white mb-4 hover:text-primary-400 transition-colors"
    >
        <span className="flex items-center gap-2">
            <Icon className="text-primary-500" size={20} />
            {title}
        </span>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
);

export default function JobProfileDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { showSnackbar } = useSnackbar();
    const profileId = params.id as string;
    const isNewProfile = profileId === 'new';

    const [profile, setProfile] = useState<JobProfile | CreateJobProfilePayload>(getEmptyProfile());
    const [isLoading, setIsLoading] = useState(!isNewProfile);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(isNewProfile);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Collapsible sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        header: true,
        summary: true,
        education: true,
        skills: true,
        experience: true,
        projects: true
    });

    // Live preview toggle (only shown when editing)
    const [showPreview, setShowPreview] = useState(true);


    useEffect(() => {
        if (!isNewProfile) {
            fetchProfile();
        }
    }, [profileId, isNewProfile]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await JobProfileService.getProfileById(profileId);
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            showSnackbar('Failed to load profile', 'error');
            router.push('/job-profile');
        } finally {
            setIsLoading(false);
        }
    };

    const validateProfile = (): boolean => {
        const errors: string[] = [];

        if (!profile.profileName?.trim()) {
            errors.push('Profile Name is required');
        }
        if (!profile.header.fullName?.trim()) {
            errors.push('Full Name is required');
        }

        setValidationErrors(errors);

        if (errors.length > 0) {
            showSnackbar(errors[0], 'error');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateProfile()) {
            return;
        }

        try {
            setIsSaving(true);
            if (isNewProfile) {
                await JobProfileService.createProfile(profile as CreateJobProfilePayload);
                showSnackbar('Profile created successfully!', 'success');
            } else {
                await JobProfileService.updateProfile(profileId, profile);
                showSnackbar('Profile updated successfully!', 'success');
            }
            router.push('/job-profile');
        } catch (error) {
            console.error('Failed to save profile:', error);
            showSnackbar('Failed to save profile. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updateProfile = (path: string, value: any) => {
        setProfile(prev => {
            const keys = path.split('.');
            const newProfile = JSON.parse(JSON.stringify(prev));
            let current = newProfile;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newProfile;
        });
    };

    const addExperience = () => {
        setProfile(prev => ({
            ...prev,
            experience: [...prev.experience, getEmptyExperience()]
        }));
    };

    const removeExperience = (index: number) => {
        setProfile(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addProject = () => {
        setProfile(prev => ({
            ...prev,
            projects: [...prev.projects, getEmptyProject()]
        }));
    };

    const removeProject = (index: number) => {
        setProfile(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const addArrayItem = (path: string, value: string = '') => {
        const keys = path.split('.');
        const currentArray = keys.reduce((obj, key) => obj[key], profile as any) || [];
        updateProfile(path, [...currentArray, value]);
    };

    const removeArrayItem = (path: string, index: number) => {
        const keys = path.split('.');
        const currentArray = keys.reduce((obj, key) => obj[key], profile as any) || [];
        updateProfile(path, currentArray.filter((_: any, i: number) => i !== index));
    };

    const updateArrayItem = (path: string, index: number, value: string) => {
        const keys = path.split('.');
        const currentArray = [...(keys.reduce((obj, key) => obj[key], profile as any) || [])];
        currentArray[index] = value;
        updateProfile(path, currentArray);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
            </div>
        );
    }


    return (
        <div className={`flex gap-6 ${(isEditing || !isNewProfile) && showPreview ? 'max-w-[1600px]' : 'max-w-5xl'} mx-auto`}>
            {/* Form Section */}
            <div className={`${(isEditing || !isNewProfile) && showPreview ? 'w-1/2' : 'w-full'} space-y-6 pb-10 transition-all duration-300`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/job-profile')}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {isNewProfile ? 'Create New Profile' : (isEditing ? 'Edit Profile' : 'View Profile')}
                            </h1>
                            <p className="text-gray-400">
                                {profile.profileName || 'Untitled Profile'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {/* Preview Toggle Button - Show for existing profiles or when editing */}
                        {(isEditing || !isNewProfile) && (
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all ${showPreview
                                    ? 'bg-primary-600/20 border-primary-500/50 text-primary-400'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                                    }`}
                                title={showPreview ? 'Hide Preview' : 'Show Preview'}
                            >
                                {showPreview ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                        )}
                        {!isNewProfile && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Edit2 size={16} />
                                Edit
                            </button>
                        )}
                        {isEditing && !isNewProfile && (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchProfile(); // Reset to original
                                }}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Name */}
                <GlassCard className="p-6">
                    <InputField
                        label="Profile Name (e.g., Frontend Engineer, Full Stack Developer)"
                        value={profile.profileName}
                        onChange={(v: string) => updateProfile('profileName', v)}
                        placeholder="Enter profile name..."
                        isEditing={isEditing}
                    />
                </GlassCard>

                {/* Header / Contact Info */}
                <GlassCard className="p-6">
                    <SectionHeader title="Personal Information" icon={User} section="header" expanded={expandedSections.header} onToggle={toggleSection} />
                    {expandedSections.header && (
                        <div className="space-y-6">
                            <InputField
                                label="Full Name"
                                value={profile.header.fullName}
                                onChange={(v: string) => updateProfile('header.fullName', v)}
                                placeholder="Your full name"
                                isEditing={isEditing}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={profile.header.contact.email}
                                    onChange={(v: string) => updateProfile('header.contact.email', v)}
                                    placeholder="your@email.com"
                                    isEditing={isEditing}
                                />
                                <InputField
                                    label="Phone"
                                    value={profile.header.contact.phone}
                                    onChange={(v: string) => updateProfile('header.contact.phone', v)}
                                    placeholder="+1 234 567 8900"
                                    isEditing={isEditing}
                                />
                                <InputField
                                    label="Location"
                                    value={profile.header.contact.location}
                                    onChange={(v: string) => updateProfile('header.contact.location', v)}
                                    placeholder="City, Country"
                                    isEditing={isEditing}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField
                                    label="LinkedIn URL"
                                    value={profile.header.contact.links.linkedin}
                                    onChange={(v: string) => updateProfile('header.contact.links.linkedin', v)}
                                    placeholder="https://linkedin.com/in/..."
                                    isEditing={isEditing}
                                />
                                <InputField
                                    label="GitHub URL"
                                    value={profile.header.contact.links.github}
                                    onChange={(v: string) => updateProfile('header.contact.links.github', v)}
                                    placeholder="https://github.com/..."
                                    isEditing={isEditing}
                                />
                                <InputField
                                    label="LeetCode URL"
                                    value={profile.header.contact.links.leetcode}
                                    onChange={(v: string) => updateProfile('header.contact.links.leetcode', v)}
                                    placeholder="https://leetcode.com/..."
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>
                    )}
                </GlassCard>

                {/* Professional Summary */}
                <GlassCard className="p-6">
                    <SectionHeader title="Professional Summary" icon={Briefcase} section="summary" expanded={expandedSections.summary} onToggle={toggleSection} />
                    {expandedSections.summary && (
                        <TextAreaField
                            label="Summary"
                            value={profile.professionalSummary}
                            onChange={(v: string) => updateProfile('professionalSummary', v)}
                            placeholder="Write a compelling professional summary..."
                            rows={5}
                            isEditing={isEditing}
                        />
                    )}
                </GlassCard>

                {/* Education */}
                <GlassCard className="p-6">
                    <SectionHeader title="Education" icon={GraduationCap} section="education" expanded={expandedSections.education} onToggle={toggleSection} />
                    {expandedSections.education && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Degree"
                                value={profile.education.degree}
                                onChange={(v: string) => updateProfile('education.degree', v)}
                                placeholder="Bachelor of Technology"
                                isEditing={isEditing}
                            />
                            <InputField
                                label="Institution"
                                value={profile.education.institution}
                                onChange={(v: string) => updateProfile('education.institution', v)}
                                placeholder="University Name"
                                isEditing={isEditing}
                            />
                            <InputField
                                label="Start Date"
                                value={profile.education.duration.start}
                                onChange={(v: string) => updateProfile('education.duration.start', v)}
                                placeholder="Jul 2019"
                                isEditing={isEditing}
                            />
                            <InputField
                                label="End Date"
                                value={profile.education.duration.end}
                                onChange={(v: string) => updateProfile('education.duration.end', v)}
                                placeholder="Jun 2023"
                                isEditing={isEditing}
                            />
                        </div>
                    )}
                </GlassCard>

                {/* Technical Skills */}
                <GlassCard className="p-6">
                    <SectionHeader title="Technical Skills" icon={Code} section="skills" expanded={expandedSections.skills} onToggle={toggleSection} />
                    {expandedSections.skills && (
                        <div className="space-y-6">
                            <TagInput
                                label="Programming Languages"
                                tags={profile.technicalSkills.programmingLanguages}
                                onAdd={(v: string) => addArrayItem('technicalSkills.programmingLanguages', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.programmingLanguages', i)}
                                placeholder="Add language..."
                                isEditing={isEditing}
                            />
                            <TagInput
                                label="Frontend Technologies"
                                tags={profile.technicalSkills.frontend}
                                onAdd={(v: string) => addArrayItem('technicalSkills.frontend', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.frontend', i)}
                                placeholder="Add technology..."
                                isEditing={isEditing}
                            />
                            <TagInput
                                label="Performance & Testing"
                                tags={profile.technicalSkills.performanceAndTesting}
                                onAdd={(v: string) => addArrayItem('technicalSkills.performanceAndTesting', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.performanceAndTesting', i)}
                                placeholder="Add skill..."
                                isEditing={isEditing}
                            />
                            <TagInput
                                label="Backend & Databases"
                                tags={profile.technicalSkills.backendAndDatabases}
                                onAdd={(v: string) => addArrayItem('technicalSkills.backendAndDatabases', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.backendAndDatabases', i)}
                                placeholder="Add technology..."
                                isEditing={isEditing}
                            />
                            <TagInput
                                label="DevOps & Tools"
                                tags={profile.technicalSkills.devOpsAndTools}
                                onAdd={(v: string) => addArrayItem('technicalSkills.devOpsAndTools', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.devOpsAndTools', i)}
                                placeholder="Add tool..."
                                isEditing={isEditing}
                            />
                            <TagInput
                                label="Architecture & Middleware"
                                tags={profile.technicalSkills.architectureAndMiddleware}
                                onAdd={(v: string) => addArrayItem('technicalSkills.architectureAndMiddleware', v)}
                                onRemove={(i: number) => removeArrayItem('technicalSkills.architectureAndMiddleware', i)}
                                placeholder="Add skill..."
                                isEditing={isEditing}
                            />
                        </div>
                    )}
                </GlassCard>

                {/* Experience */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <SectionHeader title="Work Experience" icon={Briefcase} section="experience" expanded={expandedSections.experience} onToggle={toggleSection} />
                        {isEditing && expandedSections.experience && (
                            <button
                                onClick={addExperience}
                                className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg flex items-center gap-1 text-sm transition-colors"
                            >
                                <Plus size={16} />
                                Add Experience
                            </button>
                        )}
                    </div>
                    {expandedSections.experience && (
                        <div className="space-y-6">
                            {profile.experience.map((exp, expIndex) => (
                                <div key={expIndex} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-lg font-semibold text-white">
                                            {exp.role || 'Untitled Role'} {exp.company && `@ ${exp.company}`}
                                        </h4>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeExperience(expIndex)}
                                                className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Role"
                                            value={exp.role}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.role`, v)}
                                            placeholder="Software Developer"
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="Company"
                                            value={exp.company}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.company`, v)}
                                            placeholder="Company Name"
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="Employment Type"
                                            value={exp.employmentType}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.employmentType`, v)}
                                            placeholder="Full-time"
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="Location"
                                            value={exp.location}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.location`, v)}
                                            placeholder="Remote"
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="Start Date"
                                            value={exp.duration.start}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.duration.start`, v)}
                                            placeholder="Feb 2024"
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="End Date"
                                            value={exp.duration.end}
                                            onChange={(v: string) => updateProfile(`experience.${expIndex}.duration.end`, v)}
                                            placeholder="Present"
                                            isEditing={isEditing}
                                        />
                                    </div>
                                    <TagInput
                                        label="Technologies Used"
                                        tags={exp.technologies}
                                        onAdd={(v: string) => addArrayItem(`experience.${expIndex}.technologies`, v)}
                                        onRemove={(i: number) => removeArrayItem(`experience.${expIndex}.technologies`, i)}
                                        placeholder="Add technology..."
                                        isEditing={isEditing}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Responsibilities & Achievements</label>
                                        {exp.responsibilitiesAndAchievements.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <textarea
                                                            value={item}
                                                            onChange={(e) => updateArrayItem(`experience.${expIndex}.responsibilitiesAndAchievements`, itemIndex, e.target.value)}
                                                            rows={2}
                                                            className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600 resize-none"
                                                            placeholder="Describe your achievement..."
                                                        />
                                                        <button
                                                            onClick={() => removeArrayItem(`experience.${expIndex}.responsibilitiesAndAchievements`, itemIndex)}
                                                            className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors self-start"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-300 text-sm">• {item}</p>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button
                                                onClick={() => addArrayItem(`experience.${expIndex}.responsibilitiesAndAchievements`, '')}
                                                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Add Achievement
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {profile.experience.length === 0 && (
                                <p className="text-gray-600 italic text-center py-8">No experience added yet</p>
                            )}
                        </div>
                    )}
                </GlassCard>

                {/* Projects */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <SectionHeader title="Projects" icon={FolderGit2} section="projects" expanded={expandedSections.projects} onToggle={toggleSection} />
                        {isEditing && expandedSections.projects && (
                            <button
                                onClick={addProject}
                                className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg flex items-center gap-1 text-sm transition-colors"
                            >
                                <Plus size={16} />
                                Add Project
                            </button>
                        )}
                    </div>
                    {expandedSections.projects && (
                        <div className="space-y-6">
                            {profile.projects.map((project, projIndex) => (
                                <div key={projIndex} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-lg font-semibold text-white">
                                            {project.title || 'Untitled Project'}
                                        </h4>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeProject(projIndex)}
                                                className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <InputField
                                        label="Project Title"
                                        value={project.title}
                                        onChange={(v: string) => updateProfile(`projects.${projIndex}.title`, v)}
                                        placeholder="Project Name"
                                        isEditing={isEditing}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="GitHub URL"
                                            value={project.links.github}
                                            onChange={(v: string) => updateProfile(`projects.${projIndex}.links.github`, v)}
                                            placeholder="https://github.com/..."
                                            isEditing={isEditing}
                                        />
                                        <InputField
                                            label="Live URL"
                                            value={project.links.live}
                                            onChange={(v: string) => updateProfile(`projects.${projIndex}.links.live`, v)}
                                            placeholder="https://..."
                                            isEditing={isEditing}
                                        />
                                    </div>
                                    <TagInput
                                        label="Technology Stack"
                                        tags={project.technologyStack}
                                        onAdd={(v: string) => addArrayItem(`projects.${projIndex}.technologyStack`, v)}
                                        onRemove={(i: number) => removeArrayItem(`projects.${projIndex}.technologyStack`, i)}
                                        placeholder="Add technology..."
                                        isEditing={isEditing}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Description Points</label>
                                        {project.description.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <textarea
                                                            value={item}
                                                            onChange={(e) => updateArrayItem(`projects.${projIndex}.description`, itemIndex, e.target.value)}
                                                            rows={2}
                                                            className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600 resize-none"
                                                            placeholder="Describe this aspect of the project..."
                                                        />
                                                        <button
                                                            onClick={() => removeArrayItem(`projects.${projIndex}.description`, itemIndex)}
                                                            className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors self-start"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-300 text-sm">• {item}</p>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button
                                                onClick={() => addArrayItem(`projects.${projIndex}.description`, '')}
                                                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Add Description Point
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {profile.projects.length === 0 && (
                                <p className="text-gray-600 italic text-center py-8">No projects added yet</p>
                            )}
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* Live Preview Panel - Shown when editing or for existing profiles */}
            {(isEditing || !isNewProfile) && showPreview && (
                <div className="w-1/2 sticky top-6 h-[calc(100vh-3rem)] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                    <div className="bg-dark-800/50 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye size={16} className="text-primary-400" />
                            <span className="text-sm font-medium text-white">Live Preview</span>
                        </div>
                        <span className="text-xs text-gray-500">Updates as you type</span>
                    </div>
                    <div className="h-[calc(100%-52px)] overflow-auto bg-white">
                        <ResumeRender data={profile as unknown as ResumeData} />
                    </div>
                </div>
            )}
        </div>
    );
}

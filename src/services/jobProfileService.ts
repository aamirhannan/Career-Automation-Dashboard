import api from '@/lib/axios';
import { JobProfile, JobProfileCard, CreateJobProfilePayload, UpdateJobProfilePayload, ProfileTechnicalSkills, ProfileExperience, ProfileProject, ProfileEducation } from '@/lib/jobProfileTypes';

// Backend response type for list view
interface BackendProfileCard {
    id: string;
    profileType: string;
    fullName: string;
    professionalSummary: string;
    createdAt: string;
    updatedAt: string;
}

// Backend response type for full profile (flat structure)
interface BackendJobProfile {
    id: string;
    userId?: string;
    profileType: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    professionalSummary: string;
    links: {
        linkedin?: string;
        github?: string;
        leetcode?: string;
        [key: string]: string | undefined;
    };
    education: ProfileEducation;
    technicalSkills: ProfileTechnicalSkills;
    experience: ProfileExperience[];
    projects: ProfileProject[];
    createdAt: string;
    updatedAt: string;
}

// Transform backend flat structure to frontend nested structure
const transformBackendToFrontend = (backend: BackendJobProfile): JobProfile => ({
    id: backend.id,
    userId: backend.userId,
    profileName: backend.profileType,
    header: {
        fullName: backend.fullName,
        contact: {
            phone: backend.phone || '',
            location: backend.location || '',
            email: backend.email || '',
            links: backend.links || {}
        }
    },
    professionalSummary: backend.professionalSummary || '',
    education: backend.education || { degree: '', institution: '', duration: { start: '', end: '' } },
    technicalSkills: backend.technicalSkills || {
        programmingLanguages: [],
        frontend: [],
        performanceAndTesting: [],
        backendAndDatabases: [],
        devOpsAndTools: [],
        architectureAndMiddleware: []
    },
    experience: backend.experience || [],
    projects: backend.projects || [],
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt
});

// Transform frontend nested structure to backend flat structure
const transformFrontendToBackend = (frontend: CreateJobProfilePayload): any => ({
    profileType: frontend.profileName,
    fullName: frontend.header.fullName,
    email: frontend.header.contact.email,
    phone: frontend.header.contact.phone,
    location: frontend.header.contact.location,
    links: frontend.header.contact.links,
    professionalSummary: frontend.professionalSummary,
    education: frontend.education,
    technicalSkills: frontend.technicalSkills,
    experience: frontend.experience,
    projects: frontend.projects
});

export const JobProfileService = {
    /**
     * Get all job profiles for the current user (card view)
     */
    async getAllProfiles(): Promise<JobProfileCard[]> {
        const { data } = await api.get<BackendProfileCard[]>('/job-profile/get-all');
        // Map backend response to frontend format
        return (data || []).map(profile => ({
            id: profile.id,
            profileName: profile.profileType,
            fullName: profile.fullName,
            professionalSummary: profile.professionalSummary,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
        }));
    },

    /**
     * Get a single job profile by ID
     */
    async getProfileById(id: string): Promise<JobProfile> {
        const { data } = await api.get<BackendJobProfile>(`/job-profile/${id}`);
        return transformBackendToFrontend(data);
    },

    /**
     * Create a new job profile
     * Sends the nested structure: { profileName, header: { fullName, contact: {...} }, ... }
     */
    async createProfile(profile: CreateJobProfilePayload): Promise<JobProfile> {
        // Send the nested structure directly - no transformation
        const { data } = await api.post<BackendJobProfile>('/job-profile/create', profile);
        return transformBackendToFrontend(data);
    },

    /**
     * Update an existing job profile (sends full profile, same structure as create)
     * Sends the nested structure: { profileName, header: { fullName, contact: {...} }, ... }
     */
    async updateProfile(id: string, profile: JobProfile | CreateJobProfilePayload): Promise<JobProfile> {
        // Send the nested structure directly - same as create, no transformation
        const { data } = await api.put<BackendJobProfile>(`/job-profile/${id}`, profile);
        return transformBackendToFrontend(data);
    },

    /**
     * Delete a job profile
     */
    async deleteProfile(id: string): Promise<void> {
        await api.delete(`/job-profile/${id}`);
    },

    /**
     * Get profile names for dropdown (lightweight)
     */
    async getProfilesForDropdown(): Promise<{ id: string; profileName: string }[]> {
        const { data } = await api.get<BackendProfileCard[]>('/job-profile/dropdown');
        return (data || []).map(profile => ({
            id: profile.id,
            profileName: profile.profileType
        }));
    }
};

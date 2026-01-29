// Job Profile Types - Used for resume generation and email automation

export interface ProfileLinks {
    linkedin?: string;
    github?: string;
    leetcode?: string;
    portfolio?: string;
    twitter?: string;
    [key: string]: string | undefined;
}

export interface ProfileContact {
    phone: string;
    location: string;
    email: string;
    links: ProfileLinks;
}

export interface ProfileHeader {
    fullName: string;
    contact: ProfileContact;
}

export interface ProfileDuration {
    start: string;
    end: string;
}

export interface ProfileEducation {
    degree: string;
    institution: string;
    duration: ProfileDuration;
}

export interface ProfileTechnicalSkills {
    programmingLanguages: string[];
    frontend: string[];
    performanceAndTesting: string[];
    backendAndDatabases: string[];
    devOpsAndTools: string[];
    architectureAndMiddleware: string[];
    [key: string]: string[]; // Allow custom categories
}

export interface ProfileExperience {
    role: string;
    company: string;
    employmentType: string;
    location: string;
    duration: ProfileDuration;
    responsibilitiesAndAchievements: string[];
    technologies: string[];
}

export interface ProfileProjectLinks {
    live?: string;
    github?: string;
    demo?: string;
    [key: string]: string | undefined;
}

export interface ProfileProject {
    title: string;
    links: ProfileProjectLinks;
    description: string[];
    technologyStack: string[];
}

// Main Job Profile Interface
export interface JobProfile {
    id?: string;
    userId?: string;
    profileName: string; // e.g., "Frontend Engineer", "Full Stack Developer"
    header: ProfileHeader;
    professionalSummary: string;
    education: ProfileEducation;
    technicalSkills: ProfileTechnicalSkills;
    experience: ProfileExperience[];
    projects: ProfileProject[];
    createdAt?: string;
    updatedAt?: string;
}

// Job Profile Card (for list view - minimal data)
export interface JobProfileCard {
    id: string;
    profileName: string;
    fullName: string;
    professionalSummary?: string;
    currentRole?: string; // Latest experience role
    currentCompany?: string; // Latest experience company
    skillsPreview?: string[]; // First few skills
    createdAt?: string;
    updatedAt?: string;
}

// Create/Update payload
export type CreateJobProfilePayload = Omit<JobProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateJobProfilePayload = Partial<CreateJobProfilePayload>;

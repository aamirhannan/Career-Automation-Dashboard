import api from '@/lib/axios';

export interface CreateEmailParams {
    role: string;
    jobDescription: string;
    targetEmail: string;
}

export type EmailStatus = 'PENDING' | 'IN_PROGRESS' | 'WAITING' | 'SUCCESS' | 'FAILED' | 'REJECTED';

export interface EmailJobResponse {
    id: string;
    userId: string;
    targetEmail: string;
    jobDescription: string;
    role: string;
    company: string | null;
    subjectLine: string | null;
    coverLetter: string | null;
    status: EmailStatus;
    error: string | null;
    createdAt: string;
    updatedAt: string;
}

export const EmailService = {
    /**
     * Triggers the email generation process.
     * Endpoint: /email-automation/create-email
     */
    async createEmail(params: CreateEmailParams): Promise<EmailJobResponse> {
        const { data } = await api.post<EmailJobResponse>('/email-automation/create-email', params);
        return data;
    },

    /**
     * Updates an email job status (e.g. approving it).
     * Endpoint: /email-automation/update-email/:id
     */
    async updateEmail(id: string, updates: Partial<EmailJobResponse>): Promise<EmailJobResponse> {
        const { data } = await api.put<EmailJobResponse>(`/email-automation/update-email/${id}`, updates);
        return data;
    },

    /**
     * Fetches all emails.
     * Endpoint: /email-automation/get-emails
     */
    async getEmails(): Promise<EmailJobResponse[]> {
        const { data } = await api.get<EmailJobResponse[]>('/email-automation/get-emails');
        return data;
    }
};

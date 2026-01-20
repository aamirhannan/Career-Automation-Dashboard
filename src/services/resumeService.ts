
import axios from '@/lib/axios';

export interface GenerateResumeResponse {
    blob: Blob;
    filename: string;
    tokenUsage: {
        cost: string;
        input: string;
        output: string;
    };
}

export const generateResumePDF = async (profile: string, jobDescription: string): Promise<GenerateResumeResponse> => {
    try {
        const response = await axios.post('/resume-generation/create-resume', {
            role: profile,
            jobDescription
        }, {
            responseType: 'blob'
        });

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'Optimized_Resume.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        return {
            blob: response.data,
            filename: filename,
            tokenUsage: {
                cost: response.headers['x-token-usage-cost'] || '0',
                input: response.headers['x-token-input'] || '0',
                output: response.headers['x-token-output'] || '0'
            }
        };
        } catch (error) {
        console.error('Error generating resume:', error);
        throw error;
    }
};

export const getResumes = async (): Promise<any[]> => {
    try {
        const response = await axios.get('/resume-generation/get-resume');
        return response.data;
    } catch (error) {
        console.error('Error fetching resumes:', error);
        throw error;
    }
};

export const downloadResumePDF = async (newResumeContent: any, role: string): Promise<void> => {
    try {
        const response = await axios.post('/resume-generation/download-resume-pdf', {
            newResumeContent: typeof newResumeContent === 'string' ? JSON.parse(newResumeContent) : newResumeContent,
            role: role
        }, {
            responseType: 'blob'
        });

        // Create a link element, hide it, direct it towards the blob, and then 'click' it intentionally.
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from Content-Disposition header if available
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'Detailed_Resume.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading resume PDF:', error);
        throw error;
    }
};

export const updateResume = async (id: string, newResumeContent: any): Promise<any> => {
    try {
        const response = await axios.post(`/resume-generation/update-resume`, {
            id,
            newResumeContent: typeof newResumeContent === 'string' ? JSON.parse(newResumeContent) : newResumeContent
        });
        return response.data;
    } catch (error) {
        console.error('Error updating resume:', error);
        throw error;
    }
};

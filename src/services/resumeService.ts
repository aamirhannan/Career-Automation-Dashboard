
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

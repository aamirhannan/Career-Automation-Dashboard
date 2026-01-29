'use client';

import { useState, useEffect } from 'react';
import ResumeControlPanel from '@/components/resume/ResumeControlPanel';
import ResumePreviewPanel from '@/components/resume/ResumePreviewPanel';
import ResumeHistoryTable, { ResumeLog } from '@/components/resume/ResumeHistoryTable';
import ResumeEditorModal from '@/components/resume/ResumeEditorModal';
import ResumeRender, { ResumeData } from '@/components/resume/ResumeRender';
import { ApplicationStatus, ResumeStatus } from '@/lib/types';
import { Drawer, IconButton, Divider, Button, CircularProgress } from '@mui/material';
import { X, Download, FileText, CheckCircle2, Pencil } from 'lucide-react';
import { generateResumePDF, getResumes, downloadResumePDF, updateResume } from '@/services/resumeService';

// const MOCK_HISTORY: ResumeLog[] = [
//     {
//         id: '1',
//         generatedAt: 'Oct 24, 2023',
//         company: 'Google',
//         role: 'Frontend Engineer',
//         status: ApplicationStatus.Success,
//         matchScore: 92
//     },
//     {
//         id: '2',
//         generatedAt: 'Oct 22, 2023',
//         company: 'Netflix',
//         role: 'Senior UI Developer',
//         status: ApplicationStatus.Failed,
//         matchScore: 0
//     }
// ];

// Mock data content for the editor
// Mock data content for the editor matched to ResumeData structure
const MOCK_RESUME_CONTENT = {
    header: {
        fullName: "Alex Roberts",
        contact: {
            email: "alex.roberts@example.com",
            phone: "(555) 123-4567",
            location: "San Francisco, CA",
            links: {
                linkedin: "linkedin.com/in/alexr",
                github: "github.com/alexr"
            }
        }
    },
    professionalSummary: "Highly skilled Frontend Engineer with 5+ years of experience building scalable web applications. Proven track record in optimizing performance and delivering high-quality user experiences. Tailored specifically for Target Company, with a focus on modern stack technologies.",
    experience: [
        {
            role: "Senior Software Engineer",
            company: "TechCorp Inc.",
            duration: { start: "2021", end: "Present" },
            responsibilitiesAndAchievements: [
                "Led the migration of legacy monolith to microservices, reducing deployment time by 40%.",
                "Mentored generic junior developers and established code review standards.",
                "Implemented real-time features using WebSockets, increasing user engagement by 25%."
            ]
        },
        {
            role: "Software Developer",
            company: "Startup X",
            duration: { start: "2018", end: "2021" },
            responsibilitiesAndAchievements: [
                "Built the MVP for the core product using React and Firebase.",
                "Collaborated with designers to implement pixel-perfect UIs."
            ]
        }
    ],
    technicalSkills: {
        "Languages": ["JavaScript", "TypeScript", "Python"],
        "Frameworks": ["React", "Next.js", "Express"]
    },
    education: {
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        duration: { start: "2014", end: "2018" }
    },
    projects: []
};

export default function ResumeBuilderPage() {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'GENERATION' | 'SUCCESS' | 'FAILED'>('IDLE');
    const [history, setHistory] = useState<ResumeLog[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getResumes();
                // Map API response to ResumeLog interface
                const mappedHistory: ResumeLog[] = data.map((item: any) => ({
                    id: item.id,
                    generatedAt: new Date(item.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
                    company: '',
                    role: item.role,
                    status: item.status,
                    matchScore: 0,
                    newResumeContent: item.newResumeContent,
                }));
                setHistory(mappedHistory);
            } catch (error) {
                console.error("Failed to load resume history", error);
            }
        };

        fetchHistory();
    }, []);
    const [currentScore, setCurrentScore] = useState(0);
    const [addedKeywords, setAddedKeywords] = useState<string[]>([]);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<ResumeLog | null>(null);

    // Editor Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorData, setEditorData] = useState<any>(MOCK_RESUME_CONTENT);

    // Async Action States
    const [isSaving, setIsSaving] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleGenerate = async (profile: string, jobDescription: string) => {
        try {
            setStatus('PROCESSING');

            // 1. Analyze (Mock delay - typically this might be a separate step or part of the generation)
            // Keeping a small delay for UI feedback if needed, or remove.
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('GENERATION');

            // 2. Call API to generate content - The backend creates the record
            const result = await generateResumePDF(profile, jobDescription);

            // 3. Need to fetch the latest resume to get the generated content ID and data
            // Since the generation API returns PDF blob but saves to DB, we fetch history to get the latest record
            const freshHistory = await getResumes();
            const mappedHistory: ResumeLog[] = freshHistory.map((item: any) => ({
                id: item.id,
                generatedAt: new Date(item.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
                company: '',
                role: item.role,
                status: item.status,
                matchScore: 0,
                newResumeContent: item.newResumeContent,
            }));

            setHistory(mappedHistory);

            // 4. Success
            setStatus('SUCCESS');
            setCurrentScore(88); // Mock score 
            setAddedKeywords(['Optimized based on JD']); // Mock keywords

            // Select the latest resume (first in current sorted list implied, or find matching one)
            // Assuming the API returns sorted by latest, or we check the one we just created
            // For simplicity, we take the most recent one which should be the one just generated
            if (mappedHistory.length > 0) {
                const latestResume = mappedHistory[0];
                setSelectedResume(latestResume);
                console.log("Auto-selected latest resume for preview:", latestResume.id);
            }

            // Note: The previous logic downloaded the PDF immediately. 
            // The user now wants live preview logic first, download is separate action.
            // We removed the immediate blob download here as per request "show the pdf in live preview".

            console.log('Generation completed.');

        } catch (error) {
            console.error('Generation failed:', error);
            setStatus('FAILED');
        }
    };

    const handleViewResume = (log: ResumeLog) => {
        setSelectedResume(log);
        setIsDrawerOpen(true);
    };

    const handleDownloadResume = async (log: ResumeLog) => {
        if (!log.newResumeContent) {
            console.error("No content to download for this resume");
            return;
        }

        try {
            setDownloadingId(log.id);
            await downloadResumePDF(log.newResumeContent, log.role);
            console.log(`Downloaded resume for ${log.company}`);
        } catch (error) {
            console.error("Failed to download resume PDF", error);
            // Optionally add a toast or alert here
        } finally {
            setDownloadingId(null);
        }
    };

    const handleEditResume = () => {
        if (selectedResume && selectedResume.newResumeContent) {
            try {
                const content = typeof selectedResume.newResumeContent === 'string'
                    ? JSON.parse(selectedResume.newResumeContent)
                    : selectedResume.newResumeContent;
                setEditorData(content);
            } catch (e) {
                console.error("Failed to parse resume content", e);
                setEditorData(MOCK_RESUME_CONTENT);
            }
        } else {
            setEditorData(MOCK_RESUME_CONTENT);
        }
        setIsEditorOpen(true);
    };

    const handleSaveResume = async (newData: any) => {
        if (!selectedResume) return;

        try {
            setIsSaving(true);
            // Update UI state immediately for responsiveness (or wait for API)
            setEditorData(newData);

            // Call API to save changes
            await updateResume(selectedResume.id, newData);

            // Update local history state
            const updatedHistory = history.map(item =>
                item.id === selectedResume.id
                    ? { ...item, newResumeContent: newData }
                    : item
            );
            setHistory(updatedHistory);

            // Update currently selected resume
            setSelectedResume({ ...selectedResume, newResumeContent: newData });

            console.log("Saved new resume data and updated state");
            setIsEditorOpen(false);

            // Optional: Show success feedback
        } catch (error) {
            console.error("Failed to save resume", error);
            // Optional: Show error feedback
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Resume PDF Generator</h2>
                <p className="text-gray-400 max-w-2xl">
                    Tailor your master resume to specific job descriptions using AI.
                    Get ATS-optimized PDFs in minutes.
                </p>
            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Pane: Controls */}
                <div className="lg:col-span-4 h-full">
                    <ResumeControlPanel
                        onGenerate={handleGenerate}
                        isGenerating={status === 'PROCESSING' || status === 'GENERATION'}
                    />
                </div>

                {/* Right Pane: Live Preview */}
                <div className="lg:col-span-8 h-full">
                    <ResumePreviewPanel
                        status={status}
                        score={currentScore}
                        addedKeywords={addedKeywords}
                        onEdit={handleEditResume}
                        resumeData={selectedResume?.newResumeContent}
                        onDownload={() => selectedResume && handleDownloadResume(selectedResume)}
                        isDownloading={selectedResume?.id === downloadingId}
                    />
                </div>
            </div>

            {/* Bottom Section: History */}
            <div className="pt-4">
                <ResumeHistoryTable
                    data={history}
                    onView={handleViewResume}
                    onDownload={handleDownloadResume}
                    downloadingId={downloadingId}
                    selectedId={selectedResume?.id}
                />
            </div>

            {/* Editor Modal */}
            <ResumeEditorModal
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                initialData={editorData}
                onSave={handleSaveResume}
                isSaving={isSaving}
            />

            {/* PDF Preview Drawer */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: '50vw',
                        minWidth: '400px',
                        maxWidth: '800px',
                        bgcolor: '#0d0e12',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        color: 'white'
                    }
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1c23]">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-primary" size={24} />
                                Resume Preview
                            </h3>
                            {selectedResume && (
                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedResume.role} @ {selectedResume.company}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <IconButton
                                onClick={handleEditResume}
                                sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}
                                title="Edit Content"
                            >
                                <Pencil size={20} />
                            </IconButton>
                            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                            <Button
                                variant="contained"
                                startIcon={selectedResume && downloadingId === selectedResume.id ? <CircularProgress size={18} color="inherit" /> : <Download size={18} />}
                                onClick={() => selectedResume && handleDownloadResume(selectedResume)}
                                disabled={!selectedResume || downloadingId === selectedResume.id}
                                sx={{
                                    bgcolor: '#7c3aed',
                                    '&:hover': { bgcolor: '#6d28d9' },
                                    '&.Mui-disabled': {
                                        bgcolor: 'rgba(124, 58, 237, 0.5)',
                                        color: 'rgba(255, 255, 255, 0.7)'
                                    }
                                }}
                            >
                                {selectedResume && downloadingId === selectedResume.id ? 'Downloading...' : 'Download PDF'}
                            </Button>
                            <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: 'gray' }}>
                                <X size={24} />
                            </IconButton>
                        </div>
                    </div>

                    {/* Drawer Content (Mock PDF) */}
                    <div className="flex-1 overflow-y-auto p-8 bg-black/50">
                        <div className="bg-white text-black max-w-[21cm] mx-auto min-h-[29.7cm] shadow-2xl p-12">
                            {/* Mock PDF Content */}
                            {selectedResume ? (
                                <div className="min-h-full">
                                    {selectedResume.newResumeContent ? (
                                        <ResumeRender
                                            data={
                                                typeof selectedResume.newResumeContent === 'string'
                                                    ? JSON.parse(selectedResume.newResumeContent)
                                                    : selectedResume.newResumeContent as unknown as ResumeData
                                            }
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <p>No resume content available for this entry.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

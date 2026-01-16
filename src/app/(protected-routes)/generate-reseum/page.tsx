'use client';

import { useState } from 'react';
import ResumeControlPanel from '@/components/resume/ResumeControlPanel';
import ResumePreviewPanel from '@/components/resume/ResumePreviewPanel';
import ResumeHistoryTable, { ResumeLog } from '@/components/resume/ResumeHistoryTable';
import ResumeEditorModal from '@/components/resume/ResumeEditorModal';
import { ApplicationStatus } from '@/lib/types';
import { Drawer, IconButton, Divider, Button } from '@mui/material';
import { X, Download, FileText, CheckCircle2, Pencil } from 'lucide-react';

const MOCK_HISTORY: ResumeLog[] = [
    {
        id: '1',
        generatedAt: 'Oct 24, 2023',
        company: 'Google',
        role: 'Frontend Engineer',
        status: ApplicationStatus.Success,
        matchScore: 92
    },
    {
        id: '2',
        generatedAt: 'Oct 22, 2023',
        company: 'Netflix',
        role: 'Senior UI Developer',
        status: ApplicationStatus.Failed,
        matchScore: 0
    }
];

// Mock data content for the editor
const MOCK_RESUME_CONTENT = {
    name: "Alex Roberts",
    email: "alex.roberts@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Highly skilled Frontend Engineer with 5+ years of experience building scalable web applications. Proven track record in optimizing performance and delivering high-quality user experiences. Tailored specifically for Target Company, with a focus on modern stack technologies.",
    experience: [
        {
            role: "Senior Software Engineer",
            company: "TechCorp Inc.",
            period: "2021 - Present",
            points: [
                "Led the migration of legacy monolith to microservices, reducing deployment time by 40%.",
                "Mentored generic junior developers and established code review standards.",
                "Implemented real-time features using WebSockets, increasing user engagement by 25%."
            ]
        },
        {
            role: "Software Developer",
            company: "Startup X",
            period: "2018 - 2021",
            points: [
                "Built the MVP for the core product using React and Firebase.",
                "Collaborated with designers to implement pixel-perfect UIs."
            ]
        }
    ]
};

export default function ResumeBuilderPage() {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'GENERATION' | 'SUCCESS' | 'FAILED'>('IDLE');
    const [history, setHistory] = useState<ResumeLog[]>(MOCK_HISTORY);
    const [currentScore, setCurrentScore] = useState(0);
    const [addedKeywords, setAddedKeywords] = useState<string[]>([]);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<ResumeLog | null>(null);

    // Editor Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorData, setEditorData] = useState<any>(MOCK_RESUME_CONTENT);

    const handleGenerate = async (profile: string, jobDescription: string) => {
        // Mocking the generation pipeline
        setStatus('PROCESSING');

        // 1. Analyze (Mock delay)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('GENERATION');

        // 2. Generate (Mock delay)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 3. Success
        setStatus('SUCCESS');
        setCurrentScore(88); // Mock score
        setAddedKeywords(['React Optimization', 'Micro-frontends', 'System Design', 'CI/CD Pipelines']); // Mock keywords

        // Add to history
        const newLog: ResumeLog = {
            id: Date.now().toString(),
            generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            company: 'Target Company', // Ideally extracted from JD
            role: profile === 'frontend' ? 'Frontend Engineer' : 'Fullstack Developer',
            status: ApplicationStatus.Success,
            matchScore: 88,
        };

        setHistory(prev => [newLog, ...prev]);
    };

    const handleViewResume = (log: ResumeLog) => {
        setSelectedResume(log);
        setIsDrawerOpen(true);
    };

    const handleDownloadResume = (log: ResumeLog) => {
        console.log(`Downloading resume for ${log.company}`);
        // Simulate download
        const link = document.createElement('a');
        link.href = '#'; // In real app, this would be a blob URL
        link.download = `Resume_${log.company}_${log.role}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditResume = () => {
        // In a real app, we'd fetch the resume content here
        setIsEditorOpen(true);
    };

    const handleSaveResume = (newData: any) => {
        setEditorData(newData);
        console.log("Saved new resume data:", newData);
        // Here you would send update to backend
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
                    />
                </div>
            </div>

            {/* Bottom Section: History */}
            <div className="pt-4">
                <ResumeHistoryTable
                    data={history}
                    onView={handleViewResume}
                    onDownload={handleDownloadResume}
                />
            </div>

            {/* Editor Modal */}
            <ResumeEditorModal
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                initialData={editorData}
                onSave={handleSaveResume}
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
                                onClick={() => { setIsDrawerOpen(false); handleEditResume(); }}
                                sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}
                                title="Edit Content"
                            >
                                <Pencil size={20} />
                            </IconButton>
                            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                            <Button
                                variant="contained"
                                startIcon={<Download size={18} />}
                                onClick={() => selectedResume && handleDownloadResume(selectedResume)}
                                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
                            >
                                Download PDF
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
                                <div className="space-y-6">
                                    <div className="text-center border-b-2 border-gray-800 pb-6">
                                        <h1 className="text-4xl font-bold uppercase tracking-widest text-[#2d3748]">Alex Roberts</h1>
                                        <p className="text-sm text-gray-600 mt-2">alex.roberts@example.com | (555) 123-4567 | San Francisco, CA</p>
                                        <p className="text-sm text-blue-600 mt-1">linkedin.com/in/alexr | github.com/alexr</p>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-[#2d3748]">Professional Summary</h2>
                                        <p className="text-sm leading-relaxed text-gray-700">
                                            Highly skilled <strong>{selectedResume.role}</strong> with 5+ years of experience building scalable web applications.
                                            Proven track record in optimizing performance and delivering high-quality user experiences.
                                            Tailored specifically for <strong>{selectedResume.company}</strong>, with a focus on modern stack technologies.
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-[#2d3748]">Key Skills</h2>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>JavaScript (ES6+), TypeScript, React, Next.js</li>
                                                <li>Node.js, Express, PostgreSQL, MongoDB</li>
                                            </ul>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>AWS, Docker, CI/CD Pipelines</li>
                                                <li>System Design, Performance Optimization</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-[#2d3748]">Experience</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="font-bold text-gray-800">Senior Software Engineer</h3>
                                                    <span className="text-sm text-gray-600">2021 - Present</span>
                                                </div>
                                                <p className="text-sm italic text-gray-600 mb-1">TechCorp Inc.</p>
                                                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                    <li>Led the migration of legacy monolith to microservices, reducing deployment time by 40%.</li>
                                                    <li>Mentored generic junior developers and established code review standards.</li>
                                                    <li>Implemented real-time features using WebSockets, increasing user engagement by 25%.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="font-bold text-gray-800">Software Developer</h3>
                                                    <span className="text-sm text-gray-600">2018 - 2021</span>
                                                </div>
                                                <p className="text-sm italic text-gray-600 mb-1">Startup X</p>
                                                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                    <li>Built the MVP for the core product using React and Firebase.</li>
                                                    <li>Collaborated with designers to implement pixel-perfect UIs.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-[#2d3748]">Education</h2>
                                        <div>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-gray-800">B.S. Computer Science</h3>
                                                <span className="text-sm text-gray-600">2018</span>
                                            </div>
                                            <p className="text-sm text-gray-600">University of Technology</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            <CheckCircle2 size={12} />
                                            ATS Optimized for {selectedResume.company}
                                        </div>
                                    </div>
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

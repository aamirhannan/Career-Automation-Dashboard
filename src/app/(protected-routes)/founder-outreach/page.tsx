'use client';

import { useState } from 'react';
import {
    TextField, Button, Card, CardContent,
    Avatar, Chip, Divider, IconButton,
    InputAdornment, LinearProgress
} from '@mui/material';
import {
    Linkedin, Search, Sparkles, Send,
    Edit2, Trash2, User, Building2,
    ExternalLink, FileText, CheckCircle2,
    MessageSquare, ArrowRight
} from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ApplicationEditorModal from '@/components/email/ApplicationEditorModal';

// --- Types ---
interface FounderProfile {
    name: string;
    role: string;
    company: string;
    linkedinUrl: string;
    avatarUrl?: string; // Optional for now
    recentNews?: string; // The "Hook"
}

interface OutreachDraft {
    id: string;
    founder: FounderProfile;
    targetEmail: string; // Likely derived or guessed
    subject: string;
    body: string;
    resumeData: any;
    status: 'draft' | 'ready' | 'sent';
    createdAt: Date;
}

// --- Mock Data ---
const MOCK_FOUNDER_PROFILE: FounderProfile = {
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    company: "NexAI",
    linkedinUrl: "linkedin.com/in/sarahchen-example",
    recentNews: "NexAI just raised $12M Series A to expand their engineering team."
};

const MOCK_RESUME_DATA = {
    name: "Alex Roberts",
    email: "alex.roberts@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Passionate engineer looking to solve complex problems at high-growth startups like NexAI...",
    experience: [
        {
            role: "Senior Frontend Engineer",
            company: "TechCorp",
            period: "2021-Present",
            points: ["Built scalable UI systems", "Managed team of 5"]
        }
    ]
};

const MOCK_HISTORY: OutreachDraft[] = [
    {
        id: '101',
        founder: { name: "David Kim", role: "CEO", company: "FinTechNow", linkedinUrl: "#" },
        targetEmail: "david@fintechnow.io",
        subject: "Ideas for FinTechNow's mobile onboarding",
        body: "Hi David...",
        resumeData: {},
        status: 'sent',
        createdAt: new Date()
    }
];

// --- Theme ---
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7c3aed' },
        background: { paper: '#1a1c23', default: '#0d0e12' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    },
                },
            },
        },
    },
});

export default function FounderOutreachPage() {
    // Input State
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Process State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentDraft, setCurrentDraft] = useState<OutreachDraft | null>(null);

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [history, setHistory] = useState<OutreachDraft[]>(MOCK_HISTORY);

    // Step 1: Analyze LinkedIn URL
    const handleAnalyze = () => {
        if (!linkedinUrl) return;
        setIsAnalyzing(true);

        // Simulate Scraping
        setTimeout(() => {
            setFounderProfile(MOCK_FOUNDER_PROFILE);
            setIsAnalyzing(false);
        }, 1500);
    };

    // Step 2: Generate Outreach Package
    const handleGenerate = () => {
        if (!founderProfile) return;
        setIsGenerating(true);

        // Simulate AL Generation
        setTimeout(() => {
            const draft: OutreachDraft = {
                id: Date.now().toString(),
                founder: founderProfile,
                targetEmail: "sarah.chen@nexai.com", // Simulated 'guessed' email
                subject: `Solving engineering challenges at ${founderProfile.company}`,
                body: `Hi ${founderProfile.name.split(' ')[0]},\n\nI saw the news about ${founderProfile.company}'s recent Series A - huge congratulations! It's exciting to see how you're tackling...`,
                resumeData: MOCK_RESUME_DATA,
                status: 'draft',
                createdAt: new Date()
            };
            setCurrentDraft(draft);
            setIsGenerating(false);
        }, 2000);
    };

    // Step 3: Handle Editor Save
    const handleSaveDraft = (newData: any) => {
        if (!currentDraft) return;

        const updatedDraft = {
            ...currentDraft,
            subject: newData.subject,
            body: newData.body,
            resumeData: newData.resume,
            status: 'ready' as const
        };
        setCurrentDraft(updatedDraft);
        setIsEditorOpen(false);
    };

    // Step 4: Send
    const handleSend = () => {
        if (currentDraft) {
            setHistory([{ ...currentDraft, status: 'sent' }, ...history]);
            // Reset Flow
            setLinkedinUrl('');
            setJobDescription('');
            setFounderProfile(null);
            setCurrentDraft(null);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="max-w-7xl mx-auto h-full space-y-8 pb-10">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Founder Outreach</h2>
                    <p className="text-gray-400 max-w-2xl">
                        Directly connect with decision makers. We'll analyze their profile, find the hook, and tailor your pitch.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* === LEFT COLUMN: INPUT & PROCESS === */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Step 1: Input Card */}
                        <Card sx={{ bgcolor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Linkedin className="text-[#0a66c2]" size={20} />
                                    <h3 className="text-lg font-bold">Target Profile</h3>
                                </div>
                                <div className="flex gap-2">
                                    <TextField
                                        fullWidth
                                        placeholder="Paste LinkedIn URL..."
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        size="small"
                                        disabled={isAnalyzing || !!founderProfile}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAnalyze}
                                        disabled={!linkedinUrl || isAnalyzing || !!founderProfile}
                                        sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
                                    >
                                        {isAnalyzing ? '...' : 'Analyze'}
                                    </Button>
                                </div>

                                {founderProfile && (
                                    <>
                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-gray-400">Context (Optional)</h4>
                                            </div>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Paste a JD or specific topic you want to reference..."
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                className="bg-black/20"
                                            />
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                onClick={handleGenerate}
                                                disabled={isGenerating}
                                                startIcon={isGenerating ? <div className="animate-spin">◌</div> : <Sparkles size={18} />}
                                                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, height: 48 }}
                                            >
                                                {isGenerating ? 'Generating Outreach...' : 'Generate Outreach Package'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Step 2: Founder Profile Preview */}
                        {founderProfile && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <Card sx={{ bgcolor: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)', color: 'white' }}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <Avatar sx={{ width: 56, height: 56, bgcolor: '#7c3aed' }}>{founderProfile.name[0]}</Avatar>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{founderProfile.name}</h3>
                                                    <p className="text-purple-300 font-medium">{founderProfile.role}</p>
                                                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                                                        <Building2 size={12} /> {founderProfile.company}
                                                    </div>
                                                </div>
                                            </div>
                                            <IconButton size="small" href={founderProfile.linkedinUrl} target="_blank" sx={{ color: '#0a66c2' }}>
                                                <ExternalLink size={18} />
                                            </IconButton>
                                        </div>

                                        {founderProfile.recentNews && (
                                            <div className="mt-4 bg-white/5 p-3 rounded-lg border border-white/10">
                                                <p className="text-xs text-purple-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                    <Sparkles size={10} /> Identified Hook
                                                </p>
                                                <p className="text-sm text-gray-300 italic">
                                                    "{founderProfile.recentNews}"
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* === RIGHT COLUMN: RESULT & HISTORY === */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Draft Preview */}
                        {currentDraft ? (
                            <Card sx={{ bgcolor: '#1a1c23', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'white', position: 'relative', overflow: 'visible' }}>
                                <div className="absolute -top-3 left-4 bg-[#10b981] text-black text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Generated Successfully
                                </div>
                                <CardContent className="p-6 pt-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Ready for Review</h3>
                                            <p className="text-gray-400 text-sm">Review the tailored email and resume before sending.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Subject</span>
                                                <Chip label="Email" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', height: 20, fontSize: 10 }} />
                                            </div>
                                            <p className="font-medium text-gray-200">{currentDraft.subject}</p>
                                        </div>

                                        <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Resume Strategy</span>
                                                <Chip label="PDF" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', height: 20, fontSize: 10 }} />
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                Tailored for <span className="text-white font-semibold">{currentDraft.founder.company}</span>.
                                                Highlighed experience relevant to "{currentDraft.founder.role}".
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => setIsEditorOpen(true)}
                                            startIcon={<Edit2 size={16} />}
                                            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', py: 1.5 }}
                                        >
                                            Review Full Package
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleSend}
                                            startIcon={<Send size={16} />}
                                            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, color: 'white', py: 1.5 }}
                                        >
                                            Approve & Send
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            // Placeholder State
                            !history.length && (
                                <div className="h-40 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500">
                                    <MessageSquare size={32} className="mb-2 opacity-50" />
                                    <p>No outreach drafts generated yet</p>
                                </div>
                            )
                        )}

                        {/* History Table */}
                        {history.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <HistoryIcon size={18} /> Recent Outreach
                                </h3>
                                <div className="bg-[#1a1c23] rounded-xl border border-white/10 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-black/20 border-b border-white/10 text-xs uppercase text-gray-400 font-semibold">
                                            <tr>
                                                <th className="p-4">Founder</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {history.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-medium text-white">{item.founder.name}</div>
                                                        <div className="text-xs text-gray-400">{item.founder.company}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                                                            <CheckCircle2 size={10} /> Sent
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right text-sm text-gray-500">
                                                        TODAY
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reused Editor Modal */}
                <ApplicationEditorModal
                    open={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    initialData={currentDraft ? {
                        id: currentDraft.id,
                        role: currentDraft.founder.role, // Mapping role for context
                        targetEmail: currentDraft.targetEmail,
                        subject: currentDraft.subject,
                        body: currentDraft.body,
                        resume: currentDraft.resumeData
                    } : null}
                    onSave={handleSaveDraft}
                />
            </div>
        </ThemeProvider>
    );
}

// Icon helper
function HistoryIcon({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}

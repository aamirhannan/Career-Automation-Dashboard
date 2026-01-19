'use client';

import { useState, useEffect } from 'react';
import {
    Tabs, Tab, Box, TextField, Button,
    Card, CardContent, IconButton, Chip,
    Slider, FormControlLabel, Switch, Divider,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
    Send, Plus, Trash2, Edit2, CheckCircle2,
    Clock, Mail, Sparkles, Settings as SettingsIcon,
    History as HistoryIcon, FileText, AlertCircle
} from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ApplicationEditorModal from '@/components/email/ApplicationEditorModal';
import { EmailService } from '@/services/emailService';
import { useSnackbar } from '@/context/SnackbarContext';
import { JOB_ROLE_OPTIONS, JOB_ROLE_MATCHERS } from '@/lib/constants';

// --- Types ---
interface EmailDraft {
    id: string;
    role: string;
    targetEmail: string;
    subject: string;
    body: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'WAITING' | 'SUCCESS' | 'FAILED' | 'REJECTED';
    createdAt: Date;
    resumeData: any; // Include resume data structure
}

interface SentEmail {
    id: string;
    role: string;
    recipient: string;
    sentAt: string;
    status: 'SUCCESS' | 'REJECTED';
}

// --- Mock Data ---
const MOCK_RESUME_DATA = {
    name: "Alex Roberts",
    email: "alex.roberts@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Experienced Frontend Developer specializing in React and Next.js ecosystem...",
    experience: [
        {
            role: "Senior Frontend Engineer",
            company: "TechCorp",
            period: "2021-Present",
            points: ["Led migration to Next.js", "Improved performance by 40%"]
        }
    ]
};

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
        MuiTab: {
            styleOverrides: {
                root: { textTransform: 'none', fontSize: '1rem', minHeight: 48 },
            },
        },
    },
});

export default function EmailAgentPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [drafts, setDrafts] = useState<EmailDraft[]>([]);
    const [history, setHistory] = useState<SentEmail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        let isMounted = true;

        const fetchEmails = async () => {
            try {
                const emails = await EmailService.getEmails();
                if (!isMounted) return;

                const newDrafts: EmailDraft[] = [];
                const newHistory: SentEmail[] = [];

                emails.forEach(email => {
                    // Check statuses that belong in history: SUCCESS, REJECTED
                    if (email.status === 'SUCCESS' || email.status === 'REJECTED') {
                        newHistory.push({
                            id: email.id,
                            role: email.role,
                            recipient: email.targetEmail,
                            sentAt: new Date(email.updatedAt).toLocaleDateString(),
                            status: email.status // 'SUCCESS' | 'REJECTED'
                        });
                    } else {
                        // Drafts (Pending, Waiting, Failed, In Progress)
                        newDrafts.push({
                            id: email.id,
                            role: email.role,
                            targetEmail: email.targetEmail,
                            subject: email.subjectLine || `Application for ${email.role}`,
                            body: email.coverLetter || "Generating content...",
                            status: email.status as any,
                            createdAt: new Date(email.createdAt),
                            resumeData: MOCK_RESUME_DATA // Placeholder
                        });
                    }
                });

                setDrafts(newDrafts);
                setHistory(newHistory.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
            } catch (error) {
                console.error("Failed to fetch emails:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchEmails(); // Initial fetch
        const interval = setInterval(fetchEmails, 30000); // Poll every 30 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Form State
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [jd, setJd] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingDraft, setEditingDraft] = useState<EmailDraft | null>(null);

    const handleJdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const text = e.target.value;
        setJd(text);

        // Auto-extract Email
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const foundEmail = text.match(emailRegex);
        if (foundEmail) {
            setEmail(foundEmail[0]);
        }

        // Auto-extract Role using Regex
        for (const { key, regex } of JOB_ROLE_MATCHERS) {
            if (regex.test(text)) {
                setRole(key);
                break;
            }
        }
    };

    const handleGenerate = async () => {
        if (!role || !email || !jd) return;

        setIsGenerating(true);
        try {
            const response = await EmailService.createEmail({
                role,
                jobDescription: jd,
                targetEmail: email
            });

            // Status is PENDING initially (in queue for generation)
            const newDraft: EmailDraft = {
                id: response.id,
                role: response.role,
                targetEmail: response.targetEmail,
                subject: response.subjectLine || `Application for ${response.role}`,
                body: response.coverLetter || "Generating content...",
                status: 'PENDING', // PENDING means generating
                createdAt: new Date(response.createdAt),
                resumeData: MOCK_RESUME_DATA // Placeholder
            };

            setDrafts([newDraft, ...drafts]);
            // Reset form
            setRole('');
            setEmail('');
            setJd('');
            showSnackbar('Email draft generated successfully!', 'success');
        } catch (error) {
            console.error('Failed to generate email:', error);
            showSnackbar('Failed to generate email draft.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async (id: string) => {
        const draft = drafts.find(d => d.id === id);
        if (draft) {
            try {
                // Determine if we are approving a WAITING draft -> back to PENDING (for sending)
                if (draft.status === 'WAITING') {
                    await EmailService.updateEmail(draft.id, { status: 'PENDING' });
                    // Optimistically move to history or update UI
                    setHistory([{
                        id: draft.id,
                        role: draft.role,
                        recipient: draft.targetEmail,
                        sentAt: 'Just now',
                        status: 'SUCCESS'
                    }, ...history]);
                    setDrafts(drafts.filter(d => d.id !== id));
                    showSnackbar('Email approved and pushed to send queue.', 'success');
                }
            } catch (error) {
                console.error("Failed to approve email:", error);
                showSnackbar('Failed to approve email.', 'error');
            }
        }
    };

    const handleDelete = async (id: string) => {
        const draft = drafts.find(d => d.id === id);
        if (draft) {
            try {
                await EmailService.updateEmail(id, { status: 'REJECTED' });
                // Move to history as rejected
                setHistory([{
                    id: draft.id,
                    role: draft.role,
                    recipient: draft.targetEmail,
                    sentAt: 'Rejected just now',
                    status: 'REJECTED'
                }, ...history]);
                setDrafts(drafts.filter(d => d.id !== id));
            } catch (error) {
                console.error("Failed to reject email:", error);
            }
        }
    };

    const handleEdit = (draft: EmailDraft) => {
        if (draft.status !== 'WAITING') return; // Can only edit when waiting for review
        setEditingDraft(draft);
        setIsEditorOpen(true);
    };

    const handleSaveDraft = (newData: any) => {
        if (!editingDraft) return;

        const updatedDraft: EmailDraft = {
            ...editingDraft,
            subject: newData.subject,
            body: newData.body,
            resumeData: newData.resume,
            status: 'WAITING' // Remains waiting after edit
        };

        setDrafts(drafts.map(d => d.id === editingDraft.id ? updatedDraft : d));
        setIsEditorOpen(false);
        setEditingDraft(null);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="h-full flex flex-col space-y-6 pb-10">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Email Automation Agent</h2>
                    <p className="text-gray-400 max-w-2xl">
                        Generate tailored emails from job descriptions, review them in your queue, and automate your outreach.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} textColor="primary" indicatorColor="primary">
                        <Tab icon={<Mail size={18} />} iconPosition="start" label="Compose & Queue" />
                        <Tab icon={<HistoryIcon size={18} />} iconPosition="start" label="Sent History" />
                        <Tab icon={<SettingsIcon size={18} />} iconPosition="start" label="Configuration" />
                    </Tabs>
                </Box>

                {/* === TAB 1: COMPOSE & QUEUE === */}
                {activeTab === 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Left Col: Composer */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-[#1a1c23] p-6 rounded-xl border border-white/10 shadow-lg sticky top-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="text-primary" size={20} />
                                    <h3 className="text-lg font-bold text-white">New Application</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormControl fullWidth>
                                        <InputLabel id="job-role-label">Job Role</InputLabel>
                                        <Select
                                            labelId="job-role-label"
                                            value={role}
                                            label="Job Role"
                                            onChange={(e) => setRole(e.target.value)}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c3aed' },
                                                color: 'white'
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#1a1c23',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        '& .MuiMenuItem-root': {
                                                            color: 'white',
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                                            '&.Mui-selected': { bgcolor: 'rgba(124, 58, 237, 0.2)', '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.3)' } }
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            {JOB_ROLE_OPTIONS.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Target Email"
                                        variant="outlined"
                                        placeholder="hiring@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Job Description"
                                        multiline
                                        rows={8}
                                        variant="outlined"
                                        placeholder="Paste the full job description here..."
                                        value={jd}
                                        onChange={handleJdChange}
                                        sx={{
                                            '& .MuiInputBase-root': { alignItems: 'flex-start' }
                                        }}
                                    />

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={!role || !email || !jd || isGenerating}
                                        onClick={handleGenerate}
                                        sx={{
                                            bgcolor: '#7c3aed',
                                            '&:hover': { bgcolor: '#6d28d9' },
                                            height: 48,
                                            fontWeight: 'bold'
                                        }}
                                        startIcon={isGenerating ? <div className="animate-spin text-xl">◌</div> : <Sparkles size={18} />}
                                    >
                                        {isGenerating ? 'Drafting...' : 'Generate Draft'}
                                    </Button>

                                </div>
                            </div>
                        </div>

                        {/* Right Col: Draft Queue */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Clock className="text-gray-400" size={20} />
                                    Review Queue
                                    <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">{drafts.length}</span>
                                </h3>
                            </div>

                            {drafts.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
                                    <Mail className="mx-auto text-gray-600 mb-4" size={48} />
                                    <h4 className="text-xl text-gray-400 font-semibold">Queue is empty</h4>
                                    <p className="text-gray-500 mt-2">Generate a draft to get started.</p>
                                </div>
                            ) : (
                                drafts.map((draft) => {
                                    const isPending = draft.status === 'PENDING';
                                    const isInProgress = draft.status === 'IN_PROGRESS';

                                    return (
                                        <Card key={draft.id} sx={{ bgcolor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', color: 'white', opacity: isPending ? 0.7 : 1 }}>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">{draft.role}</h4>
                                                        <p className="text-sm text-gray-400 font-mono mt-1 flex items-center gap-1">
                                                            <Mail size={12} /> {draft.targetEmail}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Chip
                                                            label={isPending ? 'Generating...' : (draft.status === 'WAITING' ? 'Needs Review' : draft.status)}
                                                            size="small"
                                                            color={draft.status === 'WAITING' ? 'success' : 'default'}
                                                            variant="outlined"
                                                            icon={isPending ? <div className="animate-spin mr-1">◌</div> : undefined}
                                                        />
                                                    </div>
                                                </div>

                                                {isPending ? (
                                                    <div className="space-y-3 animate-pulse">
                                                        <div className="h-4 bg-white/10 rounded w-1/4"></div>
                                                        <div className="h-16 bg-white/5 rounded w-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-black/30 p-4 rounded-lg mb-4 border border-white/5">
                                                        <div className="mb-2">
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Subject:</span>
                                                            <p className="text-sm font-medium text-gray-200">{draft.subject || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Body Preview:</span>
                                                            <p className="text-sm text-gray-400 line-clamp-3 mt-1 leading-relaxed">
                                                                {draft.body || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-3 pt-2">
                                                    <Button
                                                        startIcon={<Trash2 size={16} />}
                                                        color="error"
                                                        disabled={isPending}
                                                        onClick={() => handleDelete(draft.id)}
                                                        sx={{ opacity: 0.8 }}
                                                    >
                                                        Discard
                                                    </Button>
                                                    <Button
                                                        startIcon={<Edit2 size={16} />}
                                                        variant="outlined"
                                                        disabled={isPending}
                                                        onClick={() => handleEdit(draft)}
                                                        sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Send size={16} />}
                                                        disabled={isPending}
                                                        onClick={() => handleSend(draft.id)}
                                                        sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                                                    >
                                                        Approve & Send
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* === TAB 2: SENT HISTORY === */}
                {activeTab === 1 && (
                    <div className="bg-[#1a1c23] rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 border-b border-white/10 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Recipient</th>
                                    <th className="p-4">Sent At</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{item.role}</td>
                                        <td className="p-4 text-gray-400 font-mono text-sm">{item.recipient}</td>
                                        <td className="p-4 text-gray-400 text-sm">{item.sentAt}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {item.status === 'SUCCESS' && <CheckCircle2 size={10} />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button size="small" sx={{ color: 'gray' }}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* === TAB 3: CONFIGURATION === */}
                {activeTab === 2 && (
                    <div className="max-w-3xl mx-auto w-full space-y-6">
                        <Card sx={{ bgcolor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <CardContent className="p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-warning" />
                                    Safety Limits
                                </h3>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-300">Max Emails per Day</span>
                                        <span className="font-mono text-primary font-bold">50</span>
                                    </div>
                                    <Slider defaultValue={50} max={100} valueLabelDisplay="auto" sx={{ color: '#7c3aed' }} />
                                    <p className="text-xs text-gray-500 mt-1">Recommended limit to avoid spam filters.</p>
                                </div>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-white">Auto-Reply Tracking</h4>
                                            <p className="text-sm text-gray-400">Track opens and clicks using invisible pixels.</p>
                                        </div>
                                        <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7c3aed' } }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-white">Human-in-the-Loop Mode</h4>
                                            <p className="text-sm text-gray-400">Require manual approval for every email (Recommended).</p>
                                        </div>
                                        <Switch defaultChecked disabled />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Application Editor Modal */}
                <ApplicationEditorModal
                    open={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    initialData={editingDraft ? {
                        id: editingDraft.id,
                        role: editingDraft.role,
                        targetEmail: editingDraft.targetEmail,
                        subject: editingDraft.subject,
                        body: editingDraft.body,
                        resume: editingDraft.resumeData
                    } : null}
                    onSave={handleSaveDraft}
                />
            </div>
        </ThemeProvider>
    );
}

'use client';

import { useState, useEffect } from 'react';
import {
    Dialog, Slide, Button, TextField,
    Accordion, AccordionSummary, AccordionDetails,
    IconButton, Divider, InputAdornment, Tabs, Tab, Box
} from '@mui/material';
import {
    X, Save, FileText, ChevronDown, Plus, Trash2,
    Briefcase, User, MapPin, Mail, Phone, MessageSquare, FileInput
} from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Transition for full screen dialog
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Custom dark theme (matching the app)
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
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                    },
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:before': { display: 'none' },
                },
            },
        },
    },
});

interface ApplicationData {
    id: string;
    role: string;
    targetEmail: string;
    subject: string;
    body: string;
    resume: any; // The resume JSON structure
}

interface ApplicationEditorModalProps {
    open: boolean;
    onClose: () => void;
    initialData: ApplicationData | null;
    onSave: (newData: ApplicationData) => void;
}

export default function ApplicationEditorModal({ open, onClose, initialData, onSave }: ApplicationEditorModalProps) {
    const [activeTab, setActiveTab] = useState(0); // 0 = Email, 1 = Resume
    const [data, setData] = useState<ApplicationData | null>(null);

    // Sync state when initialData changes
    useEffect(() => {
        if (initialData) {
            setData(JSON.parse(JSON.stringify(initialData))); // Deep copy to avoid ref issues
        }
    }, [initialData, open]);

    if (!data) return null;

    // --- Email Handlers ---
    const handleEmailChange = (field: 'subject' | 'body', value: string) => {
        setData(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    // --- Resume Handlers (Mirrored from ResumeEditorModal) ---
    const handleResumeChange = (field: string, value: string) => {
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, [field]: value }
        }) : null);
    };

    const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
        if (!data) return;
        const newExp = [...(data.resume.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    const handlePointChange = (expIndex: number, pointIndex: number, value: string) => {
        if (!data) return;
        const newExp = [...(data.resume.experience || [])];
        const newPoints = [...(newExp[expIndex].points || [])];
        newPoints[pointIndex] = value;
        newExp[expIndex].points = newPoints;
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    const addPoint = (expIndex: number) => {
        if (!data) return;
        const newExp = [...(data.resume.experience || [])];
        const newPoints = [...(newExp[expIndex].points || []), ""];
        newExp[expIndex].points = newPoints;
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    const removePoint = (expIndex: number, pointIndex: number) => {
        if (!data) return;
        const newExp = [...(data.resume.experience || [])];
        newExp[expIndex].points = newExp[expIndex].points.filter((_: any, i: number) => i !== pointIndex);
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    const addExperience = () => {
        if (!data) return;
        const newExp = [
            ...(data.resume.experience || []),
            { role: "New Role", company: "Company", period: "2024", points: [""] }
        ];
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    const removeExperience = (index: number) => {
        if (!data) return;
        const newExp = data.resume.experience.filter((_: any, i: number) => i !== index);
        setData(prev => prev ? ({
            ...prev,
            resume: { ...prev.resume, experience: newExp }
        }) : null);
    };

    // --- Renderers ---

    const renderResumePreview = () => {
        const resume = data.resume;
        return (
            <div className="bg-white text-black h-full shadow-xl p-8 overflow-y-auto text-[0.8rem]">
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2d3748]">{resume.name || 'Your Name'}</h1>
                    <p className="text-xs text-gray-600 mt-1">{resume.email} | {resume.phone} | {resume.location}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-[#2d3748]">Summary</h2>
                    <p className="text-xs leading-relaxed text-gray-700">{resume.summary}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-[#2d3748]">Experience</h2>
                    {resume.experience?.map((exp: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                <span className="text-xs text-gray-600">{exp.period}</span>
                            </div>
                            <p className="text-xs italic text-gray-600 mb-1">{exp.company}</p>
                            <ul className="list-disc pl-4 text-xs space-y-0.5 text-gray-700">
                                {exp.points?.map((pt: string, j: number) => <li key={j}>{pt}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                PaperProps={{ sx: { bgcolor: '#0d0e12', color: 'white' } }}
            >
                <div className="h-full flex flex-col">
                    {/* Header Toolbar */}
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1c23]">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <FileText className="text-primary" size={24} />
                                <div>
                                    <h2 className="text-white font-bold text-lg">Application Editor</h2>
                                    <span className="text-xs text-gray-400">Review email & resume</span>
                                </div>
                            </div>

                            {/* Tabs in Header */}
                            <div className="ml-8 border-l border-white/10 pl-6">
                                <Tabs
                                    value={activeTab}
                                    onChange={(_, v) => setActiveTab(v)}
                                    textColor="inherit"
                                    indicatorColor="primary"
                                    sx={{ minHeight: 48 }}
                                >
                                    <Tab
                                        icon={<MessageSquare size={16} />}
                                        iconPosition="start"
                                        label="Cover Letter / Email"
                                        sx={{ textTransform: 'none', color: activeTab === 0 ? 'white' : 'gray' }}
                                    />
                                    <Tab
                                        icon={<FileInput size={16} />}
                                        iconPosition="start"
                                        label="Targeted Resume"
                                        sx={{ textTransform: 'none', color: activeTab === 1 ? 'white' : 'gray' }}
                                    />
                                </Tabs>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button onClick={onClose} sx={{ color: 'gray', '&:hover': { color: 'white' } }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => onSave(data)}
                                variant="contained"
                                startIcon={<Save size={18} />}
                                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden bg-[#0d0e12]">
                        {activeTab === 0 ? (
                            // === EMAIL EDITOR ===
                            <div className="max-w-4xl mx-auto h-full p-8 overflow-y-auto">
                                <div className="space-y-6">
                                    <div className="bg-[#1a1c23] p-6 rounded-xl border border-white/10">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Mail size={16} /> Email Details
                                        </h3>
                                        <div className="space-y-4">
                                            <TextField
                                                label="Subject Line"
                                                fullWidth
                                                value={data.subject}
                                                onChange={(e) => handleEmailChange('subject', e.target.value)}
                                            />
                                            <TextField
                                                label="Email Body"
                                                fullWidth
                                                multiline
                                                minRows={12}
                                                value={data.body}
                                                onChange={(e) => handleEmailChange('body', e.target.value)}
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.9rem',
                                                        lineHeight: '1.6'
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // === RESUME EDITOR (Split View) ===
                            <div className="flex h-full">
                                {/* Left: Form */}
                                <div className="w-1/2 border-r border-white/10 overflow-y-auto p-8 bg-[#0d0e12]">
                                    <div className="max-w-2xl mx-auto space-y-8">
                                        {/* Personal Details */}
                                        <section className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <User size={16} /> Personal Details
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <TextField
                                                    label="Full Name" size="small"
                                                    value={data.resume.name || ''}
                                                    onChange={(e) => handleResumeChange('name', e.target.value)}
                                                />
                                                <TextField
                                                    label="Email" size="small"
                                                    value={data.resume.email || ''}
                                                    onChange={(e) => handleResumeChange('email', e.target.value)}
                                                />
                                                <TextField
                                                    label="Phone" size="small"
                                                    value={data.resume.phone || ''}
                                                    onChange={(e) => handleResumeChange('phone', e.target.value)}
                                                />
                                                <TextField
                                                    label="Location" size="small"
                                                    value={data.resume.location || ''}
                                                    onChange={(e) => handleResumeChange('location', e.target.value)}
                                                />
                                            </div>
                                            <TextField
                                                label="Professional Summary"
                                                fullWidth multiline rows={3}
                                                value={data.resume.summary || ''}
                                                onChange={(e) => handleResumeChange('summary', e.target.value)}
                                            />
                                        </section>

                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                                        {/* Experience */}
                                        <section className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Briefcase size={16} /> Experience
                                                </h3>
                                                <Button size="small" startIcon={<Plus size={16} />} onClick={addExperience} sx={{ color: '#ae7aff' }}>
                                                    Add Role
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {data.resume.experience?.map((exp: any, index: number) => (
                                                    <Accordion key={index} defaultExpanded={index === 0}>
                                                        <AccordionSummary expandIcon={<ChevronDown className="text-gray-400" />}>
                                                            <div className="flex items-center justify-between w-full pr-4">
                                                                <span className="font-medium text-white">{exp.role || 'New Role'}</span>
                                                                <span className="text-sm text-gray-500">{exp.company}</span>
                                                            </div>
                                                        </AccordionSummary>
                                                        <AccordionDetails className="space-y-4 pt-0">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <TextField label="Job Title" size="small" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} />
                                                                <TextField label="Company" size="small" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                                                                <TextField label="Period" size="small" className="col-span-2" value={exp.period} onChange={(e) => handleExperienceChange(index, 'period', e.target.value)} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs text-gray-500 uppercase font-semibold">Points</label>
                                                                {exp.points?.map((point: string, pIndex: number) => (
                                                                    <div key={pIndex} className="flex gap-2">
                                                                        <TextField fullWidth size="small" multiline value={point} onChange={(e) => handlePointChange(index, pIndex, e.target.value)} />
                                                                        <IconButton size="small" onClick={() => removePoint(index, pIndex)} sx={{ color: '#ef4444', opacity: 0.5 }}>
                                                                            <Trash2 size={16} />
                                                                        </IconButton>
                                                                    </div>
                                                                ))}
                                                                <Button size="small" startIcon={<Plus size={14} />} onClick={() => addPoint(index)} sx={{ color: 'gray' }}>Add Point</Button>
                                                            </div>
                                                            <div className="pt-2 flex justify-end">
                                                                <Button size="small" color="error" startIcon={<Trash2 size={16} />} onClick={() => removeExperience(index)}>Remove Role</Button>
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Right: Preview */}
                                <div className="w-1/2 bg-[#525659] p-8 overflow-hidden flex items-center justify-center">
                                    <div className="h-full aspect-[1/1.414] shadow-2xl scale-[0.85] origin-top">
                                        {renderResumePreview()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </ThemeProvider>
    );
}

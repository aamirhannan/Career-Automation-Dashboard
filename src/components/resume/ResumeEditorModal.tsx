'use client';

import { useState, useEffect } from 'react';
import {
    Dialog, Slide, Button, TextField,
    Accordion, AccordionSummary, AccordionDetails,
    IconButton, Divider, InputAdornment
} from '@mui/material';
import {
    X, Save, FileText, ChevronDown, Plus, Trash2,
    Briefcase, User, MapPin, Mail, Phone
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

// Custom dark theme for MUI components within the modal
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

interface ResumeEditorModalProps {
    open: boolean;
    onClose: () => void;
    initialData: any;
    onSave: (newData: any) => void;
}

export default function ResumeEditorModal({ open, onClose, initialData, onSave }: ResumeEditorModalProps) {
    const [formData, setFormData] = useState<any>(initialData || {});

    // Sync state when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, open]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
        const newExp = [...(formData.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, experience: newExp }));
    };

    const handlePointChange = (expIndex: number, pointIndex: number, value: string) => {
        const newExp = [...(formData.experience || [])];
        const newPoints = [...(newExp[expIndex].points || [])];
        newPoints[pointIndex] = value;
        newExp[expIndex].points = newPoints;
        setFormData((prev: any) => ({ ...prev, experience: newExp }));
    };

    const addPoint = (expIndex: number) => {
        const newExp = [...(formData.experience || [])];
        const newPoints = [...(newExp[expIndex].points || []), ""];
        newExp[expIndex].points = newPoints;
        setFormData((prev: any) => ({ ...prev, experience: newExp }));
    };

    const removePoint = (expIndex: number, pointIndex: number) => {
        const newExp = [...(formData.experience || [])];
        newExp[expIndex].points = newExp[expIndex].points.filter((_: any, i: number) => i !== pointIndex);
        setFormData((prev: any) => ({ ...prev, experience: newExp }));
    };

    const addExperience = () => {
        setFormData((prev: any) => ({
            ...prev,
            experience: [
                ...(prev.experience || []),
                { role: "New Role", company: "Company", period: "2024", points: [""] }
            ]
        }));
    };

    const removeExperience = (index: number) => {
        const newExp = formData.experience.filter((_: any, i: number) => i !== index);
        setFormData((prev: any) => ({ ...prev, experience: newExp }));
    };

    const renderPreview = () => {
        const data = formData;
        return (
            <div className="bg-white text-black h-full shadow-xl p-8 overflow-y-auto text-[0.8rem]">
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2d3748]">{data.name || 'Your Name'}</h1>
                    <p className="text-xs text-gray-600 mt-1">{data.email} | {data.phone} | {data.location}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-[#2d3748]">Summary</h2>
                    <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-[#2d3748]">Experience</h2>
                    {data.experience?.map((exp: any, i: number) => (
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
                    {/* Toolbar */}
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1c23]">
                        <div className="flex items-center gap-3">
                            <FileText className="text-primary" size={24} />
                            <div>
                                <h2 className="text-white font-bold text-lg">Resume Editor</h2>
                                <span className="text-xs text-gray-400">Update your details securely</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-6 w-[1px] bg-white/10"></div>
                            <Button onClick={onClose} sx={{ color: 'gray', '&:hover': { color: 'white' } }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => onSave(formData)}
                                variant="contained"
                                startIcon={<Save size={18} />}
                                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Main Content Split */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Form Editor */}
                        <div className="w-1/2 border-r border-white/10 flex flex-col bg-[#0d0e12] overflow-y-auto">
                            <div className="p-8 space-y-8 max-w-3xl mx-auto w-full">

                                {/* Personal Details Section */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <User size={16} /> Personal Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextField
                                            label="Full Name"
                                            fullWidth
                                            value={formData.name || ''}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            value={formData.email || ''}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Mail size={16} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            label="Phone"
                                            fullWidth
                                            value={formData.phone || ''}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Phone size={16} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            label="Location"
                                            fullWidth
                                            value={formData.location || ''}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><MapPin size={16} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                    </div>
                                    <TextField
                                        label="Professional Summary"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={formData.summary || ''}
                                        onChange={(e) => handleChange('summary', e.target.value)}
                                        placeholder="Brief overview of your professional background..."
                                    />
                                </section>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                                {/* Experience Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase size={16} /> Experience
                                        </h3>
                                        <Button
                                            size="small"
                                            startIcon={<Plus size={16} />}
                                            onClick={addExperience}
                                            sx={{ color: '#ae7aff' }}
                                        >
                                            Add Role
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.experience?.map((exp: any, index: number) => (
                                            <Accordion key={index} defaultExpanded={index === 0}>
                                                <AccordionSummary expandIcon={<ChevronDown className="text-gray-400" />}>
                                                    <div className="flex items-center justify-between w-full pr-4">
                                                        <span className="font-medium text-white">{exp.role || 'New Role'}</span>
                                                        <span className="text-sm text-gray-500">{exp.company}</span>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails className="space-y-4 pt-0">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <TextField
                                                            label="Job Title"
                                                            size="small"
                                                            value={exp.role || ''}
                                                            onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                        />
                                                        <TextField
                                                            label="Company"
                                                            size="small"
                                                            value={exp.company || ''}
                                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                        />
                                                        <TextField
                                                            label="Period"
                                                            size="small"
                                                            value={exp.period || ''}
                                                            onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                                                            className="col-span-2"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Achievements / Responsibilities</label>
                                                        {exp.points?.map((point: string, pIndex: number) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    multiline
                                                                    value={point}
                                                                    onChange={(e) => handlePointChange(index, pIndex, e.target.value)}
                                                                />
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => removePoint(index, pIndex)}
                                                                    sx={{ color: '#ef4444', opacity: 0.5, '&:hover': { opacity: 1 } }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </IconButton>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            size="small"
                                                            startIcon={<Plus size={14} />}
                                                            onClick={() => addPoint(index)}
                                                            sx={{ color: 'gray' }}
                                                        >
                                                            Add Point
                                                        </Button>
                                                    </div>

                                                    <div className="pt-2 flex justify-end">
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            startIcon={<Trash2 size={16} />}
                                                            onClick={() => removeExperience(index)}
                                                        >
                                                            Remove Role
                                                        </Button>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Right: Live Preview */}
                        <div className="w-1/2 bg-[#525659] p-8 overflow-hidden flex items-center justify-center">
                            <div className="h-full aspect-[1/1.414] shadow-2xl scale-[0.85] origin-top">
                                {renderPreview()}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </ThemeProvider>
    );
}

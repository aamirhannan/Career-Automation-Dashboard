'use client';

import { useState, useEffect } from 'react';
import {
    Dialog, Slide, Button, TextField,
    Accordion, AccordionSummary, AccordionDetails,
    IconButton, Divider, InputAdornment,
    Tabs, Tab, Box
} from '@mui/material';
import {
    Save, FileText, ChevronDown, Plus, Trash2,
    Briefcase, User, MapPin, Mail, Phone,
    GraduationCap, Code, FolderGit2
} from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResumeRender, { ResumeData } from './ResumeRender';

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
    initialData: ResumeData;
    onSave: (newData: ResumeData) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
            style={{ padding: '24px 0' }}
        >
            {value === index && children}
        </div>
    );
}

export default function ResumeEditorModal({ open, onClose, initialData, onSave }: ResumeEditorModalProps) {
    const [formData, setFormData] = useState<ResumeData>(initialData || { header: { contact: {} } });
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, open]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // --- Handlers for Header ---
    const handleHeaderChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            header: { ...prev.header, [field]: value }
        }));
    };

    const handleContactChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            header: {
                ...prev.header,
                contact: { ...prev.header.contact, [field]: value }
            }
        }));
    };

    // --- Handlers for Experience ---
    const handleExperienceChange = (index: number, field: string, value: string | object) => {
        const newExp = [...(formData.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const handleExpDurationChange = (index: number, subField: 'start' | 'end', value: string) => {
        const newExp = [...(formData.experience || [])];
        const duration = { ...newExp[index].duration, [subField]: value };
        newExp[index] = { ...newExp[index], duration };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const handleExpPointChange = (expIndex: number, pointIndex: number, value: string) => {
        const newExp = [...(formData.experience || [])];
        const newPoints = [...(newExp[expIndex].responsibilitiesAndAchievements || [])];
        newPoints[pointIndex] = value;
        newExp[expIndex] = { ...newExp[expIndex], responsibilitiesAndAchievements: newPoints };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const addExpPoint = (expIndex: number) => {
        const newExp = [...(formData.experience || [])];
        const newPoints = [...(newExp[expIndex].responsibilitiesAndAchievements || []), ""];
        newExp[expIndex] = { ...newExp[expIndex], responsibilitiesAndAchievements: newPoints };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const removeExpPoint = (expIndex: number, pointIndex: number) => {
        const newExp = [...(formData.experience || [])];
        const newPoints = newExp[expIndex].responsibilitiesAndAchievements?.filter((_, i) => i !== pointIndex);
        newExp[expIndex] = { ...newExp[expIndex], responsibilitiesAndAchievements: newPoints };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...(prev.experience || []),
                {
                    role: "New Role",
                    company: "Company Name",
                    duration: { start: "", end: "" },
                    responsibilitiesAndAchievements: [""]
                }
            ]
        }));
    };

    const removeExperience = (index: number) => {
        const newExp = formData.experience?.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    // --- Handlers for Skills ---
    // Skills are Record<string, string[] | string>. We'll simplify editing by assuming categories are keys
    const handleSkillCategoryChange = (oldCategory: string, newCategory: string) => {
        if (oldCategory === newCategory) return;
        const skills = { ...formData.technicalSkills };
        const content = skills[oldCategory];
        delete skills[oldCategory];
        skills[newCategory] = content;
        setFormData(prev => ({ ...prev, technicalSkills: skills }));
    };

    const handleSkillContentChange = (category: string, value: string) => {
        // We'll treat the input as comma separated string for easier editing
        const arrayValue = value.split(',').map(s => s.trim());
        setFormData(prev => ({
            ...prev,
            technicalSkills: {
                ...prev.technicalSkills,
                [category]: arrayValue
            }
        }));
    };

    const addSkillCategory = () => {
        setFormData(prev => ({
            ...prev,
            technicalSkills: {
                ...prev.technicalSkills,
                "New Category": []
            }
        }));
    };

    const removeSkillCategory = (category: string) => {
        const skills = { ...formData.technicalSkills };
        delete skills[category];
        setFormData(prev => ({ ...prev, technicalSkills: skills }));
    };

    // --- Handlers for Projects ---
    // Similar pattern to Experience
    const handleProjectChange = (index: number, field: string, value: string) => {
        const newProjects = [...(formData.projects || [])];
        // @ts-ignore
        newProjects[index] = { ...newProjects[index], [field]: value };
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const handleProjectPointChange = (projIndex: number, pointIndex: number, value: string) => {
        const newProjs = [...(formData.projects || [])];
        const newPoints = [...(newProjs[projIndex].description || [])];
        newPoints[pointIndex] = value;
        newProjs[projIndex] = { ...newProjs[projIndex], description: newPoints };
        setFormData(prev => ({ ...prev, projects: newProjs }));
    };

    const addProjectPoint = (projIndex: number) => {
        const newProjs = [...(formData.projects || [])];
        const newPoints = [...(newProjs[projIndex].description || []), ""];
        newProjs[projIndex] = { ...newProjs[projIndex], description: newPoints };
        setFormData(prev => ({ ...prev, projects: newProjs }));
    };

    const removeProjectPoint = (projIndex: number, pointIndex: number) => {
        const newProjs = [...(formData.projects || [])];
        const newPoints = newProjs[projIndex].description?.filter((_, i) => i !== pointIndex);
        newProjs[projIndex] = { ...newProjs[projIndex], description: newPoints };
        setFormData(prev => ({ ...prev, projects: newProjs }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [
                ...(prev.projects || []),
                { title: "New Project", description: [""] }
            ]
        }));
    };

    const removeProject = (index: number) => {
        const newProjs = formData.projects?.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, projects: newProjs }));
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
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1c23] shrink-0">
                        <div className="flex items-center gap-3">
                            <FileText className="text-primary" size={24} />
                            <div>
                                <h2 className="text-white font-bold text-lg">Resume Editor</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
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
                            <div className="p-6">
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="resume sections" variant="scrollable" scrollButtons="auto">
                                        <Tab icon={<User size={16} />} iconPosition="start" label="Personal" />
                                        <Tab icon={<Briefcase size={16} />} iconPosition="start" label="Experience" />
                                        <Tab icon={<Code size={16} />} iconPosition="start" label="Skills" />
                                        <Tab icon={<FolderGit2 size={16} />} iconPosition="start" label="Projects" />
                                        <Tab icon={<GraduationCap size={16} />} iconPosition="start" label="Education" />
                                    </Tabs>
                                </Box>

                                {/* Personal Tab */}
                                <CustomTabPanel value={activeTab} index={0}>
                                    <div className="space-y-4 max-w-3xl mx-auto">
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextField
                                                label="Full Name"
                                                fullWidth
                                                value={formData.header?.fullName || ''}
                                                onChange={(e) => handleHeaderChange('fullName', e.target.value)}
                                            />
                                            <TextField
                                                label="Email"
                                                fullWidth
                                                value={formData.header?.contact?.email || ''}
                                                onChange={(e) => handleContactChange('email', e.target.value)}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={16} /></InputAdornment> }}
                                            />
                                            <TextField
                                                label="Phone"
                                                fullWidth
                                                value={formData.header?.contact?.phone || ''}
                                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={16} /></InputAdornment> }}
                                            />
                                            <TextField
                                                label="Location"
                                                fullWidth
                                                value={formData.header?.contact?.location || ''}
                                                onChange={(e) => handleContactChange('location', e.target.value)}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><MapPin size={16} /></InputAdornment> }}
                                            />
                                        </div>
                                        <TextField
                                            label="Professional Summary"
                                            fullWidth
                                            multiline
                                            rows={6}
                                            value={formData.professionalSummary || ''}
                                            onChange={(e) => setFormData(p => ({ ...p, professionalSummary: e.target.value }))}
                                        />
                                    </div>
                                </CustomTabPanel>

                                {/* Experience Tab */}
                                <CustomTabPanel value={activeTab} index={1}>
                                    <div className="space-y-4 max-w-3xl mx-auto">
                                        <Button startIcon={<Plus size={16} />} onClick={addExperience} fullWidth variant="outlined" sx={{ mb: 2, borderStyle: 'dashed' }}>
                                            Add Experience
                                        </Button>
                                        {formData.experience?.map((exp, index) => (
                                            <Accordion key={index} defaultExpanded={index === 0}>
                                                <AccordionSummary expandIcon={<ChevronDown className="text-gray-400" />}>
                                                    <div className="flex items-center justify-between w-full pr-4">
                                                        <span className="font-medium text-white">{exp.role || 'New Role'}</span>
                                                        <span className="text-sm text-gray-500">{exp.company}</span>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails className="space-y-4 pt-0">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <TextField label="Role" size="small" value={exp.role || ''} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} />
                                                        <TextField label="Company" size="small" value={exp.company || ''} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                                                        <TextField label="Start Date" size="small" value={exp.duration?.start || ''} onChange={(e) => handleExpDurationChange(index, 'start', e.target.value)} />
                                                        <TextField label="End Date" size="small" value={exp.duration?.end || ''} onChange={(e) => handleExpDurationChange(index, 'end', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Responsibilities</label>
                                                        {exp.responsibilitiesAndAchievements?.map((point, pIndex) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <TextField fullWidth size="small" multiline value={point} onChange={(e) => handleExpPointChange(index, pIndex, e.target.value)} />
                                                                <IconButton size="small" onClick={() => removeExpPoint(index, pIndex)} sx={{ color: '#ef4444' }}><Trash2 size={16} /></IconButton>
                                                            </div>
                                                        ))}
                                                        <Button size="small" startIcon={<Plus size={14} />} onClick={() => addExpPoint(index)}>Add Point</Button>
                                                    </div>
                                                    <div className="flex justify-end pt-2">
                                                        <Button size="small" color="error" startIcon={<Trash2 size={16} />} onClick={() => removeExperience(index)}>Delete Role</Button>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </div>
                                </CustomTabPanel>

                                {/* Skills Tab */}
                                <CustomTabPanel value={activeTab} index={2}>
                                    <div className="space-y-4 max-w-3xl mx-auto">
                                        <Button startIcon={<Plus size={16} />} onClick={addSkillCategory} fullWidth variant="outlined" sx={{ mb: 2, borderStyle: 'dashed' }}>
                                            Add Skill Category
                                        </Button>
                                        {formData.technicalSkills && Object.entries(formData.technicalSkills).map(([category, skills], index) => (
                                            <div key={index} className="bg-white/5 p-4 rounded-lg space-y-3 border border-white/10">
                                                <div className="flex justify-between items-center gap-4">
                                                    <TextField
                                                        label="Category Name"
                                                        size="small"
                                                        value={category}
                                                        onChange={(e) => handleSkillCategoryChange(category, e.target.value)}
                                                        sx={{ flex: 1 }}
                                                    />
                                                    <IconButton size="small" color="error" onClick={() => removeSkillCategory(category)}><Trash2 size={16} /></IconButton>
                                                </div>
                                                <TextField
                                                    label="Skills (comma separated)"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    value={Array.isArray(skills) ? skills.join(', ') : skills}
                                                    onChange={(e) => handleSkillContentChange(category, e.target.value)}
                                                    helperText="Example: React, Node.js, TypeScript"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CustomTabPanel>

                                {/* Projects Tab */}
                                <CustomTabPanel value={activeTab} index={3}>
                                    <div className="space-y-4 max-w-3xl mx-auto">
                                        <Button startIcon={<Plus size={16} />} onClick={addProject} fullWidth variant="outlined" sx={{ mb: 2, borderStyle: 'dashed' }}>
                                            Add Project
                                        </Button>
                                        {formData.projects?.map((proj, index) => (
                                            <Accordion key={index} defaultExpanded={index === 0}>
                                                <AccordionSummary expandIcon={<ChevronDown className="text-gray-400" />}>
                                                    <div className="flex items-center justify-between w-full pr-4">
                                                        <span className="font-medium text-white">{proj.title || 'New Project'}</span>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails className="space-y-4 pt-0">
                                                    <TextField label="Project Title" fullWidth size="small" value={proj.title || ''} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />

                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                                                        {proj.description?.map((point, pIndex) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <TextField fullWidth size="small" multiline value={point} onChange={(e) => handleProjectPointChange(index, pIndex, e.target.value)} />
                                                                <IconButton size="small" onClick={() => removeProjectPoint(index, pIndex)} sx={{ color: '#ef4444' }}><Trash2 size={16} /></IconButton>
                                                            </div>
                                                        ))}
                                                        <Button size="small" startIcon={<Plus size={14} />} onClick={() => addProjectPoint(index)}>Add Description Point</Button>
                                                    </div>
                                                    <div className="flex justify-end pt-2">
                                                        <Button size="small" color="error" startIcon={<Trash2 size={16} />} onClick={() => removeProject(index)}>Delete Project</Button>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </div>
                                </CustomTabPanel>

                                {/* Education Tab */}
                                <CustomTabPanel value={activeTab} index={4}>
                                    <div className="space-y-4 max-w-3xl mx-auto bg-white/5 p-6 rounded-lg border border-white/10">
                                        <TextField
                                            label="Degree"
                                            fullWidth
                                            value={formData.education?.degree || ''}
                                            onChange={(e) => setFormData(p => ({ ...p, education: { ...p.education!, degree: e.target.value } }))}
                                        />
                                        <TextField
                                            label="Institution"
                                            fullWidth
                                            value={formData.education?.institution || ''}
                                            onChange={(e) => setFormData(p => ({ ...p, education: { ...p.education!, institution: e.target.value } }))}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextField
                                                label="Start Date"
                                                value={formData.education?.duration?.start || ''}
                                                onChange={(e) => setFormData(p => ({ ...p, education: { ...p.education!, duration: { ...p.education!.duration, start: e.target.value } } }))}
                                            />
                                            <TextField
                                                label="End Date"
                                                value={formData.education?.duration?.end || ''}
                                                onChange={(e) => setFormData(p => ({ ...p, education: { ...p.education!, duration: { ...p.education!.duration, end: e.target.value } } }))}
                                            />
                                        </div>
                                    </div>
                                </CustomTabPanel>
                            </div>
                        </div>

                        {/* Right: Live Preview */}
                        <div className="w-1/2 bg-[#525659] p-8 overflow-hidden flex items-center justify-center">
                            <div className="h-full w-full max-w-[21cm] overflow-y-auto shadow-2xl origin-top bg-white">
                                <ResumeRender data={formData} />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </ThemeProvider>
    );
}

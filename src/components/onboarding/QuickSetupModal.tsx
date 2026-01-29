
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/context/UserSettingsContext';
import { JobProfileService } from '@/services/jobProfileService';
import { useSnackbar } from '@/context/SnackbarContext';
import { Modal, Box, Typography, Button, TextField, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import { CloudUpload, CheckCircle, Key, LockOpen, ArrowRight } from 'lucide-react';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#1e1e2d', // Dark theme background
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    color: 'white',
    outline: 'none'
};

interface QuickSetupModalProps {
    forcefulOpen?: boolean;
    onClose?: () => void;
}

export default function QuickSetupModal({ forcefulOpen = false, onClose }: QuickSetupModalProps) {
    const { settings, updateSettings, isLoading: isSettingsLoading } = useUserSettings();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isOpen, setIsOpen] = useState(false);

    // Sync external forcefulOpen with internal state
    useEffect(() => {
        if (forcefulOpen) {
            setIsOpen(true);
            setActiveStep(0); // If forced open (e.g. from "Create New"), probably want to start at beginning or specific step? 
            // Better behavior: If forced, open it.
        }
    }, [forcefulOpen]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    // ... rest of state ...
    const [activeStep, setActiveStep] = useState(0);
    const [hasProfiles, setHasProfiles] = useState(false);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

    // Resume Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // App Password State
    const [appPassword, setAppPassword] = useState('');
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const profiles = await JobProfileService.getAllProfiles();
                setHasProfiles(profiles.length > 0);

                // Determine initial step
                if (profiles.length === 0) {
                    setActiveStep(0);
                    setIsOpen(true);
                } else if (!settings.appPassword) {
                    setActiveStep(1);
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
            } catch (error) {
                console.error("Failed to check profiles", error);
            } finally {
                setIsLoadingProfiles(false);
            }
        };

        if (!isSettingsLoading) {
            checkStatus();
        }
    }, [isSettingsLoading, settings.appPassword]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            showSnackbar('Uploading and parsing resume...', 'info');

            // 1. Parse
            const profilePayload = await JobProfileService.parseResume(file);

            // 2. Create
            await JobProfileService.createProfile(profilePayload);

            showSnackbar('Profile created successfully!', 'success');
            setHasProfiles(true);
            setActiveStep(1); // Move to next step
        } catch (error) {
            console.error(error);
            showSnackbar('Failed to process resume', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSavePassword = async () => {
        if (!appPassword.trim()) return;

        setIsSavingSettings(true);
        try {
            await updateSettings({ appPassword: appPassword.trim() });
            showSnackbar('App Password saved!', 'success');
            handleClose(); // Done!
        } catch (error) {
            console.error(error);
            showSnackbar('Failed to save password', 'error');
        } finally {
            setIsSavingSettings(false);
        }
    };

    if (!isOpen && !isLoadingProfiles) return null;

    return (
        <Modal
            open={isOpen}
            onClose={() => { /* Prevent closing by clicking outside if strict, or allow close */ }}
            aria-labelledby="setup-modal-title"
        >
            <Box sx={modalStyle}>
                <Typography id="setup-modal-title" variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                    🚀 Let's get you set up
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    <Step completed={hasProfiles}>
                        <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' } }}>
                            Create Profile
                        </StepLabel>
                    </Step>
                    <Step completed={!!settings.appPassword}>
                        <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' } }}>
                            Connect Email
                        </StepLabel>
                    </Step>
                </Stepper>

                {activeStep === 0 && (
                    <div className="flex flex-col items-center text-center space-y-4 py-4">
                        <div className="p-4 bg-purple-500/10 rounded-full">
                            <CloudUpload size={48} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Import your Resume</h3>
                            <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                Upload your PDF resume. We'll extract your skills and experience to build your master profile instantly.
                            </p>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileUpload}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            sx={{
                                bgcolor: '#8b5cf6',
                                '&:hover': { bgcolor: '#7c3aed' },
                                '&:disabled': {
                                    bgcolor: 'rgba(139, 92, 246, 0.5)',
                                    color: 'white'
                                },
                                mt: 2,
                                minWidth: 200
                            }}
                        >
                            {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Resume'}
                        </Button>

                        <button
                            onClick={() => setActiveStep(1)}
                            className="text-xs text-gray-500 hover:text-gray-300 mt-4 underline"
                        >
                            Skip for now (I'll do it manually)
                        </button>
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="flex flex-col space-y-4 py-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <LockOpen size={24} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">App Password</h3>
                                <p className="text-gray-400 text-xs">Needed to send emails via your Gmail</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-lg text-sm text-gray-300 space-y-2 border border-gray-700">
                            <p>1. Go to <a href="https://myaccount.google.com/security" target="_blank" className="text-blue-400 hover:underline">Google Security</a>.</p>
                            <p>2. Enable 2-Step Verification.</p>
                            <p>3. Search for "App Passwords", create one named "JobCopilot".</p>
                            <p>4. Paste the 16-character code below.</p>
                        </div>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={appPassword}
                            onChange={(e) => setAppPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    bgcolor: 'rgba(0,0,0,0.2)',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                }
                            }}
                        />

                        <div className="flex justify-between items-center mt-4 pt-2">
                            <button
                                onClick={handleClose}
                                className="text-sm text-gray-500 hover:text-gray-300"
                            >
                                I'll do this later
                            </button>

                            <Button
                                variant="contained"
                                onClick={handleSavePassword}
                                disabled={isSavingSettings || !appPassword}
                                sx={{
                                    bgcolor: '#10b981',
                                    '&:hover': { bgcolor: '#059669' },
                                    '&:disabled': {
                                        bgcolor: 'rgba(16, 185, 129, 0.5)',
                                        color: 'rgba(255,255,255,0.8)'
                                    }
                                }}
                                endIcon={isSavingSettings ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={16} />}
                            >
                                {isSavingSettings ? 'Saving...' : 'Connect & Finish'}
                            </Button>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
}

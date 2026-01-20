import { motion, AnimatePresence } from 'framer-motion';
import ResumeRender from './ResumeRender';
import GlassCard from '@/components/ui/GlassCard';
import { Loader2, CheckCircle2, FileText, AlertCircle, Download, Edit3, Share2, Printer } from 'lucide-react';
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';

type GenerationStatus = 'IDLE' | 'PROCESSING' | 'GENERATION' | 'SUCCESS' | 'FAILED';

interface ResumePreviewPanelProps {
    status: GenerationStatus;
    score?: number;
    addedKeywords?: string[];
    onEdit?: () => void;
    resumeData?: any;
    onDownload?: () => void;
}

export default function ResumePreviewPanel({ status, score = 0, addedKeywords = [], onEdit, resumeData, onDownload }: ResumePreviewPanelProps) {
    const isSuccess = status === 'SUCCESS';
    const isProcessing = status === 'PROCESSING' || status === 'GENERATION';

    return (
        <GlassCard className="h-full min-h-[600px] flex flex-col relative overflow-hidden bg-dark-800/40">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-md z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Live Preview
                </h3>
                {isSuccess && (
                    <div className="flex items-center gap-1">
                        <Tooltip title="Edit Content">
                            <IconButton onClick={onEdit} size="small" sx={{ color: '#94a3b8' }}>
                                <Edit3 size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={() => window.print()}>
                                <Printer size={18} />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            startIcon={<Download size={16} />}
                            size="small"
                            onClick={onDownload}
                            sx={{
                                bgcolor: '#22c55e',
                                '&:hover': { bgcolor: '#16a34a' },
                                textTransform: 'none',
                                ml: 1,
                                borderRadius: '8px'
                            }}
                        >
                            Download PDF
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-grow p-6 relative flex items-center justify-center bg-dark-950/50">
                <AnimatePresence mode="wait">
                    {/* IDLE STATE */}
                    {status === 'IDLE' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-500 max-w-sm"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <FileText size={40} className="opacity-50" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-300">No Resume Generated Yet</h4>
                            <p className="text-sm mt-2">
                                Select a profile and enter a job description on the left to start tailoring your resume.
                            </p>
                        </motion.div>
                    )}

                    {/* PROCESSING / GENERATION STATE */}
                    {isProcessing && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md"
                        >
                            <div className="space-y-6">
                                <StepItem
                                    active={status === 'PROCESSING'}
                                    completed={status === 'GENERATION'}
                                    label="Analyzing Job Description"
                                    description="Extracting key requirements and skills..."
                                />
                                <StepItem
                                    active={status === 'GENERATION'}
                                    completed={false}
                                    label="Tailoring Content"
                                    description="Rewriting summary and matching keywords..."
                                />
                                <StepItem
                                    active={false}
                                    completed={false}
                                    label="Finalizing PDF"
                                    description="Formatting layout and generating document..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS STATE (PDF PREVIEW) */}
                    {isSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col items-center"
                        >

                            {/* Stats Bar */}
                            <div className="w-full mb-6 grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                                        {score}%
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-200/70 font-medium uppercase tracking-wider">ATS Match Score</p>
                                        <p className="text-sm text-green-100 font-semibold">Excellent Match</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Added Keywords</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {addedKeywords.map((kw, i) => (
                                            <span key={i} className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* A4 Paper Mockup */}
                            <div className="w-[595px] max-w-full aspect-[1/1.414] bg-white text-black shadow-2xl rounded-sm text-[10px] overflow-hidden relative group origin-top scale-[0.8] md:scale-90 lg:scale-[0.85] xl:scale-100 transition-transform overflow-y-auto">
                                <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity flex flex-col justify-end p-4 bg-gradient-to-t from-black/20 to-transparent z-20">
                                </div>
                                {resumeData ? (
                                    <div className="h-full w-full">
                                        <ResumeRender
                                            data={typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <Loader2 className="animate-spin mb-2" />
                                        <p>Loading resume preview...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* FAILURE STATE */}
                    {status === 'FAILED' && (
                        <motion.div
                            key="failed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-red-400"
                        >
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-80" />
                            <h4 className="text-xl font-bold">Generation Failed</h4>
                            <p className="text-sm mt-2 opacity-70">Please check the job description and try again.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}

function StepItem({ active, completed, label, description }: { active: boolean; completed: boolean; label: string; description: string }) {
    return (
        <div className={`flex items-start gap-4 transition-opacity ${active || completed ? 'opacity-100' : 'opacity-40'}`}>
            <div className="relative mt-1">
                {completed ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-900/50">
                        <CheckCircle2 size={18} />
                    </div>
                ) : active ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/50 animate-pulse">
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10" />
                )}

                {/* Connector Line */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/10 last:hidden" />
            </div>
            <div>
                <h5 className={`font-semibold ${completed ? 'text-green-400' : active ? 'text-blue-400' : 'text-gray-400'}`}>
                    {label}
                </h5>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    );
}

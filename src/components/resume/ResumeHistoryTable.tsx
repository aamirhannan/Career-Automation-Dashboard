import GlassCard from '@/components/ui/GlassCard';
import SectionTitle from '@/components/ui/SectionTitle';
import StatusBadge from '@/components/table/StatusBadge';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Download, Eye, FileText, MoreHorizontal } from 'lucide-react';
import { ApplicationStatus } from '@/lib/types';

// Using a local interface for now, or could export from types.ts if we update it
export interface ResumeLog {
    id: string;
    generatedAt: string;
    company: string;
    role: string;
    status: ApplicationStatus;
    matchScore?: number;
}

interface ResumeHistoryTableProps {
    data: ResumeLog[];
    onView?: (log: ResumeLog) => void;
    onDownload?: (log: ResumeLog) => void;
}

export default function ResumeHistoryTable({ data, onView, onDownload }: ResumeHistoryTableProps) {
    return (
        <div className="w-full">
            <SectionTitle
                title="Previously Generated Resumes"
                subtitle="History of your tailored resumes"
            />

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                                <th className="px-6 py-4 font-semibold">Role & Company</th>
                                <th className="px-6 py-4 font-semibold">Date Generated</th>
                                <th className="px-6 py-4 font-semibold">Match Score</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No resumes generated yet. Start by tailoring one above.
                                    </td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{row.role}</p>
                                                    <p className="text-xs text-secondary">{row.company}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {row.generatedAt}
                                        </td>
                                        <td className="px-6 py-4">
                                            {row.matchScore ? (
                                                <span className={`text-sm font-medium ${row.matchScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {row.matchScore}% Match
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Reuse StatusBadge if compatible, or use simple badge */}
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Tooltip title="Preview">
                                                    <IconButton size="small" onClick={() => onView?.(row)} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                                        <Eye size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download PDF">
                                                    <IconButton size="small" onClick={() => onDownload?.(row)} sx={{ color: '#94a3b8', '&:hover': { color: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.1)' } }}>
                                                        <Download size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

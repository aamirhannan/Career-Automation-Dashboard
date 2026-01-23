'use client';

import { LogEntry } from '@/lib/types';
import {
    IconButton,
    Chip,
    Box,
    ThemeProvider,
    createTheme,
    Dialog,
    DialogContent,
    Typography,
    Drawer,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination
} from '@mui/material';
import { X, MoreHorizontal, Coins, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

// Create a dark theme instance
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0d0e12', // dark-900
            paper: '#1a1c23',   // dark-800
        },
        primary: {
            main: '#7c3aed',
        },
        text: {
            primary: '#fff',
            secondary: '#94a3b8',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#cbd5e1',
                    padding: '16px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                },
                head: {
                    color: '#94a3b8',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(26, 28, 35, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    color: '#94a3b8',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                },
                selectIcon: {
                    color: '#94a3b8',
                },
                actions: {
                    color: '#94a3b8',
                }
            }
        }
    },
});

const getStatusChipColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'SUCCESS': return 'success';
        case 'FAILED': return 'error';
        case 'WARNING': return 'warning';
        case 'PENDING': return 'default';
        default: return 'default';
    }
};

interface LogsTableProps {
    logs: LogEntry[];
}

export default function LogsTable({ logs }: LogsTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (title: string, content: string) => {
        setModalTitle(title);
        setModalContent(content);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenDrawer = (log: LogEntry) => {
        setSelectedLog(log);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedLog(null);
    };

    // Calculate displayed rows
    const displayedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 'calc(100vh - 200px)', borderRadius: '1rem' }}>
                    <Table stickyHeader aria-label="logs table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company / Role</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="center">Request</TableCell>
                                <TableCell align="center">Response</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No logs found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedLogs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        hover
                                        sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04) !important' } }}
                                    >
                                        <TableCell>
                                            <div className="flex flex-col justify-center leading-tight">
                                                <span className="font-medium text-white text-sm">{log.company || 'Unknown Company'}</span>
                                                <span className="text-xs text-[#94a3b8]">{log.role || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-400">
                                                {log.createdAt ? format(new Date(log.createdAt), 'dd/MM/yyyy, h:mm a') : 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.status}
                                                size="small"
                                                color={getStatusChipColor(log.status)}
                                                variant="outlined"
                                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>{log.type}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenModal('Request Payload', JSON.stringify(log.requestPayload, null, 2))}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <Eye size={18} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenModal('Response Payload', JSON.stringify(log.responsePayload, null, 2))}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <Eye size={18} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={() => handleOpenDrawer(log)}
                                                sx={{
                                                    color: '#94a3b8',
                                                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                                                }}
                                            >
                                                <MoreHorizontal size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[25, 50, 75, 100]}
                    component="div"
                    count={logs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        color: '#94a3b8',
                        '.MuiTablePagination-select': {
                            color: '#94a3b8',
                        },
                        '.MuiTablePagination-selectIcon': {
                            color: '#94a3b8',
                        },
                        '.MuiTablePagination-actions': {
                            color: '#94a3b8',
                        }
                    }}
                />
            </Box>

            {/* Content Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1a1c23',
                        color: 'white',
                        backgroundImage: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Typography variant="h6" component="h2" className="font-semibold text-white">
                        {modalTitle}
                    </Typography>
                    <IconButton onClick={handleCloseModal} sx={{ color: 'gray', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <X size={20} />
                    </IconButton>
                </div>
                <DialogContent sx={{ p: 4 }}>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto font-mono text-sm">
                        {modalContent}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Token Usage Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: {
                        width: 450, // Increased width for better JSON viewing
                        bgcolor: '#0d0e12', // dark-900
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        color: 'white'
                    }
                }}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Coins size={20} className="text-primary" />
                            Log Details
                        </h3>
                        <IconButton onClick={handleCloseDrawer} sx={{ color: 'gray' }}>
                            <X size={20} />
                        </IconButton>
                    </div>

                    {selectedLog && (
                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-2">
                                <div className="text-sm text-gray-400">ID</div>
                                <div className="font-mono text-sm bg-black/30 p-2 rounded border border-white/5 overflow-hidden text-ellipsis">
                                    {selectedLog.id}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm text-gray-400">Timestamps</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800/50 p-3 rounded border border-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Created</div>
                                        <div className="text-sm">{selectedLog.createdAt ? format(new Date(selectedLog.createdAt), 'MMM d, h:mm:ss a') : '-'}</div>
                                    </div>
                                    <div className="bg-dark-800/50 p-3 rounded border border-white/5">
                                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                                        <div className="text-sm">{selectedLog.durationMs ? `${selectedLog.durationMs}ms` : '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5 space-y-4">
                                <div className="text-gray-400 text-sm mb-2 font-mono">Full JSON Payload:</div>
                                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap bg-black/30 p-4 rounded overflow-x-auto border border-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {JSON.stringify(selectedLog, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </ThemeProvider>
    );
}

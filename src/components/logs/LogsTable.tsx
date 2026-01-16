'use client';

import { LogEntry, LogStatus } from '@/lib/types';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import {
    IconButton,
    Chip,
    Box,
    ThemeProvider,
    createTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { X, ExternalLink, MoreHorizontal, Coins, Database, Cpu, Wallet } from 'lucide-react'; // Using ExternalLink as 'Explore' icon replacement or just keep View logic
import { format } from 'date-fns';
import { useState } from 'react';

// Create a dark theme instance for the DataGrid
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
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    backgroundColor: 'rgba(26, 28, 35, 0.6)', // dark-800 with opacity
                    backdropFilter: 'blur(12px)',
                    borderRadius: '1rem', // rounded-2xl
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // glass shadow
                    '& .MuiDataGrid-cell': {
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#cbd5e1', // text-slate-300
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        color: '#94a3b8', // text-gray-400
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                    },
                },
            },
        },
    },
});

const getStatusChipColor = (status: LogStatus) => {
    switch (status) {
        case LogStatus.Success: return 'success';
        case LogStatus.Failed: return 'error';
        case LogStatus.Warning: return 'warning';
        default: return 'default';
    }
};

interface LogsTableProps {
    logs: LogEntry[];
}

export default function LogsTable({ logs }: LogsTableProps) {
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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

    const columns: GridColDef[] = [
        {
            field: 'company',
            headerName: 'Company / Role',
            width: 250,
            renderCell: (params: GridRenderCellParams) => (
                <div className="flex flex-col justify-center h-full leading-tight">
                    <span className="font-medium text-white text-sm">{params.row.company}</span>
                    <span className="text-xs text-[#94a3b8]">{params.row.role}</span>
                </div>
            )
        },
        {
            field: 'timestamp',
            headerName: 'Date',
            width: 180,
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-gray-400">
                    {format(new Date(params.value), 'dd/MM/yyyy, h:mm a')}
                </span>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={getStatusChipColor(params.value as LogStatus)}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
            )
        },
        { field: 'type', headerName: 'Type', width: 150 },
        {
            field: 'jobDescription',
            headerName: 'Job Description',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div
                    className="cursor-pointer text-primary hover:text-primary/80 truncate w-full flex items-center gap-1 group"
                    onClick={() => handleOpenModal('Job Description', params.value)}
                >
                    <span className="truncate">{params.value}</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )
        },
        {
            field: 'subject',
            headerName: 'Subject',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div
                    className="cursor-pointer text-primary hover:text-primary/80 truncate w-full flex items-center gap-2 group"
                    onClick={() => handleOpenModal('Subject', params.value)}
                >
                    <span className="truncate">{params.value || 'N/A'}</span>
                    {params.value && params.value !== 'N/A' && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
            )
        },
        {
            field: 'coverLetter',
            headerName: 'Cover Letter',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div
                    className="cursor-pointer text-primary hover:text-primary/80 truncate w-full flex items-center gap-2 group"
                    onClick={() => handleOpenModal('Cover Letter', params.value)}
                >
                    <span className="truncate">{params.value || 'N/A'}</span>
                    {params.value && params.value !== 'N/A' && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
            )
        },
        {
            field: 'tokenUsage',
            headerName: 'Token Usage',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <div className="flex items-center justify-center w-full">
                    <IconButton
                        onClick={() => handleOpenDrawer(params.row)}
                        sx={{
                            color: '#94a3b8',
                            '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        <MoreHorizontal size={18} />
                    </IconButton>
                </div>
            )
        }
    ];

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ width: '100%', height: 'calc(100vh - 200px)' }}>
                <DataGrid
                    rows={logs}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    pageSizeOptions={[25, 50, 75, 100]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    sx={{
                        '& .MuiTablePagination-root': {
                            color: '#94a3b8',
                        },
                        '& .MuiToolbar-root': {
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
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
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
                        width: 350,
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
                            Usage Details
                        </h3>
                        <IconButton onClick={handleCloseDrawer} sx={{ color: 'gray' }}>
                            <X size={20} />
                        </IconButton>
                    </div>

                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Database size={16} />
                                        <span className="text-sm">Input Tokens</span>
                                    </div>
                                    <span className="font-mono font-medium">{selectedLog.inputTokens.toLocaleString()}</span>
                                </div>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Cpu size={16} />
                                        <span className="text-sm">Output Tokens</span>
                                    </div>
                                    <span className="font-mono font-medium">{selectedLog.outputTokens.toLocaleString()}</span>
                                </div>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Coins size={16} />
                                        <span className="text-sm font-semibold">Total Tokens</span>
                                    </div>
                                    <span className="font-mono font-bold text-primary text-lg">{selectedLog.totalTokens.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <Wallet size={20} />
                                    <span className="font-semibold">Total Cost</span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-white tracking-tight">
                                    ${selectedLog.cost.toFixed(6)}
                                </div>
                                <p className="text-xs text-primary/60 mt-2">Estimated cost for this run</p>
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </ThemeProvider>
    );
}

'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@mui/material';

export default function RetryButton() {
    return (
        <Button
            variant="text"
            size="small"
            startIcon={<RefreshCw size={14} />}
            sx={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                }
            }}
        >
            Retry
        </Button>
    );
}

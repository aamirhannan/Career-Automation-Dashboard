'use client';

import { Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-[#0d0e12] z-0"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                    Ready to land your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        dream role?
                    </span>
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Join thousands of smart candidates who are automating the busywork and focusing on the interviews.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        href="/dashboard"
                        component={Link}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={20} />}
                        sx={{
                            bgcolor: 'white',
                            color: '#7c3aed',
                            '&:hover': { bgcolor: '#f3f4f6' },
                            fontSize: '1.2rem',
                            py: 2,
                            px: 6,
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    >
                        Get Started for Free
                    </Button>
                </div>
                <p className="mt-6 text-sm text-gray-500">No credit card required • Cancel anytime</p>
            </div>
        </section>
    );
}

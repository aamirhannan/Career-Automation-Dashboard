'use client';

import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-sm font-medium text-gray-300">New: AI Founder Outreach</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Your Intelligent <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                    Job Hunt Copilot
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Stop sending generic applications into the void. tailored resumes, personalized cover emails, and smart outreach—all in one dashboard.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                                <Button
                                    href="/dashboard"
                                    component={Link}
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowRight size={18} />}
                                    sx={{
                                        bgcolor: '#7c3aed',
                                        '&:hover': { bgcolor: '#6d28d9' },
                                        fontSize: '1.1rem',
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: '9999px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Start Hunting Smarter
                                </Button>
                                <Button
                                    href="#how-it-works"
                                    component={Link}
                                    variant="outlined"
                                    size="large"
                                    startIcon={<Play size={18} fill="currentColor" />}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                                        fontSize: '1.1rem',
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: '9999px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Watch Demo
                                </Button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-purple-500" />
                                    <span>Human-in-the-loop</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-purple-500" />
                                    <span>ATS Optimized</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-purple-500" />
                                    <span>Tailored Content</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Mockup */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative [perspective:1000px]"
                        >
                            {/* Glass Card Container */}
                            <div className="relative bg-[#1a1c23]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                                {/* Window Controls */}
                                <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>

                                {/* Mock UI Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                                            <div className="h-3 w-48 bg-white/5 rounded"></div>
                                        </div>
                                        <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                            AI Active
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Mock Job Card */}
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">G</div>
                                            <div className="flex-1">
                                                <div className="h-4 w-24 bg-white/10 rounded mb-1"></div>
                                                <div className="h-3 w-16 bg-white/5 rounded"></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">98% Match</div>
                                            </div>
                                        </div>

                                        {/* Mock Email Draft */}
                                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                            <div className="flex gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                                <div className="text-xs text-purple-300 font-medium">Generating Contextual Outreach...</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-white/10 rounded"></div>
                                                <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                                                <div className="h-3 w-4/6 bg-white/10 rounded"></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-2">
                                            <div className="h-8 w-24 bg-white/5 rounded border border-white/10"></div>
                                            <div className="h-8 w-24 bg-purple-600 rounded shadow-lg shadow-purple-600/20"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rotate-12 blur-2xl opacity-40 -z-10"></div>
                            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-30 -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

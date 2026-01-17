'use client';

import { Button, Divider } from '@mui/material';

import Link from 'next/link';
import { CheckCircle2, Mail, FileText, Send, Zap, ArrowRight, LayoutDashboard as DashboardIcon, Briefcase } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full bg-dark-900 text-white overflow-hidden">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 z-10 bg-dark-900">
                {/* Header / Logo */}
                <div>
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-default to-secondary-default flex items-center justify-center">
                            <Send size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold font-sans tracking-tight">AutoApply</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">
                        Welcome to AutoApply
                    </h1>
                    <p className="text-gray-400 mb-10 text-lg">
                        Sign in or create an account instantly with Google.
                    </p>

                    {/* Google Login Button */}
                    <button
                        className="w-full h-14 bg-white hover:bg-gray-50 text-dark-900 font-medium text-lg rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mb-8"
                        onClick={() => console.log('Google Login Clicked')}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-dark-900 px-2 text-gray-500">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Disabled / Visual-only inputs to match design but indicate disabled */}
                    <div className="space-y-4 opacity-50 relative group">
                        <div className="absolute inset-0 z-20 cursor-not-allowed flex items-center justify-center backdrop-blur-[1px] rounded-xl">
                            <span className="bg-dark-800 text-xs px-2 py-1 rounded text-gray-400 border border-white/10">Currently disabled</span>
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                disabled
                                className="w-full h-12 bg-dark-800 border border-white/10 rounded-lg px-4 text-gray-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                disabled
                                className="w-full h-12 bg-dark-800 border border-white/10 rounded-lg px-4 text-gray-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border border-white/20 rounded bg-transparent" />
                                <span>Remember me</span>
                            </div>
                            <span>Forgot Password?</span>
                        </div>
                        <button disabled className="w-full h-12 bg-primary-default opacity-50 text-white font-medium rounded-lg mt-4 cursor-not-allowed">
                            Log in
                        </button>
                    </div>


                </div>

                {/* Footer */}
                <div className="text-xs text-gray-600 flex justify-between">
                    <span>© 2026 AutoApply Inc.</span>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-gray-400">Privacy Policy</span>
                        <span className="cursor-pointer hover:text-gray-400">Terms of Service</span>
                    </div>
                </div>
            </div>

            {/* Right Section - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-primary-default items-center justify-center overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-default/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                {/* Central Glass Card UI Mockup */}
                <div className="relative z-10 w-[450px] aspect-[4/3] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                    {/* Window Controls */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="flex-1 flex gap-4">
                        {/* Sidebar Mock */}
                        <div className="w-16 bg-white/5 rounded-lg flex flex-col items-center py-4 gap-3">
                            <div className="w-8 h-8 rounded bg-white/20" />
                            <div className="w-6 h-6 rounded-full bg-white/10 mt-2" />
                            <div className="w-6 h-6 rounded-full bg-white/10" />
                            <div className="w-6 h-6 rounded-full bg-white/10" />
                        </div>
                        {/* Main Content Mock */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Header */}
                            <div className="h-10 bg-white/5 rounded-lg w-full flex items-center px-4">
                                <div className="w-24 h-3 bg-white/10 rounded-full" />
                            </div>
                            {/* Cards */}
                            <div className="flex gap-3">
                                <div className="flex-1 h-24 bg-white/5 rounded-lg p-3">
                                    <div className="w-8 h-8 rounded bg-success/20 mb-2 flex items-center justify-center">
                                        <CheckCircle2 size={16} className="text-success" />
                                    </div>
                                    <div className="w-12 h-2 bg-white/10 rounded-full mb-1" />
                                    <div className="w-8 h-2 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex-1 h-24 bg-white/5 rounded-lg p-3">
                                    <div className="w-8 h-8 rounded bg-secondary-default/20 mb-2 flex items-center justify-center">
                                        <Mail size={16} className="text-secondary-default" />
                                    </div>
                                    <div className="w-12 h-2 bg-white/10 rounded-full mb-1" />
                                    <div className="w-8 h-2 bg-white/10 rounded-full" />
                                </div>
                            </div>
                            {/* List items */}
                            <div className="flex-1 bg-white/5 rounded-lg p-3 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10" />
                                    <div className="w-20 h-2 bg-white/20 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10" />
                                    <div className="w-16 h-2 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Connection Icons */}
                <div className="absolute top-1/4 left-10 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                    <Briefcase size={32} className="text-white" />
                </div>
                <div className="absolute bottom-1/3 right-12 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl animate-bounce delay-700 duration-[4000ms]">
                    <FileText size={32} className="text-white" />
                </div>
                <div className="absolute bottom-10 left-20 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Zap size={24} className="text-green-400" />
                        </div>
                        <div>
                            <div className="text-xs text-white/60">Success Rate</div>
                            <div className="text-lg font-bold text-white">92%</div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="absolute bottom-12 w-full text-center z-20 px-12">
                    <h2 className="text-3xl font-bold text-white mb-2">Connect with every application.</h2>
                    <p className="text-white/70 text-lg">Everything you need in an easily customizable dashboard.</p>

                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}

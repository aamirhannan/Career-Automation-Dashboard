'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Menu, X } from 'lucide-react';
import { Button } from '@mui/material';

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Smooth transition for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0d0e12]/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all">
                        <Layers className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        CareerOS
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="#how-it-works">How It Works</NavLink>
                    <NavLink href="#features">Features</NavLink>
                    <NavLink href="#pricing">Pricing</NavLink>
                    <NavLink href="#faq">FAQ</NavLink>
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Button
                        href="/dashboard"
                        variant="contained"
                        sx={{
                            bgcolor: '#7c3aed',
                            '&:hover': { bgcolor: '#6d28d9' },
                            textTransform: 'none',
                            borderRadius: '9999px',
                            px: 3,
                            boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
                        }}
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-[#1a1c23] border-b border-white/10 overflow-hidden"
                >
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <MobileNavLink onClick={() => setMobileMenuOpen(false)} href="#how-it-works">How It Works</MobileNavLink>
                        <MobileNavLink onClick={() => setMobileMenuOpen(false)} href="#features">Features</MobileNavLink>
                        <MobileNavLink onClick={() => setMobileMenuOpen(false)} href="#pricing">Pricing</MobileNavLink>
                        <Link href="/login" className="text-gray-400 py-2">Log in</Link>
                        <Button
                            href="/dashboard"
                            fullWidth
                            variant="contained"
                            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
                        >
                            Get Started
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
            {children}
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-base font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
        >
            {children}
        </Link>
    );
}

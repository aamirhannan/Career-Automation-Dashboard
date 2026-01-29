'use client';

import { Check } from 'lucide-react';
import { Button } from '@mui/material';

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-[#0d0e12] relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Start for free, upgrade when you're ready to scale your search.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Job Seeker</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Perfect for casual browsing.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <ListItem>5 Tailored Resumes / mo</ListItem>
                            <ListItem>10 AI Email Drafts</ListItem>
                            <ListItem>1 Job Profile</ListItem>
                            <ListItem>Basic Dashboard</ListItem>
                        </ul>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', py: 1.5 }}
                            href="/dashboard"
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-2xl bg-purple-900/10 border border-purple-500/50 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-purple-900/20">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-2xl"></div>
                        <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">RECOMMENDED</div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Hired Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$19</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">For serious job hunters.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <ListItem highlighted>Unlimited Resumes</ListItem>
                            <ListItem highlighted>Unlimited Email Drafts</ListItem>
                            <ListItem>5 Job Profiles</ListItem>
                            <ListItem>Advanced Analytics</ListItem>
                            <ListItem>Priority Support</ListItem>
                        </ul>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, py: 1.5, fontWeight: 'bold' }}
                            href="/dashboard"
                        >
                            Start Pro Trial
                        </Button>
                    </div>

                    {/* Agency Plan */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Agency</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">For career coaches & agencies.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <ListItem>Manage 20+ Clients</ListItem>
                            <ListItem>White-label Reports</ListItem>
                            <ListItem>API Access</ListItem>
                            <ListItem>Dedicated Account Manager</ListItem>
                        </ul>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', py: 1.5 }}
                            href="/contact"
                        >
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ListItem({ children, highlighted = false }: { children: React.ReactNode; highlighted?: boolean }) {
    return (
        <li className="flex items-center gap-3">
            <div className={`p-1 rounded-full ${highlighted ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-400'}`}>
                <Check size={12} strokeWidth={3} />
            </div>
            <span className={highlighted ? 'text-white font-medium' : 'text-gray-400'}>{children}</span>
        </li>
    );
}

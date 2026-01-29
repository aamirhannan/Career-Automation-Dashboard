'use client';

import Link from 'next/link';
import { Layers, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-[#050608] border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/dashboard" className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Layers className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                CareerOS
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Your intelligent copilot for the modern job search. Stop applying into the void.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={Twitter} />
                            <SocialIcon icon={Github} />
                            <SocialIcon icon={Linkedin} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">Resume Templates</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">Cover Letter Guide</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">Career Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="mailto:support@careeros.com" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                <Mail size={14} /> Contact
                            </Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <p>© 2026 CareerOS Inc. All rights reserved.</p>
                    <p>Designed with 💜 for job seekers everywhere.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
    return (
        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Icon size={16} />
        </a>
    );
}

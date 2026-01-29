'use client';

import { motion } from 'framer-motion';
import { User, Sparkles, Send } from 'lucide-react';

const steps = [
    {
        id: "01",
        title: "Build Your Profile",
        desc: "Upload your master resume or enter your details. Create multiple profiles for different target roles.",
        icon: User
    },
    {
        id: "02",
        title: "Paste the JD",
        desc: "Found a job you like? Just paste the description. Our AI analyzes it for keywords and requirements.",
        icon: Sparkles
    },
    {
        id: "03",
        title: "Review & Apply",
        desc: "Get a tailored resume and personalized email draft in seconds. Review, approve, and send.",
        icon: Send
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-[#1a1c23]/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-gray-400">Three simple steps to automate your outreach.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent -z-10 border-t border-dashed border-white/20"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-[#0d0e12] border-4 border-[#1a1c23] flex items-center justify-center mb-6 shadow-xl relative z-10 group">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <step.icon size={32} className="text-purple-400" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0d0e12]">
                                    {step.id}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

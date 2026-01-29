'use client';

import { motion } from 'framer-motion';
import { FileText, Send, Users, Activity, Sliders, Check } from 'lucide-react';

const features = [
    {
        icon: FileText,
        title: "Adaptive Resume Tailoring",
        description: "Don't send the same resume twice. Our AI rewrites specific bullet points to match the job description keywords.",
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        icon: Send,
        title: "Smart Email Agent",
        description: "Drafts hyper-personalized cover emails directly from the JD. You review, edit, and hit approve.",
        color: "text-green-400",
        bg: "bg-green-500/10"
    },
    {
        icon: Users,
        title: "Founder Outreach",
        description: "Skip the HR queue. We analyze LinkedIn profiles to craft pitches that get read by decision makers.",
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    },
    {
        icon: Sliders,
        title: "Multi-Profile Management",
        description: "Applying for PM and Engineering roles? Switch contexts instantly with dedicated profiles.",
        color: "text-orange-400",
        bg: "bg-orange-500/10"
    },
    {
        icon: Activity,
        title: "Live Activity Dashboard",
        description: "Track email velocity, role distribution, and response rates. Treat your job hunt like a sales funnel.",
        color: "text-pink-400",
        bg: "bg-pink-500/10"
    },
    {
        icon: Check,
        title: "Human-in-the-Loop",
        description: "The AI is the engine, you are the pilot. Nothing gets sent without your explicit approval.",
        color: "text-teal-400",
        bg: "bg-teal-500/10"
    }
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-[#0d0e12] relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Superpowers for your <br />
                        <span className="text-purple-500">Job Search</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Everything you need to manage a high-volume, high-quality job search without burning out.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

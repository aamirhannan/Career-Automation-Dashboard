'use client';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: "Will employers know I used AI?",
        a: "No. Our AI generates content based on *your* specific profile and professional history. It reads like it was written by you, because it is essentially a polished version of your own data. Plus, you have full control to edit anything before sending."
    },
    {
        q: "Does this actually send emails for me?",
        a: "It drafts them for you. We believe in a 'Human-in-the-Loop' approach. You'll see every email in your dashboard queue. You review it, maybe tweak a sentence, and then click 'Approve' to send. We never send without your permission."
    },
    {
        q: "Can I use multiple resumes?",
        a: "Yes! You can create different 'Profiles' (e.g., one for Frontend Dev, one for UX Design). When applying, just choose the profile you want to base your application on."
    },
    {
        q: "Is my data secure?",
        a: "Absolutely. We assume you're applying to stealth startups or big tech, so privacy is paramount. We do not sell your data. Your profile information is used solely to generate your applications."
    },
    {
        q: "What if I get no interviews?",
        a: "While we can't guarantee a job (no tool can), our data shows that tailored applications get 3x more responses than generic 'easy apply' blasts. We also provide analytics so you can see if your strategy is working."
    }
];

export default function FaqSection() {
    return (
        <section id="faq" className="py-24 bg-[#1a1c23]/30">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <Accordion
                            key={idx}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.03)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                '&:before': { display: 'none' }, // Remove default divider
                                '&.Mui-expanded': { margin: '0 0 16px 0' } // Fix jump
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ChevronDown className="text-gray-400" />}
                                aria-controls={`panel${idx}-content`}
                                id={`panel${idx}-header`}
                            >
                                <Typography fontWeight="bold">{faq.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="gray" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                                    {faq.a}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
}

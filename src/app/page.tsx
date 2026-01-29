'use client';

import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import FaqSection from '@/components/landing/FaqSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0d0e12] text-white selection:bg-purple-500/30 selection:text-white">
            <LandingNavbar />
            <HeroSection />
            <HowItWorks />
            <FeaturesSection />
            <PricingSection />
            <FaqSection />
            <CTASection />
            <LandingFooter />
        </main>
    );
}

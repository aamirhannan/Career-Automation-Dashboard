import React from 'react';

interface NoDataFallbackProps {
    message?: string;
    children?: React.ReactNode;
    className?: string; // Allow adding arbitrary classes
}

export default function NoDataFallback({ message = 'No data available', children, className = '' }: NoDataFallbackProps) {
    return (
        <div className={`relative w-full h-full min-h-[16rem] overflow-hidden rounded-lg border border-white/5 bg-white/5 flex items-center justify-center ${className}`}>
            {/* Background Content with reduced opacity */}
            <div className="absolute inset-0 opacity-20 pointer-events-none filter blur-[1px]">
                {children}
            </div>

            {/* Foreground Message */}
            <div className="relative z-10 flex flex-col items-center justify-center p-4">
                <p className="text-gray-400 font-medium mb-3">{message}</p>
                {/** Optional CTA could go here, for now it's just the message as requested "No Data for now" */}
                <div className="px-4 py-2 rounded-full bg-white/10 text-xs text-gray-300 pointer-events-none">
                    NO DATA FOR NOW
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChangelogEntry } from '@/lib/changelog-parser';
import { cn } from '@/lib/utils';

interface ChangelogCardProps {
    entry: ChangelogEntry;
    isActive: boolean;
}

export const ChangelogCard: React.FC<ChangelogCardProps> = ({ entry, isActive }) => {
    return (
        <div
            className={cn(
                "relative w-full h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-75",
                isActive ? "shadow-[0_0_50px_-12px_rgba(0,100,255,0.5)] border-blue-500/30" : "shadow-xl"
            )}
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/40 to-transparent z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">v{entry.version}</h2>
                        <p className="text-blue-400 font-medium">{entry.title}</p>
                    </div>
                    <span className="text-sm text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {entry.date}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto custom-scrollbar pt-24 pb-8 px-6 space-y-6">
                {entry.categories.map((category, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold border-b border-white/10 pb-1">
                            {category.title}
                        </h3>
                        <ul className="space-y-3">
                            {category.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="text-gray-300 text-sm leading-relaxed">
                                    {item.title && (
                                        <strong className="text-white block mb-0.5">{item.title}</strong>
                                    )}
                                    <span className="opacity-90">{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Footer Gradient for scroll fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
    );
};

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
                "relative w-full h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-75 flex flex-col",
                isActive ? "shadow-[0_0_50px_-12px_rgba(0,100,255,0.5)] border-blue-500/30" : "shadow-xl"
            )}
        >
            {/* Header */}
            <div className="flex-shrink-0 p-6 bg-gradient-to-b from-white/5 to-transparent z-10 border-b border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">v{entry.version}</h2>
                        <p className="text-blue-400 font-medium">{entry.title}</p>
                    </div>
                    <span className="text-sm text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                        {entry.date}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
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
        </div>
    );
};

'use client';

import { BADGE_DEFINITIONS } from '@/lib/badges';
import { Trophy, Award, Flame, Zap, Footprints, GraduationCap, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BadgeListProps {
    earnedBadges: {
        badge: {
            slug: string;
        }
    }[];
}

export default function BadgeList({ earnedBadges }: BadgeListProps) {
    const earnedSlugs = new Set(earnedBadges.map(ub => ub.badge.slug));

    const getIcon = (iconName: string, size: number) => {
        switch (iconName) {
            case 'Footprints': return <Footprints size={size} />;
            case 'Zap': return <Zap size={size} />;
            case 'Flame': return <Flame size={size} />;
            case 'GraduationCap': return <GraduationCap size={size} />;
            default: return <Award size={size} />;
        }
    };

    const getTierColor = (tier?: string) => {
        switch (tier) {
            case 'Gold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Silver': return 'text-slate-300 bg-slate-300/10 border-slate-300/20';
            case 'Bronze': return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
            default: return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
        }
    };

    const handleBadgeClick = (def: typeof BADGE_DEFINITIONS[0], isEarned: boolean) => {
        if (!isEarned) {
            toast(
                <div className="flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-2">
                        <Lock size={14} /> Locked Badge: {def.name}
                    </span>
                    <span className="text-sm text-gray-300">{def.description}</span>
                    <span className="text-xs text-gray-400 mt-1">How to unlock: {def.condition}</span>
                </div>
            );
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {BADGE_DEFINITIONS.map((def) => {
                const isEarned = earnedSlugs.has(def.slug);
                const tierColor = getTierColor(def.tier);

                return (
                    <div
                        key={def.slug}
                        onClick={() => handleBadgeClick(def, isEarned)}
                        className={`
                            flex flex-col items-center text-center group cursor-pointer transition-all duration-300
                            ${isEarned ? 'opacity-100' : 'opacity-30 hover:opacity-50 grayscale'}
                        `}
                    >
                        <div className={`
                            w-14 h-14 rounded-full flex items-center justify-center mb-2 border-2 transition-transform duration-300 group-hover:scale-110
                            ${isEarned ? tierColor : 'bg-white/5 border-white/10 text-gray-500'}
                        `}>
                            {getIcon(def.icon, 24)}
                        </div>
                        <span className={`text-xs font-medium transition-colors ${isEarned ? 'text-gray-200' : 'text-gray-600'}`}>
                            {def.name}
                        </span>
                        {isEarned && (
                            <span className="text-[10px] text-gray-500 mt-0.5 font-mono uppercase tracking-wider">
                                {def.tier}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

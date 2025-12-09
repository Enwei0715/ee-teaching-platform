'use client';

import { useLessonAppearance } from '@/hooks/useLessonAppearance';
import { themeStyles } from '@/lib/theme-config';
import { useEffect, useState } from 'react';

export function SkeletonPlayer() {
    // We use the appearance hook to match the user's theme.
    // However, on first load (hydration), we might not have localStorage access instantly or it causes mismatch.
    // 'useLessonAppearance' handles mounting check.
    const { appearance, mounted } = useLessonAppearance();

    // Default to 'default' theme if not mounted to prevent hydration mismatch
    const theme = mounted ? appearance.theme : 'default';
    const style = themeStyles[theme];

    // Helper for bone class
    // We need to override the global .skeleton-bone if we want specific colors
    // or just use inline styles / utility classes
    const boneClass = `rounded animate-pulse ${style.skeletonBase}`;

    return (
        <div className={`flex flex-col lg:flex-row h-[calc(100vh-64px)] animate-pulse transition-colors duration-300 ${style.wrapper}`}>
            {/* Sidebar Skeleton */}
            <div className={`w-full lg:w-80 border-r p-4 space-y-6 hidden lg:block ${style.border} ${style.skeletonPanel}`}>
                <div className={`h-8 w-3/4 ${boneClass}`}></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className={`h-4 w-full ${boneClass}`}></div>
                            <div className="pl-4 space-y-2">
                                <div className={`h-3 w-5/6 ${boneClass}`}></div>
                                <div className={`h-3 w-4/6 ${boneClass}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Video Player Placeholder */}
                <div className={`aspect-video w-full relative ${style.skeletonPanel} border-b ${style.border}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-full ${boneClass}`}></div>
                    </div>
                </div>

                {/* Content Below Video */}
                <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div className={`h-8 w-1/2 ${boneClass}`}></div>
                        <div className={`h-10 w-32 ${boneClass}`}></div>
                    </div>
                    <div className={`h-4 w-full ${boneClass}`}></div>
                    <div className={`h-4 w-5/6 ${boneClass}`}></div>
                    <div className={`h-4 w-4/5 ${boneClass}`}></div>
                </div>
            </div>
        </div>
    );
}

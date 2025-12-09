'use client';

import { themeStyles } from '@/lib/theme-config';
import { useState, useEffect } from 'react';

export function SkeletonPlayer() {
    // We use the appearance hook to match the user's theme.
    // However, on first load (hydration), we might not have localStorage access instantly or it causes mismatch.
    // 'useLessonAppearance' handles mounting check.
    // Optimized theme initialization for Skeleton to avoid flash
    // We try to read from localStorage immediately if on client
    const [theme, setTheme] = useState<any>('default');

    useEffect(() => {
        // Safe client-side check
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('ee-master-lesson-appearance');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed.theme) {
                        setTheme(parsed.theme);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    }, []);

    // We use a state-based approach but initialize it lazily if possible?
    // Actually, to avoid hydration mismatch, usually we must render 'default' first.
    // BUT since this is a skeleton, maybe we can suppress hydration warning and force client-side match?
    // React 18+ streaming might still be tricky.
    // Let's try to use the `appearance` from hook but IF it's not mounted, try to cheat?
    // The previous implementation used `mounted ? ... : 'default'` which GUARANTEES a flash.

    // BETTER APPROACH:
    // If we are navigating client-side (SPA), the component mounts on the client.
    // In that case, window is available and we can read it synchronously.
    // If we are lazy initializing useState:
    // useState(() => { if (typeof window !== 'undefined') ... })
    // This will work for client-side navigation!
    // For SSR (hard refresh), it will be 'default'. Then hydration might mismatch?
    // We can use `suppressHydrationWarning` on the wrapper.

    const [activeTheme, setActiveTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('ee-master-lesson-appearance');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return parsed.theme || 'default';
                }
            } catch (e) { }
        }
        return 'default';
    });

    const style = themeStyles[activeTheme as keyof typeof themeStyles] || themeStyles.default;

    // Helper for bone class
    // We need to override the global .skeleton-bone if we want specific colors
    // or just use inline styles / utility classes
    const boneClass = `rounded animate-pulse ${style.skeletonBase}`;

    return (
        <div
            suppressHydrationWarning
            className={`flex flex-col lg:flex-row h-[calc(100vh-64px)] animate-pulse transition-colors duration-300 ${style.wrapper}`}
        >
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

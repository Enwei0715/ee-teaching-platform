import { useState, useEffect } from 'react';

export type LessonTheme = 'default' | 'light' | 'sepia' | 'navy';
export type LessonFontSize = 'small' | 'medium' | 'large';

export interface LessonAppearance {
    theme: LessonTheme;
    fontSize: LessonFontSize;
    showEffects: boolean; // If true, SHOWS background effects. Default is false (clean).
}

const DEFAULT_APPEARANCE: LessonAppearance = {
    theme: 'default', // Default is still Dark theme, but maybe user wants it to match system? For now keep 'default' (Dark)
    fontSize: 'medium',
    showEffects: false, // Default: NO effects
};

const STORAGE_KEY = 'ee-master-lesson-appearance';

export function useLessonAppearance() {
    // Initialize with default, then hydrate from localStorage
    const [appearance, setAppearance] = useState<LessonAppearance>(DEFAULT_APPEARANCE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                // Migration: If 'focusMode' exists from previous version, map it?
                // Old: focusMode=true (hidden) -> New: showEffects=false
                // Old: focusMode=false (shown) -> New: showEffects=true
                // But since we just deployed, maybe just reset or handle gracefully.
                const parsed = JSON.parse(stored);

                // Handle breaking change from 'focusMode' to 'showEffects' if needed, or just overwrite
                if ('focusMode' in parsed) {
                    // If user had focusMode: true (hidden), we want showEffects: false
                    // If user had focusMode: false (shown), we want showEffects: true
                    parsed.showEffects = !parsed.focusMode;
                    delete parsed.focusMode;
                }

                setAppearance({ ...DEFAULT_APPEARANCE, ...parsed });
            } catch (e) {
                console.error('Failed to parse lesson appearance settings', e);
            }
        }
    }, []);

    const updateAppearance = (updates: Partial<LessonAppearance>) => {
        setAppearance(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
            return newSettings;
        });
    };

    return {
        appearance,
        updateAppearance,
        mounted,
    };
}

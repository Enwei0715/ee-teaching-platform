import { useState, useEffect } from 'react';

export type LessonTheme = 'default' | 'light' | 'sepia' | 'navy';
export type LessonFontSize = 'small' | 'medium' | 'large';

export interface LessonAppearance {
    theme: LessonTheme;
    fontSize: LessonFontSize;
    focusMode: boolean; // If true, hides background effects like grid pattern
}

const DEFAULT_APPEARANCE: LessonAppearance = {
    theme: 'default',
    fontSize: 'medium',
    focusMode: false,
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
                setAppearance({ ...DEFAULT_APPEARANCE, ...JSON.parse(stored) });
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

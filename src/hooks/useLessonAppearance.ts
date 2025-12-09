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
const EVENT_KEY = 'ee-master-appearance-changed';

export function useLessonAppearance() {
    // Initialize with default, then hydrate from localStorage
    const [appearance, setAppearance] = useState<LessonAppearance>(DEFAULT_APPEARANCE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loadFromStorage = () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Migration logic
                    if ('focusMode' in parsed) {
                        parsed.showEffects = !parsed.focusMode;
                        delete parsed.focusMode;
                    }
                    setAppearance({ ...DEFAULT_APPEARANCE, ...parsed });
                } catch (e) {
                    console.error('Failed to parse lesson appearance settings', e);
                }
            }
        };

        // Initial load
        loadFromStorage();

        // Listen for changes from other components (e.g. Navbar <-> LessonContent)
        const handleStorageChange = () => {
            loadFromStorage();
        };

        window.addEventListener(EVENT_KEY, handleStorageChange);
        // Also listen to 'storage' event for cross-tab sync if needed (optional but good)
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener(EVENT_KEY, handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateAppearance = (updates: Partial<LessonAppearance>) => {
        setAppearance(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
            // Dispatch event to notify other hooks
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event(EVENT_KEY));
            }
            return newSettings;
        });
    };

    return {
        appearance,
        updateAppearance,
        mounted,
    };
}

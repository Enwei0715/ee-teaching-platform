'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
    userId?: string;
    lessonTitle: string;
}

export default function ResumeLearningTracker({ userId, lessonTitle }: Props) {
    const pathname = usePathname();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Restore scroll position on mount if requested
    useEffect(() => {
        // Check if we should resume (e.g. from URL param or just always check if this is the last saved)
        // For simplicity, we can check if the current URL matches the saved URL for this user
        if (!userId) return;

        const key = `resume_learning_${userId}`;
        const savedData = localStorage.getItem(key);

        if (savedData) {
            try {
                const { url, scrollY } = JSON.parse(savedData);
                // If we are on the same page as saved, restore scroll
                if (url === pathname && window.location.search.includes('resume=true')) {
                    // Small delay to ensure content is rendered
                    setTimeout(() => {
                        window.scrollTo({
                            top: scrollY,
                            behavior: 'smooth'
                        });
                        // Remove the query param to avoid re-scrolling on refresh? 
                        // Actually keeping it is fine, or we can replaceState.
                        window.history.replaceState({}, '', pathname);
                    }, 500);
                }
            } catch (e) {
                console.error("Failed to parse resume data", e);
            }
        }
    }, [userId, pathname]);

    // Save scroll position on scroll
    useEffect(() => {
        if (!userId) return;

        const handleScroll = () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                const data = {
                    url: pathname,
                    scrollY: window.scrollY,
                    timestamp: Date.now(),
                    title: lessonTitle
                };
                localStorage.setItem(`resume_learning_${userId}`, JSON.stringify(data));
            }, 1000); // Debounce 1s
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [userId, pathname, lessonTitle]);

    return null;
}

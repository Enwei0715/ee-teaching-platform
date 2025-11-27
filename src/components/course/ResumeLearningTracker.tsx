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
        if (!userId) return;

        const key = `resume_learning_${userId}`;
        const savedData = localStorage.getItem(key);

        if (savedData) {
            try {
                const { url, scrollY, elementId } = JSON.parse(savedData);
                // If we are on the same page as saved, restore scroll
                if (url === pathname && window.location.search.includes('resume=true')) {
                    // Small delay to ensure content is rendered
                    setTimeout(() => {
                        if (elementId) {
                            const element = document.getElementById(elementId);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Highlight effect? Maybe later.
                            } else {
                                // Fallback to scrollY if element not found
                                window.scrollTo({ top: scrollY, behavior: 'smooth' });
                            }
                        } else {
                            window.scrollTo({ top: scrollY, behavior: 'smooth' });
                        }
                        // Remove the query param to clean URL
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
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
                // Find the closest element to the top of the viewport with an ID
                let activeElementId = null;
                const elements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], p[id], div[id]');

                // Find element closest to top (but not below viewport top by too much)
                // We want the element the user is currently looking at.
                // Usually that's the one near the top of the screen.
                let minDistance = Infinity;

                elements.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    // We care about elements that are near the top (e.g. within top 20% or just slightly above/below)
                    // Let's take the one closest to y=0 (absolute distance)
                    const distance = Math.abs(rect.top - 100); // Offset a bit for navbar
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeElementId = el.id;
                    }
                });

                const data = {
                    url: pathname,
                    scrollY: window.scrollY,
                    elementId: activeElementId,
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

'use client';

import { useEffect, useState, useRef } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    onActiveChange?: (activeId: string) => void;
}

export default function TableOfContents({ onActiveChange }: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Extract headings from DOM
    useEffect(() => {
        const extractHeadings = () => {
            const content = document.getElementById('lesson-content');
            if (!content) return;

            const headings = content.querySelectorAll('h2, h3');
            const tocItems: TocItem[] = [];

            headings.forEach((heading) => {
                const id = heading.getAttribute('id');
                const text = heading.textContent?.trim();
                const level = parseInt(heading.tagName.charAt(1)) as 2 | 3;

                if (id && text) {
                    tocItems.push({ id, text, level });
                }
            });

            setItems(tocItems);
        };

        // Wait for content to render
        const timer = setTimeout(extractHeadings, 500);
        return () => clearTimeout(timer);
    }, []);

    // Setup IntersectionObserver for active section tracking
    useEffect(() => {
        if (items.length === 0) return;

        const observerOptions: IntersectionObserverInit = {
            rootMargin: '-80px 0px -80% 0px', // Top 20% of viewport
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        setActiveId(id);
                    }
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all heading elements
        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element && observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [items]);

    // Debounced callback when active section changes
    useEffect(() => {
        if (!activeId || !onActiveChange) return;

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer (2.5s debounce)
        debounceTimerRef.current = setTimeout(() => {
            onActiveChange(activeId);
        }, 2500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [activeId, onActiveChange]);

    // Scroll to section on click
    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // Navbar height offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveId(id);
        }
    };

    // Don't render if no headings found
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="glass-panel rounded-xl p-4 shadow-xl">
                <h3 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
                    Contents
                </h3>
                <nav className="space-y-1">
                    {items.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                className={`
                                    w-full text-left text-sm py-1.5 px-3 rounded-lg
                                    transition-all duration-200
                                    ${item.level === 3 ? 'pl-6' : 'pl-3'}
                                    ${isActive
                                        ? 'text-blue-400 border-l-2 border-blue-400 bg-blue-500/10 font-medium'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
                                    }
                                `}
                                title={item.text}
                            >
                                <span className="line-clamp-2">{item.text}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

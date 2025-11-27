'use client';

import { useEffect, useState, useRef } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    courseId?: string;
    lessonId?: string;
    initialLastElementId?: string | null;
}

export default function TableOfContents({ courseId, lessonId, initialLastElementId }: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastSavedIdRef = useRef<string | null>(null); // Track last saved position

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

    // Auto-scroll to saved position on mount
    useEffect(() => {
        if (!initialLastElementId || items.length === 0) return;

        // Small delay to ensure content is fully rendered
        const timer = setTimeout(() => {
            const element = document.getElementById(initialLastElementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveId(initialLastElementId); // Set as active
                console.log(`Restored position: ${initialLastElementId}`);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [initialLastElementId, items]);

    // Save active section to database (INSTANT - no debounce)
    // IntersectionObserver already provides filtered signal, so save immediately
    useEffect(() => {
        // Guard clauses
        if (!activeId || !courseId || !lessonId) return;
        if (activeId === lastSavedIdRef.current) return; // Prevent duplicate saves

        // Immediate save - activeId change IS the trigger
        (async () => {
            try {
                await fetch(`/api/courses/${courseId}/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lessonId,
                        lastElementId: activeId
                    })
                });
                console.log(`💾 Instantly saved position: ${activeId}`);
                lastSavedIdRef.current = activeId; // Update ref after successful save
            } catch (error) {
                console.error('Failed to save position:', error);
                // Fail silently - don't break UI on network errors
            }
        })();
    }, [activeId, courseId, lessonId]);

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
        // Right Edge Hover Trigger Zone
        <div className="
            fixed right-0 top-24 bottom-24 w-12
            hover:w-auto
            z-40 flex items-start justify-end
            group transition-all duration-300
        ">
            {/* TOC Panel - Hidden by default, slides in on hover */}
            <div className="
                w-64 max-h-[70vh] overflow-y-auto custom-scrollbar
                glass-panel rounded-l-xl border-r-0 shadow-2xl
                transform translate-x-full opacity-0
                group-hover:translate-x-0 group-hover:opacity-100
                transition-all duration-300 ease-out
                p-4
            ">
                <h3 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
                    On this page
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

'use client';

import { useEffect, useState, useRef } from 'react';
import { List, X } from 'lucide-react';

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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
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
        <>
            {/* Mobile Trigger Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-32 right-4 z-50 p-3 glass-heavy rounded-full text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                title="Table of Contents"
            >
                <List size={20} />
            </button>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[95] glass-heavy rounded-t-2xl max-h-[70vh] overflow-y-auto p-6 border-t border-white/10 animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Table of Contents</h3>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>

                        <nav className="space-y-2">
                            {items.map((item) => {
                                const isActive = activeId === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            handleClick(item.id);
                                            setIsMobileOpen(false); // Close drawer on click
                                        }}
                                        className={`
                                            w-full text-left text-sm py-2.5 px-4 rounded-lg
                                            transition-all duration-200
                                            ${item.level === 3 ? 'pl-8' : 'pl-4'}
                                            ${isActive
                                                ? 'text-blue-400 border-l-2 border-blue-400 bg-blue-500/10 font-medium'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                                            }
                                        `}
                                    >
                                        {item.text}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}

            {/* Desktop Hover Trigger Zone */}
            <div className="
                hidden lg:block
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
        </>
    );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { List, X } from 'lucide-react';
import { generateSectionId } from '@/lib/content-utils';

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    courseId?: string;
    lessonId?: string;
    initialLastElementId?: string | null;
    onActiveHeadingChange?: (id: string) => void;
    hideMobileTrigger?: boolean;
    theme?: string;
}

export default function TableOfContents({ courseId, lessonId, initialLastElementId, onActiveHeadingChange, hideMobileTrigger = false, theme = 'default' }: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastSavedIdRef = useRef<string | null>(null); // Track last saved position
    const isRestoredRef = useRef(false); // Prevent saving during initial load

    // ... (logic for observer/extraction remains same, just styling changes below)

    // Extract headings from DOM
    useEffect(() => {
        const extractHeadings = () => {
            const content = document.getElementById('lesson-content');
            if (!content) return;

            const headings = content.querySelectorAll('h2, h3');
            const tocItems: TocItem[] = [];

            headings.forEach((heading) => {
                const text = heading.textContent?.trim();
                // Use standardized ID generation to match Backend
                const id = text ? generateSectionId(text) : heading.getAttribute('id');
                const level = parseInt(heading.tagName.charAt(1)) as 2 | 3;

                if (id && text) {
                    tocItems.push({ id, text, level });
                }
            });

            console.log("📑 [TOC] Extracted items:", tocItems);
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
                    console.log("👁️ [TOC] Intersecting:", id);
                    if (id) {
                        setActiveId(id);
                        // Call prop callback instead of dispatching event
                        if (onActiveHeadingChange) {
                            onActiveHeadingChange(id);
                        }
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

    // Auto-scroll to saved position on mount & unlock saving after delay
    useEffect(() => {
        // Scroll to saved position if it exists
        if (initialLastElementId && items.length > 0) {
            const timer = setTimeout(() => {
                const element = document.getElementById(initialLastElementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(initialLastElementId);
                    console.log(`📍 Restored position: ${initialLastElementId}`);
                }
            }, 600);
        }

        // CRITICAL: Unlock saving after 1500ms to prevent overwriting on load
        // This gives time for scroll animation and user orientation
        const unlockTimer = setTimeout(() => {
            isRestoredRef.current = true;
            console.log('🔓 Resume Learning: Save enabled');
        }, 1500);

        return () => {
            if (initialLastElementId && items.length > 0) {
                // Clear scroll timer if component unmounts early
            }
            clearTimeout(unlockTimer);
        };
    }, [initialLastElementId, items]);

    // Save active section to database with debounce and initialization guard
    useEffect(() => {
        // Guard clauses
        if (!activeId || !courseId || !lessonId) return;
        if (activeId === lastSavedIdRef.current) return; // Prevent duplicate saves

        // Debounce save by 1000ms to prevent rapid-fire updates
        const saveTimer = setTimeout(() => {
            // CRITICAL GUARD: Only save if initialization is complete
            if (!isRestoredRef.current) {
                console.log(`⏸️  Blocked save (still loading): ${activeId}`);
                return;
            }

            // Save to database
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
                    console.log(`💾 Saved position: ${activeId}`);
                    lastSavedIdRef.current = activeId; // Update ref after successful save
                } catch (error) {
                    console.error('Failed to save position:', error);
                }
            })();
        }, 1000); // 1 second debounce

        return () => clearTimeout(saveTimer);
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

    // Event listener for external open trigger
    useEffect(() => {
        const handleOpen = () => setIsMobileOpen(true);
        window.addEventListener('open-toc', handleOpen);
        return () => window.removeEventListener('open-toc', handleOpen);
    }, []);

    // Don't render if no headings found
    if (items.length === 0) {
        return null;
    }

    const getPanelStyles = () => {
        switch (theme) {
            case 'light':
                return 'bg-white shadow-xl border-l border-gray-200 text-gray-800';
            case 'sepia':
                return 'bg-[#f4ecd8] shadow-xl border-l border-[#e6decf] text-[#433422]';
            case 'navy':
                return 'bg-[#111b27] shadow-xl border-l border-blue-900/30 text-blue-100';
            default:
                return 'glass-panel rounded-l-xl border-r-0 shadow-2xl';
        }
    };

    const getFloatingButtonStyles = () => {
        switch (theme) {
            case 'light':
                return 'bg-white text-gray-900 shadow-xl border border-gray-200 hover:bg-gray-50';
            case 'sepia':
                return 'bg-[#f4ecd8] text-[#433422] shadow-xl border border-[#d3cbb7] hover:bg-[#e6decf]';
            case 'navy':
                return 'bg-[#1e293b] text-blue-100 shadow-xl border border-blue-900/30 hover:bg-[#334155]';
            default:
                return 'glass-heavy text-white shadow-lg hover:shadow-xl';
        }
    };

    const getLinkStyles = (isActive: boolean) => {
        if (theme === 'light' || theme === 'sepia') {
            return isActive
                ? 'text-blue-600 border-l-2 border-blue-500 bg-blue-500/10 font-medium'
                : 'text-current opacity-60 hover:opacity-100 hover:bg-black/5 border-l-2 border-transparent';
        }
        return isActive
            ? 'text-blue-400 border-l-2 border-blue-400 bg-blue-500/10 font-medium'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent';
    };

    return (
        <>
            {/* Mobile Trigger Button - Only show if not hidden */}
            {!hideMobileTrigger && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className={`lg:hidden fixed bottom-32 right-4 z-50 p-3 rounded-full transition-all transform hover:scale-105 ${getFloatingButtonStyles()}`}
                    title="Table of Contents"
                >
                    <List size={20} />
                </button>
            )}

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[95] rounded-t-2xl max-h-[70vh] overflow-y-auto p-6 border-t animate-in slide-in-from-bottom-10 ${getPanelStyles()}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-bold ${theme === 'light' || theme === 'sepia' ? 'text-current' : 'text-white'}`}>Table of Contents</h3>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className={theme === 'light' || theme === 'sepia' ? 'text-current' : 'text-white'} />
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
                                            ${getLinkStyles(isActive)}
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
                <div className={`
                    w-64 max-h-[70vh] overflow-y-auto custom-scrollbar
                    transform translate-x-full opacity-0
                    group-hover:translate-x-0 group-hover:opacity-100
                    transition-all duration-300 ease-out
                    p-4
                    ${getPanelStyles()}
                `}>
                    <h3 className={`text-sm font-bold mb-3 uppercase tracking-wide ${theme === 'light' || theme === 'sepia' ? 'text-current opacity-70' : 'text-white/90'}`}>
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
                                        ${getLinkStyles(isActive)}
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

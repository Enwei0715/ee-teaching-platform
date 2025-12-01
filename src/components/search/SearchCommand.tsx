'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, X, FileText, BookOpen, Wrench, Loader2, MessageSquare, FolderKanban, LayoutDashboard, User } from 'lucide-react';
import { SearchResult } from '@/lib/search';
import Fuse from 'fuse.js';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchCommand({ isOpen, onClose }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [allData, setAllData] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession();

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            // Small timeout to ensure DOM is ready and transition started
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // System Actions
    const systemActions = useMemo(() => {
        const actions: SearchResult[] = [
            {
                id: 'sys-dashboard',
                title: 'Go to Dashboard',
                description: 'View your learning progress',
                type: 'navigation',
                url: '/dashboard',
                tags: ['dashboard', 'home', 'progress']
            }
        ];

        if (session?.user?.id) {
            actions.push({
                id: 'sys-profile',
                title: 'View Profile',
                description: 'Check your public profile',
                type: 'navigation',
                url: `/u/${session.user.id}`,
                tags: ['profile', 'portfolio', 'me']
            });
        }

        // Add Theme Toggle placeholder
        actions.push({
            id: 'sys-theme',
            title: 'Toggle Theme',
            description: 'Switch between light and dark mode',
            type: 'system',
            action: () => {
                alert('Theme toggle coming soon!');
            },
            url: '#', // Dummy URL to satisfy type definition
            tags: ['theme', 'dark', 'light', 'mode']
        });

        return actions;
    }, [session]);

    // Fetch Search Data
    useEffect(() => {
        if (isOpen && allData.length === 0) {
            setLoading(true);
            fetch('/api/search') // Fixed API endpoint
                .then(res => res.json())
                .then(data => {
                    setAllData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load search index", err);
                    setLoading(false);
                });
        }
    }, [isOpen, allData.length]);

    // Initialize Fuse instance
    const fuse = useMemo(() => {
        const combinedData = [...systemActions, ...allData];
        return new Fuse(combinedData, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'description', weight: 0.3 },
                { name: 'url', weight: 0.5 },
                { name: 'tags', weight: 0.4 }
            ],
            threshold: 0.4,
            distance: 100,
            includeScore: true,
            ignoreLocation: true, // Search anywhere in the string
        });
    }, [allData, systemActions]);

    // Filter results logic
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();

        // 1. Path Navigation Mode (Scoped Search)
        if (query.startsWith('/')) {
            // Determine the "parent" path to scope the search
            // e.g. "/courses/basic" -> Parent: "/courses/" -> Search: "basic"
            // e.g. "/courses/" -> Parent: "/" -> Search: "courses" (or show all roots)

            const lastSlashIndex = query.lastIndexOf('/');
            const parentPath = query.substring(0, lastSlashIndex + 1); // e.g. "/courses/"
            const searchTerm = query.substring(lastSlashIndex + 1); // e.g. "basic"

            // Find items that are direct children of the parentPath
            // OR items that are deeper but match the search term well?
            // Let's stick to hierarchy: Show children of parentPath that match searchTerm.

            let scopedItems = allData.filter(item => {
                // Check if item belongs to this parent path
                // item.url must start with parentPath
                if (!item.url.startsWith(parentPath)) return false;

                // Calculate relative depth
                // parentPath: /courses/ (depth 2 parts: "", "courses") - wait, split('/') gives ['', 'courses', '']
                // item.url: /courses/react (depth 3 parts: ['', 'courses', 'react'])

                const parentDepth = parentPath.split('/').filter(Boolean).length;
                const itemDepth = item.url.split('/').filter(Boolean).length;

                // We want direct children (depth + 1)
                // Exception: Sections (#) are treated as children of the lesson
                const isSection = item.type === 'section';

                if (isSection) {
                    // If we are in a lesson path, show sections
                    // Lesson URL: /courses/slug/lesson-slug
                    // Section URL: /courses/slug/lesson-slug#section
                    return item.url.startsWith(parentPath) && item.url !== parentPath;
                }

                return itemDepth === parentDepth + 1;
            });

            // If we are at root "/", show root navigation items
            if (parentPath === '/') {
                const rootPaths: SearchResult[] = [
                    { id: 'nav-courses', title: 'Courses', description: 'Browse all courses', type: 'navigation', url: '/courses', tags: ['courses'] },
                    { id: 'nav-dashboard', title: 'Dashboard', description: 'Go to Dashboard', type: 'navigation', url: '/dashboard', tags: ['dashboard'] },
                    { id: 'nav-projects', title: 'Projects', description: 'View Projects', type: 'navigation', url: '/projects', tags: ['projects'] },
                    { id: 'nav-blog', title: 'Blog', description: 'Read Blog Posts', type: 'navigation', url: '/blog', tags: ['blog'] },
                ];
                if (session?.user?.id) {
                    rootPaths.push({
                        id: 'nav-profile',
                        title: 'My Profile',
                        description: 'View Profile',
                        type: 'navigation',
                        url: `/u/${session.user.id}`,
                        tags: ['profile']
                    });
                }
                scopedItems = [...rootPaths, ...scopedItems];
            }

            // Fuzzy search within the scoped items using the searchTerm
            if (searchTerm) {
                const scopedFuse = new Fuse(scopedItems, {
                    keys: ['title', 'url', 'tags'],
                    threshold: 0.4
                });
                const fuzzyResults = scopedFuse.search(searchTerm).map(r => r.item);

                // Also include items that strictly start with the query URL (for exact path typing)
                const exactPrefixMatches = scopedItems.filter(item =>
                    item.url.toLowerCase().startsWith(lowerQuery) &&
                    !fuzzyResults.includes(item)
                );

                setResults([...fuzzyResults, ...exactPrefixMatches]);
            } else {
                // If no search term (just typed "/courses/"), show all children
                setResults(scopedItems);
            }
            return;
        }

        // 2. Global Search (Default)
        // If not starting with '/', search everything
        const searchResults = fuse.search(query);
        setResults(searchResults.map(result => result.item).slice(0, 20));

    }, [query, fuse, allData, session]);

    // Handle navigation
    const handleSelect = (result: SearchResult) => {
        if (result.type === 'system' && (result as any).action) {
            (result as any).action();
        } else {
            router.push(result.url);
        }
        onClose();
        setQuery('');
    };

    // Handle Tab Autocomplete
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent focus change

            if (results.length > 0) {
                const topResult = results[0];
                // If it's a path navigation item, fill the query with its URL
                if (query.startsWith('/')) {
                    // If it's a container (Course), add slash to help user go deeper
                    const isContainer = topResult.type === 'course' && !topResult.url.includes('#');
                    const newQuery = topResult.url;
                    setQuery(newQuery + (isContainer ? '/' : ''));
                } else {
                    // For normal search, maybe just fill the title? Or do nothing.
                }
            }
        }

        if (e.key === 'Enter' && results.length > 0) {
            handleSelect(results[0]);
        }
    };

    // Group results by type
    const groupedResults = useMemo(() => {
        const groups: { [key: string]: SearchResult[] } = {};
        results.forEach(result => {
            const type = result.type;
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(result);
        });
        return groups;
    }, [results]);

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'course': return 'Courses & Lessons';
            case 'section': return 'Sections';
            case 'blog': return 'Blog Posts';
            case 'project': return 'Projects';
            case 'system': return 'System';
            case 'navigation': return 'Navigation';
            default: return 'Other';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course': return <BookOpen size={18} />;
            case 'section': return <FolderKanban size={18} />;
            case 'blog': return <FileText size={18} />;
            case 'project': return <Wrench size={18} />;
            case 'system': return <Wrench size={18} />;
            case 'navigation': return <LayoutDashboard size={18} />;
            default: return <Search size={18} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg glass-heavy border border-border-primary rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="flex items-center px-4 py-3 border-b border-border-primary flex-shrink-0">
                    <Search className="w-5 h-5 text-text-secondary mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type '/' to navigate or search..."
                        className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {loading ? (
                        <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />
                    ) : (
                        <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {query === '' && (
                        <div className="p-2">
                            <h4 className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Suggestions</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {systemActions.map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleSelect({ ...action, url: action.url || '#', tags: [] } as SearchResult)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary text-sm w-full text-left group"
                                    >
                                        <div className="text-text-secondary group-hover:text-accent-primary transition-colors">
                                            {action.icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium">{action.title}</span>
                                            <span className="ml-2 text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">{action.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query !== '' && results.length === 0 && !loading && (
                        <div className="p-8 text-center text-text-secondary text-sm">
                            No results found for "{query}"
                        </div>
                    )}

                    {Object.entries(groupedResults).map(([type, items]) => (
                        <div key={type} className="mb-2">
                            <h4 className="px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider bg-white/5 backdrop-blur-sm sticky top-0 z-10">
                                {getTypeLabel(type)}
                            </h4>
                            <div className="mt-1">
                                {items.map((result, index) => (
                                    <button
                                        key={`${type}-${index}`}
                                        onClick={() => handleSelect(result)}
                                        className="w-full flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
                                    >
                                        <div className="mr-3 text-text-secondary group-hover:text-accent-primary transition-colors">
                                            {getTypeIcon(result.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-text-primary font-medium group-hover:text-accent-primary transition-colors truncate">
                                                {result.title}
                                            </h4>
                                            {result.description && (
                                                <p className="text-text-secondary text-xs truncate opacity-70">
                                                    {result.description}
                                                </p>
                                            )}
                                        </div>
                                        {result.type === 'system' && (
                                            <kbd className="hidden group-hover:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-text-secondary">
                                                Enter
                                            </kbd>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-4 py-2 glass-ghost border-t border-border-primary text-[10px] text-text-secondary flex justify-between flex-shrink-0">
                    <div className="flex gap-3">
                        <span><kbd className="font-sans bg-bg-primary px-1 rounded border border-border-primary">↑↓</kbd> to navigate</span>
                        <span><kbd className="font-sans bg-bg-primary px-1 rounded border border-border-primary">↵</kbd> to select</span>
                        <span><kbd className="font-sans bg-bg-primary px-1 rounded border border-border-primary">Tab</kbd> to autocomplete</span>
                    </div>
                    <span><kbd className="font-sans bg-bg-primary px-1 rounded border border-border-primary">ESC</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}

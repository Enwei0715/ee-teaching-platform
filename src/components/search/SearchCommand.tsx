'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, BookOpen, Wrench, Loader2, MessageSquare, FolderKanban } from 'lucide-react';
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

    // Initialize Fuse instance
    const fuse = useMemo(() => {
        return new Fuse(allData, {
            keys: ['title', 'description', 'tags'],
            threshold: 0.4, // Allow for some typos (0.0 is exact, 1.0 is match anything)
            distance: 100,
            includeScore: true,
        });
    }, [allData]);

    // Fetch index on mount (or when first opened)
    useEffect(() => {
        if (isOpen && allData.length === 0) {
            setLoading(true);
            fetch('/api/search')
                .then(res => res.json())
                .then(data => {
                    setAllData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch search index', err);
                    setLoading(false);
                });
        }
    }, [isOpen, allData.length]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Filter results using Fuse.js
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fuseResults = fuse.search(query);
        // Take top 10 results
        setResults(fuseResults.slice(0, 10).map(r => r.item));
    }, [query, fuse]);

    // Handle navigation
    const handleSelect = (url: string) => {
        router.push(url);
        onClose();
        setQuery('');
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
            case 'course': return 'Courses';
            case 'blog': return 'Blog Posts';
            case 'project': return 'Projects';
            default: return 'Other';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course': return <BookOpen size={18} />;
            case 'blog': return <FileText size={18} />;
            case 'project': return <Wrench size={18} />;
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
            <div className="relative w-full max-w-lg glass-heavy border border-border-primary rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 py-3 border-b border-border-primary">
                    <Search className="w-5 h-5 text-text-secondary mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search courses, blogs, projects..."
                        className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading ? (
                        <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />
                    ) : (
                        <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {query === '' && (
                        <div className="p-4">
                            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Quick Links</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => handleSelect('/courses')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary text-sm">
                                    <BookOpen size={16} className="text-accent-primary" />
                                    Courses
                                </button>
                                <button onClick={() => handleSelect('/projects')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary text-sm">
                                    <FolderKanban size={16} className="text-accent-primary" />
                                    Projects
                                </button>
                                <button onClick={() => handleSelect('/blog')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary text-sm">
                                    <FileText size={16} className="text-accent-primary" />
                                    Blog
                                </button>
                                <button onClick={() => handleSelect('/forum')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary text-sm">
                                    <MessageSquare size={16} className="text-accent-primary" />
                                    Forum
                                </button>
                            </div>
                        </div>
                    )}

                    {query !== '' && results.length === 0 && !loading && (
                        <div className="p-4 text-center text-text-secondary text-sm">
                            No results found for "{query}"
                        </div>
                    )}

                    {Object.entries(groupedResults).map(([type, items]) => (
                        <div key={type} className="mb-2">
                            <h4 className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider glass-ghost">
                                {getTypeLabel(type)}
                            </h4>
                            {items.map((result, index) => (
                                <button
                                    key={`${type}-${index}`}
                                    onClick={() => handleSelect(result.url)}
                                    className="w-full flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                >
                                    <div className="mt-1 mr-3 text-text-secondary group-hover:text-accent-primary">
                                        {getTypeIcon(result.type)}
                                    </div>
                                    <div>
                                        <h4 className="text-text-primary font-medium group-hover:text-accent-primary transition-colors">
                                            {result.title}
                                        </h4>
                                        <p className="text-text-secondary text-xs line-clamp-1">
                                            {result.description}
                                        </p>
                                        {result.tags && (
                                            <div className="flex gap-2 mt-1">
                                                {result.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-primary border border-border-primary text-text-secondary">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="px-4 py-2 glass-ghost border-t border-border-primary text-[10px] text-text-secondary flex justify-between">
                    <span>Press <kbd className="font-sans bg-bg-primary px-1 rounded border border-border-primary">ESC</kbd> to close</span>
                    <span>EE Master Search</span>
                </div>
            </div>
        </div>
    );
}

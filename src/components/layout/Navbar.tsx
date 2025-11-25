'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, LogOut, Bot, PenTool } from 'lucide-react';
import SearchCommand from '@/components/search/SearchCommand';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { data: session } = useSession();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut to open search
    // Listen for global hotkey events
    useEffect(() => {
        const handleOpenSearch = () => setIsSearchOpen(true);
        const handleCloseModals = () => {
            setIsSearchOpen(false);
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
        };

        window.addEventListener('open-search', handleOpenSearch);
        window.addEventListener('close-modals', handleCloseModals);

        return () => {
            window.removeEventListener('open-search', handleOpenSearch);
            window.removeEventListener('close-modals', handleCloseModals);
        };
    }, []);



    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Click outside handler for user menu and mobile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isEngineer =
        session?.user?.occupation?.toLowerCase().includes('engineer') ||
        session?.user?.occupation?.toLowerCase().includes('engineering') ||
        session?.user?.major?.toLowerCase().includes('engineer') ||
        session?.user?.major?.toLowerCase().includes('engineering');

    return (
        <>
            <nav className="bg-bg-secondary border-b border-border-primary sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-accent-primary/10 rounded-lg relative w-12 h-12 flex items-center justify-center">
                                    <Image
                                        src="/icon_without_text.png"
                                        alt="EE Master Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <span className="text-text-primary font-bold text-xl tracking-tight whitespace-nowrap">EE Master</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <Link href="/courses" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Courses
                                </Link>
                                <Link href="/projects" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Projects
                                </Link>
                                <Link href="/blog" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Blog
                                </Link>
                                <Link href="/forum" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Forum
                                </Link>
                                {session && (
                                    <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="relative group"
                            >
                                <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-full px-4 py-1.5 text-sm text-text-secondary hover:border-accent-primary transition-colors w-64">
                                    <Search size={14} />
                                    <span className="flex-1 text-left">Search...</span>
                                    <kbd className="hidden lg:inline-block font-sans text-[10px] bg-bg-primary border border-border-primary rounded px-1">Ctrl K</kbd>
                                </div>
                            </button>

                            {session ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors focus:outline-none"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center">
                                            <User size={16} className="text-accent-primary" />
                                        </div>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-primary rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                                            <div className="px-4 py-2 border-b border-border-primary">
                                                <p className="text-sm font-medium text-text-primary truncate">{session.user?.name}</p>
                                                <p className="text-xs text-text-secondary truncate">{session.user?.email}</p>
                                            </div>

                                            {session.user?.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-bg-tertiary hover:text-indigo-700 font-medium"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            {(isEngineer || session.user?.role === 'ADMIN') && (
                                                <Link
                                                    href="/engineer/blog/new"
                                                    className="block px-4 py-2 text-sm text-green-600 hover:bg-bg-tertiary hover:text-green-700 font-medium flex items-center gap-2"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <PenTool size={14} />
                                                    Create Blog Post
                                                </Link>
                                            )}

                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Learning
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    signOut();
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-bg-tertiary hover:text-red-600 flex items-center gap-2"
                                            >
                                                <LogOut size={14} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/auth/signin" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-text-secondary hover:text-text-primary"
                            >
                                <Search size={20} />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus:outline-none"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-bg-secondary border-b border-border-primary" ref={mobileMenuRef}>
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                Courses
                            </Link>
                            <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                Projects
                            </Link>
                            <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                Blog
                            </Link>
                            <Link href="/forum" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                Forum
                            </Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                About
                            </Link>
                            {session ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                        Dashboard
                                    </Link>
                                    {session.user?.role === 'ADMIN' && (
                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-indigo-400 hover:text-indigo-300 block px-3 py-2 rounded-md text-base font-medium">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {(isEngineer || session.user?.role === 'ADMIN') && (
                                        <Link href="/engineer/blog/new" onClick={() => setIsMenuOpen(false)} className="text-green-400 hover:text-green-300 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
                                            <PenTool size={16} />
                                            Create Blog Post
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut();
                                        }}
                                        className="w-full text-left text-red-500 hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

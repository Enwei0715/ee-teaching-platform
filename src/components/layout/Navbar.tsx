'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EditableImage from '@/components/ui/EditableImage';
import EditableText from '@/components/ui/EditableText';
import { Menu, X, Search, User, LogOut, Bot, PenTool, BookOpen, Folder, MessageSquare, Info, LayoutDashboard } from 'lucide-react';
import SearchCommand from '@/components/search/SearchCommand';
import { useSession, signOut } from 'next-auth/react';
import { useEditMode } from '@/context/EditModeContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { data: session } = useSession();
    const { isEditMode, toggleEditMode } = useEditMode();
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

    // Auto-close mobile menu on screen resize (if moving to desktop view)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setIsMenuOpen(false);
            }
        };

        // Initial check
        handleResize(mediaQuery);

        // Add listener
        mediaQuery.addEventListener('change', handleResize);

        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const isEngineer =
        session?.user?.occupation?.toLowerCase().includes('engineer') ||
        session?.user?.occupation?.toLowerCase().includes('engineering') ||
        session?.user?.major?.toLowerCase().includes('engineer') ||
        session?.user?.major?.toLowerCase().includes('engineering');

    return (
        <>
            <nav className="glass-heavy border-b border-border-primary sticky top-0 z-40">
                <div className="w-full px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-black rounded-lg relative w-12 h-12 flex items-center justify-center">
                                    <EditableImage
                                        mode="static"
                                        contentKey="navbar.logo"
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

                        {/* Desktop Navigation - Absolute Center */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="flex items-center space-x-8">
                                <Link href="/courses" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <EditableText mode="static" contentKey="navbar.link.courses" defaultText="Courses" tag="span" />
                                </Link>
                                <Link href="/projects" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <EditableText mode="static" contentKey="navbar.link.projects" defaultText="Projects" tag="span" />
                                </Link>
                                <Link href="/blog" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <EditableText mode="static" contentKey="navbar.link.blog" defaultText="Blog" tag="span" />
                                </Link>
                                <Link href="/forum" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <EditableText mode="static" contentKey="navbar.link.forum" defaultText="Forum" tag="span" />
                                </Link>
                                {session && (
                                    <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        <EditableText mode="static" contentKey="navbar.link.dashboard" defaultText="Dashboard" tag="span" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                            {/* Full Search - Visible on XL+ */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="relative group hidden xl:block"
                            >
                                <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-full px-4 py-1.5 text-sm text-text-secondary hover:border-accent-primary transition-colors w-64">
                                    <Search size={14} />
                                    <span className="flex-1 text-left">Search...</span>
                                    <kbd className="hidden lg:inline-block font-sans text-[10px] bg-bg-primary border border-border-primary rounded px-1">Ctrl K</kbd>
                                </div>
                            </button>

                            {/* Icon Search - Visible on LG to XL */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-text-secondary hover:text-text-primary hidden lg:block xl:hidden"
                            >
                                <Search size={20} />
                            </button>

                            {/* Edit Mode Toggle (Admin Only) */}
                            {session?.user?.role === 'ADMIN' && (
                                <div className="flex items-center gap-2 flex-shrink-0 z-50">
                                    <span className="text-xs text-text-secondary">Edit</span>
                                    <button
                                        onClick={toggleEditMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEditMode ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            )}

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
                                        <div className="absolute right-0 top-full mt-3 w-72 bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-xl p-2 z-50 origin-top-right animate-in fade-in zoom-in-95">

                                            {/* Profile Header */}
                                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 mb-1">
                                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-inner border border-white/10">
                                                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                                                        {session.user?.role === 'ADMIN' && (
                                                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-medium">ADMIN</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/10 my-1 mx-2" />

                                            {/* Menu Items */}
                                            <div className="flex flex-col gap-1">
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <LayoutDashboard size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                                    Dashboard
                                                </Link>

                                                {/* Admin Links */}
                                                {session.user?.role === 'ADMIN' && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all duration-200 font-medium group"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <Bot size={16} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                        Admin Panel
                                                    </Link>
                                                )}

                                                {/* Engineer Links */}
                                                {(isEngineer || session.user?.role === 'ADMIN') && (
                                                    <Link
                                                        href="/blog/new"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 font-medium group"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <PenTool size={16} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                                        Write a Post
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="h-px bg-white/10 my-1 mx-2" />

                                            {/* Logout */}
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    signOut();
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200 text-left group"
                                            >
                                                <LogOut size={16} className="text-red-500/70 group-hover:text-red-400 transition-colors" />
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
                        <div className="lg:hidden flex items-center gap-2">
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

            </nav>

            {/* Mobile Menu - Moved outside nav to avoid stacking context issues */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 top-16 z-[100] bg-slate-950/95 backdrop-blur-xl overflow-y-auto animate-in slide-in-from-top-5 duration-200 flex flex-col border-t border-white/10"
                    ref={mobileMenuRef}
                >
                    <div className="p-6 flex flex-col gap-6 min-h-full">
                        {/* 1. Search Section */}
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 text-text-secondary" size={20} />
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary outline-none transition-all"
                                placeholder="Search courses, projects..."
                                onClick={() => setIsSearchOpen(true)}
                                readOnly
                            />
                        </div>

                        {/* 2. Navigation Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-lg font-medium text-text-primary hover:bg-white/10 hover:border-white/20 transition-all group">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-colors">
                                    <BookOpen size={24} />
                                </div>
                                Courses
                            </Link>
                            <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-lg font-medium text-text-primary hover:bg-white/10 hover:border-white/20 transition-all group">
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300 transition-colors">
                                    <Folder size={24} />
                                </div>
                                Projects
                            </Link>
                            <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-lg font-medium text-text-primary hover:bg-white/10 hover:border-white/20 transition-all group">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-400 group-hover:bg-green-500/30 group-hover:text-green-300 transition-colors">
                                    <PenTool size={24} />
                                </div>
                                Blog
                            </Link>
                            <Link href="/forum" onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-lg font-medium text-text-primary hover:bg-white/10 hover:border-white/20 transition-all group">
                                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30 group-hover:text-orange-300 transition-colors">
                                    <MessageSquare size={24} />
                                </div>
                                Forum
                            </Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-lg font-medium text-text-primary hover:bg-white/10 hover:border-white/20 transition-all group">
                                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30 group-hover:text-teal-300 transition-colors">
                                    <Info size={24} />
                                </div>
                                About
                            </Link>
                        </div>

                        {/* Spacer to push User content down */}
                        <div className="flex-1"></div>

                        {/* 3. User Section */}
                        {session ? (
                            <div className="bg-slate-950/60 rounded-xl p-5 border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary border border-accent-primary/30">
                                        <User size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-text-primary font-medium text-lg truncate">{session.user?.name}</p>
                                        <p className="text-sm text-text-secondary truncate">{session.user?.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut();
                                        }}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                                {session.user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="mt-3 block text-center py-2 text-sm text-indigo-400 hover:text-indigo-300"
                                    >
                                        Access Admin Dashboard
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-4 rounded-xl bg-accent-primary text-white font-bold text-lg text-center hover:bg-accent-primary/90 transition-colors shadow-lg shadow-accent-primary/20"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, MessageSquarePlus, Bot, Keyboard, ArrowUp, X, Palette } from 'lucide-react';

export default function FloatingActionGroup() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleAction = (action: string) => {
        setIsOpen(false);
        switch (action) {
            case 'ai-tutor':
                window.dispatchEvent(new CustomEvent('open-ai-tutor'));
                break;
            case 'feedback':
                window.dispatchEvent(new CustomEvent('open-feedback'));
                break;
            case 'shortcuts':
                window.dispatchEvent(new CustomEvent('toggle-shortcuts-help'));
                break;
            case 'scroll-top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'appearance':
                window.dispatchEvent(new CustomEvent('open-appearance-settings'));
                break;
        }
    };

    const pathname = usePathname();
    const isLessonPage = pathname?.startsWith('/courses/') && pathname?.split('/').length > 3;

    const menuItems = [
        ...(isLessonPage ? [
            { id: 'ai-tutor', icon: Bot, label: 'AI Tutor', color: 'bg-indigo-600' },
            { id: 'appearance', icon: Palette, label: 'Appearance', color: 'bg-purple-600' }
        ] : []),
        { id: 'feedback', icon: MessageSquarePlus, label: 'Feedback', color: 'bg-blue-600' },
        { id: 'shortcuts', icon: Keyboard, label: 'Shortcuts', color: 'bg-gray-700' },
        { id: 'scroll-top', icon: ArrowUp, label: 'Top', color: 'bg-emerald-600' },
    ];

    return (
        <div className="hidden md:flex fixed bottom-6 right-6 z-[300] flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-2">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                                className="flex items-center gap-3 justify-end"
                            >
                                <span className="text-white text-sm font-medium bg-black/60 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                                    {item.label}
                                </span>
                                <button
                                    onClick={() => handleAction(item.id)}
                                    className={`p-3 rounded-full text-white shadow-lg hover:brightness-110 transition-all ${item.color}`}
                                >
                                    <item.icon size={20} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleMenu}
                className={`p-4 rounded-full shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 flex items-center justify-center ${isOpen
                    ? 'bg-red-500/90 text-white rotate-90'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <Wrench size={24} />}
            </button>
        </div>
    );
}

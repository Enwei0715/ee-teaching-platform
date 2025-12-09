'use client';

import React from 'react';
import { Menu, List, Bot, MessageSquarePlus, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { LessonFontSize } from '@/hooks/useLessonAppearance';

interface MobileLessonBarProps {
    onUpdateAppearance?: (updates: { fontSize: LessonFontSize }) => void;
    currentFontSize?: LessonFontSize;
}

export default function MobileLessonBar({ onUpdateAppearance, currentFontSize = 'medium' }: MobileLessonBarProps) {
    const handleAction = (action: string) => {
        switch (action) {
            case 'sidebar':
                window.dispatchEvent(new CustomEvent('open-course-sidebar'));
                break;
            case 'toc':
                window.dispatchEvent(new CustomEvent('open-toc'));
                break;
            case 'ai-tutor':
                window.dispatchEvent(new CustomEvent('open-ai-tutor'));
                break;
            case 'feedback':
                window.dispatchEvent(new CustomEvent('open-feedback'));
                break;
            case 'appearance':
                window.dispatchEvent(new CustomEvent('open-appearance-settings'));
                break;
        }
    };

    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling up or at the top, hide when scrolling down
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {/* Glassmorphism Bar */}
            <div className="bg-slate-950/80 backdrop-blur-lg border-t border-white/10 pb-6 pt-2 px-6 shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center h-14">
                    {/* Menu (Sidebar) */}
                    <button
                        onClick={() => handleAction('sidebar')}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <Menu size={20} />
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>

                    {/* TOC */}
                    <button
                        onClick={() => handleAction('toc')}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <List size={20} />
                        <span className="text-[10px] font-medium">TOC</span>
                    </button>

                    {/* AI Tutor (Highlighted) */}
                    <button
                        onClick={() => handleAction('ai-tutor')}
                        className="flex flex-col items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors -mt-4"
                    >
                        <div className="p-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-900/50 border border-indigo-400/30">
                            <Bot size={24} className="text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-indigo-400">AI Tutor</span>
                    </button>

                    {/* Feedback */}
                    <button
                        onClick={() => handleAction('feedback')}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <MessageSquarePlus size={20} />
                        <span className="text-[10px] font-medium">Feedback</span>
                    </button>

                    {/* Appearance Settings */}
                    <button
                        onClick={() => handleAction('appearance')}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <Palette size={20} />
                        <span className="text-[10px] font-medium">Theme</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

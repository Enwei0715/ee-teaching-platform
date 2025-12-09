'use client';


import { Check, EyeOff, Eye, X, Wrench } from 'lucide-react';
import { LessonAppearance, LessonTheme, LessonFontSize } from '@/hooks/useLessonAppearance';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LessonAppearanceControlProps {
    appearance: LessonAppearance;
    onUpdate: (updates: Partial<LessonAppearance>) => void;
}

export default function LessonAppearanceControl({ appearance, onUpdate }: LessonAppearanceControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // New Dark Themes
    const themes: { id: LessonTheme; label: string; bg: string; text: string }[] = [
        { id: 'default', label: 'Dark', bg: 'bg-[#0B1120]', text: 'text-gray-200' },
        { id: 'midnight', label: 'Midnight', bg: 'bg-black', text: 'text-gray-400' },
        { id: 'forest', label: 'Forest', bg: 'bg-[#051a15]', text: 'text-emerald-200' },
        { id: 'amethyst', label: 'Amethyst', bg: 'bg-[#150f25]', text: 'text-purple-200' },
        { id: 'navy', label: 'Navy', bg: 'bg-[#1e293b]', text: 'text-slate-200' },
    ];



    if (!mounted) return null;

    return createPortal(
        <div className="fixed bottom-6 right-24 z-[90] md:right-8 md:bottom-8" ref={menuRef}>
            {/* 
               Mobile: bottom-6 right-24 (Left of AI Tutor? No, AI Tutor is hidden on lesson pages usually? 
               Wait, AITutor trigger is hidden on Lesson Pages.
               But MobileLessonBar is bottom-0.
               So bottom-20 (above bar) is safer for Mobile.
               Desktop: bottom-8 right-8.
            */}

            {/* Panel */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-72 p-4 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-sm">Appearance</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-6">

                        {/* Background Effects */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-text-primary">
                                {appearance.showEffects ? <Eye size={18} /> : <EyeOff size={18} />}
                                <span className="font-medium text-sm">Background Effects</span>
                            </div>
                            <button
                                onClick={() => onUpdate({ showEffects: !appearance.showEffects })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${appearance.showEffects ? 'bg-accent-primary' : 'bg-slate-700'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${appearance.showEffects ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <hr className="border-white/10" />

                        {/* Theme Selection */}
                        <div className="space-y-3">
                            <label className="text-xs text-text-secondary font-medium uppercase tracking-wider">
                                Color Theme
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onUpdate({ theme: theme.id })}
                                        className={`group relative h-12 w-full rounded-lg border-2 transition-all overflow-hidden ${theme.bg
                                            } ${appearance.theme === theme.id
                                                ? 'border-accent-primary ring-2 ring-accent-primary/20 scale-105 z-10'
                                                : 'border-transparent hover:border-white/20'
                                            }`}
                                        title={theme.label}
                                    >
                                        <div className={`absolute inset-0 flex items-center justify-center font-medium text-xs ${theme.text}`}>
                                            Aa
                                        </div>
                                        {appearance.theme === theme.id && (
                                            <div className="absolute top-0 right-0 bg-accent-primary text-white p-0.5 rounded-bl-md">
                                                <Check size={10} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>



                    </div>
                </div>
            )}

            {/* FAB Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg transition-all transform hover:scale-105 ${isOpen
                    ? 'bg-slate-700 text-white rotate-90'
                    : 'bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800'
                    }`}
                title="Appearance Settings"
            >
                {isOpen ? <X size={24} /> : <Wrench size={24} />}
            </button>
        </div>,
        document.body
    );
}

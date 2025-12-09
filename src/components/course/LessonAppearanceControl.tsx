'use client';

import { Settings, Check, Type, EyeOff, Eye } from 'lucide-react';
import { LessonAppearance, LessonTheme, LessonFontSize } from '@/hooks/useLessonAppearance';
import { useState, useRef, useEffect } from 'react';

interface LessonAppearanceControlProps {
    appearance: LessonAppearance;
    onUpdate: (updates: Partial<LessonAppearance>) => void;
}

export default function LessonAppearanceControl({ appearance, onUpdate }: LessonAppearanceControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const themes: { id: LessonTheme; label: string; bg: string; text: string }[] = [
        { id: 'default', label: 'Dark', bg: 'bg-[#0B1120]', text: 'text-gray-200' }, // Matches default app theme roughly
        { id: 'light', label: 'Light', bg: 'bg-white', text: 'text-slate-900 border border-gray-200' },
        { id: 'sepia', label: 'Sepia', bg: 'bg-[#f4ecd8]', text: 'text-[#5b4636]' },
        { id: 'navy', label: 'Navy', bg: 'bg-[#1e293b]', text: 'text-slate-200' },
    ];

    const fontSizes: { id: LessonFontSize; label: string; iconSize: number }[] = [
        { id: 'small', label: 'Small', iconSize: 14 },
        { id: 'medium', label: 'Medium', iconSize: 18 },
        { id: 'large', label: 'Large', iconSize: 24 },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isOpen ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                title="Appearance Settings"
            >
                <Settings size={20} />
                <span className="sr-only">Appearance</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 p-4 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-6">

                        {/* Focus Mode */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-text-primary">
                                {appearance.focusMode ? <EyeOff size={18} /> : <Eye size={18} />}
                                <span className="font-medium">Focus Mode</span>
                            </div>
                            <button
                                onClick={() => onUpdate({ focusMode: !appearance.focusMode })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${appearance.focusMode ? 'bg-accent-primary' : 'bg-slate-700'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${appearance.focusMode ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <hr className="border-white/10" />

                        {/* Theme Selection */}
                        <div className="space-y-3">
                            <label className="text-xs text-text-secondary font-medium uppercase tracking-wider">
                                Color Theme
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onUpdate({ theme: theme.id })}
                                        className={`group relative h-12 w-full rounded-lg border-2 transition-all ${theme.bg
                                            } ${appearance.theme === theme.id
                                                ? 'border-accent-primary ring-2 ring-accent-primary/20 scale-105 z-10'
                                                : 'border-transparent hover:border-white/20'
                                            }`}
                                        title={theme.label}
                                    >
                                        <span className={`absolute inset-0 flex items-center justify-center font-medium text-xs ${theme.text}`}>
                                            Aa
                                        </span>
                                        {appearance.theme === theme.id && (
                                            <div className="absolute -top-1 -right-1 bg-accent-primary text-white rounded-full p-0.5">
                                                <Check size={8} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-3">
                            <label className="text-xs text-text-secondary font-medium uppercase tracking-wider">
                                Font Size
                            </label>
                            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/5">
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => onUpdate({ fontSize: size.id })}
                                        className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${appearance.fontSize === size.id
                                                ? 'bg-accent-primary text-white shadow-lg'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                            }`}
                                    >
                                        <Type size={size.iconSize} />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

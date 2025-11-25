"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";

export default function ShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        const handleClose = () => setIsOpen(false);

        window.addEventListener('toggle-shortcuts-help', handleToggle);
        window.addEventListener('close-modals', handleClose);

        return () => {
            window.removeEventListener('toggle-shortcuts-help', handleToggle);
            window.removeEventListener('close-modals', handleClose);
        };
    }, []);

    if (!isOpen) return null;

    const shortcuts = [
        {
            category: "Navigation", items: [
                { keys: ["G", "H"], desc: "Go to Home" },
                { keys: ["G", "D"], desc: "Go to Dashboard" },
                { keys: ["G", "C"], desc: "Go to Courses" },
                { keys: ["G", "P"], desc: "Go to Projects" },
                { keys: ["G", "B"], desc: "Go to Blog" },
                { keys: ["G", "F"], desc: "Go to Forum" },
            ]
        },
        {
            category: "Actions", items: [
                { keys: ["Ctrl", "K"], desc: "Search" },
                { keys: ["Ctrl", "S"], desc: "Save Changes" },
                { keys: ["Ctrl", "Enter"], desc: "Submit Form" },
                { keys: ["Esc"], desc: "Close Modals" },
            ]
        },
        {
            category: "Lessons", items: [
                { keys: ["J"], desc: "Next Lesson" },
                { keys: ["K"], desc: "Previous Lesson" },
            ]
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-heavy border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-800 glass-ghost">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <Keyboard size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                    {shortcuts.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                {section.category}
                            </h3>
                            <div className="space-y-3">
                                {section.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <span className="text-gray-300 group-hover:text-white transition-colors">
                                            {item.desc}
                                        </span>
                                        <div className="flex gap-1">
                                            {item.keys.map((key, kIdx) => (
                                                <kbd key={kIdx} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs font-mono text-gray-400 min-w-[24px] text-center shadow-sm">
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 glass-ghost border-t border-gray-800 text-center text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-400 mx-1">?</kbd> to toggle this modal anytime
                </div>
            </div>
        </div>
    );
}

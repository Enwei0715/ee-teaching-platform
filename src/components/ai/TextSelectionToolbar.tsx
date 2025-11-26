"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface TextSelectionToolbarProps {
    onAskAI: (selectedText: string) => void;
}

export default function TextSelectionToolbar({ onAskAI }: TextSelectionToolbarProps) {
    const [selectedText, setSelectedText] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [show, setShow] = useState(false);

    const handleSelection = useCallback(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 3) {
            const range = selection!.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Position the toolbar above the selection
            setPosition({
                top: rect.top + window.scrollY - 50,
                left: rect.left + window.scrollX + rect.width / 2,
            });

            setSelectedText(text);
            setShow(true);
        } else {
            setShow(false);
        }
    }, []);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.text-selection-toolbar')) {
            setShow(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleSelection, handleClickOutside]);

    const handleAskClick = () => {
        onAskAI(selectedText);
        setShow(false);
        // Clear selection
        window.getSelection()?.removeAllRanges();
    };

    if (!show) return null;

    return (
        <div
            className="text-selection-toolbar fixed z-50 animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translateX(-50%)',
            }}
        >
            <button
                onClick={handleAskClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105 text-sm font-medium whitespace-nowrap"
            >
                <Sparkles size={16} className="animate-pulse" />
                <span>Ask AI</span>
            </button>
        </div>
    );
}

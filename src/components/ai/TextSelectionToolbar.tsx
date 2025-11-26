"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles } from 'lucide-react';

export default function TextSelectionToolbar() {
    const [selectedText, setSelectedText] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [show, setShow] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSelection = useCallback(() => {
        // Small delay to allow browser to update selection state
        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();

            if (selection && text && text.length > 2) { // Changed to > 2 for slightly better sensitivity
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Check if selection is actually visible/valid
                if (rect.width === 0 || rect.height === 0) {
                    setShow(false);
                    return;
                }

                // Position the toolbar above the selection using FIXED positioning (viewport coordinates)
                // We do NOT add window.scrollY because the container is fixed
                const top = rect.top - 50;
                const left = rect.left + (rect.width / 2);

                // Boundary Check: If selection is too close to top of screen, flip below
                const finalTop = top < 60 ? rect.bottom + 10 : top;

                setPosition({
                    top: finalTop,
                    left: left,
                });

                setSelectedText(text);
                setShow(true);
            } else {
                setShow(false);
            }
        }, 10);
    }, []);

    useEffect(() => {
        // Listen for both mouseup (mouse selection) and keyup (keyboard selection)
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);
        document.addEventListener('touchend', handleSelection); // Add touch support

        // Also listen for selectionchange, but debounce it or rely on mouseup/keyup for final state
        // For simplicity and performance, mouseup/keyup is usually sufficient for "finished" selection

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
        };
    }, [handleSelection]);

    const handleAskClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Dispatch custom event to open AI Tutor with text
        window.dispatchEvent(new CustomEvent('open-ai-tutor', {
            detail: { text: `Explain this: "${selectedText}"` }
        }));

        setShow(false);
        // Clear selection
        window.getSelection()?.removeAllRanges();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevent the toolbar click from triggering document mousedown (which might clear selection)
        e.preventDefault();
        e.stopPropagation();
    };

    if (!mounted || !show) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="text-selection-toolbar fixed z-[9999] animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translateX(-50%)',
            }}
            onMouseDown={handleMouseDown}
        >
            <button
                onClick={handleAskClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105 text-sm font-medium whitespace-nowrap"
            >
                <Sparkles size={16} className="animate-pulse" />
                <span>Ask AI</span>
            </button>
        </div>,
        document.body
    );
}

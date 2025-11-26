'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="my-4 border border-border-primary rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
            >
                <span className="font-semibold text-text-primary">{title}</span>
                {isOpen ? (
                    <ChevronDown size={20} className="text-text-secondary" />
                ) : (
                    <ChevronRight size={20} className="text-text-secondary" />
                )}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-border-primary">
                    {children}
                </div>
            )}
        </div>
    );
}

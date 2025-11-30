'use client';

import { usePathname } from 'next/navigation';
import InteractiveGridPattern from '../ui/InteractiveGridPattern';

export default function BackgroundGrid() {
    const pathname = usePathname();

    // Hide on Blog and Forum pages
    if (pathname?.startsWith('/blog') || pathname?.startsWith('/forum')) {
        return null;
    }

    // Use interactive grid for Course pages
    if (pathname?.startsWith('/courses')) {
        return <InteractiveGridPattern />;
    }

    // Show simple grid on About page
    if (pathname === '/about') {
        return (
            <div
                className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        );
    }

    return null;
}

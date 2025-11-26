'use client';

import { usePathname } from 'next/navigation';

export default function BackgroundGrid() {
    const pathname = usePathname();

    // Hide on Blog and Forum pages
    if (pathname?.startsWith('/blog') || pathname?.startsWith('/forum')) {
        return null;
    }

    return (
        <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
            style={{
                backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
        />
    );
}

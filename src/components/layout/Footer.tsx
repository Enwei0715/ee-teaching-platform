'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEditMode } from '@/context/EditModeContext';
import EditableText from '@/components/ui/EditableText';
import { Settings } from 'lucide-react';

interface FooterProps {
    settings: any;
    links: any[];
}

export default function Footer({ settings = {}, links = [] }: FooterProps) {
    const pathname = usePathname();
    const { isEditMode } = useEditMode();

    // Hide Footer on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* Subtle Top Border for Footer area */}
            <div className="w-full h-[1px] bg-white/5 relative z-20"></div>
            <footer className="relative z-10 w-full border-t border-gray-800 bg-gray-950/70 backdrop-blur-md py-12 pb-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-text-primary font-bold text-lg">EE Master</h3>
                            {isEditMode && (
                                <Link
                                    href="/admin/content"
                                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-500 flex items-center gap-1"
                                >
                                    <Settings size={12} />
                                    Manage Footer
                                </Link>
                            )}
                        </div>
                        <p className="text-text-secondary mb-4 whitespace-pre-wrap">
                            {settings.footer_description}
                        </p>
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Resources Column */}
                        <div>
                            <h4 className="text-text-primary font-bold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {links
                                    .filter((link: any) => link.category === 'resources' || !link.category)
                                    .map((link: any, index: number) => (
                                        <li key={index}>
                                            <Link href={link.url} className="text-text-secondary hover:text-primary transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Community Column */}
                        <div>
                            <h4 className="text-text-primary font-bold mb-4">Community</h4>
                            <ul className="space-y-2">
                                {links
                                    .filter((link: any) => link.category === 'community')
                                    .map((link: any, index: number) => (
                                        <li key={index}>
                                            <Link href={link.url} className="text-text-secondary hover:text-primary transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border-primary text-center text-text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} EE Master. Open Source Education.</p>
                </div>
            </footer>
        </>
    );
}

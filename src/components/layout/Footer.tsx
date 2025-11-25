'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEditMode } from '@/context/EditModeContext';
import EditableText from '@/components/ui/EditableText';
import { Settings } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    const { isEditMode } = useEditMode();
    const [settings, setSettings] = useState<any>({});
    const [links, setLinks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data.settings || {});
                setLinks(data.links || []);
            })
            .catch(console.error);
    }, []);

    // Hide Footer on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-bg-secondary border-t border-border-primary py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-text-primary font-bold text-lg mb-4">EE Master</h3>
                    <EditableText
                        defaultText={settings.description || 'Master Electrical Engineering with our comprehensive teaching platform.'}
                        contentKey="footer_description"
                        mode="static"
                        className="text-text-secondary mb-4"
                        multiline
                    />
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Resources Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-text-primary font-bold">Resources</h4>
                            {isEditMode && (
                                <Link
                                    href="/admin/content"
                                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-500 flex items-center gap-1"
                                >
                                    <Settings size={12} />
                                    Manage
                                </Link>
                            )}
                        </div>
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
    );
}

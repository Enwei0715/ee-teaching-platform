'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const [settings, setSettings] = useState<{ footer_description?: string }>({});
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
                    <p className="text-text-secondary text-sm leading-relaxed max-w-md whitespace-pre-wrap">
                        {settings.footer_description || "An open-source platform dedicated to teaching electronic engineering.\nFrom basic circuits to advanced FPGA design."}
                    </p>
                </div>

                <div>
                    <h4 className="text-text-primary font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2">
                        {links.filter(l => l.category === 'resources').length > 0 ? (
                            links.filter(l => l.category === 'resources').map(link => (
                                <li key={link.id}>
                                    <Link href={link.url} className="text-text-secondary hover:text-accent-primary transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <>
                                <li><Link href="/courses" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Courses</Link></li>
                                <li><Link href="/blog" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Blog</Link></li>
                                <li><Link href="/projects" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Projects</Link></li>
                                <li><Link href="/forum" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Forum</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                <div>
                    <h4 className="text-text-primary font-semibold mb-4">Community</h4>
                    <ul className="space-y-2">
                        {links.filter(l => l.category === 'community').length > 0 ? (
                            links.filter(l => l.category === 'community').map(link => (
                                <li key={link.id}>
                                    <Link href={link.url} className="text-text-secondary hover:text-accent-primary transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <>
                                <li><a href="https://github.com/Enwei0715/ee-teaching-platform" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">GitHub</a></li>
                                <li><Link href="/about" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">About Us</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border-primary text-center text-text-secondary text-sm">
                <p>&copy; {new Date().getFullYear()} EE Master. Open Source Education.</p>
            </div>
        </footer>
    );
}

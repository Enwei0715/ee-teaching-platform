import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-bg-secondary border-t border-border-primary py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-text-primary font-bold text-lg mb-4">EE Master</h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-md">
                        An open-source platform dedicated to teaching electronic engineering.
                        From basic circuits to advanced FPGA design.
                    </p>
                </div>

                <div>
                    <h4 className="text-text-primary font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2">
                        <li><Link href="/courses" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Courses</Link></li>
                        <li><Link href="/blog" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Blog</Link></li>
                        <li><Link href="/projects" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Projects</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-text-primary font-semibold mb-4">Community</h4>
                    <ul className="space-y-2">
                        <li><a href="https://github.com/Enwei0715/ee-teaching-platform" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">GitHub</a></li>
                        <li><Link href="/about" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">About Us</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border-primary text-center text-text-secondary text-sm">
                <p>&copy; {new Date().getFullYear()} EE Master. Open Source Education.</p>
            </div>
        </footer>
    );
}

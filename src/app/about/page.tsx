import { Metadata } from 'next';
import { User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | EE Master',
    description: 'Learn about the mission and team behind EE Master.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <header className="py-20 px-6 text-center bg-bg-secondary border-b border-border-primary">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">About EE Master</h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    We are dedicated to making electronic engineering education accessible, practical, and engaging for everyone.
                </p>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-6">Our Mission</h2>
                    <div className="text-text-secondary leading-relaxed space-y-4">
                        <p>
                            Electronic engineering is a fascinating field that powers the modern world. However, learning it can often feel overwhelming due to complex theory and expensive tools.
                        </p>
                        <p>
                            Our mission is to bridge the gap between theory and practice. We provide high-quality, open-source educational resources that help students, hobbyists, and professionals master the art of electronics.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-6">What We Offer</h2>
                    <div className="text-text-secondary leading-relaxed space-y-4">
                        <p>
                            <strong className="text-text-primary">Comprehensive Courses:</strong> Structured learning paths covering everything from basic circuits to advanced FPGA design.
                        </p>
                        <p>
                            <strong className="text-text-primary">Practical Projects:</strong> Hands-on projects that reinforce theoretical concepts and build real-world skills.
                        </p>
                        <p>
                            <strong className="text-text-primary">Community:</strong> A supportive community of learners and experts sharing knowledge and collaboration.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-8">The Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 text-center hover:border-accent-primary transition-colors">
                            <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={40} className="text-text-secondary" />
                            </div>
                            <div className="font-bold text-text-primary text-lg mb-1">Alex Chen</div>
                            <div className="text-sm text-text-secondary">Founder & Lead Engineer</div>
                        </div>
                        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 text-center hover:border-accent-primary transition-colors">
                            <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={40} className="text-text-secondary" />
                            </div>
                            <div className="font-bold text-text-primary text-lg mb-1">Sarah Jones</div>
                            <div className="text-sm text-text-secondary">Content Director</div>
                        </div>
                        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 text-center hover:border-accent-primary transition-colors">
                            <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={40} className="text-text-secondary" />
                            </div>
                            <div className="font-bold text-text-primary text-lg mb-1">Mike Ross</div>
                            <div className="text-sm text-text-secondary">Community Manager</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

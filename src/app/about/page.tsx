import { Metadata } from 'next';
import { User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | EE Master',
    description: 'Empowering the Next Generation of Hardware Engineers.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <header className="py-20 px-6 text-center bg-bg-secondary border-b border-border-primary">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Empowering the Next Generation of Hardware Engineers</h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    EE Master provides the tools, simulations, and community you need to go from theory to prototype.
                </p>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-6">Our Mission</h2>
                    <div className="text-text-secondary leading-relaxed space-y-4">
                        <p>
                            At EE Master, our mission is simple: <strong>Demystifying Electronics for Everyone.</strong>
                        </p>
                        <p>
                            We believe that hardware engineering shouldn't be hidden behind expensive tools or impenetrable theory. Whether you're a student just starting out or a professional looking to sharpen your skills, we're here to help you understand the "why" and "how" behind every circuit.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-6">What We Offer</h2>
                    <div className="text-text-secondary leading-relaxed space-y-4">
                        <p>
                            <strong className="text-text-primary">Interactive Courses:</strong> Dive deep into MDX-based curriculum covering everything from Diode fundamentals to BJT amplifiers and beyond.
                        </p>
                        <p>
                            <strong className="text-text-primary">Real-World Projects:</strong> Don't just read about it—build it. Our project-based learning approach focuses on real-world circuit design and simulation.
                        </p>
                        <p>
                            <strong className="text-text-primary">Community Forum:</strong> Join a growing community of engineers. Ask questions, share your knowledge, and collaborate on the next big thing.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">The Team</h2>
                    <div className="flex justify-center">
                        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 text-center hover:border-accent-primary transition-colors max-w-sm w-full">
                            <div className="w-24 h-24 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                                <User size={48} className="text-text-secondary" />
                            </div>
                            <div className="font-bold text-text-primary text-xl mb-2">Lorry</div>
                            <div className="text-base text-text-secondary font-medium">Electronic Engineering Educator</div>
                            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                                Passionate about making complex engineering concepts accessible to everyone.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

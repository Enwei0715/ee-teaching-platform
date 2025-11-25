import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'About Us | EE Master',
    description: 'Empowering the Next Generation of Hardware Engineers.',
};

export default async function AboutPage() {
    const settings = await prisma.siteSettings.findUnique({
        where: { key: 'about_us_content' }
    });

    const content = settings?.value || `
# Our Mission

At EE Master, our mission is simple: **Demystifying Electronics for Everyone.**

We believe that hardware engineering shouldn't be hidden behind expensive tools or impenetrable theory. Whether you're a student just starting out or a professional looking to sharpen your skills, we're here to help you understand the "why" and "how" behind every circuit.

# What We Offer

*   **Interactive Courses:** Dive deep into MDX-based curriculum covering everything from Diode fundamentals to BJT amplifiers and beyond.
*   **Real-World Projects:** Don't just read about it—build it. Our project-based learning approach focuses on real-world circuit design and simulation.
*   **Community Forum:** Join a growing community of engineers. Ask questions, share your knowledge, and collaborate on the next big thing.
    `;

    return (
        <div className="min-h-screen bg-bg-primary">
            <header className="py-20 px-6 text-center bg-bg-secondary border-b border-border-primary">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Empowering the Next Generation of Hardware Engineers</h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    EE Master provides the tools, simulations, and community you need to go from theory to prototype.
                </p>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16 prose prose-invert prose-lg">
                <MDXRemote source={content} />
            </div>
        </div>
    );
}

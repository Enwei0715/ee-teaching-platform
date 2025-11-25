'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Tilt from 'react-parallax-tilt';
import 'katex/dist/katex.min.css';

export default function AboutPage() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/site-content?key=about_us_content')
            .then(res => res.json())
            .then(data => {
                if (data?.content) {
                    setContent(data.content);
                } else {
                    // Default content
                    setContent(`
# Our Mission

At EE Master, our mission is simple: **Demystifying Electronics for Everyone.**

We believe that hardware engineering shouldn't be hidden behind expensive tools or impenetrable theory. Whether you're a student just starting out or a professional looking to sharpen your skills, we're here to help you understand the "why" and "how" behind every circuit.

# What We Offer

*   **Interactive Courses:** Dive deep into MDX-based curriculum covering everything from Diode fundamentals to BJT amplifiers and beyond.
*   **Real-World Projects:** Don't just read about it—build it. Our project-based learning approach focuses on real-world circuit design and simulation.
*   **Community Forum:** Join a growing community of engineers. Ask questions, share your knowledge, and collaborate on the next big thing.
                    `);
                }
                setLoading(false);
            })
            .catch(() => {
                setContent('# About Us\n\nContent loading failed.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-bg-primary">
            <header className="py-20 px-6 text-center bg-bg-secondary border-b border-border-primary">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Empowering the Next Generation of Hardware Engineers</h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    EE Master provides the tools, simulations, and community you need to go from theory to prototype.
                </p>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16 prose prose-invert prose-lg">
                {loading ? (
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                    </div>
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>

            <section className="max-w-4xl mx-auto px-6 pb-16">
                <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">The Team</h2>
                <div className="flex justify-center">
                    <Tilt
                        className="parallax-effect-glare-scale"
                        perspective={1000}
                        glareEnable={true}
                        glareMaxOpacity={0.45}
                        scale={1.02}
                        transitionSpeed={1500}
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                    >
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full relative overflow-hidden backdrop-blur-sm">
                            {/* Gradient overlay for premium feel */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="font-bold text-white text-2xl mb-1">Lorry</div>
                                <div className="text-blue-400 font-medium mb-4">Electronic Engineering Educator</div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Passionate about making complex engineering concepts accessible to everyone.
                                </p>
                            </div>
                        </div>
                    </Tilt>
                </div>
            </section>
        </div>
    );
}

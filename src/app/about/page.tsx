'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Tilt from 'react-parallax-tilt';
import 'katex/dist/katex.min.css';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function AboutPage() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/site-settings', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data?.settings?.about_us_content) {
                    setContent(data.settings.about_us_content);
                } else {
                    // No content found
                    setContent('');
                }
                setLoading(false);
            })
            .catch(() => {
                setContent('# About Us\n\nContent loading failed.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            <ParticleBackground />
            <header className="py-20 px-6 text-center bg-bg-secondary/80 backdrop-blur-sm border-b border-border-primary relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Empowering the Next Generation of Hardware Engineers</h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    EE Master provides the tools, simulations, and community you need to go from theory to prototype.
                </p>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
                <div className="glass-panel rounded-xl overflow-hidden shadow-lg p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
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
                </div>
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
                        glareBorderRadius="16px"
                    >
                        <div className="glass-panel border-gray-700 rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full relative overflow-hidden">
                            {/* Gradient overlay for premium feel */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

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

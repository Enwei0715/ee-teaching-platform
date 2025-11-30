import React from 'react';
import { getChangelog } from '@/lib/changelog-parser';
import { ChangelogCarousel } from '@/components/changelog/ChangelogCarousel';
import ChangelogBackground from '@/components/changelog/ChangelogBackground';

export default async function ChangelogPage() {
    const entries = await getChangelog();

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center py-20">
            <ChangelogBackground />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Changelog
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Explore the evolution of the platform. Swipe to travel through time.
                    </p>
                </div>

                <ChangelogCarousel entries={entries} />
            </div>
        </main>
    );
}

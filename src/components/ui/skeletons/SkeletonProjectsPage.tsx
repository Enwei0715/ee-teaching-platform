import { SkeletonProjectGrid } from './SkeletonProjectCard';

export function SkeletonProjectsPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col flex-1 relative animate-pulse">
            {/* Hero Section */}
            <div className="glass-heavy py-12 px-4 md:py-24 md:px-6 relative overflow-hidden border-b border-indigo-900/30">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="h-12 md:h-16 w-3/4 md:w-1/2 skeleton-bone rounded mx-auto mb-6"></div>
                    <div className="h-6 md:h-8 w-full md:w-2/3 skeleton-bone rounded mx-auto mb-10"></div>
                    <div className="flex justify-center gap-4">
                        <div className="h-12 w-40 skeleton-bone rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Projects Grid Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-20 w-full">
                <div className="flex items-center justify-between mb-12">
                    <div className="h-9 w-48 skeleton-bone rounded"></div>
                    <div className="h-5 w-32 skeleton-bone rounded"></div>
                </div>

                <SkeletonProjectGrid />
            </div>
        </div>
    );
}

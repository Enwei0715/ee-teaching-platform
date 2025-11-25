export function SkeletonPlayer() {
    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] animate-pulse">
            {/* Sidebar Skeleton */}
            <div className="w-full lg:w-80 border-r border-border-primary glass-heavy p-4 space-y-6 hidden lg:block">
                <div className="h-8 skeleton-bone rounded w-3/4"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 skeleton-bone rounded w-full"></div>
                            <div className="pl-4 space-y-2">
                                <div className="h-3 skeleton-bone rounded w-5/6"></div>
                                <div className="h-3 skeleton-bone rounded w-4/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Video Player Placeholder */}
                <div className="aspect-video glass-panel w-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full skeleton-bone"></div>
                    </div>
                </div>

                {/* Content Below Video */}
                <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="h-8 skeleton-bone rounded w-1/2"></div>
                        <div className="h-10 skeleton-bone rounded w-32"></div>
                    </div>
                    <div className="h-4 skeleton-bone rounded w-full"></div>
                    <div className="h-4 skeleton-bone rounded w-5/6"></div>
                    <div className="h-4 skeleton-bone rounded w-4/5"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonDashboard() {
    return (
        <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-transparent py-8 animate-pulse">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="h-9 skeleton-bone rounded w-64 mb-2"></div>
                    <div className="h-6 skeleton-bone rounded w-96"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 skeleton-bone rounded-lg"></div>
                                <div>
                                    <div className="h-4 w-32 skeleton-bone rounded mb-2"></div>
                                    <div className="h-8 w-16 skeleton-bone rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity & Recommended */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Continue Learning Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-7 w-48 skeleton-bone rounded"></div>
                        <div className="glass-panel rounded-xl shadow-sm overflow-hidden">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-6 border-b border-gray-800 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 w-48 skeleton-bone rounded"></div>
                                        <div className="h-5 w-20 skeleton-bone rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-64 skeleton-bone rounded mb-4"></div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="h-3 w-32 skeleton-bone rounded"></div>
                                        <div className="h-3 w-12 skeleton-bone rounded"></div>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 mb-4"></div>
                                    <div className="h-5 w-32 skeleton-bone rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Column */}
                    <div className="space-y-6">
                        <div className="h-7 w-48 skeleton-bone rounded"></div>
                        <div className="glass-panel p-6 rounded-xl shadow-sm space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 p-2">
                                    <div className="w-12 h-12 skeleton-bone rounded-lg shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 skeleton-bone rounded"></div>
                                        <div className="h-3 w-full skeleton-bone rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

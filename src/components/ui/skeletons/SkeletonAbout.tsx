export function SkeletonAbout() {
    return (
        <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden animate-pulse">
            {/* Header / Hero Section */}
            <div className="py-20 px-6 text-center glass-heavy border-b border-gray-800 relative z-10">
                <div className="h-10 md:h-12 w-3/4 md:w-1/2 skeleton-bone rounded mx-auto mb-6"></div>
                <div className="h-6 w-full md:w-2/3 skeleton-bone rounded mx-auto"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 relative z-10">
                {/* Mission Section */}
                <div className="glass-panel shadow-xl rounded-2xl p-8 md:p-12 mb-16">
                    <div className="space-y-4">
                        <div className="h-4 w-full skeleton-bone rounded"></div>
                        <div className="h-4 w-full skeleton-bone rounded"></div>
                        <div className="h-4 w-5/6 skeleton-bone rounded"></div>
                        <div className="h-4 w-full skeleton-bone rounded"></div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-12">
                    <div className="h-8 w-48 skeleton-bone rounded mx-auto mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="glass-panel rounded-xl p-6 flex items-center gap-6">
                                <div className="w-20 h-20 skeleton-bone rounded-full shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-32 skeleton-bone rounded"></div>
                                    <div className="h-4 w-24 skeleton-bone rounded"></div>
                                    <div className="h-3 w-full skeleton-bone rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

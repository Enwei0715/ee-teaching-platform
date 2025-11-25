export function SkeletonProjectCard() {
    return (
        <div className="group glass-panel rounded-xl overflow-hidden shadow-lg flex flex-col h-full relative animate-pulse">
            {/* Image Section */}
            <div className="h-56 skeleton-bone flex items-center justify-center relative overflow-hidden border-b border-gray-800">
                <div className="absolute top-4 right-4 z-20">
                    <div className="h-6 w-20 skeleton-bone rounded-full"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <div className="h-7 skeleton-bone rounded w-3/4 mb-3"></div>

                {/* Description */}
                <div className="space-y-2 mb-6 flex-1">
                    <div className="h-4 skeleton-bone rounded w-full"></div>
                    <div className="h-4 skeleton-bone rounded w-11/12"></div>
                    <div className="h-4 skeleton-bone rounded w-4/6"></div>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center mt-auto pt-4 border-t border-gray-800">
                    <div className="h-5 w-32 skeleton-bone rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonProjectGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonProjectCard key={i} />
            ))}
        </div>
    );
}

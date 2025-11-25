export function SkeletonCourseCard() {
    return (
        <div className="flex flex-col md:flex-row glass-panel rounded-xl overflow-hidden shadow-lg h-auto md:h-[180px] animate-pulse">
            {/* Visual Section: Top on Mobile, Left on Desktop */}
            <div className="w-full h-48 md:w-[200px] md:h-auto shrink-0 skeleton-bone border-b md:border-b-0 md:border-r border-gray-800"></div>

            {/* Content Section: Bottom on Mobile, Right on Desktop */}
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div className="flex flex-col h-full">
                    {/* Top Bar: Level & Lesson Count */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-5 w-20 skeleton-bone rounded-full"></div>
                        <div className="h-4 w-24 skeleton-bone rounded"></div>
                    </div>

                    {/* Title */}
                    <div className="h-6 w-3/4 skeleton-bone rounded mb-2"></div>

                    {/* Description */}
                    <div className="space-y-2 mb-4 md:mb-0">
                        <div className="h-4 w-full skeleton-bone rounded"></div>
                        <div className="h-4 w-5/6 skeleton-bone rounded"></div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-grow"></div>

                    {/* Bottom Bar: Duration & CTA */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800/50">
                        <div className="h-4 w-24 skeleton-bone rounded"></div>
                        <div className="h-4 w-28 skeleton-bone rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonCourseGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCourseCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonList() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass-panel rounded-xl p-6 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-4 skeleton-bone rounded w-20"></div>
                                <div className="h-4 skeleton-bone rounded w-24"></div>
                            </div>
                            <div className="h-6 skeleton-bone rounded w-3/4 mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-4 skeleton-bone rounded w-full"></div>
                                <div className="h-4 skeleton-bone rounded w-5/6"></div>
                            </div>
                        </div>
                        <div className="h-10 w-10 skeleton-bone rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

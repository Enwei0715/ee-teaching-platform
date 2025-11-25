export function SkeletonTable() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Toolbar Skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-10 skeleton-bone rounded w-64"></div>
                <div className="h-10 skeleton-bone rounded w-32"></div>
            </div>

            {/* Table Skeleton */}
            <div className="border border-border-primary rounded-lg overflow-hidden bg-bg-secondary/30">
                <div className="h-12 bg-bg-secondary border-b border-border-primary"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 border-b border-border-primary flex items-center px-6 gap-4">
                        <div className="h-4 skeleton-bone rounded w-1/4"></div>
                        <div className="h-4 skeleton-bone rounded w-1/4"></div>
                        <div className="h-4 skeleton-bone rounded w-1/6 ml-auto"></div>
                        <div className="h-8 skeleton-bone rounded w-8"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

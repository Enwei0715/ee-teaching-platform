export function SkeletonDetail() {
    return (
        <div className="animate-pulse space-y-8">
            {/* Hero Section */}
            <div className="space-y-6 text-center max-w-3xl mx-auto py-8">
                <div className="h-4 skeleton-bone rounded w-32 mx-auto"></div>
                <div className="h-10 skeleton-bone rounded w-3/4 mx-auto"></div>
                <div className="h-6 skeleton-bone rounded w-1/2 mx-auto"></div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-64 skeleton-bone rounded-xl w-full"></div>
                <div className="space-y-4">
                    <div className="h-4 skeleton-bone rounded w-full"></div>
                    <div className="h-4 skeleton-bone rounded w-full"></div>
                    <div className="h-4 skeleton-bone rounded w-5/6"></div>
                    <div className="h-4 skeleton-bone rounded w-full"></div>
                    <div className="h-4 skeleton-bone rounded w-4/5"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="h-40 skeleton-bone rounded-xl"></div>
                    <div className="h-40 skeleton-bone rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}

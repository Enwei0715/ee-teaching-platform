export function SkeletonForm() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 skeleton-bone rounded w-1/3"></div>
                <div className="h-4 skeleton-bone rounded w-1/2"></div>
            </div>

            <div className="space-y-6 glass-panel rounded-xl p-6 md:p-8">
                <div className="space-y-2">
                    <div className="h-4 skeleton-bone rounded w-24"></div>
                    <div className="h-10 skeleton-bone rounded w-full"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 skeleton-bone rounded w-32"></div>
                    <div className="h-32 skeleton-bone rounded w-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 skeleton-bone rounded w-20"></div>
                        <div className="h-10 skeleton-bone rounded w-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 skeleton-bone rounded w-24"></div>
                        <div className="h-10 skeleton-bone rounded w-full"></div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <div className="h-10 skeleton-bone rounded w-24"></div>
                    <div className="h-10 skeleton-bone rounded w-32"></div>
                </div>
            </div>
        </div>
    );
}

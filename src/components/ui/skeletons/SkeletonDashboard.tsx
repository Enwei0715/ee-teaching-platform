export function SkeletonDashboard() {
    return (
        <div>
            {/* Page Title */}
            <div className="h-9 skeleton-bone rounded w-64 mb-8 animate-pulse"></div>

            {/* Stats Grid - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 skeleton-bone rounded-lg w-12 h-12"></div>
                        </div>
                        <div className="h-8 skeleton-bone rounded w-16 mb-2"></div>
                        <div className="h-4 skeleton-bone rounded w-32"></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Grid - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-xl border border-gray-800 animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 skeleton-bone rounded-lg w-12 h-12"></div>
                            <div className="h-7 skeleton-bone rounded w-48"></div>
                        </div>
                        <div className="h-4 skeleton-bone rounded w-full"></div>
                    </div>
                ))}
            </div>

            {/* System Status */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 animate-pulse">
                <div className="h-6 skeleton-bone rounded w-40 mb-4"></div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 skeleton-bone rounded-full"></div>
                    <div className="h-4 skeleton-bone rounded w-48"></div>
                </div>
            </div>
        </div>
    );
}

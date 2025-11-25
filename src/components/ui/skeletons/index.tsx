export function SkeletonParagraph({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 bg-gray-800 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'
                        }`}
                />
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900 border-b border-gray-800">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-800 rounded" />
                ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800"
                >
                    {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-gray-800 rounded" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonForm() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title Input */}
            <div>
                <div className="h-4 bg-gray-800 rounded w-20 mb-2" />
                <div className="h-12 bg-gray-800 rounded w-full" />
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Slug/URL */}
                    <div>
                        <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
                        <div className="h-10 bg-gray-800 rounded w-full" />
                    </div>

                    {/* Rich Text Editor Placeholder */}
                    <div>
                        <div className="h-4 bg-gray-800 rounded w-32 mb-2" />
                        <div className="h-96 bg-gray-800 rounded w-full" />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="h-6 bg-gray-800 rounded w-28 mb-4" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                            <div className="h-4 bg-gray-800 rounded w-20 mb-2" />
                            <div className="h-10 bg-gray-800 rounded w-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <div className="h-10 bg-blue-900 rounded w-32" />
                <div className="h-10 bg-gray-800 rounded w-24" />
            </div>
        </div>
    );
}

export function SkeletonDetailPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
            {/* Header */}
            <div className="mb-8">
                <div className="h-10 bg-gray-800 rounded w-3/4 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-4 bg-gray-800 rounded w-24" />
                    <div className="h-4 bg-gray-800 rounded w-32" />
                </div>
            </div>
            {/* Cover Image */}
            <div className="w-full h-96 bg-gray-800 rounded-xl mb-8" />
            {/* Content */}
            <div className="space-y-6">
                <SkeletonParagraph lines={4} />
                <SkeletonParagraph lines={3} />
                <SkeletonParagraph lines={5} />
            </div>
        </div>
    );
}

export function SkeletonLessonPlayer() {
    return (
        <div className="flex h-screen animate-pulse">
            {/* Sidebar */}
            <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 space-y-3">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-6" />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded">
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-800 rounded w-full" />
                            <div className="h-3 bg-gray-800 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="h-8 bg-gray-800 rounded w-1/2 mb-6" />
                <div className="h-96 bg-gray-800 rounded-xl mb-6" />
                <SkeletonParagraph lines={6} />
            </div>
        </div>
    );
}

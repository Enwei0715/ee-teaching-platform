import { SkeletonCourseGrid } from './SkeletonCourseCard';

export function SkeletonCoursesPage() {
    return (
        <div className="px-4 py-6 md:px-8 md:py-12 flex-1 relative overflow-hidden min-h-screen bg-transparent animate-pulse">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <div className="h-10 w-48 skeleton-bone rounded mb-2"></div>
                        <div className="h-5 w-64 skeleton-bone rounded"></div>
                    </div>
                    {/* Search Bar Placeholder */}
                    <div className="w-full md:w-64 h-10 skeleton-bone rounded-lg"></div>
                </div>

                {/* Course Grid */}
                <SkeletonCourseGrid />
            </div>
        </div>
    );
}

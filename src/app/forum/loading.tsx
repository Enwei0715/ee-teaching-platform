import { SkeletonList } from '@/components/ui/skeletons';

export default function Loading() {
    return (
        <div className="bg-transparent px-4 py-6 md:px-6 md:py-12 flex-1 flex flex-col relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="h-10 bg-gray-800 rounded w-96 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-800 rounded w-[28rem] mx-auto animate-pulse"></div>
                </div>

                {/* Create Post Form Skeleton */}
                <div className="glass-panel rounded-xl p-6 mb-8 animate-pulse">
                    <div className="h-6 skeleton-bone rounded w-40 mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-12 skeleton-bone rounded w-full"></div>
                        <div className="h-32 skeleton-bone rounded w-full"></div>
                        <div className="flex justify-end gap-3">
                            <div className="h-10 skeleton-bone rounded w-24"></div>
                            <div className="h-10 skeleton-bone rounded w-32"></div>
                        </div>
                    </div>
                </div>

                {/* Forum List */}
                <SkeletonList />
            </div>
        </div>
    );
}

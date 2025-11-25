import { SkeletonList } from '@/components/ui/skeletons';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-12 text-center space-y-4">
                <div className="h-10 bg-gray-800 rounded w-64 mx-auto animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <SkeletonList />
        </div>
    );
}

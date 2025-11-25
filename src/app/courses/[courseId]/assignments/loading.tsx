import { SkeletonList } from '@/components/ui/skeletons';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-8">
                <div className="h-8 bg-gray-800 rounded w-48 animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-96 animate-pulse"></div>
            </div>
            <SkeletonList />
        </div>
    );
}

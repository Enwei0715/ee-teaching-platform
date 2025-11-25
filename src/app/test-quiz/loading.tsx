import { SkeletonList } from '@/components/ui/skeletons';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
            <SkeletonList />
        </div>
    );
}

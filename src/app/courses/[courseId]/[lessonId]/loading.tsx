import { SkeletonPlayer } from '@/components/ui/skeletons';

export default function Loading() {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <SkeletonPlayer />
        </div>
    );
}

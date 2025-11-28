import { CheckCircle2, PlayCircle, RotateCw, Circle } from 'lucide-react';

interface StatusIconProps {
    status?: string | null; // 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'REVIEWING'
    index: number;
    className?: string;
}

export const StatusIcon = ({ status, index, className }: StatusIconProps) => {
    const formattedIndex = String(index + 1).padStart(2, '0');

    switch (status) {
        case 'COMPLETED':
            return <CheckCircle2 className={`w-6 h-6 text-green-500 ${className}`} />;
        case 'REVIEWING':
            return <RotateCw className={`w-6 h-6 text-amber-500 ${className}`} />;
        case 'IN_PROGRESS':
            return <PlayCircle className={`w-6 h-6 text-blue-500 ${className}`} />;
        case 'NOT_STARTED':
        default:
            return (
                <div className={`w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-400 font-mono ${className}`}>
                    {formattedIndex}
                </div>
            );
    }
};

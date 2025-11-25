'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight, Edit2 } from 'lucide-react';
import EditableText from '@/components/ui/EditableText';
import EditableImage from '@/components/ui/EditableImage';
import { useEditMode } from '@/context/EditModeContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
    title: string;
    description: string;
    slug: string;
    level: string;
    duration?: string;
    image?: string | null;
    id: string;
    lessonCount?: number;
}

export default function CourseCard({ id, title, description, slug, level, duration, image, lessonCount }: CourseCardProps) {
    const { isEditMode } = useEditMode();
    const { data: session } = useSession();
    const router = useRouter();

    const getLevelStyles = () => {
        switch (level) {
            case 'Beginner':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Intermediate':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Advanced':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    // Helper to determine if the image string is a URL
    const isUrl = (str?: string | null) => {
        if (!str) return false;
        return str.startsWith('http') || str.startsWith('/');
    };

    const hasImage = !!image;
    const isEmoji = hasImage && !isUrl(image);

    return (
        <div className="relative group">
            {/* Edit Shortcut Icon (Admin Edit Mode Only) */}
            {isEditMode && session?.user?.role === 'ADMIN' && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/admin/courses/${slug}`);
                    }}
                    className="absolute top-4 right-4 p-2 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500 z-10"
                    title="Edit this course"
                >
                    <Edit2 size={16} />
                </button>
            )}

            <Link
                href={`/courses/${slug}`}
                className="flex flex-col md:flex-row glass-panel rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700 h-auto md:h-[180px]"
            >
                {/* Visual Section: Top on Mobile, Left on Desktop */}
                <div className="w-full h-48 md:w-[200px] md:h-auto shrink-0 relative glass-ghost flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
                    {hasImage ? (
                        isUrl(image) ? (
                            // Scenario A: Photo/Thumbnail
                            <EditableImage
                                src={image!}
                                alt={title}
                                className="w-full h-full object-cover"
                                mode="entity"
                                apiEndpoint={`/api/courses/${id}`}
                                fieldName="image"
                            />
                        ) : (
                            // Scenario B: Emoji Icon
                            <span className="text-5xl select-none">{image}</span>
                        )
                    ) : (
                        // Scenario B: Placeholder Icon
                        <BookOpen size={40} className="text-gray-600" />
                    )}
                </div>

                {/* Content Section: Bottom on Mobile, Right on Desktop */}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${getLevelStyles()}`}>
                                {level}
                            </span>
                            {lessonCount !== undefined && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <BookOpen size={12} />
                                    <span>{lessonCount} Lessons</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-100 mb-2 hover:text-accent-primary transition-colors line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 md:mb-0">
                            {description}
                        </p>

                        {/* Spacer to push footer to bottom in flex-col layout if needed */}
                        <div className="flex-grow"></div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800/50">
                            <div className="text-xs text-gray-500 font-medium">
                                {duration || 'Self-paced'}
                            </div>
                            <div className="flex items-center text-accent-primary text-xs font-medium">
                                Start Learning <ArrowRight size={14} className="ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

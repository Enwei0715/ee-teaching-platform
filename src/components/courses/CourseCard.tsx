import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';


interface CourseCardProps {
    title: string;
    description: string;
    slug: string;
    level: string;
    duration?: string;
    image?: string | null;
    lessonCount?: number;
}

export default function CourseCard({ title, description, slug, level, duration, image, lessonCount }: CourseCardProps) {
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
        <Link
            href={`/courses/${slug}`}
            className="flex flex-col md:flex-row border border-gray-800 rounded-xl overflow-hidden bg-gray-900/50 hover:bg-gray-900 h-auto md:h-[180px] hover:border-accent-primary transition-all group"
        >
            {/* Visual Section: Top on Mobile, Left on Desktop */}
            <div className="w-full h-48 md:w-[200px] md:h-auto shrink-0 relative bg-gray-800/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
                {hasImage ? (
                    isUrl(image) ? (
                        // Scenario A: Photo/Thumbnail
                        <img
                            src={image!}
                            alt={title}
                            className="w-full h-full object-cover"
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
                    <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-accent-primary transition-colors line-clamp-1">
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
                        <div className="flex items-center text-accent-primary text-xs font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity md:-translate-x-2 group-hover:translate-x-0 duration-300">
                            Start Learning <ArrowRight size={14} className="ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

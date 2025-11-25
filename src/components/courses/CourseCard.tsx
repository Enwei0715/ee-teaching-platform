import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import styles from './CourseCard.module.css';

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

    return (
        <Link href={`/courses/${slug}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {image ? (
                    isUrl(image) ? (
                        <img src={image} alt={title} className="w-12 h-12 object-contain" />
                    ) : (
                        <span className="text-4xl">{image}</span>
                    )
                ) : (
                    <BookOpen size={48} className={styles.placeholderIcon} />
                )}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.meta}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelStyles()}`}>
                        {level}
                    </span>
                    {duration && <span>{duration}</span>}
                    {lessonCount !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <BookOpen size={12} />
                            <span>{lessonCount} Lessons</span>
                        </div>
                    )}
                    <ArrowRight size={16} className={styles.arrow} />
                </div>
            </div>
        </Link>
    );
}

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    title: string;
    description: string;
    slug: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
}

export default function CourseCard({ title, description, slug, level, duration }: CourseCardProps) {
    const getLevelStyles = () => {
        switch (level) {
            case 'Beginner':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Advanced':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <Link href={`/courses/${slug}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <BookOpen size={48} className={styles.placeholderIcon} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.meta}>
                    <span className={`px-2 py-1 rounded-xl text-xs font-medium border ${getLevelStyles()}`}>
                        {level}
                    </span>
                    <span>{duration}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                </div>
            </div>
        </Link>
    );
}

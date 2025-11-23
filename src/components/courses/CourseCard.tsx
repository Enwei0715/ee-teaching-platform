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
    return (
        <Link href={`/courses/${slug}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <BookOpen size={48} className={styles.placeholderIcon} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.meta}>
                    <span className={styles.level}>{level}</span>
                    <span>{duration}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                </div>
            </div>
        </Link>
    );
}

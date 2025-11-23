import Link from 'next/link';
import styles from './BlogCard.module.css';

interface BlogCardProps {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    tags: string[];
}

export default function BlogCard({ title, excerpt, slug, date, tags }: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`} className={styles.card}>
            <div className={styles.content}>
                <span className={styles.date}>{date}</span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>
                <div className={styles.meta}>
                    <div className={styles.tags}>
                        {tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                    <span className={styles.readMore}>Read more →</span>
                </div>
            </div>
        </Link>
    );
}

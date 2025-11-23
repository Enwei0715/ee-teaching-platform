import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function FeaturedCourses() {
    // Fetch top 3 published courses from database
    const courses = await prisma.course.findMany({
        where: { published: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            level: true,
        }
    });

    return (
        <section className="py-20 bg-bg-secondary">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text-primary mb-4">Popular Courses</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Start your journey with our most popular engineering tracks.
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-bg-primary border border-border-primary rounded-xl p-12 max-w-md mx-auto">
                            <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-text-primary mb-2">Courses Coming Soon</h3>
                            <p className="text-text-secondary">
                                We're working on creating amazing courses for you. Check back soon!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="block group bg-bg-primary border border-border-primary rounded-lg p-6 hover:border-accent-primary transition-colors"
                            >
                                <div className="mb-4">
                                    <BookOpen className="w-10 h-10 text-accent-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                    {course.description}
                                </p>
                                <span className="inline-block px-3 py-1 bg-bg-tertiary text-text-secondary text-xs rounded-full border border-border-primary">
                                    {course.level}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

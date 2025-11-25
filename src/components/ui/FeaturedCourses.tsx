import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import CourseCard from '@/components/courses/CourseCard';

export default async function FeaturedCourses() {
    // Fetch top 4 published courses from database
    const courses = await prisma.course.findMany({
        where: { published: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            level: true,
            image: true,
            duration: true,
            _count: {
                select: { lessons: true }
            }
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                title={course.title}
                                description={course.description}
                                slug={course.slug}
                                level={course.level}
                                duration={course.duration || undefined}
                                image={course.image}
                                lessonCount={course._count.lessons}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

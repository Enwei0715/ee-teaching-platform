import Link from 'next/link';
import { Cpu, Zap, Radio, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';

// Force dynamic rendering to disable caching
export const dynamic = 'force-dynamic';

const iconMap: any = {
    'circuit-theory': Zap,
    'electronics': Radio,
    'electronics-101': Radio, // Added mapping for electronics-101
    'digital-logic': Cpu,
    'microcontrollers': Cpu,
    'fpga-design': Cpu,
    'signals-systems': Radio,
};

const colorMap: any = {
    'circuit-theory': 'text-yellow-500',
    'electronics': 'text-blue-500',
    'electronics-101': 'text-blue-500', // Added color for electronics-101
    'digital-logic': 'text-green-500',
    'microcontrollers': 'text-purple-500',
    'fpga-design': 'text-red-500',
    'signals-systems': 'text-orange-500',
};

export default async function CoursesPage() {
    // Direct database query with Prisma
    const courses = await prisma.course.findMany({
        where: {
            published: true, // Only fetch published courses
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: { lessons: true } // To show lesson count on card
            }
        }
    });

    // Debug logging - check terminal/console to see what's fetched
    console.log('Fetched Courses:', courses);
    console.log('Number of courses:', courses.length);

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">All Courses</h1>
                    <p className="text-text-secondary text-lg max-w-3xl">
                        Explore our comprehensive curriculum designed to take you from novice to expert in electronic engineering.
                    </p>
                    {/* Debug info - remove this after fixing */}
                    {courses.length === 0 && (
                        <p className="text-red-500 mt-4">
                            No courses found. Check that courses in the database have published=true.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => {
                        const Icon = iconMap[course.slug] || Cpu;
                        const color = colorMap[course.slug] || 'text-indigo-500';

                        return (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="block group bg-bg-secondary border border-border-primary rounded-lg overflow-hidden hover:border-accent-primary transition-colors"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Icon className={`w-10 h-10 ${color}`} />
                                        <span className="px-3 py-1 bg-bg-tertiary text-text-secondary text-xs rounded-full border border-border-primary">
                                            {course.level}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-6">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center text-text-secondary text-sm">
                                        <BookOpen size={16} className="mr-2" />
                                        <span>{course._count.lessons || 0} Lessons</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

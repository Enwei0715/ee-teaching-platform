import Link from 'next/link';
import { Cpu, Zap, Radio, BookOpen, Wifi, Layout } from 'lucide-react';
import prisma from '@/lib/prisma';
import CourseCard from '@/components/courses/CourseCard';

// Force dynamic rendering to disable caching
export const dynamic = 'force-dynamic';

const iconMap: any = {
    'circuit-theory': Zap,
    'electronics': Radio,
    'digital-logic': Cpu,
    'microcontrollers': Cpu,
    'fpga-design': Cpu,
    'signals-systems': Radio,
    'embedded-systems': Cpu,
    'iot-basics': Wifi,
    'pcb-design': Layout,
};

const colorMap: any = {
    'circuit-theory': 'text-yellow-500',
    'electronics': 'text-blue-500',
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
            </div>
        </main>
    );
}

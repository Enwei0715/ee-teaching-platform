import Link from 'next/link';
import { Cpu, Zap, Radio, BookOpen, Wifi, Layout } from 'lucide-react';
import prisma from '@/lib/prisma';
import CourseCard from '@/components/courses/CourseCard';
import EditableText from '@/components/ui/EditableText';

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
        <div className="px-4 py-6 md:px-8 md:py-12 flex-1 relative overflow-hidden min-h-screen bg-transparent">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12">
                    <EditableText
                        contentKey="courses_header_title"
                        defaultText="All Courses"
                        tag="h1"
                        className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                    />
                    <EditableText
                        contentKey="courses_header_description"
                        defaultText="Explore our comprehensive curriculum designed to take you from novice to expert in electronic engineering."
                        tag="p"
                        className="text-text-secondary text-lg max-w-3xl"
                        multiline
                    />
                    {/* Debug info - remove this after fixing */}
                    {courses.length === 0 && (
                        <p className="text-red-500 mt-4">
                            No courses found. Check that courses in the database have published=true.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
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
        </div>
    );
}

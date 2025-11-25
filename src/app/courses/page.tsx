'use client';

import Link from 'next/link';
import { Cpu, Zap, Radio, BookOpen, Wifi, Layout } from 'lucide-react';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import EditableText from '@/components/ui/EditableText';
import DotGridBackground from '@/components/ui/DotGridBackground';

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

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="py-8 px-6 relative overflow-hidden">
                <DotGridBackground />
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header Skeleton */}
                    <div className="mb-12 animate-pulse">
                        <div className="h-10 bg-gray-800 rounded w-64 mb-4"></div>
                        <div className="h-6 bg-gray-800 rounded w-96 max-w-full"></div>
                    </div>

                    {/* Course Cards Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row border border-gray-800 bg-gray-900 rounded-xl overflow-hidden h-56 animate-pulse">
                                {/* Thumbnail Skeleton */}
                                <div className="w-full md:w-56 bg-gray-800 h-full"></div>
                                {/* Content Skeleton */}
                                <div className="flex-1 p-6 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-gray-800 rounded"></div>
                                        <div className="h-6 bg-gray-800 rounded w-32"></div>
                                    </div>
                                    <div className="h-7 bg-gray-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                                    <div className="flex gap-3 mt-4">
                                        <div className="h-6 bg-gray-800 rounded w-20"></div>
                                        <div className="h-6 bg-gray-800 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-6 relative overflow-hidden">
            <DotGridBackground />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12">
                    <EditableText
                        contentKey="courses_header_title"
                        defaultText="All Courses"
                        tag="h1"
                        className="text-4xl font-bold text-text-primary mb-4"
                    />
                    <EditableText
                        contentKey="courses_header_description"
                        defaultText="Explore our comprehensive curriculum designed to take you from novice to expert in electronic engineering."
                        tag="p"
                        className="text-text-secondary text-lg max-w-3xl"
                        multiline
                    />
                    {courses.length === 0 && (
                        <p className="text-red-500 mt-4">
                            No courses found. Check that courses in the database have published=true.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

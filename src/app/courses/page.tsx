import Link from 'next/link';
import { Cpu, Zap, Radio, BookOpen } from 'lucide-react';
import { getAllCourses } from '@/lib/mdx';

const iconMap: any = {
    'circuit-theory': Zap,
    'electronics': Radio,
    'digital-logic': Cpu,
    'microcontrollers': Cpu,
    'fpga-design': Cpu,
    'signals-systems': Radio,
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
    const allCourses = await getAllCourses();

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">All Courses</h1>
                    <p className="text-text-secondary text-lg max-w-3xl">
                        Explore our comprehensive curriculum designed to take you from novice to expert in electronic engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allCourses.map((course) => {
                        const Icon = iconMap[course.id] || Cpu;
                        const color = colorMap[course.id] || 'text-indigo-500';

                        return (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
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
                                        <span>{course.modules || 0} Modules</span>
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

import Link from 'next/link';
import { Cpu, Zap, Radio } from 'lucide-react';

const courses = [
    {
        id: 'circuit-theory',
        title: 'Circuit Theory',
        description: 'Master the fundamentals of electrical circuits, from Ohm\'s law to complex network analysis.',
        icon: Zap,
        color: 'text-yellow-500',
        level: 'Beginner',
    },
    {
        id: 'electronics',
        title: 'Analog Electronics',
        description: 'Dive into semiconductor physics, diodes, transistors, and amplifier design.',
        icon: Radio,
        color: 'text-blue-500',
        level: 'Intermediate',
    },
    {
        id: 'digital-logic',
        title: 'Digital Logic Design',
        description: 'Understand boolean algebra, logic gates, and sequential circuits.',
        icon: Cpu,
        color: 'text-green-500',
        level: 'Beginner',
    },
];

export default function FeaturedCourses() {
    return (
        <section className="py-20 bg-bg-secondary">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text-primary mb-4">Popular Courses</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Start your journey with our most popular engineering tracks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="block group bg-bg-primary border border-border-primary rounded-lg p-6 hover:border-accent-primary transition-colors"
                        >
                            <div className="mb-4">
                                <course.icon className={`w-10 h-10 ${course.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-4">
                                {course.description}
                            </p>
                            <span className="inline-block px-3 py-1 bg-bg-tertiary text-text-secondary text-xs rounded-full border border-border-primary">
                                {course.level}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

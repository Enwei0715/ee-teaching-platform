import prisma from "@/lib/prisma";
import CourseListTable from "./CourseListTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { lessons: true }
            }
        }
    });

    const formattedCourses = courses.map(course => ({
        slug: course.slug,
        meta: {
            title: course.title,
            description: course.description,
            level: course.level,
            published: course.published,
            modules: course._count.lessons
        }
    }));

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Course Management</h1>
                <Link
                    href="/admin/courses/new"
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-indigo-600 text-white text-sm lg:text-base rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                >
                    <Plus size={16} className="lg:w-5 lg:h-5" />
                    New Course
                </Link>
            </div>

            <CourseListTable initialCourses={formattedCourses} />
        </div>
    );
}

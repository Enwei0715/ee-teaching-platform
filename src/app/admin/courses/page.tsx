import CourseListTable from "./CourseListTable";
import { getAllCourses } from "@/lib/mdx";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCoursesPage() {
    const courses = await getAllCourses();

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

            <CourseListTable initialCourses={courses} />
        </div>
    );
}

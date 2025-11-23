import CourseListTable from "./CourseListTable";
import { getAllCourses } from "@/lib/mdx";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCoursesPage() {
    const courses = await getAllCourses();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Course Management</h1>
                <Link
                    href="/admin/courses/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    New Course
                </Link>
            </div>

            <CourseListTable initialCourses={courses} />
        </div>
    );
}

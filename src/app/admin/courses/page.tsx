import CourseListTable from "./CourseListTable";
import { getAllCourses } from "@/lib/mdx";

export default async function AdminCoursesPage() {
    const courses = await getAllCourses();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Course Management</h1>
                <div className="text-sm text-gray-400">
                    Managed via MDX files & course.json
                </div>
            </div>

            <CourseListTable initialCourses={courses} />
        </div>
    );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProjects } from "@/lib/mdx";
import ProjectListTable from "./ProjectListTable";

export default async function AdminProjectsPage() {
    const projects = await getAllProjects();

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Projects Management</h1>
                <Link href="/admin/projects/new" className="bg-indigo-600 text-white px-3 py-2 lg:px-4 lg:py-2 text-sm lg:text-base rounded-lg flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-indigo-700 transition-colors whitespace-nowrap">
                    <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
                    New Project
                </Link>
            </div>

            <ProjectListTable initialProjects={projects} />
        </div>
    );
}

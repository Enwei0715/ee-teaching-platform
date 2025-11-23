import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProjects } from "@/lib/mdx";
import ProjectListTable from "./ProjectListTable";

export default async function AdminProjectsPage() {
    const projects = await getAllProjects();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Projects Management</h1>
                <Link href="/admin/projects/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                    <Plus size={18} />
                    New Project
                </Link>
            </div>

            <ProjectListTable initialProjects={projects} />
        </div>
    );
}

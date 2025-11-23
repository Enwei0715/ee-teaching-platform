import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const coursesDir = path.join(process.cwd(), 'src/content/courses');

        if (!fs.existsSync(coursesDir)) {
            return NextResponse.json([]);
        }

        const dirs = fs.readdirSync(coursesDir).filter(file => {
            return fs.statSync(path.join(coursesDir, file)).isDirectory();
        });

        const courses = dirs.map(slug => {
            const courseJsonPath = path.join(coursesDir, slug, 'course.json');
            let meta = { title: slug, description: '', level: 'Beginner' };

            if (fs.existsSync(courseJsonPath)) {
                try {
                    const fileContent = fs.readFileSync(courseJsonPath, 'utf-8');
                    meta = JSON.parse(fileContent);
                } catch (e) {
                    console.error(`Error parsing course.json for ${slug}`, e);
                }
            }

            return {
                slug,
                meta
            };
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error listing courses:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

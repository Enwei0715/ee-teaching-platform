import Hero from "@/components/ui/Hero";
import FeaturedCourses from "@/components/ui/FeaturedCourses";
import ResumeLearningPrompt from "@/components/dashboard/ResumeLearningPrompt";

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <Hero />
            <FeaturedCourses />
            <ResumeLearningPrompt />
            {/* Other sections will go here */}
        </main>
    );
}

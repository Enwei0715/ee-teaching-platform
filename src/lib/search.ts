import { getAllBlogPosts, getAllProjects, getAllCourses, getCourseStructure } from './mdx';

export type SearchResult = {
    type: 'blog' | 'course' | 'project';
    title: string;
    description: string;
    url: string;
    tags?: string[];
};

export const getSearchIndex = async (): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];

    // Index Blog Posts
    const posts = await getAllBlogPosts();
    posts.forEach(post => {
        results.push({
            type: 'blog',
            title: post.meta.title,
            description: post.meta.description || post.meta.description || '',
            url: `/blog/${post.slug}`,
            tags: post.meta.tags || [post.meta.category || 'Blog'],
        });
    });

    // Index Projects
    const projects = await getAllProjects();
    projects.forEach(project => {
        results.push({
            type: 'project',
            title: project.meta.title,
            description: project.meta.description,
            url: `/projects/${project.slug}`,
            tags: project.meta.tags || [project.meta.difficulty || 'Project'],
        });
    });

    // Index Courses
    const courses = await getAllCourses();
    for (const course of courses) {
        // Add the course itself
        results.push({
            type: 'course',
            title: course.title,
            description: course.description,
            url: `/courses/${course.id}`,
            tags: ['Course', course.level],
        });

        // Index Lessons
        const lessons = await getCourseStructure(course.id);
        lessons.forEach(lesson => {
            results.push({
                type: 'course',
                title: lesson.title,
                description: `Lesson ${lesson.order} of ${course.title}`,
                url: `/courses/${course.id}/${lesson.id}`,
                tags: ['Lesson', course.title],
            });
        });
    }

    return results;
};

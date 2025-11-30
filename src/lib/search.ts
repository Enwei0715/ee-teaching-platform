import { getAllBlogPosts, getAllProjects, getAllCourses, getCourseStructure } from './mdx';

export type SearchResult = {
    id?: string;
    type: 'blog' | 'course' | 'project' | 'system' | 'navigation';
    title: string;
    description: string;
    url: string;
    tags?: string[];
    action?: () => void;
    icon?: any;
};

export const getSearchIndex = async (): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];

    // Index Blog Posts
    const posts = await getAllBlogPosts();
    posts.forEach(post => {
        results.push({
            id: `blog-${post.slug}`,
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
            id: `project-${project.slug}`,
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
            id: `course-${course.id}`,
            type: 'course',
            title: course.title,
            description: course.description,
            url: `/courses/${course.slug}`, // Use slug
            tags: ['Course', course.level],
        });

        // Index Lessons
        // Note: getCourseStructure might take ID or Slug depending on implementation. 
        // Based on previous usage in LessonContent, it likely takes ID to fetch, but we need slugs for URL.
        const lessons = await getCourseStructure(course.id);
        lessons.forEach(lesson => {
            results.push({
                id: `lesson-${lesson.id}`,
                type: 'course',
                title: lesson.title,
                description: `Lesson ${lesson.order} of ${course.title}`,
                url: `/courses/${course.slug}/${lesson.slug}`, // Use slugs
                tags: ['Lesson', course.title],
            });
        });
    }

    return results;
};

import { getAllBlogPosts, getAllProjects, getCourseStructure } from './mdx';

export type SearchResult = {
    type: 'blog' | 'course' | 'project';
    title: string;
    description: string;
    url: string;
    tags?: string[];
};

export const getSearchIndex = (): SearchResult[] => {
    const results: SearchResult[] = [];

    // Index Blog Posts
    const posts = getAllBlogPosts();
    posts.forEach(post => {
        results.push({
            type: 'blog',
            title: post.meta.title,
            description: post.meta.excerpt || post.meta.description || '',
            url: `/blog/${post.slug}`,
            tags: post.meta.tags || [post.meta.category || 'Blog'],
        });
    });

    // Index Projects
    const projects = getAllProjects();
    projects.forEach(project => {
        results.push({
            type: 'project',
            title: project.meta.title,
            description: project.meta.description,
            url: `/projects/${project.slug}`,
            tags: project.meta.tags || [project.meta.difficulty || 'Project'],
        });
    });

    // Index Courses (Hardcoded for now as we don't have a getAllCourses yet, but we can infer from structure)
    // In a real app, we'd have a getAllCourses. For now, let's index the lessons of the known courses.
    const knownCourses = ['circuit-theory']; // We could scan the directory, but this is faster for now.

    knownCourses.forEach(courseId => {
        const lessons = getCourseStructure(courseId);
        lessons.forEach(lesson => {
            results.push({
                type: 'course',
                title: lesson.title,
                description: `Lesson ${lesson.order} of ${courseId.replace('-', ' ')}`,
                url: `/courses/${courseId}/${lesson.id}`,
                tags: ['Lesson', courseId],
            });
        });

        // Add the course itself
        results.push({
            type: 'course',
            title: courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            description: 'Full Course',
            url: `/courses/${courseId}`,
            tags: ['Course'],
        });
    });

    return results;
};

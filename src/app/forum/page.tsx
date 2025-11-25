import ForumList from '@/components/forum/ForumList';
import CreatePostForm from '@/components/forum/CreatePostForm';
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid';

export default function ForumPage() {
    return (
        <div className="bg-transparent px-4 py-6 md:px-6 md:py-12 flex-1 flex flex-col relative overflow-hidden">
            <InteractiveDotGrid />
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Discussion Forum</h1>
                    <p className="text-text-secondary text-lg">Join the community, ask questions, and share your knowledge.</p>
                </div>

                <CreatePostForm />
                <ForumList />
            </div>
        </div>
    );
}

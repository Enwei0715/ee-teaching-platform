import ForumList from '@/components/forum/ForumList';
import CreatePostForm from '@/components/forum/CreatePostForm';

export default function ForumPage() {
    return (
        <div className="bg-bg-primary py-12 px-6">
            <div className="max-w-4xl mx-auto">
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

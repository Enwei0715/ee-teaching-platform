
import prisma from "@/lib/prisma";
import { CheckCircle, XCircle, AlertCircle, MessageSquare, Monitor, User } from "lucide-react";
import { FeedbackItem } from "@/components/admin/FeedbackItem";

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
    const feedbacks = await prisma.feedback.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            }
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="text-blue-500" />
                    Feedback Reports
                </h1>
            </div>

            <div className="grid gap-6">
                {feedbacks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                        <MessageSquare size={48} className="mx-auto text-gray-700 mb-4" />
                        <h3 className="text-xl font-medium text-gray-400">No feedback reports yet</h3>
                    </div>
                ) : (
                    feedbacks.map((item) => (
                        <FeedbackItem key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>
    );
}

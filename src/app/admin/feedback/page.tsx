
import prisma from "@/lib/prisma";
import { CheckCircle, XCircle, AlertCircle, MessageSquare, Monitor, User } from "lucide-react";

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
                        <div key={item.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'bug' ? 'bg-red-500/20 text-red-400' :
                                                item.type === 'feature' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {item.type}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-medium ${item.status === 'RESOLVED' ? 'text-green-500' : 'text-yellow-500'
                                        }`}>
                                        {item.status === 'RESOLVED' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {item.status}
                                    </div>
                                </div>

                                <p className="text-white text-lg mb-6 whitespace-pre-wrap">{item.message}</p>

                                {item.screenshot && (
                                    <div className="mb-6 rounded-lg overflow-hidden border border-gray-800 bg-black/50">
                                        <details className="group">
                                            <summary className="cursor-pointer p-3 text-sm text-gray-400 hover:text-white flex items-center gap-2 select-none">
                                                <Monitor size={16} />
                                                View Screenshot
                                            </summary>
                                            <div className="p-4 pt-0">
                                                <img src={item.screenshot} alt="User Screenshot" className="max-w-full rounded border border-gray-700" />
                                            </div>
                                        </details>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-800 text-sm text-gray-500">
                                    {item.user && (
                                        <div className="flex items-center gap-2">
                                            {item.user.image ? (
                                                <img src={item.user.image} alt={item.user.name || "User"} className="w-6 h-6 rounded-full" />
                                            ) : (
                                                <User size={16} />
                                            )}
                                            <span>{item.user.name} ({item.user.email})</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 truncate max-w-md" title={item.pageUrl}>
                                        <Monitor size={14} />
                                        <a href={item.pageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline truncate">
                                            {item.pageUrl}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

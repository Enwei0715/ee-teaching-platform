"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Monitor, User, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FeedbackUser {
    name: string | null;
    email: string | null;
    image: string | null;
}

interface FeedbackItemProps {
    item: {
        id: string;
        type: string;
        message: string;
        screenshot: string | null;
        pageUrl: string;
        status: string;
        createdAt: Date;
        user: FeedbackUser | null;
    };
}

export function FeedbackItem({ item }: FeedbackItemProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(item.status);

    const handleStatusUpdate = async (newStatus: string) => {
        if (isUpdating) return;
        setIsUpdating(true);
        const originalStatus = status;
        setStatus(newStatus); // Optimistic update

        try {
            const res = await fetch(`/api/feedback/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Marked as ${newStatus}`);
            router.refresh();
        } catch (error) {
            console.error("Failed to update status:", error);
            setStatus(originalStatus); // Revert on error
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden transition-all hover:border-gray-700">
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

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <button disabled={isUpdating} className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${status === 'RESOLVED' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    status === 'DISMISSED' ? 'bg-gray-800 border-gray-700 text-gray-400' :
                                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                }`}>
                                {isUpdating ? <Loader2 size={16} className="animate-spin" /> :
                                    status === 'RESOLVED' ? <CheckCircle size={16} /> :
                                        status === 'DISMISSED' ? <XCircle size={16} /> :
                                            <AlertCircle size={16} />
                                }
                                <span>{status}</span>
                            </button>

                            {/* Hover Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="p-1">
                                    {status !== 'OPEN' && (
                                        <button onClick={() => handleStatusUpdate('OPEN')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-500 hover:bg-gray-800 rounded-lg">
                                            <AlertCircle size={14} /> Mark as Open
                                        </button>
                                    )}
                                    {status !== 'RESOLVED' && (
                                        <button onClick={() => handleStatusUpdate('RESOLVED')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-gray-800 rounded-lg">
                                            <CheckCircle size={14} /> Mark as Resolved
                                        </button>
                                    )}
                                    {status !== 'DISMISSED' && (
                                        <button onClick={() => handleStatusUpdate('DISMISSED')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg">
                                            <XCircle size={14} /> Dismiss
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-white text-lg mb-6 whitespace-pre-wrap">{item.message}</p>

                {item.screenshot && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-gray-800 bg-black/50">
                        <details className="group/details">
                            <summary className="cursor-pointer p-3 text-sm text-gray-400 hover:text-white flex items-center gap-2 select-none transition-colors bg-gray-900/50">
                                <Monitor size={16} />
                                View Screenshot
                            </summary>
                            <div className="p-4 bg-black/40">
                                <img src={item.screenshot} alt="User Screenshot" className="max-w-full rounded border border-gray-800 shadow-lg" loading="lazy" />
                            </div>
                        </details>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-800 text-sm text-gray-500">
                    {item.user ? (
                        <div className="flex items-center gap-2">
                            {item.user.image ? (
                                <img src={item.user.image} alt={item.user.name || "User"} className="w-6 h-6 rounded-full" />
                            ) : (
                                <User size={16} />
                            )}
                            <span className="text-gray-300">{item.user.name}</span>
                            <span className="text-gray-600">({item.user.email})</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>Anonymous</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 truncate max-w-xs md:max-w-md" title={item.pageUrl}>
                        <Monitor size={14} />
                        <a href={item.pageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline truncate transition-colors">
                            {new URL(item.pageUrl).pathname}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

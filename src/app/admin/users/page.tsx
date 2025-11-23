import prisma from "@/lib/prisma";
import { Shield } from "lucide-react";
import DeleteUserButton from "@/app/admin/users/DeleteUserButton";
import EditUserModal from "@/app/admin/users/EditUserModal";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-300">User</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Role</th>
                            <th className="px-6 py-4 font-semibold text-gray-300">Joined</th>
                            <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((user: any) => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name || ""} className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 bg-indigo-900/50 text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                                {user.name?.[0] || "U"}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    {/* @ts-ignore: Role exists in DB but client needs regeneration */}
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                                        {/* @ts-ignore */}
                                        {user.role === 'ADMIN' && <Shield size={12} />}
                                        {/* @ts-ignore */}
                                        {user.role || 'USER'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <EditUserModal user={user} />
                                    <DeleteUserButton userId={user.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

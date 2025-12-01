'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trophy, Award, Flame, BookOpen, MapPin, Briefcase, GraduationCap, Edit2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import EditProfileModal from './EditProfileModal';
import { getLevelProgress } from '@/lib/gamification';

interface ProfileHeaderProps {
    user: {
        id: string;
        name: string | null;
        image: string | null;
        level: number;
        xp: number;
        streak: number;
        occupation: string | null;
        major: string | null;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const { data: session } = useSession();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isOwnProfile = session?.user?.id === user.id;
    const progress = getLevelProgress(user.xp);

    return (
        <>
            <div className="glass-panel p-8 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-white/10 relative group">
                {isOwnProfile && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Profile"
                    >
                        <Edit2 size={18} />
                    </button>
                )}

                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-lg">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || 'User'}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-bold">
                                {(user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-1 border border-white/10">
                        <div className="bg-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Lvl {progress.currentLevel}
                        </div>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <h1 className="text-3xl font-bold">{user.name || 'Anonymous User'}</h1>
                        {/* Level Progress Bar */}
                        <div className="w-full md:w-48 mt-2 md:mt-0">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Lvl {progress.currentLevel}</span>
                                <span>{progress.xpInCurrentLevel} / {progress.xpRequiredForNextLevel} XP</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 mb-4">
                        {user.occupation && (
                            <div className="flex items-center gap-1">
                                <Briefcase size={14} />
                                {user.occupation}
                            </div>
                        )}
                        {user.major && (
                            <div className="flex items-center gap-1">
                                <GraduationCap size={14} />
                                {user.major}
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            Earth
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Flame size={16} className="text-orange-500" />
                            <span className="font-medium">{user.streak || 0} Day Streak</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Award size={16} className="text-yellow-500" />
                            <span className="font-medium">{user.xp || 0} Total XP</span>
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={{
                    occupation: user.occupation,
                    major: user.major
                }}
            />
        </>
    );
}

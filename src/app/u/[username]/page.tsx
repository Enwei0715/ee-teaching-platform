import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Trophy, Award, Flame, BookOpen, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import OscilloscopeBackground from '@/components/ui/OscilloscopeBackground';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        username: string; // This will actually be userId for now
    };
}

export default async function ProfilePage({ params }: Props) {
    const userId = params.username; // Using ID as username for now

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            badges: {
                include: {
                    badge: true
                }
            },
            certificates: {
                include: {
                    course: true
                }
            }
        }
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
            <OscilloscopeBackground />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="glass-panel p-8 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-white/10">
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
                                Lvl {user.level || 1}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                            <h1 className="text-3xl font-bold">{user.name || 'Anonymous User'}</h1>
                            {/* Level Progress Bar */}
                            <div className="w-full md:w-48 mt-2 md:mt-0">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Lvl {user.level || 1}</span>
                                    <span>{user.xp || 0} / {((user.level || 1) + 1) * 100} XP</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, ((user.xp || 0) % 100))}%` }} // Simplified logic for now
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
                                <span className="font-medium">{user.xp || 0} XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Badges & Stats */}
                    <div className="space-y-8">
                        <section className="glass-panel p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" />
                                Badges
                            </h2>
                            {user.badges.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {user.badges.map((ub) => (
                                        <div key={ub.id} className="flex flex-col items-center text-center group">
                                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors border border-white/10">
                                                {/* Placeholder for dynamic icon */}
                                                <Award size={24} className="text-indigo-400" />
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{ub.badge.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No badges earned yet.</p>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Certificates & Projects */}
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Award size={20} className="text-indigo-400" />
                                Certificates
                            </h2>
                            {user.certificates.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.certificates.map((cert) => (
                                        <div key={cert.id} className="glass-panel p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                                    <BookOpen size={20} />
                                                </div>
                                                <span className="text-xs text-gray-500 font-mono">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{cert.course.title}</h3>
                                            <p className="text-xs text-gray-400 mb-3">Completed</p>
                                            <div className="text-xs text-gray-600 font-mono">
                                                ID: {cert.code}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-panel p-8 rounded-xl border border-white/10 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award size={32} className="text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-300 mb-2">No Certificates Yet</h3>
                                    <p className="text-sm text-gray-500">Complete courses to earn certificates and showcase them here.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

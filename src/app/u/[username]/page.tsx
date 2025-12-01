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

import ProfileHeader from '@/components/profile/ProfileHeader';
import BadgeList from '@/components/profile/BadgeList';

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
                <ProfileHeader user={user} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Badges & Stats */}
                    <div className="space-y-8">
                        <section className="glass-panel p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" />
                                Badges
                            </h2>
                            <BadgeList earnedBadges={user.badges} />
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

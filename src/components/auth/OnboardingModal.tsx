'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingModal() {
    const { data: session, update } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [occupation, setOccupation] = useState('Student');
    const [major, setMajor] = useState('Electrical Engineering');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if user is logged in but missing profile info
        if (session?.user) {
            // We check specifically for null or empty string, but NOT undefined
            // because undefined might mean the session hasn't fully loaded the custom fields yet.
            // However, our authOptions usually populate them.
            // Let's check if they are explicitly missing.

            const isMissingInfo = !session.user.occupation || !session.user.major;

            if (isMissingInfo) {
                setIsOpen(true);
            }
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ occupation, major }),
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            // Update session client-side to reflect changes immediately
            await update({
                ...session,
                user: {
                    ...session?.user,
                    occupation,
                    major
                }
            });

            toast.success('Profile updated successfully!');
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            setError('Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-bg-secondary border border-border-primary rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border-primary bg-bg-tertiary/30">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <User className="text-accent-primary" size={24} />
                        Complete Your Profile
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                        Please tell us a bit more about yourself to personalize your experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-accent-error/10 border border-accent-error/20 text-accent-error px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            <Briefcase size={16} className="inline mr-2" />
                            Occupation
                        </label>
                        <select
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg py-2.5 px-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Hobbyist">Hobbyist</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            <GraduationCap size={16} className="inline mr-2" />
                            Major / Field of Interest
                        </label>
                        <select
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg py-2.5 px-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none"
                        >
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Physics">Physics</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}

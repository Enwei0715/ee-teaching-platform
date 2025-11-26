'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

export default function ProfileCompletionModal() {
    const { data: session, update } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [occupation, setOccupation] = useState('Student');
    const [major, setMajor] = useState('Electrical Engineering');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session?.user) {
            // Check if occupation or major is missing
            // We check for null, undefined, or empty string
            const isMissingInfo = !session.user.occupation || !session.user.major;

            // Only show if logged in and missing info
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
            const res = await fetch('/api/user/complete-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ occupation, major }),
            });

            if (res.ok) {
                // Update the session to reflect changes immediately
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        occupation,
                        major
                    }
                });
                setIsOpen(false);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-bg-secondary border border-border-primary rounded-xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Complete Your Profile</h2>
                    <p className="text-text-secondary">Please provide a few more details to personalize your experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-accent-error/10 border border-accent-error/20 text-accent-error px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Occupation</label>
                        <select
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Major / Field of Study</label>
                        <select
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none"
                        >
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                Complete Profile
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

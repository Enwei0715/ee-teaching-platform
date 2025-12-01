'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, GraduationCap, Save, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        occupation?: string | null;
        major?: string | null;
    };
}

export default function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
    const router = useRouter();
    const [occupation, setOccupation] = useState(initialData.occupation || 'Student');
    const [major, setMajor] = useState(initialData.major || 'Electrical Engineering');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            toast.success('Profile updated successfully!');
            router.refresh(); // Refresh server components to show new data
            onClose();
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
                <div className="p-6 border-b border-border-primary bg-bg-tertiary/30 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <User className="text-accent-primary" size={24} />
                        Edit Profile
                    </h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20} />
                    </button>
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

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-border-primary text-text-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                            {!loading && <Save size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

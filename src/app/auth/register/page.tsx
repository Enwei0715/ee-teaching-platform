'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [major, setMajor] = useState('Electrical Engineering');
    const [occupation, setOccupation] = useState('Student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, major, occupation }),
            });

            if (res.ok) {
                router.push('/auth/signin?registered=true');
            } else {
                const data = await res.json();
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
                    <p className="text-text-secondary">Join EE Master to start your learning journey</p>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-accent-error/10 border border-accent-error/20 text-accent-error px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-bg-tertiary border border-border-primary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-accent-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

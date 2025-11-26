'use client';

import { SessionProvider } from 'next-auth/react';
import ProfileCompletionModal from '@/components/auth/ProfileCompletionModal';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <ProfileCompletionModal />
        </SessionProvider>
    );
}

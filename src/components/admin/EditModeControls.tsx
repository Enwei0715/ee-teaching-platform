'use client';

import { useEditMode } from '@/context/EditModeContext';
import { useSession } from 'next-auth/react';
import { Settings } from 'lucide-react';

export default function EditModeControls() {
    const { data: session } = useSession();
    const { isEditMode, toggleEditMode } = useEditMode();

    // Only show for admins
    if (session?.user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 shadow-xl">
            <Settings size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-200">Edit Mode</span>
            <button
                onClick={toggleEditMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEditMode ? 'bg-indigo-600' : 'bg-gray-700'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}

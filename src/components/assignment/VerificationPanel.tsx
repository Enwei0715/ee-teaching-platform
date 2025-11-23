"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';

interface VerificationPanelProps {
    initialClaim: string;
}

export default function VerificationPanel({ initialClaim }: VerificationPanelProps) {
    const [claim, setClaim] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'correct' | 'incorrect' | null>(null);
    const [correction, setCorrection] = useState('');
    const [showCorrectionInput, setShowCorrectionInput] = useState(false);

    useEffect(() => {
        if (initialClaim) {
            setClaim(initialClaim);
            setVerificationStatus('pending');
        }
    }, [initialClaim]);

    const handleVerify = (isCorrect: boolean) => {
        setVerificationStatus(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            setShowCorrectionInput(true);
        }
    };

    const handleShareToForum = () => {
        // This will be implemented to actually post to the forum
        alert('Feature coming soon: Share your correction to the discussion forum!');
        // Reset after sharing
        setClaim('');
        setVerificationStatus(null);
        setCorrection('');
        setShowCorrectionInput(false);
    };

    if (!claim) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-3">
                        <AlertTriangle size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Verification Panel</h3>
                    <p className="text-xs text-gray-500">
                        Complete a quiz to verify AI explanations
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                Verify AI Explanation
            </h3>

            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-3">{claim}</p>

                {verificationStatus === 'pending' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleVerify(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <CheckCircle2 size={16} />
                            Correct
                        </button>
                        <button
                            onClick={() => handleVerify(false)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <XCircle size={16} />
                            Incorrect
                        </button>
                    </div>
                )}

                {verificationStatus === 'correct' && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                        <CheckCircle2 size={16} />
                        <span className="text-sm font-medium">Great! The AI explanation is correct.</span>
                    </div>
                )}

                {verificationStatus === 'incorrect' && showCorrectionInput && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
                            <XCircle size={16} />
                            <span className="text-sm font-medium">Help improve the AI! Share your correction.</span>
                        </div>

                        <textarea
                            value={correction}
                            onChange={(e) => setCorrection(e.target.value)}
                            placeholder="Explain what's wrong with the AI's explanation and provide the correct answer..."
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white resize-none"
                            rows={4}
                        />

                        <button
                            onClick={handleShareToForum}
                            disabled={!correction.trim()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageSquare size={16} />
                            Share to Discussion Forum
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                    <strong>Remember:</strong> AI can make mistakes. Always verify explanations carefully and share corrections to help others learn!
                </p>
            </div>
        </div>
    );
}

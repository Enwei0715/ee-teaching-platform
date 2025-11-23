"use client";

import React, { useState } from 'react';
import ChatInterface from '@/components/assignment/ChatInterface';
import VerificationPanel from '@/components/assignment/VerificationPanel';

export default function AssignmentPage({ params }: { params: { courseId: string; assignmentId: string } }) {
    const [quizExplanation, setQuizExplanation] = useState<string>('');

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Panel: Problem Description */}
            <div className="w-1/2 p-8 overflow-y-auto bg-white">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                            Assignment 1.2
                        </span>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">Op-Amp Gain Analysis</h1>
                    </div>

                    <div className="prose prose-blue max-w-none">
                        <h3>Scenario</h3>
                        <p>
                            You are designing a pre-amplifier for a microphone. You have selected a standard non-inverting configuration.
                            However, your junior colleague suggests that the input impedance might be too low for the microphone.
                        </p>

                        <div className="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                            [Circuit Diagram Placeholder: Non-Inverting Op-Amp]
                            <br />
                            R1 = 1kΩ, R2 = 10kΩ
                        </div>

                        <h3>Task</h3>
                        <ol>
                            <li>Calculate the theoretical gain of this circuit.</li>
                            <li>Determine the input impedance seen by the microphone.</li>
                            <li>
                                <strong>Consult the AI Tutor</strong> to verify your assumptions about Op-Amp input impedance.
                                <br />
                                <em className="text-red-600">Warning: The AI may make mistakes. Verify everything!</em>
                            </li>
                        </ol>

                        <h3>Resources</h3>
                        <ul>
                            <li>LM741 Datasheet (PDF)</li>
                            <li>Chapter 4: Operational Amplifiers</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Panel: AI Tutor & Verification */}
            <div className="w-1/2 flex flex-col border-l border-gray-200 bg-gray-50">
                <div className="flex-1 overflow-hidden">
                    <ChatInterface onQuizExplanation={setQuizExplanation} />
                </div>
                <div className="shrink-0">
                    <VerificationPanel initialClaim={quizExplanation} />
                </div>
            </div>
        </div>
    );
}

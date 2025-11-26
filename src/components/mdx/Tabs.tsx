'use client';

import { useState } from 'react';

interface TabsProps {
    children: React.ReactElement[];
}

interface TabProps {
    label: string;
    children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
    return <div>{children}</div>;
}

export function Tabs({ children }: TabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = Array.isArray(children) ? children : [children];

    return (
        <div className="my-6 border border-border-primary rounded-lg overflow-hidden">
            <div className="flex border-b border-border-primary bg-bg-secondary">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === index
                                ? 'bg-accent-primary text-white'
                                : 'text-text-secondary hover:bg-bg-tertiary'
                            }`}
                    >
                        {tab.props.label}
                    </button>
                ))}
            </div>
            <div className="p-4">
                {tabs[activeTab]}
            </div>
        </div>
    );
}

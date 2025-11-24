import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function TagInput({ value = [], onChange, placeholder = "Add item...", label }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addItem();
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // Remove last item on backspace if input is empty
            const newValue = [...value];
            newValue.pop();
            onChange(newValue);
        }
    };

    const addItem = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue("");
        } else if (value.includes(trimmed)) {
            setInputValue(""); // Clear if duplicate
        }
    };

    const removeItem = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>}
            <div className="flex flex-wrap gap-2 bg-gray-950 border border-gray-800 rounded-lg p-2 focus-within:border-indigo-500 transition-colors">
                {value.map((item, index) => (
                    <span key={index} className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-sm border border-indigo-500/30">
                        {item}
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="hover:text-indigo-100 focus:outline-none"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <div className="flex-1 flex items-center min-w-[120px]">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={addItem}
                        className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-600"
                        placeholder={value.length === 0 ? placeholder : ""}
                    />
                    <button
                        type="button"
                        onClick={addItem}
                        className={`text-gray-500 hover:text-indigo-400 ${!inputValue.trim() && 'opacity-0 pointer-events-none'}`}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

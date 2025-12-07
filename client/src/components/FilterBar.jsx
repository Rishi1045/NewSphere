import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const categories = [
    { id: 'general', label: 'All' },
    { id: 'india', label: 'India', color: 'text-category-india' },
    { id: 'global', label: 'Global', color: 'text-category-global' },
    { id: 'tech', label: 'Tech', color: 'text-category-tech' },
    { id: 'sports', label: 'Sports', color: 'text-category-sports' },
    { id: 'finance', label: 'Finance', color: 'text-category-finance' },
    { id: 'political', label: 'Political', color: 'text-category-political' },
];

const FilterBar = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="sticky top-16 z-40 bg-background/70 dark:bg-background-dark/70 backdrop-blur-xl py-4 mb-8 overflow-x-auto no-scrollbar mask-gradient border-b border-white/5 dark:border-white/5">
            <div className="flex space-x-2 px-4 md:px-0">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none"
                    >
                        {activeCategory === cat.id && (
                            <motion.div
                                layoutId="activePill"
                                className={clsx(
                                    "absolute inset-0 rounded-full",
                                    "bg-white dark:bg-zinc-800",
                                    "border border-zinc-200 dark:border-zinc-700",
                                    "shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                )}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={clsx(
                            "relative z-10 flex items-center gap-2",
                            activeCategory === cat.id ? (cat.color || "text-zinc-900 dark:text-zinc-100") : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;

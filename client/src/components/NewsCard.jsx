import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BsBookmark, BsBookmarkFill, BsStars } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const NewsCard = ({ article, isBookmarked, onToggleBookmark, onSummarize }) => {
    const [liked, setLiked] = useState(isBookmarked);
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBookmark = () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setLiked(!liked);
        onToggleBookmark(article);
    };

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="group relative bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-premium dark:shadow-premium-dark hover:shadow-2xl dark:hover:shadow-purple-900/10 border border-transparent dark:border-border-dark transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {article.urlToImage ? (
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400 text-sm bg-zinc-50 dark:bg-zinc-900/50">
                        <span className="italic">No Image Available</span>
                    </div>
                )}

                {/* Gradient Overlay for Text readability if needed, but keeping clean for now */}

                {/* Bookmark Button - Top Right */}
                <button
                    onClick={handleBookmark}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 z-10"
                >
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        animate={{ scale: liked ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex items-center justify-center w-5 h-5"
                    >
                        {liked ? (
                            <BsBookmarkFill className="text-white w-5 h-5 drop-shadow-md" />
                        ) : (
                            <BsBookmark className="text-white w-5 h-5 drop-shadow-md" />
                        )}
                    </motion.div>
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-category-global uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md">
                        {article.source?.name || 'News'}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        {formattedDate}
                    </span>
                </div>

                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group-hover:text-category-global transition-colors duration-300">
                    <h3 className="font-serif font-bold text-xl leading-tight text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-3">
                        {article.title}
                    </h3>
                </a>

                <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {article.description}
                </p>

                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!user) {
                                navigate('/login', { state: { from: location } });
                                return;
                            }
                            onSummarize(article);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1.5"
                    >
                        <BsStars className="w-3 h-3" />
                        AI Summary
                    </button>

                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 group/link">
                        Read Story
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;

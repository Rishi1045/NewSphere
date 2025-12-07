import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsStars, BsX } from 'react-icons/bs';
import api from '../api';

const SummaryModal = ({ isOpen, onClose, article }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); // For percentage loader
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        if (isOpen && article) {
            setLoading(true);
            setSummary([]);
            setProgress(0);

            // Progress bar simulation
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.floor(Math.random() * 10) + 1;
                });
            }, 300);

            const fetchSummary = async () => {
                try {
                    // Call our backend
                    const res = await api.post('/ai/summary', {
                        url: article.url,
                        title: article.title,
                        description: article.description,
                        content: article.content
                    });

                    // Parse if string (just in case)
                    let data = res.data;
                    if (typeof data === 'string') {
                        try { data = JSON.parse(data); } catch (e) { }
                    }
                    if (!Array.isArray(data)) data = [String(data)];

                    setSummary(data);
                } catch (error) {
                    console.error("Summary Generation Failed", error);
                    setSummary(["Failed to generate summary. Please try again later."]);
                } finally {
                    clearInterval(interval);
                    setProgress(100); // Complete!
                    setTimeout(() => setLoading(false), 500); // Small delay to show 100%
                }
            };

            fetchSummary();

            return () => clearInterval(interval);
        }
    }, [isOpen, article]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <BsStars className="animate-pulse text-lg" />
                                <span>AI Quick Summary</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <BsX size={24} className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            <h3 className="text-xl font-bold text-foreground mb-4 leading-tight">
                                {article?.title}
                            </h3>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                        ></div>
                                        <span className="text-xs font-bold text-primary">{progress}%</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground animate-pulse">
                                        Reading article...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-3">
                                        {summary.map((point, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-3 text-foreground/90 leading-relaxed"
                                            >
                                                <span className="text-primary mt-1.5 text-xs">●</span>
                                                <span>{point}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <div className="pt-4 mt-6 border-t border-border">
                                        <p className="text-xs text-muted-foreground italic flex justify-between">
                                            <span>Generated by NewSphere AI</span>
                                            <a href={article?.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                Read full article →
                                            </a>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SummaryModal;

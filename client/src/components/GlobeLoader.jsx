import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobeLoader = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000); // 2.5 seconds total duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
            <div className="relative flex flex-col items-center">
                {/* Globe Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-48 h-48 sm:w-64 sm:h-64 mb-8"
                >
                    {/* Glowing Blur Behind */}
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-[60px] animate-pulse" />

                    {/* SVG Globe */}
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                        {/* Globe Circle */}
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-30" />

                        {/* Meridians / Longitude Lines */}
                        <motion.ellipse
                            cx="50" cy="50" rx="48" ry="48"
                            fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-20"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.ellipse
                            cx="50" cy="50" rx="20" ry="48"
                            fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-40"
                            animate={{ rx: [20, 0, 20] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.ellipse
                            cx="50" cy="50" rx="40" ry="48"
                            fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-30"
                            animate={{ rx: [40, 10, 40] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        />

                        {/* Parallels / Latitude Lines */}
                        <motion.path
                            d="M 2 50 Q 50 80 98 50"
                            fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-30"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2 }}
                        />
                        <motion.path
                            d="M 2 50 Q 50 20 98 50"
                            fill="none" stroke="#3B82F6" strokeWidth="0.5" className="opacity-30"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2 }}
                        />

                        {/* Orange Accent Dot (NewSphere Brand) */}
                        <motion.circle
                            cx="70" cy="40" r="2"
                            fill="#F97316"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 1] }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        />
                    </svg>

                    {/* Orbiting Ring */}
                    <motion.div
                        className="absolute inset-[-10px] rounded-full border border-zinc-700/50 border-t-white/50 border-r-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>

                {/* Text Reveal */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                        className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500"
                    >
                        NEW<span className="font-light text-zinc-400">SPHERE</span>
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-2 text-xs text-zinc-500 tracking-[0.3em] uppercase"
                >
                </motion.p>
            </div>
        </motion.div>
    );
};

export default GlobeLoader;

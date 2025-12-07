
import { useState, useEffect } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from './WeatherWidget';

const Layout = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className="min-h-screen bg-background dark:bg-background-dark text-surface-dark dark:text-surface transition-colors duration-300 font-sans selection:bg-category-global selection:text-white relative">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif'
                    },
                    className: 'dark:bg-zinc-800 dark:text-white',
                    success: {
                        duration: 3000,
                        theme: {
                            primary: '#4ade80',
                            secondary: 'black',
                        },
                    },
                }}
            />
            {/* Premium Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-orange-500/10 dark:bg-orange-900/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-500 group-hover:rotate-180">
                                <path d="M18 3.00003C13.8579 3.00003 10.0838 4.68812 7.3934 7.39343C4.6881 10.0838 3 13.8579 3 18C3 22.1421 4.6881 25.9162 7.3934 28.6066C10.0838 31.3119 13.8579 33 18 33"
                                    stroke="#F97316" strokeWidth="3" strokeLinecap="round" />

                                <path d="M18 33C22.1421 33 25.9162 31.3119 28.6066 28.6066C31.3119 25.9162 33 22.1421 33 18C33 13.8579 31.3119 10.0838 28.6066 7.39343C25.9162 4.68812 22.1421 3.00003 18 3.00003"
                                    stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

                                <circle cx="18" cy="18" r="4" className="fill-zinc-900 dark:fill-white" />
                            </svg>

                            <div className="flex flex-col justify-center">
                                <h1 className="font-serif font-bold text-xl leading-none tracking-tight text-zinc-900 dark:text-white">
                                    New<span className="font-light text-zinc-500 dark:text-zinc-400">Sphere</span>
                                </h1>
                            </div>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-6">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                                ${location.pathname === '/'
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            News
                        </Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                                <WeatherWidget />
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                                aria-label="Toggle Theme"
                            >
                                {darkMode ? <BsSun className="w-5 h-5" /> : <BsMoon className="w-5 h-5" />}
                            </button>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/bookmarks"
                                        className={`hidden sm:block text-sm font-medium transition-colors px-4 py-2 rounded-full
                                            ${location.pathname === '/bookmarks'
                                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        My Bookmarks
                                    </Link>
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 focus:outline-none">
                                            {user.picture ? (
                                                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-border dark:border-border-dark" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-category-global text-white flex items-center justify-center font-bold text-xs uppercase">
                                                    {user.name?.charAt(0)}
                                                </div>
                                            )}
                                        </button>
                                        <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:block">
                                            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-premium dark:shadow-premium-dark border border-border dark:border-border-dark py-2">
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-border dark:border-border-dark py-8 mt-auto bg-background dark:bg-background-dark text-center text-sm text-zinc-500">
                <p>© {new Date().getFullYear()} NewSphere. Premium News Experience.</p>
            </footer>
        </div>
    );
};

export default Layout;

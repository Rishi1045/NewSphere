import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import NewsCard from '../components/NewsCard';
import SummaryModal from '../components/SummaryModal';
import { fetchNews, addBookmark, removeBookmarkByUrl, fetchBookmarks } from '../api';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkedUrls, setBookmarkedUrls] = useState(new Set());
    const [summaryArticle, setSummaryArticle] = useState(null);

    useEffect(() => {
        loadBookmarks();
        loadNews(activeCategory);
    }, [activeCategory]);

    const loadBookmarks = async () => {
        try {
            const saved = await fetchBookmarks();
            const urls = new Set(saved.map(b => b.url));
            setBookmarkedUrls(urls);
        } catch (error) {
            console.error("Failed to load bookmarks", error);
        }
    };

    const loadNews = async (category) => {
        setLoading(true);
        try {
            const data = await fetchNews(category === 'general' ? '' : category);
            // Filter out removed articles typically returned by NewsAPI
            const validArticles = data.articles.filter(a => a.title !== '[Removed]');
            setArticles(validArticles);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBookmark = async (article) => {
        const isBookmarked = bookmarkedUrls.has(article.url);

        try {
            if (isBookmarked) {
                await removeBookmarkByUrl(article.url);
                setBookmarkedUrls(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(article.url);
                    return newSet;
                });
            } else {
                await addBookmark(article);
                setBookmarkedUrls(prev => new Set(prev).add(article.url));
            }
        } catch (error) {
            console.error("Error toggling bookmark", error);
        }
    };

    return (
        <>
            <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-surface dark:bg-surface-dark rounded-2xl h-80">
                            <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl"></div>
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <NewsCard
                            key={`${article.url}-${index}`}
                            article={article}
                            isBookmarked={bookmarkedUrls.has(article.url)}
                            onToggleBookmark={handleToggleBookmark}
                            onSummarize={() => setSummaryArticle(article)}
                        />
                    ))}
                </div>
            )}

            <SummaryModal
                isOpen={!!summaryArticle}
                onClose={() => setSummaryArticle(null)}
                article={summaryArticle}
            />
        </>
    );
};

export default Home;

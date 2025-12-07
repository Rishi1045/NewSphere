import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { fetchBookmarks, removeBookmarkByUrl } from '../api';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {
        setLoading(true);
        try {
            const data = await fetchBookmarks();
            setBookmarks(data);
        } catch (error) {
            console.error("Failed to load bookmarks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (article) => {
        try {
            await removeBookmarkByUrl(article.url);
            setBookmarks(prev => prev.filter(b => b.url !== article.url));
        } catch (error) {
            console.error("Error removing bookmark", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-8">Your Saved Stories</h1>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading...</div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg">You haven't bookmarked any stories yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookmarks.map((article) => (
                        <NewsCard
                            key={article._id || article.url}
                            article={article}
                            isBookmarked={true}
                            onToggleBookmark={handleRemoveBookmark}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;

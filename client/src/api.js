import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});

export const fetchNews = async (category = 'general', q = '') => {
    const params = {};
    if (category) params.category = category;
    if (q) params.q = q;
    const response = await api.get('/news', { params });
    return response.data;
};

export const fetchBookmarks = async () => {
    const response = await api.get('/bookmarks');
    return response.data;
};

export const addBookmark = async (article) => {
    const response = await api.post('/bookmarks', article);
    return response.data;
};

export const removeBookmark = async (id) => {
    const response = await api.delete(`/bookmarks/${id}`);
    return response.data;
};

export const removeBookmarkByUrl = async (url) => {
    const encodedUrl = encodeURIComponent(url);
    const response = await api.delete(`/bookmarks/url/${encodedUrl}`);
    return response.data;
}

export default api;

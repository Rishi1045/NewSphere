const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    source: {
        id: String,
        name: String
    },
    author: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    url: {
        type: String,
        required: true,
        unique: true
    },
    urlToImage: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique bookmarks per user
BookmarkSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);

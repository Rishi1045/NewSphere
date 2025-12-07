const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

// @route   GET api/bookmarks
// @desc    Get all user's bookmarks
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user.id }).sort({ savedAt: -1 });
        res.json(bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/bookmarks
// @desc    Add a bookmark
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, url, urlToImage, publishedAt, source } = req.body;

    try {
        let bookmark = await Bookmark.findOne({ user: req.user.id, url });

        if (bookmark) {
            return res.status(400).json({ message: 'Article already bookmarked' });
        }

        bookmark = new Bookmark({
            title,
            description,
            url,
            urlToImage,
            publishedAt,
            source,
            user: req.user.id
        });

        await bookmark.save();
        res.json(bookmark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/bookmarks/:id
// @desc    Delete bookmark
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });

        // Make sure user owns bookmark
        if (bookmark.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Bookmark.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bookmark removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/bookmarks/url/:url
// @desc    Delete bookmark by URL
// @access  Private
router.delete('/url/:url', auth, async (req, res) => {
    try {
        const decodedUrl = decodeURIComponent(req.params.url);
        const bookmark = await Bookmark.findOne({ user: req.user.id, url: decodedUrl });

        if (!bookmark) {
            return res.json({ message: 'Bookmark not found (maybe already deleted)' });
        }

        await Bookmark.findByIdAndDelete(bookmark._id);
        res.json({ message: 'Bookmark removed by URL' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    content: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Optional: expire after 30 days to clear old news cache
        // index: { expires: '30d' } 
    }
});

module.exports = mongoose.model('Summary', SummarySchema);

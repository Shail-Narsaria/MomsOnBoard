const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    symptoms: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    photos: [{
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

journalSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Journal', journalSchema); 
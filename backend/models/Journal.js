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
    mood: {
        type: String,
        enum: ['Happy', 'Excited', 'Tired', 'Anxious', 'Uncomfortable', 'Other'],
        required: true
    },
    symptoms: {
        type: [String],
        default: []
    },
    week: {
        type: Number,
        required: true,
        min: 1,
        max: 42
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

// Add index for efficient querying
journalSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Journal', journalSchema); 
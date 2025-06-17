const mongoose = require('mongoose');

const advancedHealthSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['babyMovement', 'contraction', 'waterIntake', 'sleep', 'exercise', 'medication'],
        required: true
    },
    // Baby Movement Tracking
    babyMovement: {
        duration: Number, // in minutes
        kickCount: Number,
        notes: String,
        timeOfDay: String // morning, afternoon, evening, night
    },
    // Contraction Tracking
    contraction: {
        duration: Number, // in seconds
        intensity: {
            type: String,
            enum: ['mild', 'moderate', 'strong', 'very strong']
        },
        frequency: Number, // minutes between contractions
        notes: String
    },
    // Water Intake Tracking
    waterIntake: {
        amount: Number, // in ml
        goal: Number, // daily goal in ml
        type: {
            type: String,
            enum: ['water', 'juice', 'tea', 'other']
        }
    },
    // Sleep Quality Tracking
    sleep: {
        hours: Number,
        quality: {
            type: String,
            enum: ['poor', 'fair', 'good', 'excellent']
        },
        interruptions: Number,
        notes: String,
        bedTime: Date,
        wakeTime: Date
    },
    // Exercise Log
    exercise: {
        exerciseType: {
            type: String,
            enum: ['walking', 'swimming', 'cycling', 'yoga', 'strength', 'pilates', 'dancing', 'other']
        },
        duration: Number, // in minutes
        intensity: Number, // 1-5 scale
        calories: Number,
        satisfaction: Number, // 1-5 scale
        notes: String
    },
    // Medication Tracking
    medication: {
        medicationName: String,
        dosage: String,
        frequency: String,
        time: Date,
        taken: {
            type: Boolean,
            default: false
        },
        sideEffects: String,
        prescribedBy: String,
        notes: String
    }
}, {
    timestamps: true
});

// Add indexes for efficient querying
advancedHealthSchema.index({ user: 1, date: -1 });
advancedHealthSchema.index({ user: 1, type: 1, date: -1 });

module.exports = mongoose.model('AdvancedHealth', advancedHealthSchema); 
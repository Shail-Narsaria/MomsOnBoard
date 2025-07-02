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
    babyMovement: {
        duration: Number,
        kickCount: Number,
        notes: String,
        timeOfDay: String 
    },
 
    contraction: {
        duration: Number, 
        intensity: {
            type: String,
            enum: ['mild', 'moderate', 'strong', 'very strong']
        },
        frequency: Number,
        notes: String
    },
    waterIntake: {
        amount: Number, 
        goal: Number, 
        type: {
            type: String,
            enum: ['water', 'juice', 'tea', 'other']
        }
    },
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
    exercise: {
        exerciseType: {
            type: String,
            enum: ['walking', 'swimming', 'cycling', 'yoga', 'strength', 'pilates', 'dancing', 'other']
        },
        duration: Number,
        intensity: Number, 
        calories: Number,
        satisfaction: Number, 
        notes: String
    },
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

advancedHealthSchema.index({ user: 1, date: -1 });
advancedHealthSchema.index({ user: 1, type: 1, date: -1 });

module.exports = mongoose.model('AdvancedHealth', advancedHealthSchema); 
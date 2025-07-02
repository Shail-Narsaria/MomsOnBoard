const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    pregnancyStartDate: {
        type: Date,
        required: true
    },
    medicalInfo: {
        bloodType: String,
        allergies: [String],
        medications: [String],
        preExistingConditions: [String],
        healthcareProvider: {
            name: String,
            phone: String,
            address: String
        }
    },
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String
    }],
    healthMetrics: [{
        date: Date,
        weight: Number,
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        symptoms: [String]
    }],
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

userSchema.methods.getCurrentPregnancyWeek = function() {
    const today = new Date();
    const pregnancyStart = new Date(this.pregnancyStartDate);
    const diffTime = Math.abs(today - pregnancyStart);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
};

module.exports = mongoose.model('User', userSchema); 
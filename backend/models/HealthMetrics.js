const mongoose = require('mongoose');

const HealthMetricsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },
  bloodSugar: {
    type: Number
  },
  temperature: {
    type: Number
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual for BMI calculation
HealthMetricsSchema.virtual('bmi').get(function() {
  if (!this.weight || !this.user.height) return null;
  // BMI = weight(kg) / height(m)²
  const heightInMeters = this.user.height / 100; // Convert cm to m
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

module.exports = mongoose.model('healthMetrics', HealthMetricsSchema); 
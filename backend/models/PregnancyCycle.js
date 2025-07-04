const mongoose = require('mongoose');

const PregnancyCycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'terminated', 'completed'],
    default: 'active'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PregnancyCycle', PregnancyCycleSchema); 
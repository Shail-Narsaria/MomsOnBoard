const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['checkup', 'ultrasound', 'blood-test', 'vaccination', 'other']
  },
  doctorName: {
    type: String,
    trim: true
  },
  location: {
    name: {
      type: String
    },
    address: {
      type: String
    }
  },
  notes: {
    type: String
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    time: {
      type: Number,
      default: 60
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'missed'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('appointment', AppointmentSchema); 
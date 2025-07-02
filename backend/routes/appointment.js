const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const { check, validationResult } = require('express-validator');

router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty(),
    check('type', 'Appointment type is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, date, time, type, doctorName, location, notes, reminder } = req.body;

    const appointment = new Appointment({
      user: req.user.id,
      title,
      date,
      time,
      type,
      doctorName,
      location,
      notes,
      reminder
    });

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, date, time, type, doctorName, location, notes, reminder, status } = req.body;

    const appointmentFields = {};
    if (title) appointmentFields.title = title;
    if (date) appointmentFields.date = date;
    if (time) appointmentFields.time = time;
    if (type) appointmentFields.type = type;
    if (doctorName !== undefined) appointmentFields.doctorName = doctorName;
    if (location) appointmentFields.location = location;
    if (notes) appointmentFields.notes = notes;
    if (reminder !== undefined) appointmentFields.reminder = reminder;
    if (status) appointmentFields.status = status;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: appointmentFields },
      { new: true }
    );

    res.json(updatedAppointment);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
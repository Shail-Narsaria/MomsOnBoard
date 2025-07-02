const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthMetrics = require('../models/HealthMetrics');
const { check, validationResult } = require('express-validator');

router.post('/', [
  auth,
  [
    check('date', 'Date is required').not().isEmpty(),
    check('weight', 'Weight is required').isNumeric(),
    check('bloodPressure.systolic', 'Systolic blood pressure is required').isNumeric(),
    check('bloodPressure.diastolic', 'Diastolic blood pressure is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      date,
      weight,
      bloodPressure,
      bloodSugar,
      temperature,
      symptoms,
      notes
    } = req.body;

    const healthMetrics = new HealthMetrics({
      user: req.user.id,
      date,
      weight,
      bloodPressure,
      bloodSugar,
      temperature,
      symptoms: Array.isArray(symptoms) ? symptoms : (symptoms ? symptoms.split(',').map(s => s.trim()) : []),
      notes
    });

    await healthMetrics.save();
    res.json(healthMetrics);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.find({ user: req.user.id }).sort({ date: -1 });
    res.json(healthMetrics);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.findById(req.params.id);

    if (!healthMetrics) {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }
    if (healthMetrics.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(healthMetrics);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.findById(req.params.id);

    if (!healthMetrics) {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }

    if (healthMetrics.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      date,
      weight,
      bloodPressure,
      bloodSugar,
      temperature,
      symptoms,
      notes
    } = req.body;

    const healthMetricsFields = {};
    if (date) healthMetricsFields.date = date;
    if (weight) healthMetricsFields.weight = weight;
    if (bloodPressure) healthMetricsFields.bloodPressure = bloodPressure;
    if (bloodSugar) healthMetricsFields.bloodSugar = bloodSugar;
    if (temperature) healthMetricsFields.temperature = temperature;
    if (symptoms) healthMetricsFields.symptoms = Array.isArray(symptoms) ? symptoms : symptoms.split(',').map(s => s.trim());
    if (notes) healthMetricsFields.notes = notes;

    const updatedHealthMetrics = await HealthMetrics.findByIdAndUpdate(
      req.params.id,
      { $set: healthMetricsFields },
      { new: true }
    );

    res.json(updatedHealthMetrics);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.findById(req.params.id);

    if (!healthMetrics) {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }

    if (healthMetrics.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await healthMetrics.deleteOne();
    res.json({ message: 'Health metrics entry removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health metrics entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
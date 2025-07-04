const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PregnancyCycle = require('../models/PregnancyCycle');
const { check, validationResult } = require('express-validator');

// @route   POST api/pregnancy-cycles
// @desc    Start a new pregnancy cycle
// @access  Private
router.post('/', [
  auth,
  [check('startDate', 'Start date is required').not().isEmpty()]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // End any currently active cycle for this user
    await PregnancyCycle.updateMany(
      { user: req.user.id, status: 'active' },
      { $set: { status: 'completed', endDate: new Date() } }
    );
    const { startDate, notes } = req.body;
    const cycle = new PregnancyCycle({
      user: req.user.id,
      startDate,
      status: 'active',
      notes
    });
    await cycle.save();
    res.json(cycle);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/pregnancy-cycles/:id/terminate
// @desc    Terminate a pregnancy cycle
// @access  Private
router.put('/:id/terminate', auth, async (req, res) => {
  try {
    const cycle = await PregnancyCycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ message: 'Pregnancy cycle not found' });
    }
    if (cycle.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (cycle.status !== 'active') {
      return res.status(400).json({ message: 'Cycle is not active' });
    }
    cycle.status = 'terminated';
    cycle.endDate = new Date();
    await cycle.save();
    res.json(cycle);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/pregnancy-cycles
// @desc    Get all pregnancy cycles for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cycles = await PregnancyCycle.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(cycles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
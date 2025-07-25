const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AdvancedHealth = require('../models/AdvancedHealth');
const { check, validationResult } = require('express-validator');

router.post('/', [
  auth,
  [
    check('type', 'Type is required').isIn(['babyMovement', 'contraction', 'waterIntake', 'sleep', 'exercise', 'medication']),
    check('date', 'Date is required').isISO8601()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { type, date, ...data } = req.body;

    const advancedHealth = new AdvancedHealth({
      user: req.user.id,
      type,
      date: new Date(date),
      [type]: data[type] || data
    });

    await advancedHealth.save();
    res.json(advancedHealth);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    let query = { user: req.user.id };

    if (type) {
      query.type = type;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const entries = await AdvancedHealth.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await AdvancedHealth.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await AdvancedHealth.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const { type, date, ...data } = req.body;

    if (type) entry.type = type;
    if (date) entry.date = new Date(date);
    if (data) {
      entry[type || entry.type] = { ...entry[type || entry.type], ...data };
    }

    await entry.save();
    res.json(entry);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await AdvancedHealth.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    await entry.deleteOne();
    res.json({ message: 'Entry removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateQuery = {};

    if (startDate && endDate) {
      dateQuery = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await AdvancedHealth.aggregate([
      {
        $match: {
          user: req.user.id,
          ...(Object.keys(dateQuery).length > 0 && { date: dateQuery })
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          latestEntry: { $max: '$date' }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
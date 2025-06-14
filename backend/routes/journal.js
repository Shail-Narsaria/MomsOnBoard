const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Validation middleware
const validateJournalEntry = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('mood').isIn(['Happy', 'Excited', 'Tired', 'Anxious', 'Uncomfortable', 'Other']).withMessage('Invalid mood'),
  body('week').isInt({ min: 1, max: 42 }).withMessage('Week must be between 1 and 42'),
  body('symptoms').optional().isArray().withMessage('Symptoms must be an array')
];

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, upload.single('image'), validateJournalEntry, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, mood, symptoms, week } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Convert symptoms to array if it's a string
        const symptomsArray = typeof symptoms === 'string' ? 
            symptoms.split(',').map(s => s.trim()).filter(s => s) : 
            (Array.isArray(symptoms) ? symptoms : []);

        const journal = new Journal({
            user: req.user.id,
            title,
            content,
            mood,
            symptoms: symptomsArray,
            week: parseInt(week),
            image: imagePath
        });

        const savedEntry = await journal.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        console.error('Journal creation error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size cannot exceed 10MB' });
        }
        if (err.message === 'Only image files are allowed!') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/journal/:id
// @desc    Get a specific journal entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(entry);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, upload.single('image'), validateJournalEntry, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // If there's a new image, delete the old one
        if (req.file) {
            if (entry.image) {
                const oldImagePath = path.join(__dirname, '..', entry.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            entry.image = `/uploads/${req.file.filename}`;
        }

        // Convert symptoms to array if it's a string
        const symptomsArray = typeof req.body.symptoms === 'string' ? 
            req.body.symptoms.split(',').map(s => s.trim()).filter(s => s) : 
            (Array.isArray(req.body.symptoms) ? req.body.symptoms : entry.symptoms);

        // Update fields if provided
        if (req.body.title) entry.title = req.body.title;
        if (req.body.content) entry.content = req.body.content;
        if (req.body.mood) entry.mood = req.body.mood;
        if (req.body.symptoms) entry.symptoms = symptomsArray;
        if (req.body.week) entry.week = parseInt(req.body.week);

        const updatedEntry = await entry.save();
        res.json(updatedEntry);
    } catch (err) {
        console.error(err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size cannot exceed 10MB' });
        }
        if (err.message === 'Only image files are allowed!') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Delete associated image if it exists
        if (entry.image) {
            const imagePath = path.join(__dirname, '..', entry.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await entry.deleteOne();
        res.json({ message: 'Entry deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 
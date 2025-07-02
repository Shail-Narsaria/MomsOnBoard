const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

const validateJournalEntry = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('symptoms').optional().custom((value) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch (e) {
        return false;
      }
    }
    return Array.isArray(value);
  }).withMessage('Symptoms must be an array'),
  body('date').optional().isISO8601().withMessage('Invalid date format')
];

router.post('/', auth, upload.array('photos', 10), validateJournalEntry, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, symptoms, date } = req.body;
        
        const photos = req.files ? req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename
        })) : [];

        let symptomsArray = [];
        if (typeof symptoms === 'string') {
            try {
                symptomsArray = JSON.parse(symptoms);
            } catch (e) {
                symptomsArray = [];
            }
        } else if (Array.isArray(symptoms)) {
            symptomsArray = symptoms;
        }

        const journal = new Journal({
            user: req.user.id,
            title,
            content,
            symptoms: symptomsArray,
            date: date ? new Date(date) : new Date(),
            photos
        });

        const savedEntry = await journal.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size cannot exceed 10MB' });
        }
        if (err.message === 'Only image files are allowed!') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', auth, upload.array('photos', 10), validateJournalEntry, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        let newPhotos = [];
        if (req.files && req.files.length > 0) {
            newPhotos = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                filename: file.filename
            }));
        }

        const symptomsArray = typeof req.body.symptoms === 'string' ? 
            JSON.parse(req.body.symptoms) : 
            (Array.isArray(req.body.symptoms) ? req.body.symptoms : entry.symptoms);


        if (req.body.title) entry.title = req.body.title;
        if (req.body.content) entry.content = req.body.content;
        if (req.body.symptoms) entry.symptoms = symptomsArray;
        if (req.body.date) entry.date = new Date(req.body.date);
  
        if (newPhotos.length > 0) {
            entry.photos.forEach(photo => {
                const photoPath = path.join(__dirname, '..', photo.url);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            });
            entry.photos = newPhotos;
        }

        const updatedEntry = await entry.save();
        res.json(updatedEntry);
    } catch (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size cannot exceed 10MB' });
        }
        if (err.message === 'Only image files are allowed!') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        if (entry.photos && entry.photos.length > 0) {
            entry.photos.forEach(photo => {
                const photoPath = path.join(__dirname, '..', photo.url);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 
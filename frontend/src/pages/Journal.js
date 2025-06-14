import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { createJournalEntry, getJournalEntries, updateJournalEntry, deleteJournalEntry } from '../redux/slices/journalSlice';

const Journal = () => {
  const [open, setOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    symptoms: [],
    week: '',
    image: null
  });
  
  const dispatch = useDispatch();
  const { entries, loading, error } = useSelector(state => state.journal);

  useEffect(() => {
    dispatch(getJournalEntries());
  }, [dispatch]);

  const handleOpen = (entry = null) => {
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        symptoms: entry.symptoms || [],
        week: entry.week,
        image: entry.image
      });
      setSelectedEntry(entry);
    } else {
      setFormData({
        title: '',
        content: '',
        mood: '',
        symptoms: [],
        week: '',
        image: null
      });
      setSelectedEntry(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedEntry(null);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      symptoms: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'symptoms') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedEntry) {
        await dispatch(updateJournalEntry({
          id: selectedEntry._id,
          formData: formDataToSend
        })).unwrap();
      } else {
        await dispatch(createJournalEntry(formDataToSend)).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await dispatch(deleteJournalEntry(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
      }
    }
  };

  const moodOptions = [
    'Happy',
    'Excited',
    'Tired',
    'Anxious',
    'Uncomfortable',
    'Other'
  ];

  const symptomOptions = [
    'Morning Sickness',
    'Fatigue',
    'Cravings',
    'Heartburn',
    'Back Pain',
    'Swelling',
    'Insomnia',
    'Headache',
    'Other'
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Journal Entries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Entry
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {entries?.map((entry) => (
            <Grid item xs={12} md={6} key={entry._id}>
              <Card>
                {entry.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={entry.image}
                    alt={entry.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {entry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Week {entry.week} - {format(new Date(entry.date), 'MMMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {entry.content}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={entry.mood} color="primary" sx={{ mr: 1 }} />
                    {entry.symptoms?.map((symptom, index) => (
                      <Chip
                        key={index}
                        label={symptom}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpen(entry)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(entry._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="title"
              value={formData.title}
              onChange={handleChange}
              label="Title"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="content"
              value={formData.content}
              onChange={handleChange}
              label="Content"
              multiline
              rows={4}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="week"
              value={formData.week}
              onChange={handleChange}
              label="Week"
              type="number"
              inputProps={{ min: 1, max: 42 }}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              select
              label="Mood"
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              {moodOptions.map((mood) => (
                <MenuItem key={mood} value={mood}>
                  {mood}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="symptoms"
              value={formData.symptoms}
              onChange={handleSymptomsChange}
              select
              label="Symptoms"
              fullWidth
              SelectProps={{
                multiple: true,
                value: formData.symptoms,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                ),
              }}
              sx={{ mb: 2 }}
            >
              {symptomOptions.map((symptom) => (
                <MenuItem key={symptom} value={symptom}>
                  {symptom}
                </MenuItem>
              ))}
            </TextField>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Image
              </Button>
            </label>
            {formData.image && (
              <Typography variant="body2" color="text.secondary">
                {typeof formData.image === 'string' ? 'Image uploaded' : formData.image.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Journal; 
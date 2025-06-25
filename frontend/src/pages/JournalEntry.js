import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, PhotoCamera } from '@mui/icons-material';
import {
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
  clearCurrentEntry
} from '../store/slices/journalSlice';
import { showAlert } from '../store/slices/alertSlice';
import './JournalEntry.css';

const moods = ['Happy', 'Excited', 'Tired', 'Anxious', 'Uncomfortable', 'Other'];

const symptoms = [
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

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  mood: Yup.string()
    .required('Mood is required')
    .oneOf(moods, 'Invalid mood selection'),
  pregnancyWeek: Yup.number()
    .required('Pregnancy week is required')
    .min(1, 'Week must be at least 1')
    .max(42, 'Week must be at most 42'),
  symptoms: Yup.array()
    .of(Yup.string().oneOf(symptoms, 'Invalid symptom selection')),
  healthMetrics: Yup.object().shape({
    weight: Yup.number()
      .min(30, 'Weight must be at least 30 kg')
      .max(200, 'Weight must be at most 200 kg'),
    bloodPressure: Yup.object().shape({
      systolic: Yup.number()
        .min(70, 'Systolic must be at least 70')
        .max(200, 'Systolic must be at most 200'),
      diastolic: Yup.number()
        .min(40, 'Diastolic must be at least 40')
        .max(130, 'Diastolic must be at most 130')
    })
  })
});

const JournalEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const { currentEntry, loading, error } = useSelector(state => state.journal);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getJournalEntry(id));
    }
    return () => {
      dispatch(clearCurrentEntry());
    };
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      title: currentEntry?.title || '',
      content: currentEntry?.content || '',
      mood: currentEntry?.mood || '',
      pregnancyWeek: currentEntry?.pregnancyWeek || user?.getCurrentPregnancyWeek() || 1,
      symptoms: currentEntry?.symptoms || [],
      healthMetrics: currentEntry?.healthMetrics || {
        weight: '',
        bloodPressure: {
          systolic: '',
          diastolic: ''
        }
      }
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'healthMetrics') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'symptoms') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });

      selectedPhotos.forEach(photo => {
        formData.append('photos', photo);
      });

      try {
        if (id) {
          await dispatch(updateJournalEntry({ entryId: id, entryData: formData })).unwrap();
          dispatch(showAlert('Journal entry updated successfully', 'success'));
        } else {
          await dispatch(createJournalEntry(formData)).unwrap();
          dispatch(showAlert('Journal entry created successfully', 'success'));
        }
        navigate('/dashboard');
      } catch (error) {
        dispatch(showAlert(error.message || 'Failed to save journal entry', 'error'));
      }
    }
  });

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedPhotos(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  if (loading && id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Journal Entry' : 'New Journal Entry'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pregnancy Week"
                name="pregnancyWeek"
                type="number"
                value={formik.values.pregnancyWeek}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pregnancyWeek && Boolean(formik.errors.pregnancyWeek)}
                helperText={formik.touched.pregnancyWeek && formik.errors.pregnancyWeek}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Mood"
                name="mood"
                value={formik.values.mood}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mood && Boolean(formik.errors.mood)}
                helperText={formik.touched.mood && formik.errors.mood}
              >
                {moods.map(mood => (
                  <MenuItem key={mood} value={mood}>
                    {mood}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Content"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Symptoms"
                name="symptoms"
                value={formik.values.symptoms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.symptoms && Boolean(formik.errors.symptoms)}
                helperText={formik.touched.symptoms && formik.errors.symptoms}
                SelectProps={{
                  multiple: true
                }}
              >
                {symptoms.map(symptom => (
                  <MenuItem key={symptom} value={symptom}>
                    {symptom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="healthMetrics.weight"
                type="number"
                value={formik.values.healthMetrics.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.healthMetrics?.weight &&
                  Boolean(formik.errors.healthMetrics?.weight)
                }
                helperText={
                  formik.touched.healthMetrics?.weight &&
                  formik.errors.healthMetrics?.weight
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Systolic"
                    name="healthMetrics.bloodPressure.systolic"
                    type="number"
                    value={formik.values.healthMetrics.bloodPressure.systolic}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.healthMetrics?.bloodPressure?.systolic &&
                      Boolean(formik.errors.healthMetrics?.bloodPressure?.systolic)
                    }
                    helperText={
                      formik.touched.healthMetrics?.bloodPressure?.systolic &&
                      formik.errors.healthMetrics?.bloodPressure?.systolic
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Diastolic"
                    name="healthMetrics.bloodPressure.diastolic"
                    type="number"
                    value={formik.values.healthMetrics.bloodPressure.diastolic}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.healthMetrics?.bloodPressure?.diastolic &&
                      Boolean(formik.errors.healthMetrics?.bloodPressure?.diastolic)
                    }
                    helperText={
                      formik.touched.healthMetrics?.bloodPressure?.diastolic &&
                      formik.errors.healthMetrics?.bloodPressure?.diastolic
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                multiple
                type="file"
                onChange={handlePhotoChange}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Photos
                </Button>
              </label>
            </Grid>

            {photoPreview.length > 0 && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {photoPreview.map((preview, index) => (
                    <Grid item key={index} xs={12} sm={4}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={preview}
                          alt={`Preview ${index + 1}`}
                        />
                        <Box sx={{ p: 1, textAlign: 'right' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : id ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default JournalEntry; 
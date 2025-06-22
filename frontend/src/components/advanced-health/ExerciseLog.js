import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvancedHealthEntry } from '../../redux/slices/advancedHealthSlice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';

const ExerciseLog = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [exerciseType, setExerciseType] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');

  const exerciseEntries = entries.filter(entry => entry.type === 'exercise');

  const exerciseTypes = [
    { id: 'walking', label: 'Walking' },
    { id: 'yoga', label: 'Prenatal Yoga' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'prenatal_fitness', label: 'Prenatal Fitness' },
    { id: 'stretching', label: 'Stretching' },
    { id: 'other', label: 'Other' }
  ];

  const intensityLevels = [
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'vigorous', label: 'Vigorous' }
  ];

  const addExerciseEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'exercise',
        date: selectedDate,
        type: exerciseType,
        duration: parseInt(duration),
        intensity,
        notes
      })).unwrap();
      setDuration(30);
      setNotes('');
    } catch (error) {
      // Remove all console.error statements
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Exercise Entry
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Exercise Type</InputLabel>
                <Select
                  value={exerciseType}
                  label="Exercise Type"
                  onChange={(e) => setExerciseType(e.target.value)}
                >
                  {exerciseTypes.map(option => (
                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="300"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Intensity</InputLabel>
                <Select
                  value={intensity}
                  label="Intensity"
                  onChange={(e) => setIntensity(e.target.value)}
                >
                  {intensityLevels.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={addExerciseEntry}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Entry
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Exercise Entries
          </Typography>
          {exerciseEntries.length === 0 ? (
            <Typography color="text.secondary">No exercise entries yet.</Typography>
          ) : (
            exerciseEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {entry.exercise.duration} min, {entry.exercise.intensity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()} | {entry.exercise.type}
                </Typography>
                {entry.exercise.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {entry.exercise.notes}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExerciseLog; 
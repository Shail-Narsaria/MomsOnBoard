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
  Grid,
  MenuItem
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const exerciseTypes = [
  { value: 'walking', label: 'Walking' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'other', label: 'Other' }
];

const ExerciseLogTracker = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [exerciseType, setExerciseType] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');

  const todayEntries = entries.filter(
    entry => entry.type === 'exercise' && new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const addExerciseEntry = async () => {
    await dispatch(createAdvancedHealthEntry({
      type: 'exercise',
      date: selectedDate,
      exerciseType,
      duration: parseInt(duration),
      notes
    }));
    setExerciseType('walking');
    setDuration(30);
    setNotes('');
  };

  return (
    <Box className="exercise-log-tracker">
      <Card className="exercise-log-form-card">
        <CardContent>
          <Typography variant="h6" className="exercise-log-title" gutterBottom>
            Log Exercise
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Type"
                value={exerciseType}
                onChange={e => setExerciseType(e.target.value)}
                fullWidth
              >
                {exerciseTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Duration (min)"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                fullWidth
                inputProps={{ min: 5, max: 180 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={addExerciseEntry} fullWidth>
                Add Exercise Entry
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box className="exercise-log-list">
        <Typography variant="subtitle1" gutterBottom>
          Today's Exercise Entries
        </Typography>
        {todayEntries.length === 0 ? (
          <Typography color="text.secondary">No exercise entries for today.</Typography>
        ) : (
          todayEntries.map((entry, idx) => (
            <Card key={entry._id || idx} className="exercise-log-entry-card">
              <CardContent style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <FitnessCenterIcon color="primary" />
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {entry.exerciseType} — {entry.duration} min
                </Typography>
                {entry.notes && (
                  <Typography variant="body2" color="text.secondary" style={{ marginLeft: 16 }}>
                    {entry.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ExerciseLogTracker; 
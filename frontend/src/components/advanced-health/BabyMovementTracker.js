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

const BabyMovementTracker = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [duration, setDuration] = useState(0);
  const [kickCount, setKickCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');

  const babyMovementEntries = entries.filter(entry => entry.type === 'babyMovement');

  const timeOfDayOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'night', label: 'Night' }
  ];

  const addMovementEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'babyMovement',
        date: selectedDate,
        duration: parseInt(duration),
        kickCount: parseInt(kickCount),
        notes,
        timeOfDay
      })).unwrap();
      setDuration(0);
      setKickCount(0);
      setNotes('');
      setTimeOfDay('morning');
    } catch (error) {
      // Remove all console.error statements
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Baby Movement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Kick Count"
                type="number"
                value={kickCount}
                onChange={(e) => setKickCount(e.target.value)}
                min="0"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Time of Day</InputLabel>
                <Select
                  value={timeOfDay}
                  label="Time of Day"
                  onChange={(e) => setTimeOfDay(e.target.value)}
                >
                  {timeOfDayOptions.map(option => (
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
            onClick={addMovementEntry}
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
            Recent Baby Movement Entries
          </Typography>
          {babyMovementEntries.length === 0 ? (
            <Typography color="text.secondary">No baby movement entries yet.</Typography>
          ) : (
            babyMovementEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {entry.babyMovement.duration} min, {entry.babyMovement.kickCount} kicks, {entry.babyMovement.timeOfDay}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
                {entry.babyMovement.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {entry.babyMovement.notes}
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

export default BabyMovementTracker; 
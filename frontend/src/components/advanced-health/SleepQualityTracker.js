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

const SleepQualityTracker = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [hours, setHours] = useState(8);
  const [quality, setQuality] = useState('good');
  const [interruptions, setInterruptions] = useState(0);
  const [notes, setNotes] = useState('');
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const sleepEntries = entries.filter(entry => entry.type === 'sleep');

  const qualityOptions = [
    { value: 'poor', label: 'Poor' },
    { value: 'fair', label: 'Fair' },
    { value: 'good', label: 'Good' },
    { value: 'excellent', label: 'Excellent' }
  ];

  const addSleepEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'sleep',
        date: selectedDate,
        hours: parseFloat(hours),
        quality,
        interruptions: parseInt(interruptions),
        notes,
        bedTime: bedTime ? new Date(bedTime) : null,
        wakeTime: wakeTime ? new Date(wakeTime) : null
      })).unwrap();
      setHours(8);
      setQuality('good');
      setInterruptions(0);
      setNotes('');
      setBedTime('');
      setWakeTime('');
    } catch (error) {
      console.error('Failed to add sleep entry:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Sleep Entry
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Sleep Duration (hours)"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0"
                max="24"
                step="0.5"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Interruptions"
                type="number"
                value={interruptions}
                onChange={(e) => setInterruptions(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Quality</InputLabel>
                <Select
                  value={quality}
                  label="Quality"
                  onChange={(e) => setQuality(e.target.value)}
                >
                  {qualityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bed Time"
                type="datetime-local"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Wake Time"
                type="datetime-local"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
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
            onClick={addSleepEntry}
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
            Recent Sleep Entries
          </Typography>
          {sleepEntries.length === 0 ? (
            <Typography color="text.secondary">No sleep entries yet.</Typography>
          ) : (
            sleepEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {entry.sleep.hours}h, {entry.sleep.quality}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()} | Interruptions: {entry.sleep.interruptions}
                </Typography>
                {entry.sleep.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {entry.sleep.notes}
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

export default SleepQualityTracker; 
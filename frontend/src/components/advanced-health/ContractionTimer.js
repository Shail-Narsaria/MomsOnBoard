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

const ContractionTimer = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [duration, setDuration] = useState(0);
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');

  const contractionEntries = entries.filter(entry => entry.type === 'contraction');

  const intensityOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'strong', label: 'Strong' },
    { value: 'very strong', label: 'Very Strong' }
  ];

  const addContractionEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'contraction',
        date: selectedDate,
        duration: parseInt(duration),
        intensity,
        notes
      })).unwrap();
      setDuration(0);
      setIntensity('moderate');
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
            Add Contraction
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Duration (seconds)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0"
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
                  {intensityOptions.map(option => (
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
            onClick={addContractionEntry}
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
            Recent Contraction Entries
          </Typography>
          {contractionEntries.length === 0 ? (
            <Typography color="text.secondary">No contraction entries yet.</Typography>
          ) : (
            contractionEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {entry.contraction.duration}s, {entry.contraction.intensity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
                {entry.contraction.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {entry.contraction.notes}
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

export default ContractionTimer; 
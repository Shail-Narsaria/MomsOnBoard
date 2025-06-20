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
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';

const MedicationTracker = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [taken, setTaken] = useState(false);

  const medicationEntries = entries.filter(entry => entry.type === 'medication');

  const frequencyOptions = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'twice', label: 'Twice Daily' },
    { value: 'thrice', label: 'Three Times' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as_needed', label: 'As Needed' }
  ];

  const addMedicationEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'medication',
        date: selectedDate,
        medicationName,
        dosage,
        frequency,
        time: time ? new Date(time) : null,
        taken,
        notes
      })).unwrap();
      setMedicationName('');
      setDosage('');
      setFrequency('daily');
      setTime('');
      setTaken(false);
      setNotes('');
    } catch (error) {
      console.error('Failed to add medication entry:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Medication
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Medication Name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={frequency}
                  label="Frequency"
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {frequencyOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Time to Take"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={taken}
                    onChange={(e) => setTaken(e.target.checked)}
                    color="primary"
                  />
                }
                label="Taken"
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
            onClick={addMedicationEntry}
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
            Recent Medication Entries
          </Typography>
          {medicationEntries.length === 0 ? (
            <Typography color="text.secondary">No medication entries yet.</Typography>
          ) : (
            medicationEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {entry.medication.medicationName} ({entry.medication.dosage})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()} | {entry.medication.frequency} | {entry.medication.taken ? 'Taken' : 'Not taken'}
                </Typography>
                {entry.medication.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {entry.medication.notes}
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

export default MedicationTracker; 
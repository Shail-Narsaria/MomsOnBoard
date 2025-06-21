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

const WaterIntakeTracker = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [amount, setAmount] = useState(250);
  const [beverageType, setBeverageType] = useState('water');
  const [notes, setNotes] = useState('');

  const waterIntakeEntries = entries.filter(entry => entry.type === 'waterIntake');

  const beverageTypes = [
    { id: 'water', label: 'Water' },
    { id: 'juice', label: 'Juice' },
    { id: 'tea', label: 'Tea' },
    { id: 'other', label: 'Other' }
  ];

  const addIntake = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'waterIntake',
        date: selectedDate,
        waterIntake: {
          amount,
          type: beverageType,
          notes
        }
      })).unwrap();
      setAmount(250);
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
            Add Water Intake
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Beverage Type</InputLabel>
                <Select
                  value={beverageType}
                  label="Beverage Type"
                  onChange={(e) => setBeverageType(e.target.value)}
                >
                  {beverageTypes.map(option => (
                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount (ml)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                fullWidth
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
            onClick={addIntake}
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
            Recent Water Intake Entries
          </Typography>
          {waterIntakeEntries.length === 0 ? (
            <Typography color="text.secondary">No water intake entries yet.</Typography>
          ) : (
            waterIntakeEntries.slice(0, 5).map((entry) => (
              <Box key={entry._id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                {entry.waterIntake ? (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {entry.waterIntake.amount}ml, {entry.waterIntake.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                    {entry.waterIntake.notes && (
                      <Typography variant="body2" color="text.secondary">
                        Notes: {entry.waterIntake.notes}
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography color="error">Malformed entry</Typography>
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WaterIntakeTracker; 
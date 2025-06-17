import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvancedHealthEntry, fetchAdvancedHealthEntries } from '../../redux/slices/advancedHealthSlice';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Medication,
  Add,
  TrendingUp,
  History,
  Schedule,
  CheckCircle,
  Warning,
  LocalPharmacy,
  Notifications,
  NotificationsActive
} from '@mui/icons-material';

const MedicationTracker = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [taken, setTaken] = useState(false);
  const [sideEffects, setSideEffects] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');

  const medicationEntries = entries.filter(entry => entry.type === 'medication');

  const frequencyOptions = [
    { value: 'once', label: 'Once', description: 'Single dose' },
    { value: 'daily', label: 'Daily', description: 'Once per day' },
    { value: 'twice', label: 'Twice Daily', description: '2 times per day' },
    { value: 'thrice', label: 'Three Times', description: '3 times per day' },
    { value: 'weekly', label: 'Weekly', description: 'Once per week' },
    { value: 'as_needed', label: 'As Needed', description: 'When required' }
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
        sideEffects,
        prescribedBy,
        notes
      })).unwrap();
      
      // Reset form
      setMedicationName('');
      setDosage('');
      setFrequency('daily');
      setTime('');
      setTaken(false);
      setSideEffects('');
      setPrescribedBy('');
      setNotes('');
    } catch (error) {
      console.error('Failed to add medication entry:', error);
    }
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      once: '#10b981',
      daily: '#3b82f6',
      twice: '#f59e0b',
      thrice: '#ef4444',
      weekly: '#8b5cf6',
      as_needed: '#6b7280'
    };
    return colors[frequency] || '#6b7280';
  };

  const calculateTotalMedications = () => {
    return medicationEntries.length;
  };

  const calculateTakenToday = () => {
    const todayEntries = medicationEntries.filter(entry => 
      new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
    );
    return todayEntries.filter(entry => entry.medication.taken).length;
  };

  const getMostCommonMedication = () => {
    if (medicationEntries.length === 0) return 'None';
    const medCounts = {};
    medicationEntries.forEach(entry => {
      medCounts[entry.medication.medicationName] = (medCounts[entry.medication.medicationName] || 0) + 1;
    });
    return Object.keys(medCounts).reduce((a, b) => medCounts[a] > medCounts[b] ? a : b);
  };

  const calculateAdherenceRate = () => {
    if (medicationEntries.length === 0) return 0;
    const takenCount = medicationEntries.filter(entry => entry.medication.taken).length;
    return Math.round((takenCount / medicationEntries.length) * 100);
  };

  const todayEntries = medicationEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const pendingToday = todayEntries.filter(entry => !entry.medication.taken).length;

  return (
    <Box sx={{ space: 3 }}>
      {/* Medication Adherence Progress */}
      <Card sx={{ mb: 3, p: 2, background: 'linear-gradient(90deg, #fff7e6 0%, #ffe0b2 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsActive sx={{ mr: 2, color: theme.palette.warning.main, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Medication Adherence
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {calculateAdherenceRate()}% adherence rate
          </Typography>
          <LinearProgress variant="determinate" value={calculateAdherenceRate()} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
          <Typography variant="caption" color={calculateAdherenceRate() >= 90 ? 'success.main' : 'text.secondary'}>
            {calculateAdherenceRate() >= 90 ? 'Excellent!' : 'Keep it up!'}
          </Typography>
        </CardContent>
      </Card>
      {/* Add Medication Entry */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: `2px solid ${theme.palette.warning.main}` }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Log New Medication
          </Typography>
          <Grid container spacing={3}>
            {/* Medication Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Medication Name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                fullWidth
                placeholder="e.g., Prenatal Vitamins, Folic Acid"
                required
                helperText="Enter the name of the medication"
              />
            </Grid>
            {/* Dosage */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                fullWidth
                placeholder="e.g., 1 tablet, 400mg"
                required
                helperText="Specify the dosage as per prescription"
              />
            </Grid>
            {/* Frequency */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Frequency</Typography>
              <Grid container spacing={1}>
                {frequencyOptions.map((option) => (
                  <Grid item xs={6} sm={4} key={option.value}>
                    <Tooltip title={option.description} arrow>
                      <Button
                        variant={frequency === option.value ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => setFrequency(option.value)}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          bgcolor: frequency === option.value ? getFrequencyColor(option.value) : 'transparent',
                          color: frequency === option.value ? 'white' : getFrequencyColor(option.value),
                          borderColor: getFrequencyColor(option.value),
                          '&:hover': {
                            bgcolor: frequency === option.value ? getFrequencyColor(option.value) : `${getFrequencyColor(option.value)}10`
                          }
                        }}
                      >
                        {option.label}
                      </Button>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Time to Take"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText="Set a reminder time if needed"
              />
            </Grid>
            {/* Prescribed By */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Prescribed By"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                fullWidth
                placeholder="e.g., Dr. Smith, OB/GYN"
                helperText="Who prescribed this medication?"
              />
            </Grid>
            {/* Taken Status */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={taken}
                      onChange={(e) => setTaken(e.target.checked)}
                      color="success"
                    />
                  }
                  label="Medication Taken"
                />
                {taken ? (
                  <CheckCircle sx={{ color: theme.palette.success.main }} />
                ) : (
                  <Warning sx={{ color: theme.palette.warning.main }} />
                )}
              </Box>
            </Grid>
            {/* Side Effects */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Side Effects (if any)"
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder="Any side effects experienced..."
                helperText="Describe any side effects you noticed"
              />
            </Grid>
            {/* Notes */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder="Additional notes about medication..."
                helperText="Any other information"
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addMedicationEntry}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2, mt: 2 }}
          >
            Add Medication Entry
          </Button>
        </CardContent>
      </Card>
      {/* Medication Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Medication Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {calculateTotalMedications()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Entries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {calculateAdherenceRate()}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Adherence Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {calculateTakenToday()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taken Today
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {pendingToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Today
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Recent Medication Entries */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Recent Medication Entries
          </Typography>
          <Grid container spacing={2}>
            {medicationEntries.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Medication sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No medication entries recorded yet
                  </Typography>
                </Box>
              </Grid>
            ) : (
              medicationEntries.slice(0, 5).map((entry) => (
                <Grid item xs={12} md={6} key={entry._id}>
                  <Card sx={{ mb: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={entry.medication.taken ? <CheckCircle /> : <Warning />}
                          label={entry.medication.taken ? 'Taken' : 'Pending'}
                          sx={{ bgcolor: entry.medication.taken ? theme.palette.success.main : theme.palette.warning.main, color: 'white', fontWeight: 600, mr: 2 }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {entry.medication.medicationName} • {entry.medication.dosage}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(entry.date).toLocaleDateString()} • {entry.medication.frequency}
                        {entry.medication.prescribedBy && ` • ${entry.medication.prescribedBy}`}
                      </Typography>
                      {(entry.medication.sideEffects || entry.medication.notes) && (
                        <Box sx={{ mt: 2 }}>
                          {entry.medication.sideEffects && (
                            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                              <strong>Side Effects:</strong> {entry.medication.sideEffects}
                            </Typography>
                          )}
                          {entry.medication.notes && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Notes:</strong> {entry.medication.notes}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MedicationTracker; 
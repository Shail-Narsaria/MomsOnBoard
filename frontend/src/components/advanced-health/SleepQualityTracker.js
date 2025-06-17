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
  useTheme
} from '@mui/material';
import {
  Bedtime,
  Add,
  TrendingUp,
  History,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';

const SleepQualityTracker = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [hours, setHours] = useState(8);
  const [quality, setQuality] = useState('good');
  const [interruptions, setInterruptions] = useState(0);
  const [notes, setNotes] = useState('');
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const sleepEntries = entries.filter(entry => entry.type === 'sleep');

  const qualityOptions = [
    { value: 'poor', label: 'Poor', color: '#ef4444', icon: '😴', description: 'Very restless' },
    { value: 'fair', label: 'Fair', color: '#f59e0b', icon: '😐', description: 'Somewhat restless' },
    { value: 'good', label: 'Good', color: '#10b981', icon: '😊', description: 'Generally restful' },
    { value: 'excellent', label: 'Excellent', color: '#3b82f6', icon: '😄', description: 'Very restful' }
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
      
      // Reset form
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

  const getQualityColor = (quality) => {
    const option = qualityOptions.find(q => q.value === quality);
    return option ? option.color : '#6b7280';
  };

  const getQualityIcon = (quality) => {
    const option = qualityOptions.find(q => q.value === quality);
    return option ? option.icon : '😐';
  };

  const calculateAverageSleep = () => {
    if (sleepEntries.length === 0) return 0;
    const totalHours = sleepEntries.reduce((sum, entry) => sum + entry.sleep.hours, 0);
    return (totalHours / sleepEntries.length).toFixed(1);
  };

  const getMostCommonQuality = () => {
    if (sleepEntries.length === 0) return 'None';
    const qualityCounts = {};
    sleepEntries.forEach(entry => {
      qualityCounts[entry.sleep.quality] = (qualityCounts[entry.sleep.quality] || 0) + 1;
    });
    return Object.keys(qualityCounts).reduce((a, b) => qualityCounts[a] > qualityCounts[b] ? a : b);
  };

  const todayEntries = sleepEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const totalHoursToday = todayEntries.reduce((sum, entry) => sum + entry.sleep.hours, 0);
  const avgInterruptionsToday = todayEntries.length > 0 ? 
    Math.round(todayEntries.reduce((sum, entry) => sum + entry.sleep.interruptions, 0) / todayEntries.length) : 0;

  return (
    <Box sx={{ space: 3 }}>
      {/* Add Sleep Entry */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
        border: `2px solid ${theme.palette.secondary.main}`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Bedtime sx={{ mr: 2, color: theme.palette.secondary.main, fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Sleep Quality Tracker
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Sleep Duration */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Sleep Duration (hours)"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0"
                max="24"
                step="0.5"
                fullWidth
                InputProps={{
                  endAdornment: <Typography variant="body2" color="text.secondary">hours</Typography>
                }}
              />
            </Grid>

            {/* Interruptions */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setInterruptions(Math.max(0, interruptions - 1))}
                  sx={{ minWidth: 40 }}
                >
                  -
                </Button>
                <TextField
                  label="Number of Interruptions"
                  type="number"
                  value={interruptions}
                  onChange={(e) => setInterruptions(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  fullWidth
                  sx={{ textAlign: 'center' }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setInterruptions(interruptions + 1)}
                  sx={{ minWidth: 40 }}
                >
                  +
                </Button>
              </Box>
            </Grid>

            {/* Bed Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Bed Time"
                type="datetime-local"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Wake Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Wake Time"
                type="datetime-local"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Sleep Quality */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Sleep Quality</Typography>
            <Grid container spacing={2}>
              {qualityOptions.map((option) => (
                <Grid item xs={6} sm={3} key={option.value}>
                  <Button
                    variant={quality === option.value ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setQuality(option.value)}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      bgcolor: quality === option.value ? option.color : 'transparent',
                      color: quality === option.value ? 'white' : option.color,
                      borderColor: option.color,
                      '&:hover': {
                        bgcolor: quality === option.value ? option.color : `${option.color}10`
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {option.icon}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Notes */}
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="How did you sleep? Any observations..."
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addSleepEntry}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Add Sleep Entry
          </Button>
        </CardContent>
      </Card>

      {/* Sleep Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Sleep Statistics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  {calculateAverageSleep()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Hours
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {sleepEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Entries
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {getMostCommonQuality()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Most Common Quality
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {avgInterruptionsToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Interruptions
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Sleep Entries */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Recent Sleep Entries
          </Typography>
          
          {sleepEntries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Bedtime sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No sleep entries recorded yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ space: 2 }}>
              {sleepEntries.slice(0, 5).map((entry) => (
                <Card key={entry._id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Bedtime sx={{ mr: 2, color: theme.palette.secondary.main }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.sleep.hours}h • {entry.sleep.quality} • {entry.sleep.interruptions} interruptions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4">
                          {getQualityIcon(entry.sleep.quality)}
                        </Typography>
                        <Chip
                          label={entry.sleep.quality}
                          size="small"
                          sx={{
                            bgcolor: getQualityColor(entry.sleep.quality),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </Box>
                    {entry.sleep.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {entry.sleep.notes}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SleepQualityTracker; 
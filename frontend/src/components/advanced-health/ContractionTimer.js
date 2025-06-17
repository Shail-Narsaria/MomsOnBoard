import React, { useState, useEffect } from 'react';
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
  PlayArrow,
  Pause,
  Stop,
  Timer,
  TrendingUp,
  History,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const ContractionTimer = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');
  const [contractions, setContractions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const contractionEntries = entries.filter(entry => entry.type === 'contraction');

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startContraction = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const pauseContraction = () => {
    setIsTracking(false);
  };

  const stopContraction = () => {
    setIsTracking(false);
    setShowForm(true);
  };

  const saveContraction = async () => {
    const duration = Math.floor(elapsedTime / 1000); // Convert to seconds
    
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'contraction',
        date: selectedDate,
        duration,
        intensity,
        notes
      })).unwrap();

      const newContraction = {
        startTime,
        duration,
        intensity,
        timestamp: new Date()
      };

      setContractions(prev => [...prev, newContraction]);
      setShowForm(false);
      setNotes('');
      setElapsedTime(0);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to save contraction:', error);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'mild': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'strong': return '#f97316';
      case 'very strong': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getIntensityIcon = (intensity) => {
    switch (intensity) {
      case 'mild': return '😊';
      case 'moderate': return '😐';
      case 'strong': return '😣';
      case 'very strong': return '😫';
      default: return '😐';
    }
  };

  const calculateFrequency = () => {
    if (contractions.length < 2) return null;
    
    const sortedContractions = [...contractions].sort((a, b) => a.timestamp - b.timestamp);
    const intervals = [];
    
    for (let i = 1; i < sortedContractions.length; i++) {
      const interval = (sortedContractions[i].timestamp - sortedContractions[i-1].timestamp) / 60000; // minutes
      intervals.push(interval);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(avgInterval);
  };

  const todayEntries = contractionEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const totalDurationToday = todayEntries.reduce((sum, entry) => sum + entry.contraction.duration, 0);
  const avgDurationToday = todayEntries.length > 0 ? Math.round(totalDurationToday / todayEntries.length) : 0;

  return (
    <Box sx={{ space: 3 }}>
      {/* Current Contraction */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: `2px solid ${theme.palette.error.main}`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timer sx={{ mr: 2, color: theme.palette.error.main, fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Contraction Timer
            </Typography>
          </Box>

          {/* Timer Display */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'monospace', 
              fontWeight: 700,
              color: theme.palette.error.main,
              mb: 1
            }}>
              {formatTime(elapsedTime)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Contraction Duration
            </Typography>
          </Box>

          {/* Intensity Selector */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Intensity Level</Typography>
            <Grid container spacing={2}>
              {['mild', 'moderate', 'strong', 'very strong'].map((level) => (
                <Grid item xs={6} sm={3} key={level}>
                  <Button
                    variant={intensity === level ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setIntensity(level)}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      bgcolor: intensity === level ? getIntensityColor(level) : 'transparent',
                      color: intensity === level ? 'white' : getIntensityColor(level),
                      borderColor: getIntensityColor(level),
                      '&:hover': {
                        bgcolor: intensity === level ? getIntensityColor(level) : `${getIntensityColor(level)}10`
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {getIntensityIcon(level)}
                      </Typography>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {level}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {!isTracking ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={startContraction}
                sx={{ borderRadius: 3, px: 4 }}
              >
                Start Contraction
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={pauseContraction}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopContraction}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Stop & Save
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Save Form Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Contraction</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Duration (seconds)"
                value={Math.floor(elapsedTime / 1000)}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Intensity</InputLabel>
                <Select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  label="Intensity"
                >
                  <MenuItem value="mild">Mild</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="strong">Strong</MenuItem>
                  <MenuItem value="very strong">Very Strong</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Any observations about the contraction..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={saveContraction} variant="contained">
            Save Contraction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Today's Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Today's Statistics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {todayEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contractions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {avgDurationToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Duration (sec)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {calculateFrequency() || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Frequency (min)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {totalDurationToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Duration (sec)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Contractions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Recent Contractions
          </Typography>
          
          {contractionEntries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Timer sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No contractions recorded yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ space: 2 }}>
              {contractionEntries.slice(0, 5).map((entry) => (
                <Card key={entry._id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Timer sx={{ mr: 2, color: theme.palette.error.main }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.contraction.duration}s • {entry.contraction.intensity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={entry.contraction.intensity}
                        size="small"
                        sx={{
                          bgcolor: getIntensityColor(entry.contraction.intensity),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    {entry.contraction.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {entry.contraction.notes}
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

export default ContractionTimer; 
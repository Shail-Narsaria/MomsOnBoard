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
  IconButton,
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
  Add,
  ChildCare,
  AccessTime,
  TrendingUp,
  History
} from '@mui/icons-material';

const BabyMovementTracker = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [kickCount, setKickCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [showForm, setShowForm] = useState(false);

  const babyMovementEntries = entries.filter(entry => entry.type === 'babyMovement');

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setKickCount(0);
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setShowForm(true);
  };

  const addKick = () => {
    setKickCount(prev => prev + 1);
  };

  const saveSession = async () => {
    const duration = Math.floor(elapsedTime / 60000); // Convert to minutes
    
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'babyMovement',
        date: selectedDate,
        duration,
        kickCount,
        notes,
        timeOfDay
      })).unwrap();
      
      // Reset form
      setShowForm(false);
      setNotes('');
      setKickCount(0);
      setElapsedTime(0);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to save baby movement session:', error);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeOfDayColor = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning': return '#fbbf24';
      case 'afternoon': return '#f59e0b';
      case 'evening': return '#d97706';
      case 'night': return '#92400e';
      default: return '#6b7280';
    }
  };

  const todayEntries = babyMovementEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const totalKicksToday = todayEntries.reduce((sum, entry) => sum + entry.babyMovement.kickCount, 0);
  const totalDurationToday = todayEntries.reduce((sum, entry) => sum + entry.babyMovement.duration, 0);

  return (
    <Box sx={{ space: 3 }}>
      {/* Current Session */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
        border: `2px solid ${theme.palette.primary.main}`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ChildCare sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Baby Movement Tracker
            </Typography>
          </Box>

          {/* Timer Display */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'monospace', 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1
            }}>
              {formatTime(elapsedTime)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Session Duration
            </Typography>
          </Box>

          {/* Kick Counter */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              color: theme.palette.secondary.main,
              mb: 2
            }}>
              {kickCount}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Kicks Counted
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={addKick}
              disabled={!isTracking}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Count Kick
            </Button>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {!isTracking ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={startTracking}
                sx={{ borderRadius: 3, px: 4 }}
              >
                Start Tracking
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={pauseTracking}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopTracking}
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
        <DialogTitle>Save Movement Session</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Duration (minutes)"
                value={Math.floor(elapsedTime / 60000)}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Kick Count"
                value={kickCount}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Time of Day</InputLabel>
                <Select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  label="Time of Day"
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                  <MenuItem value="night">Night</MenuItem>
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
                placeholder="Any observations about baby's movements..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={saveSession} variant="contained">
            Save Session
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
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {todayEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sessions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  {totalKicksToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Kicks
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {totalDurationToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {todayEntries.length > 0 ? Math.round(totalKicksToday / totalDurationToday) : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kicks/Min
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Recent Sessions
          </Typography>
          
          {babyMovementEntries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ChildCare sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No movement sessions recorded yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ space: 2 }}>
              {babyMovementEntries.slice(0, 5).map((entry) => (
                <Card key={entry._id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ChildCare sx={{ mr: 2, color: theme.palette.primary.main }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.babyMovement.duration} min • {entry.babyMovement.kickCount} kicks
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString()} • {entry.babyMovement.timeOfDay}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={entry.babyMovement.timeOfDay}
                        size="small"
                        sx={{
                          bgcolor: getTimeOfDayColor(entry.babyMovement.timeOfDay),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    {entry.babyMovement.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {entry.babyMovement.notes}
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

export default BabyMovementTracker; 
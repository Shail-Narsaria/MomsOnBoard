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
  Slider,
  Rating,
  Tooltip,
  Divider
} from '@mui/material';
import {
  FitnessCenter,
  Add,
  TrendingUp,
  History,
  Timer,
  DirectionsRun,
  Pool,
  DirectionsBike,
  SelfImprovement,
  EmojiEvents
} from '@mui/icons-material';

const WEEKLY_GOAL = 150; // minutes

const ExerciseLogTracker = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [exerciseType, setExerciseType] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(3);
  const [calories, setCalories] = useState(150);
  const [notes, setNotes] = useState('');
  const [satisfaction, setSatisfaction] = useState(3);

  const exerciseEntries = entries.filter(entry => entry.type === 'exercise');

  const exerciseTypes = [
    { value: 'walking', label: 'Walking', icon: <DirectionsRun />, color: '#10b981' },
    { value: 'swimming', label: 'Swimming', icon: <Pool />, color: '#3b82f6' },
    { value: 'cycling', label: 'Cycling', icon: <DirectionsBike />, color: '#f59e0b' },
    { value: 'yoga', label: 'Yoga', icon: <SelfImprovement />, color: '#8b5cf6' },
    { value: 'strength', label: 'Strength Training', icon: <FitnessCenter />, color: '#ef4444' },
    { value: 'pilates', label: 'Pilates', icon: <SelfImprovement />, color: '#ec4899' },
    { value: 'dancing', label: 'Dancing', icon: <DirectionsRun />, color: '#06b6d4' },
    { value: 'other', label: 'Other', icon: <FitnessCenter />, color: '#6b7280' }
  ];

  const intensityLabels = {
    1: 'Very Light',
    2: 'Light',
    3: 'Moderate',
    4: 'Vigorous',
    5: 'Very Vigorous'
  };

  const addExerciseEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'exercise',
        date: selectedDate,
        exerciseType,
        duration: parseInt(duration),
        intensity: parseInt(intensity),
        calories: parseInt(calories),
        satisfaction: parseInt(satisfaction),
        notes
      })).unwrap();
      
      // Reset form
      setExerciseType('walking');
      setDuration(30);
      setIntensity(3);
      setCalories(150);
      setSatisfaction(3);
      setNotes('');
    } catch (error) {
      // Remove all console.error statements
    }
  };

  const getExerciseIcon = (type) => {
    const exercise = exerciseTypes.find(e => e.value === type);
    return exercise ? exercise.icon : <FitnessCenter />;
  };

  const getExerciseColor = (type) => {
    const exercise = exerciseTypes.find(e => e.value === type);
    return exercise ? exercise.color : '#6b7280';
  };

  const calculateTotalDuration = () => {
    return exerciseEntries.reduce((sum, entry) => sum + entry.exercise.duration, 0);
  };

  const calculateTotalCalories = () => {
    return exerciseEntries.reduce((sum, entry) => sum + entry.exercise.calories, 0);
  };

  const getMostCommonExercise = () => {
    if (exerciseEntries.length === 0) return 'None';
    const typeCounts = {};
    exerciseEntries.forEach(entry => {
      typeCounts[entry.exercise.exerciseType] = (typeCounts[entry.exercise.exerciseType] || 0) + 1;
    });
    return Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b);
  };

  const calculateAverageSatisfaction = () => {
    if (exerciseEntries.length === 0) return 0;
    const totalSatisfaction = exerciseEntries.reduce((sum, entry) => sum + entry.exercise.satisfaction, 0);
    return (totalSatisfaction / exerciseEntries.length).toFixed(1);
  };

  const todayEntries = exerciseEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const totalDurationToday = todayEntries.reduce((sum, entry) => sum + entry.exercise.duration, 0);
  const totalCaloriesToday = todayEntries.reduce((sum, entry) => sum + entry.exercise.calories, 0);

  // Calculate weekly progress
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  const weeklyEntries = exerciseEntries.filter(entry => {
    const d = new Date(entry.date);
    return d >= startOfWeek && d <= endOfWeek;
  });
  const weeklyMinutes = weeklyEntries.reduce((sum, entry) => sum + entry.exercise.duration, 0);
  const weeklyProgress = Math.min(100, Math.round((weeklyMinutes / WEEKLY_GOAL) * 100));

  return (
    <Box sx={{ space: 3 }}>
      {/* Weekly Progress */}
      <Card sx={{ mb: 3, p: 2, background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEvents sx={{ mr: 2, color: theme.palette.info.main, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Weekly Exercise Goal
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {weeklyMinutes} / {WEEKLY_GOAL} minutes this week
          </Typography>
          <LinearProgress variant="determinate" value={weeklyProgress} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
          <Typography variant="caption" color={weeklyProgress >= 100 ? 'success.main' : 'text.secondary'}>
            {weeklyProgress >= 100 ? 'Goal achieved!' : `${weeklyProgress}% of goal`}
          </Typography>
        </CardContent>
      </Card>
      {/* Add Exercise Entry */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: `2px solid ${theme.palette.success.main}` }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Log New Exercise
          </Typography>
          <Grid container spacing={3}>
            {/* Exercise Type */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Exercise Type</Typography>
              <Grid container spacing={1}>
                {exerciseTypes.map((exercise) => (
                  <Grid item xs={6} sm={4} key={exercise.value}>
                    <Tooltip title={exercise.label} arrow>
                      <Button
                        variant={exerciseType === exercise.value ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => setExerciseType(exercise.value)}
                        startIcon={exercise.icon}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          bgcolor: exerciseType === exercise.value ? exercise.color : 'transparent',
                          color: exerciseType === exercise.value ? 'white' : exercise.color,
                          borderColor: exercise.color,
                          '&:hover': {
                            bgcolor: exerciseType === exercise.value ? exercise.color : `${exercise.color}10`
                          }
                        }}
                      >
                        {exercise.label}
                      </Button>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* Duration */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Duration (minutes)</Typography>
              <Slider
                value={duration}
                onChange={(e, newValue) => setDuration(newValue)}
                min={5}
                max={180}
                step={5}
                marks={[{ value: 15, label: '15m' }, { value: 30, label: '30m' }, { value: 60, label: '1h' }, { value: 120, label: '2h' }]}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                Recommended: 30+ min per session
              </Typography>
            </Grid>
            {/* Intensity */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Intensity</Typography>
              <Slider
                value={intensity}
                onChange={(e, newValue) => setIntensity(newValue)}
                min={1}
                max={5}
                step={1}
                marks={[{ value: 1, label: 'Very Light' }, { value: 3, label: 'Moderate' }, { value: 5, label: 'Very Vigorous' }]}
                sx={{ mb: 2 }}
              />
            </Grid>
            {/* Calories */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Calories Burned</Typography>
              <TextField
                type="number"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                fullWidth
                InputProps={{ endAdornment: <Typography variant="caption">kcal</Typography> }}
                helperText="Estimate or use a fitness tracker"
              />
            </Grid>
            {/* Satisfaction */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Satisfaction</Typography>
              <Rating
                value={satisfaction}
                onChange={(e, newValue) => setSatisfaction(newValue)}
                max={5}
                size="large"
              />
            </Grid>
            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder="How was your workout? Any observations or feelings..."
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addExerciseEntry}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2, mt: 2 }}
          >
            Add Exercise Entry
          </Button>
        </CardContent>
      </Card>
      {/* Exercise Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Exercise Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {calculateTotalDuration()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {calculateTotalCalories()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Calories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {exerciseEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Workouts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  {calculateAverageSatisfaction()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Satisfaction
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Recent Exercise Entries */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Recent Exercise Entries
          </Typography>
          <Grid container spacing={2}>
            {exerciseEntries.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FitnessCenter sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No exercise entries recorded yet
                  </Typography>
                </Box>
              </Grid>
            ) : (
              exerciseEntries.slice(0, 5).map((entry) => (
                <Grid item xs={12} md={6} key={entry._id}>
                  <Card sx={{ mb: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={getExerciseIcon(entry.exercise.exerciseType)}
                          label={entry.exercise.exerciseType}
                          sx={{ bgcolor: getExerciseColor(entry.exercise.exerciseType), color: 'white', fontWeight: 600, mr: 2 }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {entry.exercise.duration} min • {entry.exercise.calories} kcal
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(entry.date).toLocaleDateString()} • Intensity: {intensityLabels[entry.exercise.intensity]}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={entry.exercise.satisfaction} readOnly size="small" />
                        {entry.exercise.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            {entry.exercise.notes}
                          </Typography>
                        )}
                      </Box>
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

export default ExerciseLogTracker; 
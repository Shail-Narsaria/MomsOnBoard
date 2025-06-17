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
  Opacity,
  Add,
  TrendingUp,
  History,
  LocalDrink,
  CheckCircle
} from '@mui/icons-material';

const WaterIntakeTracker = ({ selectedDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entries, loading } = useSelector(state => state.advancedHealth);
  const [amount, setAmount] = useState(250);
  const [beverageType, setBeverageType] = useState('water');
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const waterIntakeEntries = entries.filter(entry => entry.type === 'waterIntake');

  const todayIntake = waterIntakeEntries.reduce((total, entry) => total + entry.waterIntake.amount, 0);
  const progressPercentage = Math.min((todayIntake / dailyGoal) * 100, 100);

  const beverageTypes = [
    { id: 'water', label: 'Water', color: '#3b82f6', icon: '💧' },
    { id: 'juice', label: 'Juice', color: '#f97316', icon: '🍊' },
    { id: 'tea', label: 'Tea', color: '#10b981', icon: '🍵' },
    { id: 'other', label: 'Other', color: '#6b7280', icon: '🥤' }
  ];

  const quickAmounts = [100, 200, 250, 300, 500];

  const addIntake = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'waterIntake',
        date: selectedDate,
        amount,
        type: beverageType,
        goal: dailyGoal
      })).unwrap();
      
      setAmount(250);
    } catch (error) {
      console.error('Failed to add water intake:', error);
    }
  };

  const updateDailyGoal = () => {
    setShowGoalForm(false);
  };

  const getBeverageTypeColor = (type) => {
    const beverage = beverageTypes.find(b => b.id === type);
    return beverage ? beverage.color : '#6b7280';
  };

  const getBeverageIcon = (type) => {
    const beverage = beverageTypes.find(b => b.id === type);
    return beverage ? beverage.icon : '🥤';
  };

  const todayEntries = waterIntakeEntries.filter(entry => 
    new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
  );

  return (
    <Box sx={{ space: 3 }}>
      {/* Daily Progress */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: `2px solid ${theme.palette.info.main}`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Opacity sx={{ mr: 2, color: theme.palette.info.main, fontSize: 32 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Daily Water Intake
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowGoalForm(true)}
              sx={{ borderRadius: 2 }}
            >
              Set Goal
            </Button>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {todayIntake}ml
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dailyGoal}ml goal
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                bgcolor: 'rgba(59, 130, 246, 0.2)',
                '& .MuiLinearProgress-bar': { 
                  bgcolor: theme.palette.info.main,
                  borderRadius: 6
                }
              }} 
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                {Math.round(progressPercentage)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                complete
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {todayEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Entries Today
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {Math.round(todayIntake / todayEntries.length) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg per Entry
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Add Intake Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Add sx={{ mr: 1 }} />
            Add Water Intake
          </Typography>

          {/* Beverage Type */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Beverage Type</Typography>
            <Grid container spacing={2}>
              {beverageTypes.map((beverage) => (
                <Grid item xs={6} sm={3} key={beverage.id}>
                  <Button
                    variant={beverageType === beverage.id ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setBeverageType(beverage.id)}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      bgcolor: beverageType === beverage.id ? beverage.color : 'transparent',
                      color: beverageType === beverage.id ? 'white' : beverage.color,
                      borderColor: beverage.color,
                      '&:hover': {
                        bgcolor: beverageType === beverage.id ? beverage.color : `${beverage.color}10`
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {beverage.icon}
                      </Typography>
                      <Typography variant="body2">
                        {beverage.label}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {/* Amount */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Amount (ml)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                fullWidth
                InputProps={{
                  endAdornment: <Typography variant="body2" color="text.secondary">ml</Typography>
                }}
              />
            </Grid>

            {/* Quick Amount Buttons */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Amounts</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {quickAmounts.map((quickAmount) => (
                  <Chip
                    key={quickAmount}
                    label={`${quickAmount}ml`}
                    onClick={() => setAmount(quickAmount)}
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addIntake}
            fullWidth
            sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
          >
            Add Intake
          </Button>
        </CardContent>
      </Card>

      {/* Goal Setting Dialog */}
      <Dialog open={showGoalForm} onClose={() => setShowGoalForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Set Daily Goal</DialogTitle>
        <DialogContent>
          <TextField
            label="Daily Goal (ml)"
            type="number"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: <Typography variant="body2" color="text.secondary">ml</Typography>
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGoalForm(false)}>Cancel</Button>
          <Button onClick={updateDailyGoal} variant="contained">
            Save Goal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Today's Intake History */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Today's Intake
          </Typography>
          
          {todayEntries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocalDrink sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No intake recorded yet today
              </Typography>
            </Box>
          ) : (
            <Box sx={{ space: 2 }}>
              {todayEntries.map((entry) => (
                <Card key={entry._id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          bgcolor: `${getBeverageTypeColor(entry.waterIntake.type)}20`,
                          mr: 2
                        }}>
                          <Typography variant="h5">
                            {getBeverageIcon(entry.waterIntake.type)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.waterIntake.amount}ml {entry.waterIntake.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${Math.round((entry.waterIntake.amount / dailyGoal) * 100)}% of goal`}
                        size="small"
                        sx={{
                          bgcolor: theme.palette.info.main,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
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

export default WaterIntakeTracker; 
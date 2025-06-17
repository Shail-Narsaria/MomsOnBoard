import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAdvancedHealthEntries, 
  fetchAdvancedHealthStats,
  setActiveTab 
} from '../redux/slices/advancedHealthSlice';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  CalendarToday,
  AccessTime,
  FitnessCenter,
  ChildCare,
  Timer,
  Opacity,
  Bedtime,
  LocalHospital,
  Medication,
  Add as AddIcon
} from '@mui/icons-material';
import BabyMovementTracker from '../components/advanced-health/BabyMovementTracker';
import ContractionTimer from '../components/advanced-health/ContractionTimer';
import WaterIntakeTracker from '../components/advanced-health/WaterIntakeTracker';
import SleepQualityTracker from '../components/advanced-health/SleepQualityTracker';
import ExerciseLogTracker from '../components/advanced-health/ExerciseLogTracker';
import MedicationTracker from '../components/advanced-health/MedicationTracker';

const AdvancedHealth = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { entries, stats, loading, error, activeTab } = useSelector(state => state.advancedHealth);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    dispatch(fetchAdvancedHealthEntries({ startDate: selectedDate, endDate: selectedDate }));
    dispatch(fetchAdvancedHealthStats({ startDate: selectedDate, endDate: selectedDate }));
  }, [dispatch, selectedDate]);

  const tabs = [
    { 
      id: 'babyMovement', 
      label: 'Baby Movement', 
      icon: <ChildCare />, 
      color: theme.palette.mode === 'dark' ? '#fce7f3' : '#fdf2f8',
      textColor: '#ec4899'
    },
    { 
      id: 'contraction', 
      label: 'Contractions', 
      icon: <Timer />, 
      color: theme.palette.mode === 'dark' ? '#fef2f2' : '#fef2f2',
      textColor: '#ef4444'
    },
    { 
      id: 'waterIntake', 
      label: 'Water Intake', 
      icon: <Opacity />, 
      color: theme.palette.mode === 'dark' ? '#eff6ff' : '#eff6ff',
      textColor: '#3b82f6'
    },
    { 
      id: 'sleep', 
      label: 'Sleep Quality', 
      icon: <Bedtime />, 
      color: theme.palette.mode === 'dark' ? '#f3e8ff' : '#f3e8ff',
      textColor: '#8b5cf6'
    },
    { 
      id: 'exercise', 
      label: 'Exercise Log', 
      icon: <FitnessCenter />, 
      color: theme.palette.mode === 'dark' ? '#ecfdf5' : '#ecfdf5',
      textColor: '#10b981'
    },
    { 
      id: 'medication', 
      label: 'Medications', 
      icon: <Medication />, 
      color: theme.palette.mode === 'dark' ? '#fff7ed' : '#fff7ed',
      textColor: '#f97316'
    }
  ];

  const getTodayStats = () => {
    const todayEntries = entries.filter(entry => 
      new Date(entry.date).toDateString() === new Date().toDateString()
    );
    
    return {
      totalEntries: todayEntries.length,
      byType: tabs.reduce((acc, tab) => {
        acc[tab.id] = todayEntries.filter(entry => entry.type === tab.id).length;
        return acc;
      }, {})
    };
  };

  const todayStats = getTodayStats();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'babyMovement':
        return <BabyMovementTracker selectedDate={selectedDate} />;
      case 'contraction':
        return <ContractionTimer selectedDate={selectedDate} />;
      case 'waterIntake':
        return <WaterIntakeTracker selectedDate={selectedDate} />;
      case 'sleep':
        return <SleepQualityTracker selectedDate={selectedDate} />;
      case 'exercise':
        return <ExerciseLogTracker selectedDate={selectedDate} />;
      case 'medication':
        return <MedicationTracker selectedDate={selectedDate} />;
      default:
        return <BabyMovementTracker selectedDate={selectedDate} />;
    }
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            textAlign: { xs: 'center', md: 'left' }
          }}>
            Advanced Health Tracking
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            textAlign: { xs: 'center', md: 'left' },
            mb: 3
          }}>
            Comprehensive tracking for your pregnancy journey
          </Typography>

          {/* Date Selector */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            mb: 3
          }}>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Entries</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {todayStats.totalEntries}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((todayStats.totalEntries / 10) * 100, 100)} 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Tracking</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {Object.values(todayStats.byType).filter(count => count > 0).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Categories tracked today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="h6">Last Updated</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Real-time tracking
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ mr: 1 }} />
                  <Typography variant="h6">Most Active</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {Object.entries(todayStats.byType).reduce((a, b) => a[1] > b[1] ? a : b)[0] || 'None'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Top tracking category
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.shadows[8]
        }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none'
                },
                '& .Mui-selected': {
                  color: 'primary.main'
                }
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      <Typography variant="body2">{tab.label}</Typography>
                      {todayStats.byType[tab.id] > 0 && (
                        <Chip
                          label={todayStats.byType[tab.id]}
                          size="small"
                          sx={{
                            bgcolor: tab.color,
                            color: tab.textColor,
                            fontWeight: 600,
                            minWidth: 20,
                            height: 20
                          }}
                        />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                py: 8 
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              renderTabContent()
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdvancedHealth; 
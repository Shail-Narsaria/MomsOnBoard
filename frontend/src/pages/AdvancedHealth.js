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
import './AdvancedHealth.css';

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
    { id: 'babyMovement', label: 'Baby Movement', icon: <ChildCare /> },
    { id: 'contraction', label: 'Contractions', icon: <Timer /> },
    { id: 'waterIntake', label: 'Water Intake', icon: <Opacity /> },
    { id: 'sleep', label: 'Sleep Quality', icon: <Bedtime /> },
    { id: 'exercise', label: 'Exercise Log', icon: <FitnessCenter /> },
    { id: 'medication', label: 'Medications', icon: <Medication /> }
  ];

  const getTodayStats = () => {
    const todayEntries = entries.filter(entry => new Date(entry.date).toDateString() === new Date().toDateString());
    return {
      totalEntries: todayEntries.length,
      categoriesTracked: tabs.filter(tab => todayEntries.some(entry => entry.type === tab.id)).length
    };
  };
  const todayStats = getTodayStats();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'babyMovement': return <BabyMovementTracker selectedDate={selectedDate} />;
      case 'contraction': return <ContractionTimer selectedDate={selectedDate} />;
      case 'waterIntake': return <WaterIntakeTracker selectedDate={selectedDate} />;
      case 'sleep': return <SleepQualityTracker selectedDate={selectedDate} />;
      case 'exercise': return <ExerciseLogTracker selectedDate={selectedDate} />;
      case 'medication': return <MedicationTracker selectedDate={selectedDate} />;
      default: return <BabyMovementTracker selectedDate={selectedDate} />;
    }
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <Box className="advancedhealth-container">
      <Container maxWidth="xl">
        <Box className="advancedhealth-header">
          <Typography variant="h3" component="h1" className="advancedhealth-title">
            Advanced Health Tracking
          </Typography>
          <Typography variant="h6" color="text.secondary" className="advancedhealth-subtitle">
            Comprehensive tracking for your pregnancy journey
          </Typography>
          <Box className="advancedhealth-date-selector">
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Box className="advancedhealth-summary" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          marginBottom: '2rem',
          background: theme.palette.background.paper,
          borderRadius: 8,
          padding: '1rem 2rem',
          boxShadow: theme.shadows[1]
        }}>
          <Typography variant="body1"><b>Today's Entries:</b> {todayStats.totalEntries}</Typography>
          <Divider orientation="vertical" flexItem style={{ margin: '0 1rem' }} />
          <Typography variant="body1"><b>Categories Tracked:</b> {todayStats.categoriesTracked}</Typography>
        </Box>
        <Paper className="advancedhealth-main">
          <Box>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={<Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{tab.icon}<span>{tab.label}</span></Box>}
                />
              ))}
            </Tabs>
          </Box>
          <Box style={{ padding: isMobile ? 16 : 32 }}>
            {loading ? (
              <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
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
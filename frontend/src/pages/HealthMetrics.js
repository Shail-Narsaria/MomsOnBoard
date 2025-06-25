import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp,
  Favorite,
  LocalHospital,
  Thermostat,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { 
  getHealthMetrics, 
  createHealthMetric, 
  updateHealthMetric, 
  deleteHealthMetric 
} from '../redux/slices/healthMetricsSlice';
import './HealthMetrics.css';

const HealthMetrics = () => {
  const [open, setOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    weight: '',
    systolicBP: '',
    diastolicBP: '',
    bloodSugar: '',
    temperature: '',
    symptoms: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { metrics, loading } = useSelector(state => state.healthMetrics);

  // Sort metrics by date (newest first) to ensure proper display order
  const sortedMetrics = metrics ? [...metrics].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

  useEffect(() => {
    dispatch(getHealthMetrics());
  }, [dispatch]);

  const handleOpen = (metric = null) => {
    if (metric) {
      setFormData({
        date: format(new Date(metric.date), 'yyyy-MM-dd'),
        weight: metric.weight || '',
        systolicBP: metric.bloodPressure?.systolic || '',
        diastolicBP: metric.bloodPressure?.diastolic || '',
        bloodSugar: metric.bloodSugar || '',
        temperature: metric.temperature || '',
        symptoms: metric.symptoms?.join(', ') || '',
        notes: metric.notes || ''
      });
      setSelectedMetric(metric);
    } else {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        weight: '',
        systolicBP: '',
        diastolicBP: '',
        bloodSugar: '',
        temperature: '',
        symptoms: '',
        notes: ''
      });
      setSelectedMetric(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedMetric(null);
    setOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.date || !formData.weight || !formData.systolicBP || !formData.diastolicBP) {
      setError('Please fill in all required fields (Date, Weight, Blood Pressure)');
      return;
    }

    const metricData = {
      date: formData.date,
      weight: parseFloat(formData.weight),
      bloodPressure: {
        systolic: parseInt(formData.systolicBP),
        diastolic: parseInt(formData.diastolicBP)
      },
      bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()).filter(s => s) : [],
      notes: formData.notes
    };

    try {
      if (selectedMetric) {
        const result = await dispatch(updateHealthMetric({ id: selectedMetric._id, metricData })).unwrap();
      } else {
        const result = await dispatch(createHealthMetric(metricData)).unwrap();
      }
      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to save health metric');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this health metric?')) {
      try {
        await dispatch(deleteHealthMetric(id)).unwrap();
      } catch (error) {
        setError(error.message || 'Failed to delete health metric');
      }
    }
  };

  const getLatestMetric = (field) => {
    if (sortedMetrics.length === 0) return 'No data';
    const latest = sortedMetrics[0]; // Metrics are sorted by date descending
    
    switch (field) {
      case 'weight':
        return `${latest.weight} kg`;
      case 'bloodPressure':
        return `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic} mmHg`;
      case 'bloodSugar':
        return latest.bloodSugar ? `${latest.bloodSugar} mg/dL` : 'No data';
      case 'temperature':
        return latest.temperature ? `${latest.temperature}°C` : 'No data';
      default:
        return 'No data';
    }
  };

  const MetricCard = ({ title, value, unit, icon: Icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="p" gutterBottom>
          {value}
          {unit && (
            <Typography variant="caption" sx={{ ml: 1 }}>
              {unit}
            </Typography>
          )}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Health Metrics
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: 'primary.main' }}
        >
          New Entry
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Weight"
            value={getLatestMetric('weight')}
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Blood Pressure"
            value={getLatestMetric('bloodPressure')}
            icon={Favorite}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Blood Sugar"
            value={getLatestMetric('bloodSugar')}
            icon={LocalHospital}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Temperature"
            value={getLatestMetric('temperature')}
            icon={Thermostat}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              History
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : sortedMetrics.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No health metrics recorded yet. Add your first entry to get started.
              </Typography>
            ) : (
              <List>
                {sortedMetrics.map((metric) => (
                  <ListItem key={metric._id} divider>
                    <ListItemText
                      primary={format(new Date(metric.date), 'MMMM d, yyyy')}
                      secondary={`Weight: ${metric.weight}kg | BP: ${metric.bloodPressure.systolic}/${metric.bloodPressure.diastolic} | Sugar: ${metric.bloodSugar || 'N/A'}mg/dL`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleOpen(metric)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDelete(metric._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Symptoms
            </Typography>
            {sortedMetrics.length > 0 && sortedMetrics[0].symptoms.length > 0 ? (
              <List dense>
                {sortedMetrics[0].symptoms.map((symptom, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={symptom} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No symptoms recorded
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Health Metrics Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMetric ? 'Edit Health Metrics' : 'New Health Metrics'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              name="date"
              type="date"
              label="Date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="weight"
              type="number"
              label="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ step: 0.1, min: 0 }}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  name="systolicBP"
                  type="number"
                  label="Systolic BP"
                  value={formData.systolicBP}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="diastolicBP"
                  type="number"
                  label="Diastolic BP"
                  value={formData.diastolicBP}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
            <TextField
              name="bloodSugar"
              type="number"
              label="Blood Sugar (mg/dL)"
              value={formData.bloodSugar}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="temperature"
              type="number"
              label="Temperature (°C)"
              value={formData.temperature}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="symptoms"
              label="Symptoms (comma-separated)"
              value={formData.symptoms}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              name="notes"
              label="Notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (selectedMetric ? 'Save Changes' : 'Create Entry')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default HealthMetrics; 
import React, { useState } from 'react';
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
import { Line } from 'react-chartjs-2';

const HealthMetrics = () => {
  const [open, setOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const dispatch = useDispatch();

  const handleOpen = (metric = null) => {
    setSelectedMetric(metric);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedMetric(null);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement health metrics submission
    handleClose();
  };

  // Placeholder metrics data
  const metrics = [
    {
      id: 1,
      date: new Date(),
      weight: 65,
      bloodPressure: {
        systolic: 120,
        diastolic: 80,
      },
      bloodSugar: 95,
      temperature: 36.8,
      symptoms: ['Nausea', 'Fatigue'],
      notes: 'Feeling better today',
    },
  ];

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
          <Typography variant="caption" sx={{ ml: 1 }}>
            {unit}
          </Typography>
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
            value={65}
            unit="kg"
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Blood Pressure"
            value="120/80"
            unit="mmHg"
            icon={Favorite}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Blood Sugar"
            value={95}
            unit="mg/dL"
            icon={LocalHospital}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Temperature"
            value={36.8}
            unit="°C"
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
            <List>
              {metrics.map((metric) => (
                <ListItem key={metric.id} divider>
                  <ListItemText
                    primary={format(metric.date, 'MMMM d, yyyy')}
                    secondary={`Weight: ${metric.weight}kg | BP: ${metric.bloodPressure.systolic}/${metric.bloodPressure.diastolic} | Sugar: ${metric.bloodSugar}mg/dL`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpen(metric)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Symptoms
            </Typography>
            <List dense>
              {metrics[0]?.symptoms.map((symptom, index) => (
                <ListItem key={index}>
                  <ListItemText primary={symptom} />
                </ListItem>
              ))}
            </List>
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
            <TextField
              type="date"
              label="Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              type="number"
              label="Weight (kg)"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Systolic BP"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Diastolic BP"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <TextField
              type="number"
              label="Blood Sugar (mg/dL)"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              type="number"
              label="Temperature (°C)"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Symptoms (comma-separated)"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Notes"
              multiline
              rows={4}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedMetric ? 'Save Changes' : 'Create Entry'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default HealthMetrics; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from '../redux/slices/appointmentSlice';

const Appointments = () => {
  const [open, setOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: '',
    doctorName: '',
    location: '',
    notes: ''
  });
  const [scheduleData, setScheduleData] = useState({
    doctorName: '',
    frequency: 'monthly',
    startDate: '',
    appointmentType: 'Checkup',
    time: '10:00',
    location: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { appointments, loading } = useSelector(state => state.appointments);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        date: format(new Date(appointment.date), 'yyyy-MM-dd'),
        time: appointment.time,
        type: appointment.type,
        doctorName: appointment.doctorName || '',
        location: appointment.location || '',
        notes: appointment.notes || ''
      });
      setSelectedAppointment(appointment);
    } else {
      setFormData({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        type: '',
        doctorName: '',
        location: '',
        notes: ''
      });
      setSelectedAppointment(null);
    }
    setOpen(true);
  };

  const handleScheduleOpen = () => {
    setScheduleData({
      doctorName: '',
      frequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      appointmentType: 'checkup',
      time: '10:00',
      location: '',
      notes: ''
    });
    setScheduleOpen(true);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setOpen(false);
    setScheduleOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.type) {
      setError('Please fill in all required fields (Title, Date, Time, Type)');
      return;
    }

    const appointmentData = {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      doctorName: formData.doctorName,
      location: formData.location,
      notes: formData.notes
    };

    console.log('Submitting appointment:', appointmentData);

    try {
      if (selectedAppointment) {
        const result = await dispatch(updateAppointment({ id: selectedAppointment._id, appointmentData })).unwrap();
        console.log('Appointment updated:', result);
      } else {
        const result = await dispatch(createAppointment(appointmentData)).unwrap();
        console.log('Appointment created:', result);
      }
      handleClose();
    } catch (error) {
      console.error('Appointment error:', error);
      setError(error.message || 'Failed to save appointment');
    }
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();
    
    if (!scheduleData.doctorName || !scheduleData.startDate) {
      setError('Please fill in doctor name and start date');
      return;
    }

    const newAppointments = [];
    let currentDate = new Date(scheduleData.startDate);
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Schedule for 1 year

    while (currentDate <= endDate) {
      const appointmentData = {
        title: `${getAppointmentTypeLabel(scheduleData.appointmentType)} with Dr. ${scheduleData.doctorName}`,
        date: format(currentDate, 'yyyy-MM-dd'),
        time: scheduleData.time,
        type: scheduleData.appointmentType,
        doctorName: scheduleData.doctorName,
        location: scheduleData.location,
        notes: scheduleData.notes
      };
      
      newAppointments.push(appointmentData);

      // Calculate next appointment date based on frequency
      switch (scheduleData.frequency) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
        default:
          currentDate = addMonths(currentDate, 1);
      }
    }

    try {
      // Create all appointments
      for (const appointmentData of newAppointments) {
        await dispatch(createAppointment(appointmentData)).unwrap();
      }
      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to schedule appointments');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await dispatch(deleteAppointment(id)).unwrap();
      } catch (error) {
        setError(error.message || 'Failed to delete appointment');
      }
    }
  };

  const appointmentTypes = [
    { value: 'checkup', label: 'Checkup' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'blood-test', label: 'Blood Test' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'other', label: 'Other' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const getAppointmentTypeLabel = (type) => {
    const appointmentType = appointmentTypes.find(t => t.value === type);
    return appointmentType ? appointmentType.label : type;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={handleScheduleOpen}
            sx={{ mr: 2 }}
          >
            Auto Schedule
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ bgcolor: 'primary.main' }}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No appointments scheduled. Create your first appointment to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.title}</TableCell>
                  <TableCell>{format(new Date(appointment.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{getAppointmentTypeLabel(appointment.type)}</TableCell>
                  <TableCell>{appointment.doctorName || 'N/A'}</TableCell>
                  <TableCell>{appointment.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.status} 
                      color={appointment.status === 'scheduled' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(appointment)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Appointment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              name="title"
              autoFocus
              margin="dense"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
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
              name="time"
              type="time"
              label="Time"
              value={formData.time}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="type"
              select
              label="Type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              {appointmentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="doctorName"
              label="Doctor Name"
              value={formData.doctorName}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              name="location"
              label="Location"
              value={formData.location}
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
              {loading ? <CircularProgress size={24} /> : (selectedAppointment ? 'Save Changes' : 'Create Appointment')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Auto Schedule Dialog */}
      <Dialog open={scheduleOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Auto Schedule Appointments
        </DialogTitle>
        <form onSubmit={handleScheduleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              name="doctorName"
              label="Doctor Name"
              value={scheduleData.doctorName}
              onChange={handleScheduleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Frequency</InputLabel>
              <Select
                name="frequency"
                value={scheduleData.frequency}
                onChange={handleScheduleChange}
                label="Frequency"
              >
                {frequencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="startDate"
              type="date"
              label="Start Date"
              value={scheduleData.startDate}
              onChange={handleScheduleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="appointmentType"
              select
              label="Appointment Type"
              value={scheduleData.appointmentType}
              onChange={handleScheduleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              {appointmentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="time"
              type="time"
              label="Time"
              value={scheduleData.time}
              onChange={handleScheduleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="location"
              label="Location"
              value={scheduleData.location}
              onChange={handleScheduleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              name="notes"
              label="Notes"
              value={scheduleData.notes}
              onChange={handleScheduleChange}
              multiline
              rows={3}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Schedule Appointments'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Appointments; 
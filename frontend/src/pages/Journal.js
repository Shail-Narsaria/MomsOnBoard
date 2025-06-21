import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CalendarToday,
  Timeline as TimelineIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { createJournalEntry, getJournalEntries, updateJournalEntry, deleteJournalEntry } from '../redux/slices/journalSlice';

const Journal = () => {
  const [open, setOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    symptoms: [],
    week: '',
    date: '',
    photos: []
  });
  
  const dispatch = useDispatch();
  const { entries, loading, error } = useSelector(state => state.journal);

  useEffect(() => {
    dispatch(getJournalEntries());
  }, [dispatch]);

  const handleOpen = (entry = null, date = null) => {
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        symptoms: entry.symptoms || [],
        week: entry.week,
        date: format(new Date(entry.date), 'yyyy-MM-dd'),
        photos: entry.photos || []
      });
      setSelectedEntry(entry);
    } else {
      setFormData({
        title: '',
        content: '',
        symptoms: [],
        week: '',
        date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        photos: []
      });
      setSelectedEntry(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedEntry(null);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      symptoms: value
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('week', formData.week);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('symptoms', JSON.stringify(formData.symptoms));
      
      // Add photos (only new files, not existing URLs)
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append('photos', photo);
        }
      });

      if (selectedEntry) {
        const result = await dispatch(updateJournalEntry({
          id: selectedEntry._id,
          formData: formDataToSend
        })).unwrap();
      } else {
        const result = await dispatch(createJournalEntry(formDataToSend)).unwrap();
      }
      handleClose();
    } catch (error) {
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await dispatch(deleteJournalEntry(id)).unwrap();
      } catch (error) {
      }
    }
  };

  const handleViewDetail = (entry) => {
    setSelectedEntryForDetail(entry);
    setViewMode('detail');
  };

  const handleCloseDetail = () => {
    setSelectedEntryForDetail(null);
    setViewMode('calendar');
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const existingEntry = entries.find(entry => isSameDay(new Date(entry.date), date));
    if (existingEntry) {
      handleViewDetail(existingEntry);
    } else {
      handleOpen(null, date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const symptomOptions = [
    'Morning Sickness',
    'Fatigue',
    'Cravings',
    'Heartburn',
    'Back Pain',
    'Swelling',
    'Insomnia',
    'Headache',
    'Other'
  ];

  // Sort entries by date (newest first)
  const sortedEntries = entries ? [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Helper function to get the correct image URL
  const getImageUrl = (photo) => {
    if (typeof photo === 'string') {
      return photo;
    }
    if (photo.url) {
      // If it's a full URL, use it as is
      if (photo.url.startsWith('http')) {
        return photo.url;
      }
      // If it's a relative path, construct the full URL
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${photo.url}`;
    }
    return null;
  };

  const renderCalendarView = () => (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h5" component="h2">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Sun</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Mon</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Tue</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Wed</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Thu</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Fri</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Sat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
              <TableRow key={weekIndex}>
                {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                  const dayEntries = entries.filter(entry => isSameDay(new Date(entry.date), day));
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <TableCell
                      key={dayIndex}
                      sx={{
                        height: 120,
                        width: '14.28%',
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        position: 'relative',
                        bgcolor: isToday ? 'primary.light' : 'inherit',
                        color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleDateClick(day)}
                    >
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                          {format(day, 'd')}
                        </Typography>
                        {dayEntries.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {dayEntries.slice(0, 2).map((entry, index) => (
                              <Box key={entry._id} sx={{ mb: 0.5 }}>
                                <Chip
                                  label={entry.title.length > 15 ? `${entry.title.substring(0, 15)}...` : entry.title}
                                  size="small"
                                  color="primary"
                                  variant="filled"
                                  sx={{ 
                                    fontSize: '0.6rem', 
                                    height: 20, 
                                    display: 'block',
                                    width: '100%',
                                    mb: 0.5
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetail(entry);
                                  }}
                                />
                                {entry.photos && entry.photos.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                    {entry.photos.slice(0, 2).map((photo, photoIndex) => (
                                      <img
                                        key={photoIndex}
                                        src={getImageUrl(photo)}
                                        alt=""
                                        style={{
                                          width: '20px',
                                          height: '20px',
                                          objectFit: 'cover',
                                          borderRadius: '2px',
                                          border: '1px solid #e0e0e0'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewDetail(entry);
                                        }}
                                      />
                                    ))}
                                    {entry.photos.length > 2 && (
                                      <Box
                                        sx={{
                                          width: '20px',
                                          height: '20px',
                                          bgcolor: 'primary.main',
                                          borderRadius: '2px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '0.5rem',
                                          color: 'white',
                                          cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewDetail(entry);
                                        }}
                                      >
                                        +{entry.photos.length - 2}
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ))}
                            {dayEntries.length > 2 && (
                              <Typography variant="caption" color="primary" sx={{ fontSize: '0.6rem' }}>
                                +{dayEntries.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Selected Date Info */}
      {selectedDate && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen(null, selectedDate)}
            sx={{ mt: 1 }}
          >
            Add Journal Entry
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderTimelineView = () => (
    <Timeline position="alternate">
      {sortedEntries.map((entry, index) => (
        <TimelineItem key={entry._id}>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="span">
                {format(new Date(entry.date), 'MMM dd')}
              </Typography>
              <Typography variant="body2" component="div">
                {format(new Date(entry.date), 'yyyy')}
              </Typography>
              <Typography variant="caption" component="div">
                Week {entry.week}
              </Typography>
            </Box>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: 'primary.main' }} />
            {index < sortedEntries.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Paper elevation={3} sx={{ p: 2, cursor: 'pointer' }} onClick={() => handleViewDetail(entry)}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {entry.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {entry.content.length > 100 ? `${entry.content.substring(0, 100)}...` : entry.content}
              </Typography>
              {entry.symptoms && entry.symptoms.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {entry.symptoms.slice(0, 2).map((symptom, idx) => (
                    <Chip
                      key={idx}
                      label={symptom}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {entry.symptoms.length > 2 && (
                    <Chip
                      label={`+${entry.symptoms.length - 2} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              )}
              {entry.photos && entry.photos.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="primary">
                    📷
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {entry.photos.slice(0, 3).map((photo, photoIndex) => (
                      <img
                        key={photoIndex}
                        src={getImageUrl(photo)}
                        alt=""
                        style={{
                          width: '16px',
                          height: '16px',
                          objectFit: 'cover',
                          borderRadius: '2px',
                          border: '1px solid #e0e0e0'
                        }}
                      />
                    ))}
                    {entry.photos.length > 3 && (
                      <Typography variant="caption" color="primary" sx={{ fontSize: '0.6rem' }}>
                        +{entry.photos.length - 3}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  const renderDetailView = () => (
    <Box>
      <Button onClick={handleCloseDetail} sx={{ mb: 2 }}>
        ← Back to {viewMode === 'timeline' ? 'Timeline' : 'Calendar'}
      </Button>
      {selectedEntryForDetail && (
        <Card>
          {selectedEntryForDetail.photos && selectedEntryForDetail.photos.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Photos ({selectedEntryForDetail.photos.length})
              </Typography>
              <Grid container spacing={2}>
                {selectedEntryForDetail.photos.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img 
                      src={getImageUrl(photo)} 
                      alt={`${selectedEntryForDetail.title} - Photo ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {selectedEntryForDetail.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
              <CalendarToday sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">
                {format(new Date(selectedEntryForDetail.date), 'EEEE, MMMM dd, yyyy')}
              </Typography>
              <Box sx={{ mx: 1 }}>•</Box>
              <Typography variant="body2">
                Week {selectedEntryForDetail.week}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              {selectedEntryForDetail.content}
            </Typography>
            {selectedEntryForDetail.symptoms && selectedEntryForDetail.symptoms.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Symptoms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedEntryForDetail.symptoms.map((symptom, idx) => (
                    <Chip
                      key={idx}
                      label={symptom}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleOpen(selectedEntryForDetail)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(selectedEntryForDetail._id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pregnancy Journal
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarToday sx={{ mr: 1 }} />
              Calendar
            </ToggleButton>
            <ToggleButton value="timeline" aria-label="timeline view">
              <TimelineIcon sx={{ mr: 1 }} />
              Timeline
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'detail' ? (
        renderDetailView()
      ) : viewMode === 'timeline' ? (
        renderTimelineView()
      ) : (
        renderCalendarView()
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="title"
              value={formData.title}
              onChange={handleChange}
              label="Title"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="content"
              value={formData.content}
              onChange={handleChange}
              label="Content"
              multiline
              rows={6}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="week"
              value={formData.week}
              onChange={handleChange}
              label="Week"
              type="number"
              inputProps={{ min: 1, max: 42 }}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="date"
              value={formData.date}
              onChange={handleChange}
              label="Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="symptoms"
              value={formData.symptoms}
              onChange={handleSymptomsChange}
              select
              label="Symptoms"
              fullWidth
              SelectProps={{
                multiple: true,
                value: formData.symptoms,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                ),
              }}
              sx={{ mb: 2 }}
            >
              {symptomOptions.map((symptom) => (
                <MenuItem key={symptom} value={symptom}>
                  {symptom}
                </MenuItem>
              ))}
            </TextField>
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="photos-upload"
            />
            <label htmlFor="photos-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Photos
              </Button>
            </label>
            {formData.photos && formData.photos.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formData.photos.length} photos selected:
                </Typography>
                {formData.photos.map((photo, index) => (
                  <Typography key={index} variant="caption" display="block" color="text.secondary">
                    {photo.name || (typeof photo === 'string' ? 'Photo uploaded' : 'Photo')}
                  </Typography>
                ))}
                {selectedEntry && formData.photos.some(photo => photo.url) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Existing photos:
                    </Typography>
                    <Grid container spacing={1}>
                      {formData.photos.filter(photo => photo.url).map((photo, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                          <img 
                            src={getImageUrl(photo)} 
                            alt={`Photo ${index + 1}`}
                            style={{ 
                              width: '100%', 
                              height: '80px', 
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Journal; 
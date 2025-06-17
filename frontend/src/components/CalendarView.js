import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Badge,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton as MuiIconButton
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  PhotoCamera
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView = ({ 
  entries, 
  onAddEntry, 
  onEditEntry, 
  onDeleteEntry, 
  onDownloadImage,
  API_URL 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showEntriesDialog, setShowEntriesDialog] = useState(false);

  const getEntriesForDate = (date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  const handleDateClick = (date) => {
    const dayEntries = getEntriesForDate(date);
    setSelectedDate(date);
    setSelectedEntries(dayEntries);
    setShowEntriesDialog(true);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs={12/7} key={day}>
            <Paper
              sx={{
                p: 1,
                textAlign: 'center',
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              {day}
            </Paper>
          </Grid>
        ))}
        {days.map(day => {
          const dayEntries = getEntriesForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Grid item xs={12/7} key={day.toString()}>
              <Paper
                sx={{
                  p: 1,
                  minHeight: 120,
                  cursor: 'pointer',
                  backgroundColor: isToday ? 'secondary.light' : 'background.paper',
                  border: isToday ? 2 : 1,
                  borderColor: isToday ? 'secondary.main' : 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => handleDateClick(day)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                    fontWeight: isToday ? 'bold' : 'normal',
                    fontSize: '0.875rem'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                
                {dayEntries.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Badge 
                      badgeContent={dayEntries.length} 
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          minWidth: '20px',
                          height: '20px'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          mx: 'auto',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      />
                    </Badge>
                  </Box>
                )}

                {/* Show mood indicators for entries */}
                {dayEntries.slice(0, 2).map((entry, index) => (
                  <Chip
                    key={entry._id}
                    label={entry.mood}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 2 + (index * 16),
                      left: 2,
                      right: 2,
                      fontSize: '0.6rem',
                      height: '14px',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(25, 118, 210, 0.3)'
                    }}
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderEntriesDialog = () => (
    <Dialog 
      open={showEntriesDialog} 
      onClose={() => setShowEntriesDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          Journal Entries for {selectedDate && format(selectedDate, 'MMMM dd, yyyy')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedEntries.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No entries for this date
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowEntriesDialog(false);
                onAddEntry(selectedDate);
              }}
            >
              Add Entry
            </Button>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                {selectedEntries.length} entr{selectedEntries.length === 1 ? 'y' : 'ies'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setShowEntriesDialog(false);
                  onAddEntry(selectedDate);
                }}
              >
                Add Another Entry
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {selectedEntries.map((entry) => (
                <Grid item xs={12} md={6} key={entry._id}>
                  <Card sx={{ height: '100%' }}>
                    {entry.photos && entry.photos.length > 0 && entry.photos[0] && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${API_URL}${entry.photos[0].url}`}
                        alt={entry.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {entry.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {format(new Date(entry.date), 'h:mm a')}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {entry.content}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Chip label={entry.mood} color="primary" size="small" sx={{ mr: 1 }} />
                        {entry.symptoms?.slice(0, 2).map((symptom, index) => (
                          <Chip
                            key={index}
                            label={symptom}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="Edit">
                        <MuiIconButton 
                          size="small" 
                          onClick={() => {
                            setShowEntriesDialog(false);
                            onEditEntry(entry);
                          }}
                        >
                          <EditIcon />
                        </MuiIconButton>
                      </Tooltip>
                      {entry.photos && entry.photos.length > 0 && (
                        <Tooltip title="Download Photos">
                          <MuiIconButton 
                            size="small"
                            onClick={() => onDownloadImage(entry.photos[0].url)}
                          >
                            <DownloadIcon />
                          </MuiIconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <MuiIconButton 
                          size="small"
                          onClick={() => onDeleteEntry(entry._id)}
                        >
                          <DeleteIcon />
                        </MuiIconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowEntriesDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        backgroundColor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: 1
      }}>
        <IconButton 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          <NavigateBefore />
        </IconButton>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          <NavigateNext />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{ 
        p: 3, 
        mb: 4,
        backgroundColor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2
      }}>
        {renderCalendar()}
      </Paper>

      {/* Entries Dialog */}
      {renderEntriesDialog()}
    </Box>
  );
};

export default CalendarView; 
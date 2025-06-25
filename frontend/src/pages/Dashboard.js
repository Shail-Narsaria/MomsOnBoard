import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  CalendarToday,
  Favorite,
  PhotoCamera,
  LocalHospital
} from '@mui/icons-material';
import { getJournalEntries } from '../store/slices/journalSlice';
import { differenceInWeeks, format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { entries, loading } = useSelector(state => state.journal);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    dispatch(getJournalEntries());
  }, [dispatch]);

  const calculatePregnancyProgress = () => {
    if (!user?.pregnancyStartDate) return 0;
    const totalWeeks = 40;
    const currentWeek = differenceInWeeks(new Date(), new Date(user.pregnancyStartDate));
    return Math.min(Math.max((currentWeek / totalWeeks) * 100, 0), 100);
  };

  const getCurrentWeek = () => {
    if (!user?.pregnancyStartDate) return 0;
    return Math.min(
      Math.max(differenceInWeeks(new Date(), new Date(user.pregnancyStartDate)), 0),
      40
    );
  };

  const recentEntries = entries.slice(0, 3);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Progress Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Your Pregnancy Journey
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={calculatePregnancyProgress()}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'pink',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#ff69b4'
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {`${getCurrentWeek()}/40 weeks`}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography variant="body1">
                        {user?.dueDate ? format(new Date(user.dueDate), 'MMM dd, yyyy') : 'Not set'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Favorite color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Week
                      </Typography>
                      <Typography variant="body1">
                        Week {getCurrentWeek()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PhotoCamera color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Journal Entries
                      </Typography>
                      <Typography variant="body1">
                        {entries.length}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LocalHospital color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Next Appointment
                      </Typography>
                      <Typography variant="body1">
                        Not scheduled
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Journal Entries */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Recent Journal Entries</Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate('/journal/new')}
              >
                New Entry
              </Button>
            </Box>
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              ) : recentEntries.length > 0 ? (
                recentEntries.map(entry => (
                  <Grid item xs={12} md={4} key={entry._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          transition: 'transform 0.2s ease-in-out'
                        }
                      }}
                      onClick={() => navigate(`/journal/${entry._id}`)}
                    >
                      {entry.photos && entry.photos.length > 0 && entry.photos[0] && (
                        <Box
                          sx={{
                            height: 200,
                            backgroundImage: `url(${API_URL}${entry.photos[0].url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {entry.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Week {entry.pregnancyWeek} • {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {entry.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    No journal entries yet. Start documenting your journey!
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import PregnancyIcon from '@mui/icons-material/PregnantWoman';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import JournalIcon from '@mui/icons-material/Book';
import HealthIcon from '@mui/icons-material/LocalHospital';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const Landing = () => {
  const features = [
    {
      icon: <PregnancyIcon sx={{ fontSize: 50, color: '#FF69B4' }} />,
      title: 'Pregnancy Tracking',
      description: 'Track your pregnancy journey week by week with detailed insights and milestones.',
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 50, color: '#FF69B4' }} />,
      title: 'Appointment Management',
      description: 'Never miss an important checkup with our appointment reminder system.',
    },
    {
      icon: <JournalIcon sx={{ fontSize: 50, color: '#FF69B4' }} />,
      title: 'Digital Journal',
      description: 'Document your memories, symptoms, and experiences throughout your pregnancy.',
    },
    {
      icon: <HealthIcon sx={{ fontSize: 50, color: '#FF69B4' }} />,
      title: 'Health Monitoring',
      description: 'Keep track of vital health metrics and share them with your healthcare provider.',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to MotherTrack
          </Typography>
          <Typography variant="h5" paragraph>
            Your personal companion throughout your pregnancy journey
          </Typography>
          <Box mt={4}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                mr: 2,
                bgcolor: 'white',
                color: '#FF69B4',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={3}>
                {feature.icon}
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={8}>
          <Typography variant="h4" component="h2" gutterBottom>
            Start Your Journey Today
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of mothers who trust MotherTrack to guide them through their pregnancy journey.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              bgcolor: '#FF69B4',
              '&:hover': {
                bgcolor: '#FF1493',
              },
            }}
          >
            Create Your Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 
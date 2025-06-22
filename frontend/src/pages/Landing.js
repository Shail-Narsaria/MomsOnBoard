// NOTE: This page does not include a StickyNavbar. Do NOT wrap this page with Layout.js to avoid duplicate navbars.
// To use your own images in the slider, place them in frontend/public/slider-images/ and update the image paths in the features array below.
// To use an image in the About Us section, place it in frontend/public/about-image.jpg and update the src below if you use a different name.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Example images: Replace these URLs with your own images in public/slider-images/
const features = [
  {
    title: 'Pregnancy Tracking',
    description: 'Track your pregnancy journey week by week with detailed insights and milestones.',
    image: '/slider-images/slide1.png', // User's image
  },
  {
    title: 'Appointment Management',
    description: 'Never miss an important checkup with our appointment reminder system.',
    image: '/slider-images/slide2.png', // User's image
  },
  {
    title: 'Digital Journal',
    description: 'Document your memories, symptoms, and experiences throughout your pregnancy.',
    image: '/slider-images/slide3.png', // User's image
  },
  {
    title: 'Health Monitoring',
    description: 'Keep track of vital health metrics and share them with your healthcare provider.',
    image: '/slider-images/slide1.png', // Reuse slide1.png as placeholder
  },
];

const NAV_HEIGHT = 64;

// const StickyNavbar = () => (
//   <AppBar position="sticky" sx={{ bgcolor: '#232526', height: NAV_HEIGHT, justifyContent: 'center' }} elevation={2}>
//     <Toolbar>
//       <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
//         MomsOnBoard
//       </Typography>
//       <Button color="inherit" component="a" href="#home" sx={{ fontWeight: 500 }}>Home</Button>
//       <Button color="inherit" component={Link} to="/register" sx={{ fontWeight: 500 }}>Get Started</Button>
//       <Button color="inherit" component="a" href="#about" sx={{ fontWeight: 500 }}>About Us</Button>
//       <Button color="inherit" component="a" href="#contact" sx={{ fontWeight: 500 }}>Contact Us</Button>
//     </Toolbar>
//   </AppBar>
// );

const FeatureSlider = () => {
  const [current, setCurrent] = useState(0);
  const SLIDE_INTERVAL = 6000; // 6 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => setCurrent((prev) => (prev - 1 + features.length) % features.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % features.length);

  return (
    <Box id="home" sx={{ minHeight: '100vh', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 0, m: 0 }}>
      {features.map((feature, idx) => (
        <Box
          key={feature.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 1 : 0,
            transition: 'opacity 0.8s',
            background: `url(${feature.image}) center center/cover no-repeat`,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 8,
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.45)',
            zIndex: 1,
          }} />
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {feature.title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {feature.description}
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#232526',
                fontWeight: 600,
                '&:hover': { bgcolor: '#f5f5f5' },
                boxShadow: 3,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      ))}
      {/* Arrow Buttons */}
      <IconButton onClick={goToPrev} sx={{ position: 'absolute', left: 24, top: '50%', zIndex: 3, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }, transform: 'translateY(-50%)' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton onClick={goToNext} sx={{ position: 'absolute', right: 24, top: '50%', zIndex: 3, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }, transform: 'translateY(-50%)' }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Place your about image in frontend/public/about-image.jpg
  const aboutImage = '/about-image.jpg';

  return (
    <Box id="about" sx={{ bgcolor: '#f7f7f7', minHeight: '100vh', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0, m: 0 }}>
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center" justifyContent="center" direction={isMobile ? 'column' : 'row'}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              About Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              MomsOnBoard is dedicated to supporting mothers throughout their pregnancy journey. Our platform offers a comprehensive suite of tools to help you track your health, manage appointments, and document your experiences. We believe every mother deserves a smooth, informed, and memorable pregnancy.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our team is passionate about empowering women with technology and care. Join us and become a part of a growing community of mothers supporting each other.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
            <Box
              component="img"
              src={aboutImage}
              alt="About MomsOnBoard"
              sx={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: 3,
                border: '6px solid white',
                bgcolor: 'grey.200',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const FinalSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', p: 0, m: 0 }}>
      {/* Top half: Quote */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{
              fontWeight: 400,
              fontStyle: 'italic',
              textAlign: 'center',
              color: 'text.primary',
              mb: 1,
              letterSpacing: 0.5,
              lineHeight: 1.3,
              textShadow: 'none',
            }}
          >
            "The journey of a thousand miles begins with a single step."
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 400 }}>
            — Lao Tzu
          </Typography>
        </Container>
      </Box>
      {/* Space between quote and footer */}
      <Box sx={{ height: { xs: 16, md: 32 } }} />
      {/* Bottom half: Footer */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#232526', color: 'white', width: '100vw', py: 3, px: 2, mt: 0 }}>
        <Container maxWidth="lg">
          <Divider sx={{ bgcolor: 'grey.700', mb: 2 }} />
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'center' : 'left', mb: { xs: 1, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', gap: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'grey.300' }} />
                <Typography variant="body2" sx={{ color: 'grey.200' }}>support@momsonboard.com</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'grey.300' }} />
                <Typography variant="body2" sx={{ color: 'grey.200' }}>+1 (555) 123-4567</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-end', gap: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'grey.300' }} />
                <Typography variant="body2" sx={{ color: 'grey.200' }}>123 Motherhood Lane, Care City, Country</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

const Landing = () => {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      {/* StickyNavbar removed */}
      <FeatureSlider />
      <AboutSection />
      <FinalSection />
    </Box>
  );
};

export default Landing; 
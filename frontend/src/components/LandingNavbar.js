import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';

const LandingNavbar = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useContext(ThemeContext);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          MomsOnBoard
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingNavbar; 
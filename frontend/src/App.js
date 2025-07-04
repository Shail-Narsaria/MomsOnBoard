import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Appointments from './pages/Appointments';
import HealthMetrics from './pages/HealthMetrics';
import AdvancedHealth from './pages/AdvancedHealth';
import MoodAnalysis from './pages/MoodAnalysis';
import Profile from './pages/Profile';
import { checkAuth } from './redux/slices/authSlice';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const [mode, setMode] = React.useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark';
  });

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ff69b4',
            light: '#ffb6c1',
            dark: '#ff1493',
            contrastText: '#fff',
          },
          secondary: {
            main: '#4A90E2',
            light: '#5C9CE5',
            dark: '#357ABD',
            contrastText: '#fff',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
              },
            },
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    // Check authentication status when app loads
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/journal"
            element={
              <Layout>
                <PrivateRoute>
                  <Journal />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/appointments"
            element={
              <Layout>
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/health-metrics"
            element={
              <Layout>
                <PrivateRoute>
                  <HealthMetrics />
                </PrivateRoute>
              </Layout>
            }
          />
                      <Route
              path="/advanced-health"
              element={
                <Layout>
                  <PrivateRoute>
                    <AdvancedHealth />
                  </PrivateRoute>
                </Layout>
              }
            />
            <Route
              path="/mood-analysis"
              element={
                <Layout>
                  <PrivateRoute>
                    <MoodAnalysis />
                  </PrivateRoute>
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                </Layout>
              }
            />
        </Routes>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App; 
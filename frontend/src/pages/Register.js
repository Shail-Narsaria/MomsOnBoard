import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PersonAdd } from '@mui/icons-material';
import { register, clearError } from '../store/slices/authSlice';
import { addDays, subWeeks } from 'date-fns';
import './Register.css';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date cannot be in the past'),
  pregnancyStartDate: Yup.date()
    .required('Pregnancy start date is required')
    .max(new Date(), 'Pregnancy start date cannot be in the future')
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dueDate: null,
      pregnancyStartDate: null
    },
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...registerData } = values;
      dispatch(register(registerData));
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleDueDateChange = (date) => {
    formik.setFieldValue('dueDate', date);
    // Automatically calculate pregnancy start date (40 weeks before due date)
    if (date) {
      const pregnancyStartDate = subWeeks(date, 40);
      formik.setFieldValue('pregnancyStartDate', pregnancyStartDate);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAdd />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Due Date"
                value={formik.values.dueDate}
                onChange={handleDueDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                    helperText={formik.touched.dueDate && formik.errors.dueDate}
                    disabled={loading}
                  />
                )}
                minDate={addDays(new Date(), 1)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Pregnancy Start Date"
                value={formik.values.pregnancyStartDate}
                onChange={(date) => formik.setFieldValue('pregnancyStartDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    error={formik.touched.pregnancyStartDate && Boolean(formik.errors.pregnancyStartDate)}
                    helperText={formik.touched.pregnancyStartDate && formik.errors.pregnancyStartDate}
                    disabled={loading}
                  />
                )}
                maxDate={new Date()}
                disabled={loading}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { updateProfile } from '../store/slices/authSlice';
import { showAlert } from '../store/slices/alertSlice';
import { format } from 'date-fns';
import './Profile.css';

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
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date cannot be in the past'),
  pregnancyStartDate: Yup.date()
    .required('Pregnancy start date is required')
    .max(new Date(), 'Pregnancy start date cannot be in the future'),
  emergencyContact: Yup.object().shape({
    name: Yup.string().required('Emergency contact name is required'),
    phone: Yup.string().required('Emergency contact phone is required'),
    relationship: Yup.string().required('Relationship is required')
  }),
  medicalInfo: Yup.object().shape({
    bloodType: Yup.string().required('Blood type is required'),
    allergies: Yup.string(),
    medications: Yup.string(),
    preExistingConditions: Yup.string()
  })
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      dueDate: user?.dueDate ? new Date(user.dueDate) : null,
      pregnancyStartDate: user?.pregnancyStartDate ? new Date(user.pregnancyStartDate) : null,
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || '',
        relationship: user?.emergencyContact?.relationship || ''
      },
      medicalInfo: {
        bloodType: user?.medicalInfo?.bloodType || '',
        allergies: user?.medicalInfo?.allergies || '',
        medications: user?.medicalInfo?.medications || '',
        preExistingConditions: user?.medicalInfo?.preExistingConditions || ''
      }
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await dispatch(updateProfile(values)).unwrap();
        dispatch(showAlert('Profile updated successfully', 'success'));
        setIsEditing(false);
      } catch (error) {
        dispatch(showAlert(error.message || 'Failed to update profile', 'error'));
      }
    }
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 2
                }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Personal Information</Typography>
                  {!isEditing && (
                    <Button variant="outlined" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Due Date"
                        value={formik.values.dueDate}
                        onChange={(date) => formik.setFieldValue('dueDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                            helperText={formik.touched.dueDate && formik.errors.dueDate}
                          />
                        )}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Pregnancy Start Date"
                        value={formik.values.pregnancyStartDate}
                        onChange={(date) => formik.setFieldValue('pregnancyStartDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={formik.touched.pregnancyStartDate && Boolean(formik.errors.pregnancyStartDate)}
                            helperText={formik.touched.pregnancyStartDate && formik.errors.pregnancyStartDate}
                          />
                        )}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Emergency Contact
                        </Typography>
                      </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Name"
                        name="emergencyContact.name"
                        value={formik.values.emergencyContact.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.emergencyContact?.name &&
                          Boolean(formik.errors.emergencyContact?.name)
                        }
                        helperText={
                          formik.touched.emergencyContact?.name &&
                          formik.errors.emergencyContact?.name
                        }
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        name="emergencyContact.phone"
                        value={formik.values.emergencyContact.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.emergencyContact?.phone &&
                          Boolean(formik.errors.emergencyContact?.phone)
                        }
                        helperText={
                          formik.touched.emergencyContact?.phone &&
                          formik.errors.emergencyContact?.phone
                        }
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Relationship"
                        name="emergencyContact.relationship"
                        value={formik.values.emergencyContact.relationship}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.emergencyContact?.relationship &&
                          Boolean(formik.errors.emergencyContact?.relationship)
                        }
                        helperText={
                          formik.touched.emergencyContact?.relationship &&
                          formik.errors.emergencyContact?.relationship
                        }
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Medical Information
                        </Typography>
                      </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Blood Type"
                        name="medicalInfo.bloodType"
                        value={formik.values.medicalInfo.bloodType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.medicalInfo?.bloodType &&
                          Boolean(formik.errors.medicalInfo?.bloodType)
                        }
                        helperText={
                          formik.touched.medicalInfo?.bloodType &&
                          formik.errors.medicalInfo?.bloodType
                        }
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Allergies"
                        name="medicalInfo.allergies"
                        multiline
                        rows={2}
                        value={formik.values.medicalInfo.allergies}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Medications"
                        name="medicalInfo.medications"
                        multiline
                        rows={2}
                        value={formik.values.medicalInfo.medications}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Pre-existing Conditions"
                        name="medicalInfo.preExistingConditions"
                        multiline
                        rows={2}
                        value={formik.values.medicalInfo.preExistingConditions}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditing}
                      />
                    </Grid>

                    {isEditing && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                          >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 
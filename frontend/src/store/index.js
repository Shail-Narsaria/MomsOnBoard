import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import journalReducer from './slices/journalSlice';
import healthMetricsReducer from './slices/healthMetricsSlice';
import appointmentReducer from './slices/appointmentSlice';
import alertReducer from './slices/alertSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    healthMetrics: healthMetricsReducer,
    appointments: appointmentReducer,
    alert: alertReducer
  }
});

export default store; 
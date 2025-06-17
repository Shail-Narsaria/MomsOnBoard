import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alertReducer from './slices/alertSlice';
import journalReducer from './slices/journalSlice';
import appointmentReducer from './slices/appointmentSlice';
import healthMetricsReducer from './slices/healthMetricsSlice';
import advancedHealthReducer from './slices/advancedHealthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    journal: journalReducer,
    appointments: appointmentReducer,
    healthMetrics: healthMetricsReducer,
    advancedHealth: advancedHealthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 
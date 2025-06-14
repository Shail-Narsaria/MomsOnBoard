import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import journalReducer from './slices/journalSlice';
import alertReducer from './slices/alertSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    alert: alertReducer
  }
});

export default store; 
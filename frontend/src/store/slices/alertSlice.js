import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: []
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        type: action.payload.type,
        message: action.payload.message,
        timeout: action.payload.timeout || 5000
      });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    }
  }
});

export const { setAlert, removeAlert } = alertSlice.actions;

// Alert types: 'success', 'error', 'warning', 'info'
export const showAlert = (message, type = 'info', timeout = 5000) => (dispatch) => {
  const id = Date.now();
  dispatch(setAlert({ message, type, timeout, id }));
  setTimeout(() => dispatch(removeAlert(id)), timeout);
};

export default alertSlice.reducer; 
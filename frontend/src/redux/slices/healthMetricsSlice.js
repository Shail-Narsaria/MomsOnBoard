import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createHealthMetric = createAsyncThunk(
  'healthMetrics/create',
  async (metricData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/health-metrics`, metricData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHealthMetrics = createAsyncThunk(
  'healthMetrics/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/health-metrics`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateHealthMetric = createAsyncThunk(
  'healthMetrics/update',
  async ({ id, metricData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/health-metrics/${id}`, metricData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHealthMetric = createAsyncThunk(
  'healthMetrics/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/health-metrics/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  metrics: [],
  loading: false,
  error: null,
  currentMetric: null,
  stats: {
    weight: [],
    bloodPressure: [],
    bloodSugar: [],
    temperature: [],
  },
};

const healthMetricsSlice = createSlice({
  name: 'healthMetrics',
  initialState,
  reducers: {
    setCurrentMetric: (state, action) => {
      state.currentMetric = action.payload;
    },
    clearCurrentMetric: (state) => {
      state.currentMetric = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      // Update stats for charts
      state.stats = {
        weight: state.metrics.map(m => ({
          date: m.date,
          value: m.weight,
        })),
        bloodPressure: state.metrics.map(m => ({
          date: m.date,
          systolic: m.bloodPressure.systolic,
          diastolic: m.bloodPressure.diastolic,
        })),
        bloodSugar: state.metrics.map(m => ({
          date: m.date,
          value: m.bloodSugar,
        })),
        temperature: state.metrics.map(m => ({
          date: m.date,
          value: m.temperature,
        })),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Health Metric
      .addCase(createHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics.unshift(action.payload);
        state.updateStats();
      })
      .addCase(createHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create health metric';
      })
      // Get Health Metrics
      .addCase(getHealthMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHealthMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.updateStats();
      })
      .addCase(getHealthMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch health metrics';
      })
      // Update Health Metric
      .addCase(updateHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = state.metrics.map((metric) =>
          metric._id === action.payload._id ? action.payload : metric
        );
        state.currentMetric = null;
        state.updateStats();
      })
      .addCase(updateHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update health metric';
      })
      // Delete Health Metric
      .addCase(deleteHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = state.metrics.filter((metric) => metric._id !== action.payload);
        state.updateStats();
      })
      .addCase(deleteHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete health metric';
      });
  },
});

export const { setCurrentMetric, clearCurrentMetric, clearError } = healthMetricsSlice.actions;
export default healthMetricsSlice.reducer; 
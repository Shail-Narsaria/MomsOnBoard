import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Async thunks
export const getHealthMetrics = createAsyncThunk(
  'healthMetrics/getMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/health-metrics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch health metrics' });
    }
  }
);

export const createHealthMetric = createAsyncThunk(
  'healthMetrics/createMetric',
  async (metricData, { rejectWithValue }) => {
    try {
      const response = await api.post('/health-metrics', metricData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create health metric' });
    }
  }
);

export const updateHealthMetric = createAsyncThunk(
  'healthMetrics/updateMetric',
  async ({ id, metricData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/health-metrics/${id}`, metricData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update health metric' });
    }
  }
);

export const deleteHealthMetric = createAsyncThunk(
  'healthMetrics/deleteMetric',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/health-metrics/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete health metric' });
    }
  }
);

const initialState = {
  metrics: [],
  loading: false,
  error: null,
};

const healthMetricsSlice = createSlice({
  name: 'healthMetrics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get metrics
      .addCase(getHealthMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHealthMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(getHealthMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch health metrics';
      })
      // Create metric
      .addCase(createHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics.unshift(action.payload);
      })
      .addCase(createHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create health metric';
      })
      // Update metric
      .addCase(updateHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.metrics.findIndex(metric => metric._id === action.payload._id);
        if (index !== -1) {
          state.metrics[index] = action.payload;
        }
      })
      .addCase(updateHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update health metric';
      })
      // Delete metric
      .addCase(deleteHealthMetric.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHealthMetric.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = state.metrics.filter(metric => metric._id !== action.payload);
      })
      .addCase(deleteHealthMetric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete health metric';
      });
  },
});

export const { clearError } = healthMetricsSlice.actions;
export default healthMetricsSlice.reducer; 
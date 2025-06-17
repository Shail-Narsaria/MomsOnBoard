import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchAdvancedHealthEntries = createAsyncThunk(
  'advancedHealth/fetchEntries',
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/advanced-health?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch entries');
    }
  }
);

export const createAdvancedHealthEntry = createAsyncThunk(
  'advancedHealth/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/advanced-health', entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create entry');
    }
  }
);

export const updateAdvancedHealthEntry = createAsyncThunk(
  'advancedHealth/updateEntry',
  async ({ id, entryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/advanced-health/${id}`, entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update entry');
    }
  }
);

export const deleteAdvancedHealthEntry = createAsyncThunk(
  'advancedHealth/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/advanced-health/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete entry');
    }
  }
);

export const fetchAdvancedHealthStats = createAsyncThunk(
  'advancedHealth/fetchStats',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/advanced-health/stats/summary?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  entries: [],
  stats: [],
  loading: false,
  error: null,
  currentEntry: null,
  activeTab: 'babyMovement'
};

const advancedHealthSlice = createSlice({
  name: 'advancedHealth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchAdvancedHealthEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancedHealthEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchAdvancedHealthEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create entry
      .addCase(createAdvancedHealthEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdvancedHealthEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
      })
      .addCase(createAdvancedHealthEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update entry
      .addCase(updateAdvancedHealthEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdvancedHealthEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(entry => entry._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(updateAdvancedHealthEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete entry
      .addCase(deleteAdvancedHealthEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdvancedHealthEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(entry => entry._id !== action.payload);
      })
      .addCase(deleteAdvancedHealthEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchAdvancedHealthStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancedHealthStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdvancedHealthStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentEntry, setActiveTab, clearCurrentEntry } = advancedHealthSlice.actions;
export default advancedHealthSlice.reducer; 
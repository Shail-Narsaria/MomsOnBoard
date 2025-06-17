import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth config
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Async thunks
export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append text data
      formData.append('title', entryData.get('title'));
      formData.append('content', entryData.get('content'));
      formData.append('mood', entryData.get('mood'));
      formData.append('symptoms', entryData.get('symptoms'));
      
      // Append date if provided
      const date = entryData.get('date');
      if (date) {
        formData.append('date', date);
      }
      
      // Append photos
      const photos = entryData.getAll('photos');
      photos.forEach(photo => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });

      const response = await axios.post(
        `${API_URL}/api/journal`,
        formData,
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create journal entry' });
    }
  }
);

export const getJournalEntries = createAsyncThunk(
  'journal/getEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/journal`,
        getConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch journal entries' });
    }
  }
);

export const getJournalEntry = createAsyncThunk(
  'journal/getEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/journal/${entryId}`,
        getConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch journal entry' });
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ entryId, entryData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append text data
      formData.append('title', entryData.get('title'));
      formData.append('content', entryData.get('content'));
      formData.append('mood', entryData.get('mood'));
      formData.append('symptoms', entryData.get('symptoms'));
      
      // Append date if provided
      const date = entryData.get('date');
      if (date) {
        formData.append('date', date);
      }
      
      // Append photos
      const photos = entryData.getAll('photos');
      photos.forEach(photo => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });

      const response = await axios.put(
        `${API_URL}/api/journal/${entryId}`,
        formData,
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update journal entry' });
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/api/journal/${entryId}`,
        getConfig()
      );
      return entryId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete journal entry' });
    }
  }
);

const initialState = {
  entries: [],
  currentEntry: null,
  loading: false,
  error: null
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Entry
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
        state.currentEntry = action.payload;
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create journal entry';
      })
      // Get Entries
      .addCase(getJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(getJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch journal entries';
      })
      // Get Entry
      .addCase(getJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntry = action.payload;
      })
      .addCase(getJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch journal entry';
      })
      // Update Entry
      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntry = action.payload;
        state.entries = state.entries.map(entry =>
          entry._id === action.payload._id ? action.payload : entry
        );
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update journal entry';
      })
      // Delete Entry
      .addCase(deleteJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(entry => entry._id !== action.payload);
        state.currentEntry = null;
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete journal entry';
      });
  }
});

export const { clearCurrentEntry, clearError } = journalSlice.actions;
export default journalSlice.reducer; 
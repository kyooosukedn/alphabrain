import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { progressApi } from '../../services/api';
import type { Progress, ProgressState } from '../../types';

const initialState: ProgressState = {
  metrics: [],
  loading: false,
  error: null,
};

export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getProgress();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
    }
  }
);

export const addProgress = createAsyncThunk(
  'progress/addProgress',
  async (progress: Omit<Progress, 'id'>, { rejectWithValue }) => {
    try {
      const response = await progressApi.addProgress(progress);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add progress');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Progress
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action: PayloadAction<Progress[]>) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Progress
      .addCase(addProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProgress.fulfilled, (state, action: PayloadAction<Progress>) => {
        state.loading = false;
        state.metrics.push(action.payload);
      })
      .addCase(addProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;

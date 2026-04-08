import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

interface AIRecommendationsState {
  /** Message from the backend about AI feature availability */
  statusMessage: string | null;
  /** Whether the backend has real AI endpoints enabled */
  aiEnabled: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AIRecommendationsState = {
  statusMessage: null,
  aiEnabled: false,
  loading: false,
  error: null,
};

/**
 * Check the AI recommendations status from the backend.
 * This is the only real endpoint: GET /api/recommendations/status
 */
export const checkAIStatus = createAsyncThunk(
  'ai/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<string>('/api/recommendations/status');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to check AI status'
      );
    }
  }
);

const aiRecommendationsSlice = createSlice({
  name: 'aiRecommendations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAIStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAIStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statusMessage = action.payload;
        // If the status message mentions "disabled", AI is not active
        state.aiEnabled = !action.payload?.toLowerCase().includes('disabled');
      })
      .addCase(checkAIStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.aiEnabled = false;
      });
  },
});

export const { clearError } = aiRecommendationsSlice.actions;

export default aiRecommendationsSlice.reducer;

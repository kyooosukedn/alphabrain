import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

// ─── Types matching backend AIRecommendationResponse ───

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedHours: number;
}

export interface Milestone {
  label: string;
  done: boolean;
}

export interface SuggestedRoadmap {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  completionPercentage: number;
  milestones: Milestone[];
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
}

export interface AIRecommendationData {
  aiEnabled: boolean;
  statusMessage: string | null;
  learningPaths: LearningPath[] | null;
  roadmap: SuggestedRoadmap | null;
  nextSteps: NextStep[] | null;
  generatedAt: string | null;
}

interface AIRecommendationsState {
  data: AIRecommendationData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: AIRecommendationsState = {
  data: null,
  loading: false,
  refreshing: false,
  error: null,
};

export const fetchRecommendations = createAsyncThunk(
  'ai/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<AIRecommendationData>('/api/recommendations/status');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch recommendations'
      );
    }
  }
);

export const refreshRecommendations = createAsyncThunk(
  'ai/refreshRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AIRecommendationData>('/api/recommendations/refresh');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to refresh recommendations'
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
      // Fetch
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh
      .addCase(refreshRecommendations.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshRecommendations.fulfilled, (state, action) => {
        state.refreshing = false;
        state.data = action.payload;
      })
      .addCase(refreshRecommendations.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = aiRecommendationsSlice.actions;

export default aiRecommendationsSlice.reducer;

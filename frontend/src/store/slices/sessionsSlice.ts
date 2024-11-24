import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sessionsApi } from '../../services/api';
import type { Session, SessionsState } from '../../types';

const initialState: SessionsState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionsApi.getSessions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/createSession',
  async (session: Omit<Session, 'id'>, { rejectWithValue }) => {
    try {
      const response = await sessionsApi.createSession(session);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

export const updateSession = createAsyncThunk(
  'sessions/updateSession',
  async ({ id, session }: { id: string; session: Partial<Session> }, { rejectWithValue }) => {
    try {
      const response = await sessionsApi.updateSession(id, session);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update session');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'sessions/deleteSession',
  async (id: string, { rejectWithValue }) => {
    try {
      await sessionsApi.deleteSession(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete session');
    }
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<Session | null>) => {
      state.currentSession = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action: PayloadAction<Session[]>) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Session
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        const index = state.sessions.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        if (state.currentSession?.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Session
      .addCase(deleteSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.sessions = state.sessions.filter((s) => s.id !== action.payload);
        if (state.currentSession?.id === action.payload) {
          state.currentSession = null;
        }
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentSession, clearError } = sessionsSlice.actions;
export default sessionsSlice.reducer;

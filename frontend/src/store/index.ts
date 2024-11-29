import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sessionsReducer from './slices/sessionsSlice';
import progressReducer from './slices/progressSlice';
import type { RootState } from '../types';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionsReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'sessions/createSession/pending',
          'sessions/createSession/fulfilled',
          'sessions/createSession/rejected',
          'progress/addProgress/pending',
          'progress/addProgress/fulfilled',
          'progress/addProgress/rejected'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'meta.arg.startTime',
          'meta.arg.endTime',
          'meta.arg.timestamp',
          'payload.startTime',
          'payload.endTime',
          'payload.timestamp'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'sessions.sessions.startTime',
          'sessions.sessions.endTime',
          'progress.metrics.timestamp',
          'sessions.currentSession.startTime',
          'sessions.currentSession.endTime'
        ],
      },
    }),
});

// Infer the `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

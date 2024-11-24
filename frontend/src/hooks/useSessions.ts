import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSessions,
  createSession,
  updateSession,
  deleteSession,
  setCurrentSession,
} from '../store/slices/sessionsSlice';
import type { Session } from '../types';

export const useSessions = () => {
  const dispatch = useAppDispatch();
  const { sessions, currentSession, loading, error } = useAppSelector(
    (state) => state.sessions
  );

  // Fetch sessions on mount
  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleCreateSession = useCallback(
    async (session: Omit<Session, 'id'>) => {
      try {
        const result = await dispatch(createSession(session)).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateSession = useCallback(
    async (id: string, sessionData: Partial<Session>) => {
      try {
        const result = await dispatch(
          updateSession({ id, session: sessionData })
        ).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to update session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteSession(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleSetCurrentSession = useCallback(
    (session: Session | null) => {
      dispatch(setCurrentSession(session));
    },
    [dispatch]
  );

  return {
    sessions,
    currentSession,
    loading,
    error,
    createSession: handleCreateSession,
    updateSession: handleUpdateSession,
    deleteSession: handleDeleteSession,
    setCurrentSession: handleSetCurrentSession,
  };
};

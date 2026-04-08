import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
	fetchSessions,
	createSession,
	updateSession,
	deleteSession,
	setCurrentSession,
} from '../store/slices/sessionsSlice';
import type { Session } from '../types/session';
import { sessionsApi } from '../services/api';

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
		async (sessionData: Session) => {
			try {
				const result = await dispatch(
					updateSession({ id: sessionData.id, session: sessionData })
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
				return true;
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
	
	const handleUpdateSessionStatus = useCallback(
		async (sessionId: string, status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => {
			try {
				// First update the status in the backend
				await sessionsApi.updateSessionStatus(sessionId, status);
				
				// Then update the session in the Redux store
				const sessionToUpdate = sessions.find(s => s.id === sessionId);
				if (sessionToUpdate) {
					await dispatch(
						updateSession({
							id: sessionId,
							session: { ...sessionToUpdate, status }
						})
					).unwrap();
				}
				return true;
			} catch (error) {
				console.error('Failed to update session status:', error);
				throw error;
			}
		},
		[dispatch, sessions]
	);
	
	return {
		sessions,
		currentSession,
		loading,
		error,
		handleCreateSession,
		handleUpdateSession,
		handleDeleteSession,
		handleSetCurrentSession,
		handleUpdateSessionStatus,
	};
};
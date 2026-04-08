// src/hooks/useTopics.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  setCurrentTopic,
} from '../store/slices/topicsSlice';
import type { Topic } from '../types/topic';

export const useTopics = () => {
  const dispatch = useAppDispatch();
  const { topics, currentTopic, loading, error } = useAppSelector(
    (state) => state.topics
  );
  
  // Fetch topics on mount
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);
  
  const handleCreateTopic = useCallback(
    async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = await dispatch(createTopic(topic)).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to create topic:', error);
        throw error;
      }
    },
    [dispatch]
  );
  
  const handleUpdateTopic = useCallback(
    async (id: string, topicData: Partial<Topic>) => {
      try {
        const result = await dispatch(
          updateTopic({ id, topic: topicData })
        ).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to update topic:', error);
        throw error;
      }
    },
    [dispatch]
  );
  
  const handleDeleteTopic = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteTopic(id)).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to delete topic:', error);
        throw error;
      }
    },
    [dispatch]
  );
  
  const handleSetCurrentTopic = useCallback(
    (topic: Topic | null) => {
      dispatch(setCurrentTopic(topic));
    },
    [dispatch]
  );
  
  return {
    topics,
    currentTopic,
    loading,
    error,
    handleCreateTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    handleSetCurrentTopic,
  };
};
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProgress, addProgress } from '../store/slices/progressSlice';
import type { Progress } from '../types';

export const useProgress = () => {
  const dispatch = useAppDispatch();
  const { metrics, loading, error } = useAppSelector((state) => state.progress);

  // Fetch progress on mount
  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  const handleAddProgress = useCallback(
    async (progress: Omit<Progress, 'id'>) => {
      try {
        const result = await dispatch(addProgress(progress)).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to add progress:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Helper function to get progress by metric
  const getProgressByMetric = useCallback(
    (metric: string) => {
      return metrics.filter((p) => p.metric === metric);
    },
    [metrics]
  );

  // Helper function to get latest progress for a metric
  const getLatestProgress = useCallback(
    (metric: string) => {
      const metricProgress = getProgressByMetric(metric);
      return metricProgress.length > 0
        ? metricProgress.reduce((latest, current) =>
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
          )
        : null;
    },
    [getProgressByMetric]
  );

  return {
    metrics,
    loading,
    error,
    addProgress: handleAddProgress,
    getProgressByMetric,
    getLatestProgress,
  };
};

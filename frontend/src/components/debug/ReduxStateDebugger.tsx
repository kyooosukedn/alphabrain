import React from 'react';
import { useAppSelector } from '@/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { createSession } from '@/store/slices/sessionsSlice';
import { addProgress } from '@/store/slices/progressSlice';
import { login } from '@/store/slices/authSlice';

export const ReduxStateDebugger: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useAppSelector((state) => state.auth);
  const sessionsState = useAppSelector((state) => state.sessions);
  const progressState = useAppSelector((state) => state.progress);

  // Test actions
  const testAuthAction = () => {
    dispatch(login({
      email: 'test@example.com',
      password: 'password123'
    }));
  };

  const testSessionAction = () => {
    dispatch(createSession({
      title: 'Test Session',
      description: 'Testing Redux State',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      status: 'scheduled',
      userId: '123'
    }));
  };

  const testProgressAction = () => {
    dispatch(addProgress({
      metric: 'study_time',
      value: 60,
      timestamp: new Date(),
      userId: '123'
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Redux State Debugger</h2>
      
      {/* Auth State */}
      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-2">Auth State</h3>
        <pre className="bg-gray-800 p-2 rounded text-sm">
          {JSON.stringify(authState, null, 2)}
        </pre>
        <Button onClick={testAuthAction} className="mt-2">
          Test Login Action
        </Button>
      </Card>

      {/* Sessions State */}
      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-2">Sessions State</h3>
        <pre className="bg-gray-800 p-2 rounded text-sm">
          {JSON.stringify(sessionsState, null, 2)}
        </pre>
        <Button onClick={testSessionAction} className="mt-2">
          Test Create Session
        </Button>
      </Card>

      {/* Progress State */}
      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-2">Progress State</h3>
        <pre className="bg-gray-800 p-2 rounded text-sm">
          {JSON.stringify(progressState, null, 2)}
        </pre>
        <Button onClick={testProgressAction} className="mt-2">
          Test Add Progress
        </Button>
      </Card>
    </div>
  );
};

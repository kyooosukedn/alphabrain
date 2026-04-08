import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from './components/ui/toaster';

// Pages
import Dashboard from './components/Dashboard';
import LearningRoadmap from './pages/LearningRoadmap';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import RoadmapList from './pages/RoadmapList';
import RoadmapDetail from './pages/RoadmapDetail';
import TopicsPage from './pages/TopicsPage';
import Schedule from './components/Schedule';
import ProgressPage from './components/progress/ProgressPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          }
        />

        {/* Protected app routes wrapped in sidebar layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute requireAuth={true}>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/learning-journey" element={<LearningRoadmap />} />
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                  <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/roadmaps" element={<RoadmapList />} />
                  <Route path="/roadmap/:id" element={<RoadmapDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;

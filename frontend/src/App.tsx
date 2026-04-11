import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages — each becomes its own chunk at build time
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const LearningRoadmap = React.lazy(() => import('./pages/LearningRoadmap'));
const KnowledgeGraphPage = React.lazy(() => import('./pages/KnowledgeGraphPage'));
const AIRecommendationsPage = React.lazy(() => import('./pages/AIRecommendationsPage'));
const RoadmapList = React.lazy(() => import('./pages/RoadmapList'));
const RoadmapDetail = React.lazy(() => import('./pages/RoadmapDetail'));
const TopicsPage = React.lazy(() => import('./pages/TopicsPage'));
const Schedule = React.lazy(() => import('./components/Schedule'));
const ProgressPage = React.lazy(() => import('./components/progress/ProgressPage'));
const ReviewPage = React.lazy(() => import('./pages/ReviewPage'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );
}

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
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/learning-journey" element={<LearningRoadmap />} />
                      <Route path="/topics" element={<TopicsPage />} />
                      <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                      <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/progress" element={<ProgressPage />} />
                      <Route path="/reviews" element={<ReviewPage />} />
                      <Route path="/roadmaps" element={<RoadmapList />} />
                      <Route path="/roadmap/:id" element={<RoadmapDetail />} />
                      <Route path="/profile/:username" element={<UserProfilePage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
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

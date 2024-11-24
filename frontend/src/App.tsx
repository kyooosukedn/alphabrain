import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { queryClient } from './services/api';
import { UIProvider } from './context/UIContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import AppRoutes from './routes';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <UIProvider>
            <Router>
              <AppRoutes />
              <ToastContainer />
            </Router>
          </UIProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
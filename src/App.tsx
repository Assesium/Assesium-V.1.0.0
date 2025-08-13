import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import ThemeProvider from './components/ThemeProvider';
import ResponsiveLayout from './components/ResponsiveLayout';
import Dashboard from './pages/Dashboard';
import Institutions from './pages/Institutions';
import AIProcessing from './pages/AIProcessing';
import Students from './pages/Students';
import Reports from './pages/Reports';
import StudentDetails from './pages/StudentDetails';
import Settings from './pages/Settings';
import Teachers from './pages/Teachers';
import TeacherDetails from './pages/TeacherDetails';
import TeacherSchedule from './pages/TeacherSchedule';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import Payments from './pages/Payments';
import Tutoring from './pages/Tutoring';
import CommunityGroups from './pages/CommunityGroups';
import ModalProvider from './components/ModalProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl mx-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
            <div className="text-left mb-6">
              <p className="text-red-600 dark:text-red-400 mb-2">Error details:</p>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
          <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <ResponsiveLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/ai-processing" element={<AIProcessing />} />
              <Route path="/students" element={<Students />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/tutoring" element={<Tutoring />} />
              <Route path="/community-groups" element={<CommunityGroups />} />
              <Route path="/students/:id" element={<StudentDetails />} />
              <Route path="/student-details/:id" element={<StudentDetails />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/:teacherId" element={<TeacherDetails />} />
              <Route path="/teacher-schedule" element={<TeacherSchedule />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
            </Routes>
          </ResponsiveLayout>
          <ModalProvider />
        </Router>
          </Suspense>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;



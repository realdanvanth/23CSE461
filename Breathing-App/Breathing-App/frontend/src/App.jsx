import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SensoryProvider } from './context/SensoryContext';
import Layout from './components/Layout';
import BreathingCircle from './components/BreathingCircle';
import Meditation from './components/Meditation';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Achievements from './components/Achievements';
import FocusTimer from './components/FocusTimer';
import Settings from './components/Settings';
import Journal from './components/Journal';
import FeedbackCounter from './components/FeedbackCounter';

/**
 * AppContent - FUNCTION COMPONENT demonstrating:
 * - React Router (useNavigate, useLocation hooks)
 * - useState for local state
 * - Conditional rendering
 */
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current view from URL path
  const getViewFromPath = () => {
    const path = location.pathname.slice(1) || 'home';
    return path;
  };

  const [view, setView] = useState(getViewFromPath());

  // Sync view with navigation
  const handleViewChange = (newView) => {
    setView(newView);
    navigate(newView === 'home' ? '/' : `/${newView}`);
  };

  const getPageInfo = () => {
    switch (view) {
      case 'breathing':
        return { title: 'Breathe', subtitle: 'Find your rhythm. Follow the circle.' };
      case 'meditation':
        return { title: 'Meditate', subtitle: 'Take a moment to be present.' };
      case 'focus':
        return { title: 'Focus', subtitle: 'Stay productive with the Pomodoro technique.' };
      case 'history':
        return { title: 'History', subtitle: 'Your mindfulness journey over time.' };
      case 'achievements':
        return { title: 'Achievements', subtitle: 'Celebrate your progress.' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Customize your experience.' };
      case 'journal':
        return { title: 'Journal', subtitle: 'Document your mindfulness journey.' };
      case 'feedback':
        return { title: 'Feedback', subtitle: 'Share how you feel after sessions.' };
      default:
        return { title: 'Dashboard', subtitle: 'Track your mindfulness journey.' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <Layout
      title={title}
      subtitle={subtitle}
      currentView={view}
      onViewChange={handleViewChange}
    >
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={handleViewChange} />} />
        <Route path="/breathing" element={<BreathingCircle />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/focus" element={<FocusTimer />} />
        <Route path="/history" element={<History />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/feedback" element={<FeedbackCounter />} />
      </Routes>
    </Layout>
  );
}

/**
 * App - Root component with BrowserRouter for React Router
 */
function App() {
  return (
    <BrowserRouter>
      <SensoryProvider>
        <AppContent />
      </SensoryProvider>
    </BrowserRouter>
  );
}

export default App;

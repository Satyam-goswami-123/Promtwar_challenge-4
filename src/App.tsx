import { useState, lazy, Suspense } from 'react';
import LandingPage from './pages/LandingPage';
import type { AppView, UserRole } from './types';
import './App.css';

const FanApp = lazy(() => import('./pages/FanApp'));
const OpsCenter = lazy(() => import('./pages/OpsCenter'));
const VolunteerApp = lazy(() => import('./pages/VolunteerApp'));

function App() {
  const [view, setView] = useState<AppView['current']>('landing');

  const handleNavigate = (target: AppView['current'], _role?: UserRole) => {
    setView(target);
  };

  const renderView = () => {
    if (view === 'fan') {
      return <FanApp onBack={() => setView('landing')} />;
    }
    if (view === 'ops') {
      return <OpsCenter onBack={() => setView('landing')} />;
    }
    if (view === 'volunteer') {
      return <VolunteerApp onBack={() => setView('landing')} />;
    }
    return <LandingPage onNavigate={handleNavigate} />;
  };

  return (
    <Suspense fallback={<div className="loading-fallback" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem',
      background: 'var(--bg-base)'
    }}>Loading NexusAI Stadium...</div>}>
      {renderView()}
    </Suspense>
  );
}

export default App;

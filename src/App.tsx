import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import FanApp from './pages/FanApp';
import OpsCenter from './pages/OpsCenter';
import VolunteerApp from './pages/VolunteerApp';
import type { AppView, UserRole } from './types';
import './App.css';

function App() {
  const [view, setView] = useState<AppView['current']>('landing');
  const [userRole, setUserRole] = useState<UserRole>('fan');

  const handleNavigate = (target: AppView['current'], role?: UserRole) => {
    if (role) setUserRole(role);
    setView(target);
  };

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
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, Header } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Workspaces } from './pages/Workspaces';
import { Checkpoints } from './pages/Checkpoints';
import { Obligations } from './pages/Obligations';
import { DecisionLog } from './pages/DecisionLog';
import { Policies } from './pages/Policies';
import { Telemetry } from './pages/Telemetry';
import { Settings } from './pages/Settings';
import { GovernanceProvider } from './context/GovernanceContext';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<Workspaces />} />
          <Route path="/checkpoints" element={<Checkpoints />} />
          <Route path="/checkpoints/:id" element={<Checkpoints />} />
          <Route path="/obligations" element={<Obligations />} />
          <Route path="/obligations/:id" element={<Obligations />} />
          <Route path="/decision-log" element={<DecisionLog />} />
          <Route path="/decision-log/:id" element={<DecisionLog />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/policies/:id" element={<Policies />} />
          <Route path="/telemetry" element={<Telemetry />} />
          <Route path="/telemetry/:id" element={<Telemetry />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GovernanceProvider>
        <div className="app-shell lg:flex">
          <Sidebar />

          <main className="flex min-w-0 flex-1 flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="app-page">
                <AnimatedRoutes />
              </div>
            </div>
          </main>
        </div>
      </GovernanceProvider>
    </BrowserRouter>
  );
}

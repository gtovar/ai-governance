import React, { useState } from 'react';
import { Sidebar, Header } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Workspaces } from './pages/Workspaces';
import { Checkpoints } from './pages/Checkpoints';
import { Obligations } from './pages/Obligations';
import { DecisionLog } from './pages/DecisionLog';
import { Policies } from './pages/Policies';
import { Telemetry } from './pages/Telemetry';
import { Settings } from './pages/Settings';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'workspaces': return <Workspaces />;
      case 'checkpoints': return <Checkpoints />;
      case 'obligations': return <Obligations />;
      case 'decision-log': return <DecisionLog />;
      case 'policies': return <Policies />;
      case 'telemetry': return <Telemetry />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Operational Overview',
      'workspaces': 'Workspace Management',
      'checkpoints': 'Governance Checkpoints',
      'obligations': 'Compliance Obligations',
      'decision-log': 'Governance Decision Log',
      'policies': 'Policy Packs & Rules',
      'telemetry': 'System Telemetry',
      'settings': 'Platform Settings',
    };
    return titles[activeTab] || 'Portal';
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-accent/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title={getTitle()} />
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandCenter } from './components/CommandCenter/CommandCenter';
import { NetworkTopology } from './components/Topology/NetworkTopology';
import { DecoyManagement } from './components/Decoy/DecoyManagement';
import { AlertCenter } from './components/ThreatIntel/AlertCenter';
import { AttackTimeline } from './components/Timeline/AttackTimeline';
import { IncidentReports } from './components/Reports/IncidentReports';
import { GuideModal } from './components/GuideModal';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 overflow-y-auto bg-[#070B14]">
      {activeView === 'command_center' && <CommandCenter />}
      {activeView === 'topology' && <NetworkTopology />}
      {activeView === 'decoys' && <DecoyManagement />}
      {activeView === 'threat_intel' && <AlertCenter />}
      {activeView === 'timeline' && <AttackTimeline />}
      {activeView === 'reports' && <IncidentReports />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen h-screen flex flex-col bg-[#070B14] text-[#F8FAFC] overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <GuideModal />
      </div>
    </AppProvider>
  );
}

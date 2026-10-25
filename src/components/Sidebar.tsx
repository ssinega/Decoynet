import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  ShieldAlert, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types/decoynet';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, alerts } = useApp();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const unacknowledgedCount = alerts.filter(a => a.status === 'new').length;

  const navItems: NavItem[] = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'topology', label: 'Network Topology', icon: Network },
    { id: 'decoys', label: 'Decoy Management', icon: Target },
    { id: 'threat_intel', label: 'Threat Intelligence', icon: ShieldAlert, badge: unacknowledgedCount },
    { id: 'timeline', label: 'Attack Timeline', icon: Clock },
    { id: 'reports', label: 'Incident Reports', icon: FileText },
  ];

  return (
    <aside
      className={`bg-[#0B1220] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between z-20 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-4 px-2">
          {!collapsed && (
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              SOC Navigation
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer relative group ${
                  isActive
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-slate-200'}`} />

                {!collapsed && <span className="truncate">{item.label}</span>}

                {item.badge && item.badge > 0 ? (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      collapsed ? 'absolute -top-1 -right-1 px-1.5 py-0.2' : ''
                    } bg-rose-500 text-white animate-pulse`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Node Telemetry Indicator */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-[10px] font-mono uppercase">Detection Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">RULE-ENGINE: ACTIVE</p>
          <p className="text-[10px] text-slate-500 mt-1">7 Nodes Monitored</p>
        </div>
      )}
    </aside>
  );
};

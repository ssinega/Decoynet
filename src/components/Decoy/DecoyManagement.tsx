import React from 'react';
import { Target, FileSpreadsheet, Key, Terminal, AlertTriangle, Clock, ShieldCheck, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DecoyManagement: React.FC = () => {
  const { decoys, triggerManualDecoy } = useApp();

  const getDecoyIcon = (type: string) => {
    switch (type) {
      case 'honeyfile':
        return <FileSpreadsheet className="w-8 h-8 text-[#FF4D6D]" />;
      case 'honeytoken':
        return <Key className="w-8 h-8 text-amber-400" />;
      case 'honeypot':
        return <Terminal className="w-8 h-8 text-purple-400" />;
      default:
        return <Target className="w-8 h-8 text-[#00E5FF]" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-[#00E5FF]/40">
            <Target className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">DECOY & HONEYTOKEN MANAGEMENT</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure, monitor, and manually trigger simulated adversary interactions with planted traps.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Main Decoy Asset Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DECOY 1: CONFIDENTIAL FILE TRAP */}
        <div className="glass-panel p-6 rounded-xl border-slate-800 flex flex-col justify-between hover:border-[#FF4D6D]/40 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                {getDecoyIcon('honeyfile')}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                CRITICAL SEVERITY
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-mono">DECOY 1: Confidential File Trap</h3>
            <p className="text-xs text-[#00E5FF] font-mono mt-1">company_payroll_2026.xlsx</p>
            <p className="text-xs text-slate-400 mt-2">
              Fictional confidential financial document intended to detect unauthorized read and exfiltration attempts. Embedded with a silent web beacon callback.
            </p>

            <div className="mt-5 space-y-2 text-xs font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Classification:</span>
                <span className="text-rose-400 font-bold">Highly Confidential</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Node:</span>
                <span className="text-white">File Decoy Node (192.0.2.50)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Trigger Count:</span>
                <span className="text-[#00E5FF] font-bold">{decoys.find(d => d.id === 'decoy-1')?.triggerCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latest Access Time:</span>
                <span className="text-slate-300 text-[11px]">{decoys.find(d => d.id === 'decoy-1')?.lastAccessTime || 'No recent access'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => triggerManualDecoy('decoy-1')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs font-mono transition cursor-pointer shadow-lg shadow-rose-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Unauthorized File Access</span>
            </button>
          </div>
        </div>

        {/* DECOY 2: FAKE ADMINISTRATOR CREDENTIALS */}
        <div className="glass-panel p-6 rounded-xl border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                {getDecoyIcon('honeytoken')}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                CRITICAL SEVERITY
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-mono">DECOY 2: Fake Admin Credentials</h3>
            <p className="text-xs text-amber-400 font-mono mt-1">svc_backup_admin</p>
            <p className="text-xs text-slate-400 mt-2">
              Planted administrative honeytoken stored in unencrypted web application configuration files. Detects unauthorized credential scraping and privilege escalation.
            </p>

            <div className="mt-5 space-y-2 text-xs font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Planted Secret Token:</span>
                <span className="text-amber-300 font-bold">BkUp_Admin_Pass_2026!#Fake</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Endpoint:</span>
                <span className="text-white">Admin Trap (192.0.2.40)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Trigger Count:</span>
                <span className="text-[#00E5FF] font-bold">{decoys.find(d => d.id === 'decoy-2')?.triggerCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latest Access Time:</span>
                <span className="text-slate-300 text-[11px]">{decoys.find(d => d.id === 'decoy-2')?.lastAccessTime || 'No recent access'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => triggerManualDecoy('decoy-2')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Credential Misuse</span>
            </button>
          </div>
        </div>

        {/* DECOY 3: SSH HONEYPOT */}
        <div className="glass-panel p-6 rounded-xl border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                {getDecoyIcon('honeypot')}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                HIGH SEVERITY
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-mono">DECOY 3: SSH Honeypot Server</h3>
            <p className="text-xs text-purple-400 font-mono mt-1">ssh-gateway-decoy (192.0.2.30:22)</p>
            <p className="text-xs text-slate-400 mt-2">
              Isolated Linux honeypot node exposing port 22. Intercepts brute-force credential attempts and logs interactive shell session keystrokes in real time.
            </p>

            <div className="mt-5 space-y-2 text-xs font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Exposed Port:</span>
                <span className="text-purple-300 font-bold">Port 22 (SSH)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Environment Type:</span>
                <span className="text-white">Isolated Sandbox Container</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Trigger Count:</span>
                <span className="text-[#00E5FF] font-bold">{decoys.find(d => d.id === 'decoy-3')?.triggerCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latest Access Time:</span>
                <span className="text-slate-300 text-[11px]">{decoys.find(d => d.id === 'decoy-3')?.lastAccessTime || 'No recent access'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => triggerManualDecoy('decoy-3')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs font-mono transition cursor-pointer shadow-lg shadow-purple-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Honeypot Connection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

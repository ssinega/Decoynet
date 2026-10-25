import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, HelpCircle, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { simulation, resetDemoData, setGuideModalOpen, alerts } = useApp();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const hasUnacknowledgedCritical = alerts.some(a => a.severity === 'critical' && a.status === 'new');

  return (
    <header className="h-16 bg-[#0B1220] border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between z-30 relative select-none">
      {/* Left: Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-[#00E5FF]/40 flex items-center justify-center glow-cyan">
          <Shield className="w-6 h-6 text-[#00E5FF]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-white font-mono">DECOYNET</span>
            <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono hidden sm:inline-block">
              v2.5 SOC
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">Deceive. Detect. Defend.</p>
        </div>
      </div>

      {/* Middle: Security Environment Status Badge */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <Activity className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          <span className="text-slate-400">Environment:</span>
          <span className="text-slate-200 font-mono font-medium">Isolated Deception Subnet</span>
        </div>

        {/* Live Status Indicator */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
          simulation.status === 'running'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 glow-blue animate-pulse'
            : hasUnacknowledgedCritical
            ? 'bg-rose-500/15 text-rose-400 border-rose-500/50 glow-red animate-cyber-pulse'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          {simulation.status === 'running' ? (
            <>
              <ShieldAlert className="w-4 h-4 animate-spin text-amber-400" />
              <span>SIMULATION IN PROGRESS</span>
            </>
          ) : hasUnacknowledgedCritical ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>INTRUSION THREAT DETECTED</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SYSTEM SECURE</span>
            </>
          )}
        </div>
      </div>

      {/* Right Controls: Clock + Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:block font-mono text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800/80">
          {timeString}
        </div>

        <button
          onClick={() => setGuideModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
          title="How DECOYNET Works"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="hidden md:inline">How It Works</span>
        </button>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition cursor-pointer"
          title="Reset Demo to Initial Seed State"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};

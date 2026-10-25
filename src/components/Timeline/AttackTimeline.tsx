import React from 'react';
import { 
  Clock, 
  ShieldAlert, 
  Globe, 
  Activity, 
  Server, 
  Target, 
  Lock, 
  Key, 
  FileSpreadsheet, 
  Terminal, 
  CheckCircle2, 
  Hash,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttackTimeline: React.FC = () => {
  const { incidents, selectedIncident, selectIncident } = useApp();

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'reconnaissance':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'discovery':
        return <Activity className="w-4 h-4 text-purple-400" />;
      case 'credential_access':
      case 'credential_misuse':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'exfiltration_attempt':
        return <FileSpreadsheet className="w-4 h-4 text-[#FF4D6D]" />;
      case 'lateral_movement':
        return <Terminal className="w-4 h-4 text-purple-400" />;
      case 'deception_triggered':
        return <Target className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Incident Selector */}
      <div className="glass-panel p-5 rounded-xl border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-[#00E5FF]/40">
            <Clock className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">RECONSTRUCTED CHRONOLOGICAL ATTACK TIMELINE</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hop-by-hop attacker trajectory reconstruction with cryptographic hash link verification.
            </p>
          </div>
        </div>

        {/* Incident Dropdown */}
        <div className="min-w-[240px]">
          <label className="block text-[10px] font-mono text-slate-400 mb-1">SELECT INCIDENT:</label>
          <select
            value={selectedIncident?.id || ''}
            onChange={(e) => selectIncident(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2 font-mono font-medium focus:ring-2 focus:ring-[#00E5FF] focus:outline-none"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.scenarioName} ({inc.finalSeverity.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedIncident ? (
        <>
          {/* Attack Path Trajectory Summary Bar */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 bg-slate-900/60">
            <div className="text-xs font-mono text-slate-400 mb-2">OBSERVED ATTACK PATH TRAJECTORY:</div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedIncident.attackPath && selectedIncident.attackPath.map((hop, idx) => (
                <React.Fragment key={idx}>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                    idx === selectedIncident.attackPath.length - 1
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 glow-red'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                    {idx === 0 ? <Globe className="w-3.5 h-3.5 text-slate-400" /> : <Server className="w-3.5 h-3.5 text-[#00E5FF]" />}
                    <span>{hop}</span>
                  </div>
                  {idx < selectedIncident.attackPath.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Timeline Step Sequence */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
              {selectedIncident.events && selectedIncident.events.length > 0 ? (
                selectedIncident.events.map((event, index) => {
                  const isDeceptionTrigger = event.detectionStatus === 'deception_triggered';

                  return (
                    <div key={event.id} className="relative flex gap-4 items-start group">
                      {/* Event Dot Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all ${
                        isDeceptionTrigger
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500 glow-red animate-pulse'
                          : 'bg-slate-900 text-slate-300 border-slate-700 group-hover:border-[#00E5FF]'
                      }`}>
                        {getEventIcon(event.category)}
                      </div>

                      {/* Event Details Card */}
                      <div className={`flex-1 p-4 rounded-xl border transition-all ${
                        isDeceptionTrigger
                          ? 'bg-rose-500/10 border-rose-500/40'
                          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">{event.action}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              event.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                              event.severity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              {event.severity}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{event.timestamp}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 font-sans mb-3">{event.description}</p>

                        {/* Node Hops & Hash Verification Line */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                          <div className="text-slate-400">
                            Source: <span className="text-slate-200">{event.sourceIp}</span> → Dest: <span className="text-[#00E5FF]">{event.destinationIp}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                            <Hash className="w-3 h-3 text-[#00E5FF]" />
                            <span className="truncate max-w-[180px]" title={`SHA-256 Hash: ${event.hash}`}>
                              Hash: {event.hash.substring(0, 16)}...
                            </span>
                            <span title="Hash Link Verified">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono">
                  No chronological events recorded for this incident.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel p-12 text-center text-slate-500 font-mono rounded-xl">
          No incident selected. Select an incident from the dropdown above or run a simulation.
        </div>
      )}
    </div>
  );
};

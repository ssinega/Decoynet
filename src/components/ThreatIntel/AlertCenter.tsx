import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityAlert } from '../../types/decoynet';

export const AlertCenter: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    selectedAlertFilter, 
    setSelectedAlertFilter,
    selectedAlertSearch,
    setSelectedAlertSearch,
    selectIncident,
    setActiveView
  } = useApp();

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  // Filter alerts based on severity and search query
  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = selectedAlertFilter === 'all' || alert.severity === selectedAlertFilter;
    const searchLower = selectedAlertSearch.toLowerCase();
    const matchesSearch = 
      alert.id.toLowerCase().includes(searchLower) ||
      alert.targetAsset.toLowerCase().includes(searchLower) ||
      alert.sourceIp.includes(searchLower) ||
      alert.ruleName.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-[#FF4D6D]/40">
              <ShieldAlert className="w-6 h-6 text-[#FF4D6D]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">THREAT INTELLIGENCE & ALERT CENTER</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Realtime security events dispatched by DECOYNET deterministic detection rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Total Alerts:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-[#00E5FF] border border-slate-800 text-xs font-mono font-bold">
              {alerts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Alert ID, target asset, source IP, or rule name..."
            value={selectedAlertSearch}
            onChange={(e) => setSelectedAlertSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-[#00E5FF] focus:outline-none"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedAlertFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer ${
                selectedAlertFilter === sev
                  ? 'bg-[#00E5FF] text-slate-950 glow-cyan'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                <th className="p-3.5">ALERT ID</th>
                <th className="p-3.5">TIMESTAMP</th>
                <th className="p-3.5">SOURCE IP</th>
                <th className="p-3.5">TARGET DECOY / ASSET</th>
                <th className="p-3.5">SEVERITY</th>
                <th className="p-3.5">DETECTION RULE</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-bold text-[#00E5FF]">{alert.id}</td>
                    <td className="p-3.5 text-slate-300">{alert.timestamp.substring(11, 19)}</td>
                    <td className="p-3.5 text-slate-200">{alert.sourceIp}</td>
                    <td className="p-3.5 text-white font-medium">{alert.targetAsset}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        alert.severity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{alert.detectionRuleId}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        alert.status === 'new' ? 'bg-rose-500 text-white animate-pulse' :
                        alert.status === 'investigating' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                        title="View Alert Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {alert.status !== 'acknowledged' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono transition cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                    No alerts matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALERT DETAILS MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedAlert(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 text-[#FF4D6D]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">{selectedAlert.id} DETAILS</h3>
                <p className="text-xs text-slate-400 font-mono">Associated Incident: {selectedAlert.incidentId}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Detection Rule:</span>
                <p className="text-[#00E5FF] font-bold mt-0.5">{selectedAlert.ruleName} ({selectedAlert.detectionRuleId})</p>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Description & Telemetry Evidence:</span>
                <p className="text-slate-200 mt-1 font-sans text-xs">{selectedAlert.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Source Attacker IP:</span>
                  <p className="text-white font-bold mt-0.5">{selectedAlert.sourceIp}</p>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Target Asset:</span>
                  <p className="text-white font-bold mt-0.5">{selectedAlert.targetAsset}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    selectIncident(selectedAlert.incidentId);
                    setActiveView('reports');
                    setSelectedAlert(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Full Incident Report</span>
                </button>

                {selectedAlert.status !== 'acknowledged' && (
                  <button
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Acknowledge Alert</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ShieldAlert, 
  Activity, 
  Target, 
  AlertTriangle, 
  FileText, 
  Zap,
  ArrowUpRight,
  TrendingUp,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { SCENARIOS } from '../../utils/scenarios';

export const CommandCenter: React.FC = () => {
  const { 
    simulation, 
    selectScenario, 
    startSimulation, 
    pauseSimulation, 
    resumeSimulation, 
    resetCurrentSimulation, 
    setSpeedMultiplier,
    nodes,
    decoys,
    alerts,
    incidents,
    selectedIncident,
    setActiveView,
    triggerManualDecoy
  } = useApp();

  const currentScenario = SCENARIOS.find(s => s.id === simulation.scenarioId) || SCENARIOS[0];

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length;
  const totalIntrusionsCount = incidents.reduce((acc, inc) => acc + inc.events.length, 0);
  const currentThreatScore = selectedIncident ? selectedIncident.threatScore : 0;

  // Chart data for threat activity over time
  const activityTrendData = [
    { time: '18:00', events: 2, threatScore: 10 },
    { time: '19:00', events: 5, threatScore: 25 },
    { time: '20:00', events: 3, threatScore: 20 },
    { time: '21:00', events: 9, threatScore: 65 },
    { time: '22:00', events: 14, threatScore: currentThreatScore || 85 },
  ];

  const severityDistributionData = [
    { name: 'Critical', value: alerts.filter(a => a.severity === 'critical').length || 2, color: '#FF4D6D' },
    { name: 'High', value: alerts.filter(a => a.severity === 'high').length || 1, color: '#F97316' },
    { name: 'Medium', value: alerts.filter(a => a.severity === 'medium').length || 2, color: '#EAB308' },
    { name: 'Low', value: alerts.filter(a => a.severity === 'low').length || 3, color: '#22C55E' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* LIVE ATTACK SIMULATION CONTROL PANEL */}
      <div className="glass-panel p-5 rounded-xl border border-[#00E5FF]/30 relative overflow-hidden bg-gradient-to-r from-[#101A2E] via-[#0B1220] to-[#101A2E]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00E5FF] animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-wide">Live Cyber Attack Simulation Control</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                CONTAINED SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select an adversarial scenario and launch sequential intrusion telemetry to test automated deception assets.
            </p>
          </div>

          {/* Simulation Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">STATUS:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              simulation.status === 'running' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
              simulation.status === 'paused' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              simulation.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {simulation.status}
            </span>
          </div>
        </div>

        {/* Scenario Selection & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Scenario Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-slate-400 mb-1">SELECT ATTACK SCENARIO:</label>
            <select
              value={simulation.scenarioId}
              onChange={(e) => selectScenario(e.target.value)}
              disabled={simulation.status === 'running'}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-[#00E5FF] focus:outline-none disabled:opacity-50"
            >
              {SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name} — {sc.tagline}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-4 flex items-center gap-2 pt-5 md:pt-0">
            {simulation.status === 'ready' || simulation.status === 'completed' ? (
              <button
                onClick={startSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#070B14] font-bold text-sm transition glow-cyan cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Simulation</span>
              </button>
            ) : simulation.status === 'running' ? (
              <button
                onClick={pauseSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={resetCurrentSimulation}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Reset Active Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Toggle */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setSpeedMultiplier(1)}
                className={`px-2 py-1 text-xs font-mono rounded ${simulation.speedMultiplier === 1 ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeedMultiplier(2)}
                className={`px-2 py-1 text-xs font-mono rounded flex items-center gap-0.5 ${simulation.speedMultiplier === 2 ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400'}`}
              >
                <FastForward className="w-3 h-3" />
                2x
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="md:col-span-3 pt-2 md:pt-0">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Step Progress:</span>
              <span className="text-[#00E5FF] font-bold">
                {simulation.currentStepIndex} / {currentScenario.steps.length}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-[#00E5FF] h-full transition-all duration-300"
                style={{
                  width: `${(simulation.currentStepIndex / currentScenario.steps.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Monitored Nodes */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Monitored Nodes</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{nodes.length}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <span>● 100% Active Subnet</span>
          </div>
        </div>

        {/* Active Deception Assets */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Decoy Assets</span>
            <Target className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#00E5FF] font-mono">{decoys.length}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">3 Primary Traps</div>
        </div>

        {/* Total Intrusion Attempts */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Intrusion Events</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalIntrusionsCount}</div>
          <div className="text-[10px] text-purple-300 mt-1 font-mono">Telemetry Tracked</div>
        </div>

        {/* Critical Alerts */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Critical Alerts</span>
            <ShieldAlert className="w-4 h-4 text-[#FF4D6D]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FF4D6D] font-mono">{criticalAlertsCount}</div>
          <div className="text-[10px] text-rose-400 mt-1 font-mono">Requires Action</div>
        </div>

        {/* Incidents Created */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Incidents</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{incidents.length}</div>
          <div className="text-[10px] text-amber-300 mt-1 font-mono">Analyzed Reports</div>
        </div>

        {/* Current Threat Score */}
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Threat Score</span>
            <TrendingUp className="w-4 h-4 text-[#FF4D6D]" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${
            currentThreatScore >= 75 ? 'text-[#FF4D6D]' :
            currentThreatScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {currentThreatScore}<span className="text-xs text-slate-500">/100</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono uppercase">
            {selectedIncident ? selectedIncident.finalSeverity : 'Calculated'} Risk
          </div>
        </div>
      </div>

      {/* CHARTS & ACTIVITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Activity Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
                INTRUSION TELEMETRY & THREAT SCORE TIMELINE
              </h3>
              <p className="text-xs text-slate-400">Observed events & risk score accumulation</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Realtime Stream</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="threatScore" stroke="#00E5FF" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="glass-panel p-5 rounded-xl border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              ALERT SEVERITY DISTRIBUTION
            </h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of triggered detection rules</p>

            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistributionData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E293B', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
            {severityDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-400">{item.name}:</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK DECOY SIMULATION & RECENT EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Decoy Traps Panel */}
        <div className="glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00E5FF]" />
              ACTIVE DECEPTION ASSETS
            </h3>
            <button
              onClick={() => setActiveView('decoys')}
              className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 font-mono"
            >
              Manage <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {decoys.map((decoy) => (
              <div key={decoy.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white font-mono">{decoy.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{decoy.identifier}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Triggers: {decoy.triggerCount}</div>
                </div>

                <button
                  onClick={() => triggerManualDecoy(decoy.id)}
                  className="px-2.5 py-1.5 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono transition cursor-pointer"
                >
                  Simulate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Telemetry Events */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              RECENT SECURITY TELEMETRY LOGS
            </h3>
            <button
              onClick={() => setActiveView('timeline')}
              className="text-xs text-[#00E5FF] hover:underline font-mono"
            >
              View Timeline →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">TIMESTAMP</th>
                  <th className="pb-2">SOURCE</th>
                  <th className="pb-2">ACTION</th>
                  <th className="pb-2">SEVERITY</th>
                  <th className="pb-2">RULE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedIncident && selectedIncident.events.length > 0 ? (
                  selectedIncident.events.slice(-5).reverse().map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-900/40">
                      <td className="py-2.5 text-slate-300">{ev.timestamp.substring(11, 19)}</td>
                      <td className="py-2.5 text-slate-200">{ev.sourceIp}</td>
                      <td className="py-2.5 text-white">{ev.action}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          ev.severity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {ev.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{ev.detectionRuleId || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No active events in current simulation run. Click "Launch Simulation" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Server, 
  Database, 
  ShieldAlert, 
  FileCode, 
  Globe, 
  Key, 
  FileSpreadsheet, 
  X, 
  Activity,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkNode } from '../../types/decoynet';

export const NetworkTopology: React.FC = () => {
  const { nodes, edges, simulation, selectedNode, setSelectedNode, selectedIncident } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(1.6, prev + 0.15));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.6, prev - 0.15));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const activeNodeId = simulation.activeNodeId;

  // Render node icon based on type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'external':
        return <Globe className="w-5 h-5 text-rose-400" />;
      case 'gateway':
        return <Activity className="w-5 h-5 text-[#00E5FF]" />;
      case 'app':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'honeypot_ssh':
        return <FileCode className="w-5 h-5 text-purple-400" />;
      case 'honeypot_cred':
        return <Key className="w-5 h-5 text-amber-400" />;
      case 'honeypot_file':
        return <FileSpreadsheet className="w-5 h-5 text-[#FF4D6D]" />;
      default:
        return <Server className="w-5 h-5 text-slate-400" />;
    }
  };

  // Node status border color
  const getNodeColorClass = (node: NetworkNode) => {
    if (activeNodeId === node.id) {
      return 'border-[#00E5FF] bg-[#00E5FF]/20 glow-cyan animate-cyber-pulse';
    }
    switch (node.status) {
      case 'triggered':
        return 'border-[#FF4D6D] bg-[#FF4D6D]/15 glow-red';
      case 'suspicious':
        return 'border-amber-500 bg-amber-500/15';
      case 'monitored':
        return 'border-blue-500 bg-blue-500/10';
      case 'healthy':
      default:
        return 'border-emerald-500/80 bg-emerald-500/10';
    }
  };

  // Attack route nodes highlight
  const isInAttackPath = (nodeId: string) => {
    if (!selectedIncident || !selectedIncident.events) return false;
    return selectedIncident.events.some(e => e.sourceNodeId === nodeId || e.destinationNodeId === nodeId);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00E5FF]" />
            INTERACTIVE NETWORK TOPOLOGY & ATTACK GRAPH
          </h2>
          <p className="text-xs text-slate-400">
            Realtime visualization of decoy assets, gateway nodes, and observed intruder trajectory.
          </p>
        </div>

        {/* Legend & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Monitored</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Suspicious</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]"></span> Decoy Triggered</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Reset Topology View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Network Diagram */}
      <div className="glass-panel rounded-xl border border-slate-800 relative overflow-hidden h-[540px] bg-[#070B14]">
        <div className="absolute top-2 left-2 z-10 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
          SUBNET: 192.0.2.0/24 | ZOOM: {Math.round(zoomLevel * 100)}%
        </div>

        <div
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          <svg className="w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
              <linearGradient id="edge-attack" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>

            {/* Render Network Edges */}
            {edges.map((edge) => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const dstNode = nodes.find(n => n.id === edge.target);

              if (!srcNode || !dstNode) return null;

              const isAttackRoute = isInAttackPath(edge.source) && isInAttackPath(edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.position.x + 80}
                    y1={srcNode.position.y + 35}
                    x2={dstNode.position.x + 80}
                    y2={dstNode.position.y + 35}
                    stroke={
                      edge.animated
                        ? 'url(#edge-active)'
                        : isAttackRoute
                        ? 'url(#edge-attack)'
                        : '#1E293B'
                    }
                    strokeWidth={edge.animated || isAttackRoute ? 3 : 1.5}
                    strokeDasharray={edge.animated ? '6,6' : undefined}
                    className={edge.animated ? 'animate-pulse' : ''}
                  />

                  {/* Animated Packet pulse on edge if active */}
                  {edge.animated && (
                    <circle
                      r="5"
                      fill="#00E5FF"
                      className="glow-cyan"
                    >
                      <animateMotion
                        path={`M ${srcNode.position.x + 80} ${srcNode.position.y + 35} L ${dstNode.position.x + 80} ${dstNode.position.y + 35}`}
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Nodes as Interactive Absolute Positioned HTML Cards */}
          {nodes.map((node) => {
            const isAttackPath = isInAttackPath(node.id);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`
                }}
                className={`absolute w-44 p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-xl ${getNodeColorClass(
                  node
                )} hover:scale-105 hover:z-20`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {getNodeIcon(node.type)}
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    node.status === 'triggered' ? 'bg-rose-500/20 text-rose-300' :
                    node.status === 'suspicious' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="font-bold text-xs text-white truncate font-mono">{node.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{node.ip}</div>

                {isAttackPath && (
                  <div className="mt-2 text-[9px] font-mono text-[#FF4D6D] bg-[#FF4D6D]/10 px-1.5 py-0.5 rounded border border-[#FF4D6D]/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Attacker Traversal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NODE INSPECTOR MODAL */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-900 border border-[#00E5FF]/40">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedNode.name}</h3>
                <p className="text-xs text-slate-400 font-mono">IP Address: {selectedNode.ip}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Node Description:</span>
                <p className="text-slate-200 mt-1 font-sans text-xs">{selectedNode.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <p className="text-white font-bold uppercase mt-1">{selectedNode.status}</p>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Total Interactions:</span>
                  <p className="text-[#00E5FF] font-bold mt-1">{selectedNode.interactionsCount}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Threat Indicators:</span>
                {selectedNode.threatIndicators && selectedNode.threatIndicators.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.threatIndicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[11px]">
                        {ind}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px]">No threat indicators recorded.</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Recent Associated Events:</span>
                <ul className="space-y-1">
                  {selectedNode.recentEvents.map((evt, i) => (
                    <li key={i} className="text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/80">
                      • {evt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

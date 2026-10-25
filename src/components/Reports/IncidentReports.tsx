import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Lock, 
  Share2, 
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportIncidentReportPDF } from '../../utils/pdfExport';
import { AuditVerification } from '../../types/decoynet';

export const IncidentReports: React.FC = () => {
  const { 
    incidents, 
    selectedIncident, 
    selectIncident, 
    requestGeminiAnalysis, 
    isAnalyzing, 
    analysisError,
    verifyAuditChain,
    tamperTestIncident
  } = useApp();

  const [auditResult, setAuditResult] = useState<AuditVerification | null>(null);

  const handleVerifyIntegrity = () => {
    if (selectedIncident) {
      const result = verifyAuditChain(selectedIncident.id);
      setAuditResult(result);
    }
  };

  const handleTamperTest = () => {
    if (selectedIncident) {
      tamperTestIncident(selectedIncident.id);
      const result = verifyAuditChain(selectedIncident.id);
      setAuditResult(result);
    }
  };

  const handleDownloadJSON = () => {
    if (!selectedIncident) return;
    const jsonStr = JSON.stringify(selectedIncident, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DECOYNET_Incident_${selectedIncident.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (selectedIncident) {
      exportIncidentReportPDF(selectedIncident);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-xl border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-[#00E5FF]/40">
            <FileText className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">AUTOMATED INCIDENT REPORTS & AI ANALYSIS</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive forensic report compilation with Google Gemini AI incident analysis & SHA-256 audit chain.
            </p>
          </div>
        </div>

        {/* Incident Selector */}
        <div className="min-w-[260px]">
          <label className="block text-[10px] font-mono text-slate-400 mb-1">SELECT INCIDENT REPORT:</label>
          <select
            value={selectedIncident?.id || ''}
            onChange={(e) => {
              selectIncident(e.target.value);
              setAuditResult(null);
            }}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2 font-mono font-medium focus:ring-2 focus:ring-[#00E5FF] focus:outline-none"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.scenarioName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedIncident ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Report Body */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview Card */}
            <div className="glass-panel p-6 rounded-xl border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-slate-400">INCIDENT IDENTIFIER:</span>
                  <h3 className="text-xl font-bold text-white font-mono">{selectedIncident.id}</h3>
                  <p className="text-xs text-[#00E5FF] font-mono mt-0.5">{selectedIncident.scenarioName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">THREAT SCORE:</span>
                    <span className={`text-xl font-mono font-bold ${
                      selectedIncident.threatScore >= 75 ? 'text-[#FF4D6D]' :
                      selectedIncident.threatScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedIncident.threatScore}/100
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    selectedIncident.finalSeverity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    selectedIncident.finalSeverity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedIncident.finalSeverity}
                  </span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block">Attacker Source IP:</span>
                  <span className="text-white font-bold">{selectedIncident.sourceIp}</span>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block">Start Time:</span>
                  <span className="text-slate-200">{selectedIncident.startTime}</span>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block">End Time:</span>
                  <span className="text-slate-200">{selectedIncident.endTime || 'In Progress'}</span>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block">Report Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{selectedIncident.status}</span>
                </div>
              </div>

              {/* Attack Path */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1">Traversed Route:</span>
                <p className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {selectedIncident.attackPath ? selectedIncident.attackPath.join(' → ') : 'N/A'}
                </p>
              </div>
            </div>

            {/* GEMINI AI INCIDENT ANALYST PANEL */}
            <div className="glass-panel p-6 rounded-xl border border-[#00E5FF]/40 relative overflow-hidden bg-gradient-to-br from-[#101A2E] via-[#0B1220] to-[#101A2E]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-6 h-6 text-[#00E5FF] animate-pulse" />
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">GEMINI AI INCIDENT ANALYST</h3>
                    <p className="text-xs text-slate-400">Server-side LLM security telemetry analysis via @google/genai</p>
                  </div>
                </div>

                <button
                  onClick={() => requestGeminiAnalysis(selectedIncident.id)}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-slate-950 font-bold text-xs font-mono transition cursor-pointer glow-cyan disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing Telemetry...' : 'Analyze with Gemini'}</span>
                </button>
              </div>

              {/* Gemini Analysis Output or Prompt to Analyze */}
              {selectedIncident.geminiAnalysis ? (
                <div className="space-y-4 text-xs font-sans">
                  {selectedIncident.geminiAnalysis.isFallback && (
                    <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                      <span>Rule-Based Analysis — Gemini API key missing or offline fallback activated.</span>
                    </div>
                  )}

                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-[#00E5FF] font-mono mb-1">Executive Summary:</h4>
                    <p className="text-slate-200 leading-relaxed">{selectedIncident.geminiAnalysis.executiveSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <h4 className="font-bold text-slate-300 font-mono mb-1">Observed Attack Technique:</h4>
                      <p className="text-slate-300">{selectedIncident.geminiAnalysis.attackTechnique}</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <h4 className="font-bold text-slate-300 font-mono mb-1">Root Cause Hypothesis:</h4>
                      <p className="text-slate-300">{selectedIncident.geminiAnalysis.rootCauseHypothesis}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-emerald-400 font-mono mb-1.5">Recommended Response Actions:</h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {selectedIncident.geminiAnalysis.recommendedActions.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-900/50 rounded-lg border border-slate-800">
                  <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-mono">No AI analysis generated yet for this incident.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Click "Analyze with Gemini" above to interpret live security telemetry logs.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls & Audit Verification */}
          <div className="lg:col-span-4 space-y-6">
            {/* Export Actions */}
            <div className="glass-panel p-5 rounded-xl border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Export Investigation Report</h3>

              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-mono font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Raw Telemetry</span>
              </button>
            </div>

            {/* BONUS FEATURE: TAMPER-EVIDENT HASH-LINKED AUDIT TRAIL */}
            <div className="glass-panel p-5 rounded-xl border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase">HASH-LINKED AUDIT TRAIL</h3>
                  <p className="text-[10px] text-slate-400">SHA-256 Event Chain Integrity Verification</p>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Each security event in DECOYNET is cryptographically linked to the previous event hash to build a tamper-evident audit ledger.
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleVerifyIntegrity}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Audit Integrity</span>
                </button>

                <button
                  onClick={handleTamperTest}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono transition cursor-pointer"
                  title="Simulates log alteration to demonstrate tamper detection"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Log Tamper Test</span>
                </button>
              </div>

              {auditResult && (
                <div className={`p-3 rounded-lg text-xs font-mono border ${
                  auditResult.isChainValid
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/50'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {auditResult.isChainValid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>INTEGRITY VERIFIED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>INTEGRITY CHECK FAILED</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] opacity-90">
                    {auditResult.isChainValid
                      ? `All ${auditResult.totalBlocks} event hashes matched the sequential SHA-256 chain.`
                      : `Hash mismatch detected at block index ${auditResult.tamperedBlockIndex}. Log tampering flagged!`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-slate-500 font-mono rounded-xl">
          No incident selected. Select an incident from the dropdown above.
        </div>
      )}
    </div>
  );
};

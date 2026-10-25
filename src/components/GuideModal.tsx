import React from 'react';
import { X, Shield, Target, Activity, BrainCircuit, Play, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuideModal: React.FC = () => {
  const { guideModalOpen, setGuideModalOpen } = useApp();

  if (!guideModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1220] border border-slate-700 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        <button
          onClick={() => setGuideModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-[#00E5FF]/40 flex items-center justify-center glow-cyan">
            <Shield className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">HOW DECOYNET WORKS</h2>
            <p className="text-xs text-slate-400">Cyber Deception Architecture & Judge Demonstration Guide</p>
          </div>
        </div>

        <div className="space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
          {/* Concept summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="font-bold text-[#00E5FF] font-mono mb-1 text-sm">System Concept & Purpose</h3>
            <p>
              DECOYNET deploys realistic decoy assets (honeyfiles, honeytokens, and honeypots) inside a simulated network. When an attacker probes or attempts unauthorized interactions with these assets, DECOYNET triggers deterministic security alerts, traces the complete movement trajectory, and generates AI-driven forensic reports.
            </p>
          </div>

          {/* Hackathon Judge Demo Walkthrough */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-[#00E5FF]/30 space-y-2">
            <h3 className="font-bold text-white font-mono flex items-center gap-2 text-sm">
              <Play className="w-4 h-4 text-[#00E5FF]" />
              60-Second Hackathon Judge Demonstration Flow
            </h3>

            <ol className="space-y-2 font-mono text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 1:</span>
                <span>Open Command Center. View monitored nodes and active deception assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 2:</span>
                <span>Select scenario <strong className="text-white">"Confidential Data Exfiltration Attempt"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 3:</span>
                <span>Click <strong className="text-white">"Launch Simulation"</strong>. Watch attacker packets traverse the Network Topology.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 4:</span>
                <span>Observe the Critical Alert generated when the attacker opens <strong className="text-white">company_payroll_2026.xlsx</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 5:</span>
                <span>Navigate to <strong className="text-white">Incident Reports</strong> and click <strong className="text-[#00E5FF]">"Analyze with Gemini"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">STEP 6:</span>
                <span>Click <strong className="text-white">"Download PDF Report"</strong> or verify the <strong className="text-purple-400">SHA-256 Audit Integrity</strong>.</span>
              </li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setGuideModalOpen(false)}
              className="px-5 py-2.5 rounded-lg bg-[#00E5FF] text-slate-950 font-bold font-mono text-xs hover:bg-[#00E5FF]/80 transition cursor-pointer glow-cyan"
            >
              Start Exploring DECOYNET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

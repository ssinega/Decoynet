import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  ActiveView, 
  AuditVerification, 
  DecoyAsset, 
  Incident, 
  NetworkEdge, 
  NetworkNode, 
  SecurityAlert, 
  SecurityEvent 
} from '../types/decoynet';
import { INITIAL_ALERTS, INITIAL_DECOYS, INITIAL_EDGES, INITIAL_NODES, getSeededHistoricalIncidents } from '../utils/seedData';
import { SCENARIOS } from '../utils/scenarios';
import { calculateThreatScore, DETECTION_RULES } from '../utils/detectionRules';
import { generateEventHash, verifyAuditChainIntegrity } from '../utils/crypto';

interface SimulationState {
  scenarioId: string;
  status: 'ready' | 'running' | 'paused' | 'completed';
  currentStepIndex: number;
  speedMultiplier: number;
  activeNodeId?: string;
  activeEdgeId?: string;
  activeIncidentId?: string;
}

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  decoys: DecoyAsset[];
  alerts: SecurityAlert[];
  incidents: Incident[];
  selectedIncident: Incident | null;
  selectedNode: NetworkNode | null;
  setSelectedNode: (node: NetworkNode | null) => void;
  simulation: SimulationState;
  selectScenario: (scenarioId: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetCurrentSimulation: () => void;
  setSpeedMultiplier: (speed: number) => void;
  triggerManualDecoy: (decoyId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  selectIncident: (incidentId: string) => void;
  requestGeminiAnalysis: (incidentId: string) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
  resetDemoData: () => void;
  verifyAuditChain: (incidentId: string) => AuditVerification;
  tamperTestIncident: (incidentId: string) => void;
  guideModalOpen: boolean;
  setGuideModalOpen: (open: boolean) => void;
  selectedAlertFilter: string;
  setSelectedAlertFilter: (filter: string) => void;
  selectedAlertSearch: string;
  setSelectedAlertSearch: (search: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'DECOYNET_STATE_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('command_center');
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<NetworkEdge[]>(INITIAL_EDGES);
  const [decoys, setDecoys] = useState<DecoyAsset[]>(INITIAL_DECOYS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<Incident[]>(getSeededHistoricalIncidents());
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-2026-081');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [selectedAlertFilter, setSelectedAlertFilter] = useState<string>('all');
  const [selectedAlertSearch, setSelectedAlertSearch] = useState<string>('');

  const [simulation, setSimulation] = useState<SimulationState>({
    scenarioId: 'SCENARIO-B',
    status: 'ready',
    currentStepIndex: 0,
    speedMultiplier: 1
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.incidents && parsed.incidents.length > 0) {
          setIncidents(parsed.incidents);
        }
        if (parsed.alerts) setAlerts(parsed.alerts);
        if (parsed.decoys) setDecoys(parsed.decoys);
      }
    } catch {
      // Fallback to default state
    }
  }, []);

  // Save incidents and alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        incidents,
        alerts,
        decoys
      }));
    } catch {
      // Storage error ignored
    }
  }, [incidents, alerts, decoys]);

  const activeScenario = SCENARIOS.find(s => s.id === simulation.scenarioId) || SCENARIOS[0];

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;

  const selectScenario = (scenarioId: string) => {
    if (simulation.status === 'running') return;
    setSimulation(prev => ({
      ...prev,
      scenarioId,
      status: 'ready',
      currentStepIndex: 0,
      activeNodeId: undefined,
      activeEdgeId: undefined,
      activeIncidentId: undefined
    }));
  };

  const startSimulation = () => {
    if (simulation.status === 'running') return;

    const newIncidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newIncident: Incident = {
      id: newIncidentId,
      scenarioId: activeScenario.id,
      scenarioName: activeScenario.name,
      startTime: now,
      sourceIp: '198.51.100.24',
      finalSeverity: 'low',
      threatScore: 10,
      status: 'running',
      events: [],
      triggeredRuleIds: [],
      affectedAssets: ['External Threat Actor'],
      attackPath: ['External Threat Actor']
    };

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncidentId(newIncidentId);

    setSimulation(prev => ({
      ...prev,
      status: 'running',
      currentStepIndex: 0,
      activeIncidentId: newIncidentId
    }));
  };

  const pauseSimulation = () => {
    if (simulation.status === 'running') {
      if (timerRef.current) clearInterval(timerRef.current);
      setSimulation(prev => ({ ...prev, status: 'paused' }));
    }
  };

  const resumeSimulation = () => {
    if (simulation.status === 'paused') {
      setSimulation(prev => ({ ...prev, status: 'running' }));
    }
  };

  const resetCurrentSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Restore node status
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);

    setSimulation({
      scenarioId: simulation.scenarioId,
      status: 'ready',
      currentStepIndex: 0,
      speedMultiplier: simulation.speedMultiplier,
      activeNodeId: undefined,
      activeEdgeId: undefined,
      activeIncidentId: undefined
    });
  };

  const setSpeedMultiplier = (speed: number) => {
    setSimulation(prev => ({ ...prev, speedMultiplier: speed }));
  };

  // Execute single scenario step
  const executeStep = useCallback((stepIdx: number, incidentId: string) => {
    const scenario = SCENARIOS.find(s => s.id === simulation.scenarioId) || SCENARIOS[0];
    if (stepIdx >= scenario.steps.length) {
      // Finish simulation
      if (timerRef.current) clearInterval(timerRef.current);
      const endTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      setIncidents(prev => prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'completed',
            endTime
          };
        }
        return inc;
      }));

      setSimulation(prev => ({
        ...prev,
        status: 'completed',
        activeNodeId: undefined,
        activeEdgeId: undefined
      }));

      // Reset node pulse after 2 seconds
      setTimeout(() => {
        setEdges(prev => prev.map(e => ({ ...e, animated: false, active: false })));
      }, 1500);

      return;
    }

    const step = scenario.steps[stepIdx];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Find previous event hash
    setIncidents(prevIncidents => {
      const currentInc = prevIncidents.find(i => i.id === incidentId);
      const lastEvent = currentInc?.events && currentInc.events.length > 0
        ? currentInc.events[currentInc.events.length - 1]
        : null;

      const previousHash = lastEvent ? lastEvent.hash : "0000000000000000000000000000000000000000000000000000000000000000";
      const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;

      const sourceNode = INITIAL_NODES.find(n => n.id === step.sourceNodeId);
      const destNode = INITIAL_NODES.find(n => n.id === step.destNodeId);

      const isDeceptionTrigger = step.category === 'deception_triggered' || !!step.ruleIdToTrigger;

      const eventHash = generateEventHash(
        eventId,
        incidentId,
        timestamp,
        step.sourceNodeId,
        step.destNodeId,
        step.action,
        isDeceptionTrigger ? 'critical' : step.category === 'discovery' ? 'medium' : 'low',
        previousHash
      );

      const newEvent: SecurityEvent = {
        id: eventId,
        incidentId,
        timestamp,
        sourceIp: sourceNode?.ip || '198.51.100.24',
        sourceNodeId: step.sourceNodeId,
        destinationIp: destNode?.ip || '192.0.2.1',
        destinationNodeId: step.destNodeId,
        action: step.action,
        category: step.category,
        severity: isDeceptionTrigger ? 'critical' : step.category === 'discovery' ? 'medium' : 'low',
        detectionStatus: isDeceptionTrigger ? 'deception_triggered' : step.ruleIdToTrigger ? 'flagged' : 'normal',
        detectionRuleId: step.ruleIdToTrigger,
        description: step.description,
        hash: eventHash,
        previousHash
      };

      const updatedEvents = [...(currentInc?.events || []), newEvent];
      const { score, severity, triggeredRules } = calculateThreatScore(updatedEvents);

      const ruleIds = triggeredRules.map(r => r.id);
      const affectedNodeNames = Array.from(new Set(updatedEvents.map(e => {
        const n = INITIAL_NODES.find(node => node.id === e.destinationNodeId);
        return n ? n.name : e.destinationNodeId;
      })));

      const pathNodeNames = updatedEvents.reduce((acc: string[], ev) => {
        const srcN = INITIAL_NODES.find(n => n.id === ev.sourceNodeId)?.name || ev.sourceNodeId;
        const dstN = INITIAL_NODES.find(n => n.id === ev.destinationNodeId)?.name || ev.destinationNodeId;
        if (!acc.includes(srcN)) acc.push(srcN);
        if (!acc.includes(dstN)) acc.push(dstN);
        return acc;
      }, ['External Threat Actor']);

      // Generate alert if deception rule triggered
      if (step.ruleIdToTrigger && DETECTION_RULES[step.ruleIdToTrigger]) {
        const rule = DETECTION_RULES[step.ruleIdToTrigger];
        const newAlert: SecurityAlert = {
          id: `ALT-${Math.floor(8000 + Math.random() * 1000)}`,
          incidentId,
          timestamp,
          sourceIp: sourceNode?.ip || '198.51.100.24',
          targetAsset: rule.targetAsset,
          severity: rule.severity,
          detectionRuleId: rule.id,
          ruleName: rule.name,
          description: step.description,
          status: 'new'
        };

        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);

        // Update matching decoy trigger count
        if (rule.id === 'RULE-001') {
          setDecoys(prev => prev.map(d => d.id === 'decoy-1' ? { ...d, triggerCount: d.triggerCount + 1, lastAccessTime: timestamp, status: 'triggered' } : d));
        } else if (rule.id === 'RULE-002') {
          setDecoys(prev => prev.map(d => d.id === 'decoy-2' ? { ...d, triggerCount: d.triggerCount + 1, lastAccessTime: timestamp, status: 'triggered' } : d));
        } else if (rule.id === 'RULE-003') {
          setDecoys(prev => prev.map(d => d.id === 'decoy-3' ? { ...d, triggerCount: d.triggerCount + 1, lastAccessTime: timestamp, status: 'triggered' } : d));
        }
      }

      return prevIncidents.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            events: updatedEvents,
            threatScore: score,
            finalSeverity: severity,
            triggeredRuleIds: ruleIds,
            affectedAssets: affectedNodeNames,
            attackPath: pathNodeNames
          };
        }
        return inc;
      });
    });

    // Update node visual highlight
    setNodes(prev => prev.map(node => {
      if (node.id === step.destNodeId) {
        return {
          ...node,
          status: step.category === 'deception_triggered' ? 'triggered' : 'suspicious',
          interactionsCount: node.interactionsCount + 1
        };
      }
      return node;
    }));

    // Update edge animation
    setEdges(prev => prev.map(edge => {
      if (
        (edge.source === step.sourceNodeId && edge.target === step.destNodeId) ||
        (edge.source === step.destNodeId && edge.target === step.sourceNodeId)
      ) {
        return { ...edge, animated: true, active: true };
      }
      return { ...edge, animated: false, active: false };
    }));

    setSimulation(prev => ({
      ...prev,
      currentStepIndex: stepIdx + 1,
      activeNodeId: step.destNodeId
    }));
  }, [simulation.scenarioId]);

  // Simulation interval ticker
  useEffect(() => {
    if (simulation.status === 'running' && simulation.activeIncidentId) {
      const intervalMs = Math.max(300, 1000 / simulation.speedMultiplier);
      timerRef.current = setInterval(() => {
        executeStep(simulation.currentStepIndex, simulation.activeIncidentId!);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simulation.status, simulation.currentStepIndex, simulation.activeIncidentId, simulation.speedMultiplier, executeStep]);

  // Manual Trigger for Decoys
  const triggerManualDecoy = (decoyId: string) => {
    const decoy = decoys.find(d => d.id === decoyId);
    if (!decoy) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const incidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

    let ruleId = 'RULE-001';
    let actionDesc = 'Manual simulation triggered on Confidential Document Trap';
    if (decoy.id === 'decoy-2') {
      ruleId = 'RULE-002';
      actionDesc = 'Manual credential misuse simulated on fake backup admin token';
    } else if (decoy.id === 'decoy-3') {
      ruleId = 'RULE-003';
      actionDesc = 'Manual SSH honeypot connection simulated on port 22';
    }

    const rule = DETECTION_RULES[ruleId];

    // Create event
    const prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = generateEventHash(eventId, incidentId, timestamp, 'node-1', decoy.assignedNodeId, actionDesc, 'critical', prevHash);

    const event: SecurityEvent = {
      id: eventId,
      incidentId,
      timestamp,
      sourceIp: '198.51.100.24',
      sourceNodeId: 'node-1',
      destinationIp: '192.0.2.1',
      destinationNodeId: decoy.assignedNodeId,
      action: actionDesc,
      category: 'deception_triggered',
      severity: 'critical',
      detectionStatus: 'deception_triggered',
      detectionRuleId: ruleId,
      description: `Manual decoy interaction executed on ${decoy.name} (${decoy.identifier}).`,
      hash,
      previousHash: prevHash
    };

    // New Alert
    const newAlert: SecurityAlert = {
      id: `ALT-${Math.floor(8000 + Math.random() * 1000)}`,
      incidentId,
      timestamp,
      sourceIp: '198.51.100.24',
      targetAsset: decoy.name,
      severity: rule.severity,
      detectionRuleId: ruleId,
      ruleName: rule.name,
      description: actionDesc,
      status: 'new'
    };

    // New Incident
    const newIncident: Incident = {
      id: incidentId,
      scenarioId: 'MANUAL-TRIGGER',
      scenarioName: `Manual Trigger: ${decoy.name}`,
      startTime: timestamp,
      endTime: timestamp,
      sourceIp: '198.51.100.24',
      finalSeverity: 'critical',
      threatScore: rule.riskPoints + 15,
      status: 'completed',
      events: [event],
      triggeredRuleIds: [ruleId],
      affectedAssets: [decoy.name],
      attackPath: ['External Threat Actor', 'Internet Gateway', decoy.name]
    };

    setDecoys(prev => prev.map(d => d.id === decoyId ? {
      ...d,
      triggerCount: d.triggerCount + 1,
      lastAccessTime: timestamp,
      status: 'triggered'
    } : d));

    setAlerts(prev => [newAlert, ...prev]);
    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncidentId(incidentId);

    // Highlight node
    setNodes(prev => prev.map(n => n.id === decoy.assignedNodeId ? { ...n, status: 'triggered', interactionsCount: n.interactionsCount + 1 } : n));
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged' } : a));
  };

  const selectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
  };

  const requestGeminiAnalysis = async (incidentId: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: inc.id,
          scenarioName: inc.scenarioName,
          events: inc.events,
          triggeredRules: inc.triggeredRuleIds,
          affectedAssets: inc.affectedAssets,
          threatScore: inc.threatScore
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.analysis) {
        setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, geminiAnalysis: data.analysis } : i));
      } else {
        throw new Error(data.message || data.error || 'Server returned invalid response');
      }
    } catch (err: any) {
      console.warn('Gemini API call unavailable or failed. Utilizing local rule-based analysis fallback:', err);
      setAnalysisError(err.message || 'Gemini API unavailable');

      // Local Fallback analysis
      const fallbackAnalysis = {
        executiveSummary: `Rule-Based Analysis (Gemini Unavailable): Incident ${inc.id} recorded an intruder accessing monitored assets. Threat score reached ${inc.threatScore}/100.`,
        attackTechnique: 'T1083 File Discovery / T1078 Valid Accounts',
        observedAttackPath: inc.attackPath ? inc.attackPath.join(' -> ') : 'Perimeter Ingress -> Internal Trap',
        evidence: `Triggered rules: ${inc.triggeredRuleIds.join(', ')}. Events captured: ${inc.events.length}.`,
        rootCauseHypothesis: 'Adversary leveraged discovered credentials or configuration files to pivot onto decoy endpoints.',
        severityExplanation: `Calculated severity: ${inc.finalSeverity.toUpperCase()} based on deception rules.`,
        recommendedActions: [
          'Contain host IP 198.51.100.24 on border firewall.',
          'Rotate all administrative credentials and API keys.',
          'Enforce strict micro-segmentation around sensitive subnets.'
        ],
        confidenceLevel: 'Rule-Based Deterministic Analysis',
        limitations: 'Generated locally without cloud LLM inference.',
        isFallback: true
      };

      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, geminiAnalysis: fallbackAnalysis } : i));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const verifyAuditChain = (incidentId: string): AuditVerification => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc || !inc.events) {
      return {
        isChainValid: true,
        totalBlocks: 0,
        checkedAt: new Date().toISOString()
      };
    }
    return verifyAuditChainIntegrity(inc.events);
  };

  const tamperTestIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId && i.events && i.events.length > 0) {
        const tamperedEvents = [...i.events];
        tamperedEvents[0] = {
          ...tamperedEvents[0],
          description: '[TAMPERED] Modified event payload string to test SHA-256 detection!'
        };
        return { ...i, events: tamperedEvents };
      }
      return i;
    }));
  };

  const resetDemoData = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setDecoys(INITIAL_DECOYS);
    setAlerts(INITIAL_ALERTS);
    const freshIncidents = getSeededHistoricalIncidents();
    setIncidents(freshIncidents);
    setSelectedIncidentId(freshIncidents[0].id);
    setSimulation({
      scenarioId: 'SCENARIO-B',
      status: 'ready',
      currentStepIndex: 0,
      speedMultiplier: 1
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        nodes,
        edges,
        decoys,
        alerts,
        incidents,
        selectedIncident,
        selectedNode,
        setSelectedNode,
        simulation,
        selectScenario,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetCurrentSimulation,
        setSpeedMultiplier,
        triggerManualDecoy,
        acknowledgeAlert,
        selectIncident,
        requestGeminiAnalysis,
        isAnalyzing,
        analysisError,
        resetDemoData,
        verifyAuditChain,
        tamperTestIncident,
        guideModalOpen,
        setGuideModalOpen,
        selectedAlertFilter,
        setSelectedAlertFilter,
        selectedAlertSearch,
        setSelectedAlertSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};

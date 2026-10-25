export type NodeType = 
  | 'external' 
  | 'gateway' 
  | 'app' 
  | 'database' 
  | 'honeypot_ssh' 
  | 'honeypot_cred' 
  | 'honeypot_file';

export type NodeStatus = 'healthy' | 'monitored' | 'suspicious' | 'triggered';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  type: NodeType;
  status: NodeStatus;
  description: string;
  interactionsCount: number;
  recentEvents: string[];
  threatIndicators: string[];
  position: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  active?: boolean;
  label?: string;
}

export type DecoyType = 'honeyfile' | 'honeytoken' | 'honeypot';

export interface DecoyAsset {
  id: string;
  name: string;
  identifier: string;
  type: DecoyType;
  description: string;
  classification: string;
  assignedNodeId: string;
  triggerCount: number;
  lastAccessTime: string | null;
  severity: 'high' | 'critical';
  status: 'active' | 'triggered' | 'disabled';
}

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  id: string;
  incidentId: string;
  timestamp: string;
  sourceIp: string;
  sourceNodeId: string;
  destinationIp: string;
  destinationNodeId: string;
  action: string;
  category: string;
  severity: EventSeverity;
  detectionStatus: 'normal' | 'flagged' | 'deception_triggered';
  detectionRuleId?: string;
  description: string;
  hash: string;
  previousHash: string;
}

export interface SecurityAlert {
  id: string;
  incidentId: string;
  timestamp: string;
  sourceIp: string;
  targetAsset: string;
  severity: EventSeverity;
  detectionRuleId: string;
  ruleName: string;
  description: string;
  status: 'new' | 'investigating' | 'acknowledged';
}

export interface IncidentAnalysis {
  executiveSummary: string;
  attackTechnique: string;
  observedAttackPath: string;
  evidence: string;
  rootCauseHypothesis: string;
  severityExplanation: string;
  recommendedActions: string[];
  confidenceLevel: string;
  limitations: string;
  isFallback?: boolean;
}

export interface Incident {
  id: string;
  scenarioId: string;
  scenarioName: string;
  startTime: string;
  endTime?: string;
  sourceIp: string;
  finalSeverity: EventSeverity;
  threatScore: number;
  status: 'running' | 'completed' | 'paused';
  events: SecurityEvent[];
  triggeredRuleIds: string[];
  affectedAssets: string[];
  attackPath: string[];
  geminiAnalysis?: IncidentAnalysis | null;
  isHistorical?: boolean;
}

export interface ScenarioStep {
  stepNumber: number;
  delayMs: number;
  sourceNodeId: string;
  destNodeId: string;
  action: string;
  category: string;
  description: string;
  ruleIdToTrigger?: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  expectedPath: string[];
  steps: ScenarioStep[];
}

export type ActiveView = 
  | 'command_center' 
  | 'topology' 
  | 'decoys' 
  | 'threat_intel' 
  | 'timeline' 
  | 'reports';

export interface AuditVerification {
  isChainValid: boolean;
  totalBlocks: number;
  tamperedBlockIndex?: number;
  checkedAt: string;
}

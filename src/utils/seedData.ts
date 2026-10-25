import { DecoyAsset, Incident, NetworkEdge, NetworkNode, SecurityAlert } from '../types/decoynet';
import { generateEventHash } from './crypto';

export const INITIAL_NODES: NetworkNode[] = [
  {
    id: 'node-1',
    name: 'External Threat Actor',
    ip: '198.51.100.24',
    type: 'external',
    status: 'suspicious',
    description: 'Adversary source IP detected attempting probing and unauthorized authentication across perimeter boundaries.',
    interactionsCount: 14,
    recentEvents: ['Port Scan Detected', 'Ingress Probe', 'Credential Attempt'],
    threatIndicators: ['Malicious IP Reputation', 'Rapid Scanning Pattern', 'Unrecognized User-Agent'],
    position: { x: 80, y: 180 }
  },
  {
    id: 'node-2',
    name: 'Internet Gateway',
    ip: '192.0.2.1',
    type: 'gateway',
    status: 'monitored',
    description: 'Perimeter ingress gateway firewall providing SSL termination and connection filtering.',
    interactionsCount: 88,
    recentEvents: ['TLS Session Established', 'Firewall Pass-Through', 'Packet Inspection'],
    threatIndicators: ['High Connection Rate', 'Repeated Syn Packets'],
    position: { x: 280, y: 180 }
  },
  {
    id: 'node-3',
    name: 'Production Application',
    ip: '192.0.2.10',
    type: 'app',
    status: 'monitored',
    description: 'Primary customer portal and internal API gateway hosting web services.',
    interactionsCount: 142,
    recentEvents: ['HTTP GET /api/v1/config', 'DB Query Executed', 'Session Auth Requested'],
    threatIndicators: ['Directory Traversal Probe', 'Config File Query'],
    position: { x: 500, y: 180 }
  },
  {
    id: 'node-4',
    name: 'Internal Database',
    ip: '192.0.2.20',
    type: 'database',
    status: 'healthy',
    description: 'Encrypted relational cluster holding production customer records with restricted ACLs.',
    interactionsCount: 310,
    recentEvents: ['Connection Pool Auth', 'SQL Select Executed', 'Backup Sync Complete'],
    threatIndicators: [],
    position: { x: 740, y: 60 }
  },
  {
    id: 'node-5',
    name: 'SSH Honeypot',
    ip: '192.0.2.30',
    type: 'honeypot_ssh',
    status: 'healthy',
    description: 'High-interaction decoy SSH server with keystroke logging and fake shell access.',
    interactionsCount: 4,
    recentEvents: ['Service Port Listening', 'Simulated Keystroke Logged'],
    threatIndicators: ['Decoy SSH Port Probed'],
    position: { x: 740, y: 180 }
  },
  {
    id: 'node-6',
    name: 'Administrator Credential Trap',
    ip: '192.0.2.40',
    type: 'honeypot_cred',
    status: 'healthy',
    description: 'Monitored administrative authentication endpoint bound to honeytoken svc_backup_admin.',
    interactionsCount: 2,
    recentEvents: ['Honeytoken Auth Attempt', 'Account Flagged'],
    threatIndicators: ['Planted Credential Misuse'],
    position: { x: 740, y: 300 }
  },
  {
    id: 'node-7',
    name: 'Confidential Document Trap',
    ip: '192.0.2.50',
    type: 'honeypot_file',
    status: 'healthy',
    description: 'Decoy document file trap (company_payroll_2026.xlsx) with active forensic web beacon.',
    interactionsCount: 3,
    recentEvents: ['Honeyfile Open Event', 'Beacon Dispatched'],
    threatIndicators: ['Unauthorized File Access'],
    position: { x: 740, y: 420 }
  }
];

export const INITIAL_EDGES: NetworkEdge[] = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: false, label: 'WAN Ingress' },
  { id: 'e2-3', source: 'node-2', target: 'node-3', animated: false, label: 'HTTP / API' },
  { id: 'e3-4', source: 'node-3', target: 'node-4', animated: false, label: 'Prod DB Link' },
  { id: 'e3-5', source: 'node-3', target: 'node-5', animated: false, label: 'Decoy SSH (Port 22)' },
  { id: 'e3-6', source: 'node-3', target: 'node-6', animated: false, label: 'Honeytoken Auth' },
  { id: 'e3-7', source: 'node-3', target: 'node-7', animated: false, label: 'Honeyfile SMB' }
];

export const INITIAL_DECOYS: DecoyAsset[] = [
  {
    id: 'decoy-1',
    name: 'Confidential File Trap',
    identifier: 'company_payroll_2026.xlsx',
    type: 'honeyfile',
    description: 'Fictional confidential financial document containing embedded tracking web beacon to detect unauthorized retrieval.',
    classification: 'Highly Confidential',
    assignedNodeId: 'node-7',
    triggerCount: 3,
    lastAccessTime: '2026-10-24 19:42:10 UTC',
    severity: 'critical',
    status: 'active'
  },
  {
    id: 'decoy-2',
    name: 'Fake Administrator Credentials',
    identifier: 'svc_backup_admin',
    type: 'honeytoken',
    description: 'Planted non-functional administrative service token monitored for access attempts across authentication servers.',
    classification: 'Restricted Token',
    assignedNodeId: 'node-6',
    triggerCount: 2,
    lastAccessTime: '2026-10-24 18:15:33 UTC',
    severity: 'critical',
    status: 'active'
  },
  {
    id: 'decoy-3',
    name: 'SSH Honeypot Server',
    identifier: 'ssh-gateway-decoy',
    type: 'honeypot',
    description: 'Isolated high-interaction Linux SSH endpoint running synthetic service on port 22 with command recording.',
    classification: 'Decoy Infrastructure',
    assignedNodeId: 'node-5',
    triggerCount: 4,
    lastAccessTime: '2026-10-24 21:05:12 UTC',
    severity: 'high',
    status: 'active'
  }
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-8841',
    incidentId: 'INC-2026-081',
    timestamp: '2026-10-24 21:05:12 UTC',
    sourceIp: '198.51.100.24',
    targetAsset: 'Confidential Document Trap (company_payroll_2026.xlsx)',
    severity: 'critical',
    detectionRuleId: 'RULE-001',
    ruleName: 'Confidential Decoy Document Access',
    description: 'Unauthorized access to honeyfile company_payroll_2026.xlsx detected. Web beacon triggered.',
    status: 'investigating'
  },
  {
    id: 'ALT-8839',
    incidentId: 'INC-2026-080',
    timestamp: '2026-10-24 19:42:10 UTC',
    sourceIp: '198.51.100.24',
    targetAsset: 'Administrator Credential Trap (svc_backup_admin)',
    severity: 'critical',
    detectionRuleId: 'RULE-002',
    ruleName: 'Planted Administrator Credential Misuse',
    description: 'Authentication attempt detected using fake administrative token svc_backup_admin.',
    status: 'acknowledged'
  },
  {
    id: 'ALT-8820',
    incidentId: 'INC-2026-078',
    timestamp: '2026-10-24 18:15:33 UTC',
    sourceIp: '198.51.100.88',
    targetAsset: 'SSH Honeypot (192.0.2.30)',
    severity: 'high',
    detectionRuleId: 'RULE-003',
    ruleName: 'SSH Honeypot Endpoint Interaction',
    description: 'Unauthorized interactive SSH shell session established on honeypot port 22.',
    status: 'acknowledged'
  }
];

// Generate synthetic historical incident for initial dashboard state
export function getSeededHistoricalIncidents(): Incident[] {
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  const event1Hash = generateEventHash('EVT-1001', 'INC-2026-081', '2026-10-24 21:01:00 UTC', 'node-1', 'node-2', 'Inbound Syn Probe', 'low', prevHash);
  const event2Hash = generateEventHash('EVT-1002', 'INC-2026-081', '2026-10-24 21:02:15 UTC', 'node-2', 'node-3', 'Config File Inspection', 'medium', event1Hash);
  const event3Hash = generateEventHash('EVT-1003', 'INC-2026-081', '2026-10-24 21:04:30 UTC', 'node-3', 'node-7', 'Unauthorized Honeyfile Retrieval', 'critical', event2Hash);
  const event4Hash = generateEventHash('EVT-1004', 'INC-2026-081', '2026-10-24 21:05:12 UTC', 'node-7', 'node-1', 'Honeyfile Beacon Tripped', 'critical', event3Hash);

  const histEvents = [
    {
      id: 'EVT-1001',
      incidentId: 'INC-2026-081',
      timestamp: '2026-10-24 21:01:00 UTC',
      sourceIp: '198.51.100.24',
      sourceNodeId: 'node-1',
      destinationIp: '192.0.2.1',
      destinationNodeId: 'node-2',
      action: 'Inbound Gateway Reconnaissance',
      category: 'reconnaissance',
      severity: 'low' as const,
      detectionStatus: 'normal' as const,
      description: 'Host 198.51.100.24 performed perimeter TCP port scan.',
      hash: event1Hash,
      previousHash: prevHash
    },
    {
      id: 'EVT-1002',
      incidentId: 'INC-2026-081',
      timestamp: '2026-10-24 21:02:15 UTC',
      sourceIp: '198.51.100.24',
      sourceNodeId: 'node-2',
      destinationIp: '192.0.2.10',
      destinationNodeId: 'node-3',
      action: 'App File Share Discovery',
      category: 'discovery',
      severity: 'medium' as const,
      detectionStatus: 'flagged' as const,
      detectionRuleId: 'RULE-004',
      description: 'Repeated configuration file requests on Production Application server.',
      hash: event2Hash,
      previousHash: event1Hash
    },
    {
      id: 'EVT-1003',
      incidentId: 'INC-2026-081',
      timestamp: '2026-10-24 21:04:30 UTC',
      sourceIp: '198.51.100.24',
      sourceNodeId: 'node-3',
      destinationIp: '192.0.2.50',
      destinationNodeId: 'node-7',
      action: 'Unauthorized Honeyfile Read Attempt',
      category: 'exfiltration_attempt',
      severity: 'critical' as const,
      detectionStatus: 'deception_triggered' as const,
      detectionRuleId: 'RULE-001',
      description: 'Attacker accessed planted document company_payroll_2026.xlsx.',
      hash: event3Hash,
      previousHash: event2Hash
    },
    {
      id: 'EVT-1004',
      incidentId: 'INC-2026-081',
      timestamp: '2026-10-24 21:05:12 UTC',
      sourceIp: '192.0.2.50',
      sourceNodeId: 'node-7',
      destinationIp: '198.51.100.24',
      destinationNodeId: 'node-1',
      action: 'Decoy Watermark Beacon Alert Dispatched',
      category: 'alerting',
      severity: 'critical' as const,
      detectionStatus: 'deception_triggered' as const,
      detectionRuleId: 'RULE-001',
      description: 'Watermark beacon verified unauthorized retrieval of company_payroll_2026.xlsx.',
      hash: event4Hash,
      previousHash: event3Hash
    }
  ];

  return [
    {
      id: 'INC-2026-081',
      scenarioId: 'SCENARIO-B',
      scenarioName: 'Confidential Data Exfiltration Attempt',
      startTime: '2026-10-24 21:01:00 UTC',
      endTime: '2026-10-24 21:05:12 UTC',
      sourceIp: '198.51.100.24',
      finalSeverity: 'critical',
      threatScore: 85,
      status: 'completed',
      events: histEvents,
      triggeredRuleIds: ['RULE-001', 'RULE-004'],
      affectedAssets: ['Confidential Document Trap (company_payroll_2026.xlsx)', 'Internet Gateway (192.0.2.1)'],
      attackPath: ['External Threat Actor', 'Internet Gateway', 'Production Application', 'Confidential Document Trap'],
      isHistorical: true,
      geminiAnalysis: {
        executiveSummary: 'An external threat actor traversed perimeter defenses and accessed a confidential document decoy (company_payroll_2026.xlsx). Forensic watermarks instantly alerted SOC operators before exfiltration.',
        attackTechnique: 'T1083 (File and Directory Discovery) & T1020 (Automated Exfiltration)',
        observedAttackPath: '198.51.100.24 -> 192.0.2.1 (Gateway) -> 192.0.2.10 (App Server) -> 192.0.2.50 (Honeyfile)',
        evidence: 'Active web beacon callback from IP 198.51.100.24 requesting SMB payload company_payroll_2026.xlsx.',
        rootCauseHypothesis: 'Misconfigured app share exposure allowed unauthenticated internal file share browsing.',
        severityExplanation: 'CRITICAL (Score: 85/100). High-sensitivity financial deception trap tripped.',
        recommendedActions: [
          'Immediately block source IP 198.51.100.24 at boundary gateway.',
          'Quarantine file share permissions on host 192.0.2.10.',
          'Audit web access logs for secondary access indicators.'
        ],
        confidenceLevel: '98% High Confidence',
        limitations: 'Simulated environment telemetry.'
      }
    }
  ];
}

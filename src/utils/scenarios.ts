import { SimulationScenario } from '../types/decoynet';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 'SCENARIO-A',
    name: 'Stolen Administrator Credentials',
    tagline: 'Credential Honeytoken Misuse',
    description: 'Simulates an adversary exploiting leaked administrative credentials (svc_backup_admin) to breach internal systems.',
    expectedPath: ['node-1', 'node-2', 'node-3', 'node-6'],
    steps: [
      {
        stepNumber: 1,
        delayMs: 1000,
        sourceNodeId: 'node-1',
        destNodeId: 'node-2',
        action: 'Initial Threat Activation & Ingress Probe',
        category: 'reconnaissance',
        description: 'External threat actor (198.51.100.24) initiates network scanning targeting perimeter gateway.'
      },
      {
        stepNumber: 2,
        delayMs: 1000,
        sourceNodeId: 'node-2',
        destNodeId: 'node-3',
        action: 'Gateway Ingress Traversal',
        category: 'reconnaissance',
        description: 'Attacker routes through Internet Gateway (192.0.2.1) and performs TCP port scan against application server.',
        ruleIdToTrigger: 'RULE-004'
      },
      {
        stepNumber: 3,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-3',
        action: 'Application Environment Probing',
        category: 'discovery',
        description: 'Adversary enumerates environment variables and config files on Production Application (192.0.2.10).'
      },
      {
        stepNumber: 4,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-6',
        action: 'Planted Honeytoken Credential Discovered',
        category: 'credential_access',
        description: 'Attacker discovers unencrypted administrative backup credential (svc_backup_admin) in web configuration file.'
      },
      {
        stepNumber: 5,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-6',
        action: 'Unauthorized Credential Authentication Attempt',
        category: 'credential_misuse',
        description: 'Adversary attempts privilege escalation using svc_backup_admin credentials against administrative endpoint (192.0.2.40).'
      },
      {
        stepNumber: 6,
        delayMs: 1000,
        sourceNodeId: 'node-6',
        destNodeId: 'node-6',
        action: 'Deception Trap Tripped — Honeytoken Alert',
        category: 'deception_triggered',
        description: 'Administrator Credential Trap activates. Real-time security alert dispatched and attacker session isolated.',
        ruleIdToTrigger: 'RULE-002'
      },
      {
        stepNumber: 7,
        delayMs: 1000,
        sourceNodeId: 'node-6',
        destNodeId: 'node-3',
        action: 'Automatic Containment & Quarantine',
        category: 'containment',
        description: 'Automated defense rule triggers credential revocation and revokes active API tokens associated with source session.'
      },
      {
        stepNumber: 8,
        delayMs: 1000,
        sourceNodeId: 'node-6',
        destNodeId: 'node-1',
        action: 'Incident Reconstruction Completed',
        category: 'incident_summary',
        description: 'Attack path fully mapped. Forensic telemetry compiled and ready for AI threat intelligence analysis.'
      }
    ]
  },
  {
    id: 'SCENARIO-B',
    name: 'Confidential Data Exfiltration Attempt',
    tagline: 'Honeyfile Access Detection',
    description: 'Simulates an insider threat or compromised host seeking high-value corporate intellectual property.',
    expectedPath: ['node-1', 'node-2', 'node-3', 'node-7'],
    steps: [
      {
        stepNumber: 1,
        delayMs: 1000,
        sourceNodeId: 'node-1',
        destNodeId: 'node-2',
        action: 'Perimeter Network Ingress',
        category: 'reconnaissance',
        description: 'External threat actor (198.51.100.24) establishes encrypted tunnel through Internet Gateway.'
      },
      {
        stepNumber: 2,
        delayMs: 1000,
        sourceNodeId: 'node-2',
        destNodeId: 'node-3',
        action: 'Internal Share Enumeration',
        category: 'discovery',
        description: 'Attacker queries internal file shares and document repositories accessible from Production Application.'
      },
      {
        stepNumber: 3,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-7',
        action: 'Confidential File Location Located',
        category: 'discovery',
        description: 'Attacker locates financial document share housing "company_payroll_2026.xlsx" at 192.0.2.50.'
      },
      {
        stepNumber: 4,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-7',
        action: 'Unauthorized Document Retrieval Initiated',
        category: 'exfiltration_attempt',
        description: 'Attacker attempts SMB read and copy operation on company_payroll_2026.xlsx.'
      },
      {
        stepNumber: 5,
        delayMs: 1000,
        sourceNodeId: 'node-7',
        destNodeId: 'node-7',
        action: 'Honeyfile Watermark Trap Triggered',
        category: 'deception_triggered',
        description: 'Confidential Document Trap activates web beacon and silent telemetry signal upon file open attempt.',
        ruleIdToTrigger: 'RULE-001'
      },
      {
        stepNumber: 6,
        delayMs: 1000,
        sourceNodeId: 'node-7',
        destNodeId: 'node-3',
        action: 'Critical Data Exfiltration Alert Generated',
        category: 'alerting',
        description: 'CRITICAL alert emitted: Unauthorized access to honeyfile company_payroll_2026.xlsx detected.'
      },
      {
        stepNumber: 7,
        delayMs: 1000,
        sourceNodeId: 'node-7',
        destNodeId: 'node-1',
        action: 'Data Link Severed & Endpoint Isolated',
        category: 'containment',
        description: 'Network firewall blocks outbound connection from source IP 198.51.100.24 to prevent potential data loss.'
      },
      {
        stepNumber: 8,
        delayMs: 1000,
        sourceNodeId: 'node-7',
        destNodeId: 'node-1',
        action: 'Incident Investigation Log Finalized',
        category: 'incident_summary',
        description: 'Telemetry captured. Attack tree compiled with cryptographic hash integrity chain.'
      }
    ]
  },
  {
    id: 'SCENARIO-C',
    name: 'Network Lateral Movement',
    tagline: 'SSH Honeypot Interception',
    description: 'Simulates an adversary attempting automated subnet scanning and pivoting into decoy infrastructure.',
    expectedPath: ['node-1', 'node-2', 'node-3', 'node-5'],
    steps: [
      {
        stepNumber: 1,
        delayMs: 1000,
        sourceNodeId: 'node-1',
        destNodeId: 'node-2',
        action: 'Gateway Access & Probe',
        category: 'reconnaissance',
        description: 'Threat actor connects to Gateway (192.0.2.1) and initiates automated network discovery script.'
      },
      {
        stepNumber: 2,
        delayMs: 1000,
        sourceNodeId: 'node-2',
        destNodeId: 'node-3',
        action: 'Internal Subnet Sweep',
        category: 'discovery',
        description: 'Subnet sweep (192.0.2.0/24) launched from Production Application (192.0.2.10).'
      },
      {
        stepNumber: 3,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-5',
        action: 'Open Port 22 Identified on Honeypot Node',
        category: 'discovery',
        description: 'Attacker discovers SSH service running on 192.0.2.30 (ssh-gateway-decoy).'
      },
      {
        stepNumber: 4,
        delayMs: 1000,
        sourceNodeId: 'node-3',
        destNodeId: 'node-5',
        action: 'Brute-Force SSH Connection Attempt',
        category: 'lateral_movement',
        description: 'Attacker executes dictionary attack against SSH service on ssh-gateway-decoy.'
      },
      {
        stepNumber: 5,
        delayMs: 1000,
        sourceNodeId: 'node-5',
        destNodeId: 'node-5',
        action: 'SSH Honeypot Interactive Session Trapped',
        category: 'deception_triggered',
        description: 'Honeypot grants restricted shell to log attacker keystrokes, commands, and tool downloads in complete isolation.',
        ruleIdToTrigger: 'RULE-003'
      },
      {
        stepNumber: 6,
        delayMs: 1000,
        sourceNodeId: 'node-5',
        destNodeId: 'node-5',
        action: 'Lateral Movement Detection Rule Triggered',
        category: 'alerting',
        description: 'HIGH alert generated: Unauthorized interaction with decoy SSH terminal.',
        ruleIdToTrigger: 'RULE-005'
      },
      {
        stepNumber: 7,
        delayMs: 1000,
        sourceNodeId: 'node-5',
        destNodeId: 'node-2',
        action: 'Automated Port Blockade Enforced',
        category: 'containment',
        description: 'Gateway automatically drops all subsequent incoming traffic from 198.51.100.24.'
      },
      {
        stepNumber: 8,
        delayMs: 1000,
        sourceNodeId: 'node-5',
        destNodeId: 'node-1',
        action: 'Attacker Movement Map Reconstructed',
        category: 'incident_summary',
        description: 'Interactive graph topology updated with full attacker route trajectory.'
      }
    ]
  }
];

import { EventSeverity, SecurityEvent } from '../types/decoynet';

export interface DetectionRule {
  id: string;
  name: string;
  severity: EventSeverity;
  riskPoints: number;
  description: string;
  targetAsset: string;
}

export const DETECTION_RULES: Record<string, DetectionRule> = {
  'RULE-001': {
    id: 'RULE-001',
    name: 'Confidential Decoy Document Access',
    severity: 'critical',
    riskPoints: 60,
    description: 'Unauthorized read/exfiltration attempt detected on planted confidential document decoy (company_payroll_2026.xlsx).',
    targetAsset: 'Confidential Document Trap (company_payroll_2026.xlsx)'
  },
  'RULE-002': {
    id: 'RULE-002',
    name: 'Planted Administrator Credential Misuse',
    severity: 'critical',
    riskPoints: 50,
    description: 'Authentication attempt detected using fake administrative service honeytoken (svc_backup_admin).',
    targetAsset: 'Administrator Credential Trap (svc_backup_admin)'
  },
  'RULE-003': {
    id: 'RULE-003',
    name: 'SSH Honeypot Endpoint Interaction',
    severity: 'high',
    riskPoints: 35,
    description: 'Unauthorized interactive SSH connection or session attempt established with isolated decoy endpoint (ssh-gateway-decoy).',
    targetAsset: 'SSH Honeypot (192.0.2.30:22)'
  },
  'RULE-004': {
    id: 'RULE-004',
    name: 'Repeated Network Reconnaissance',
    severity: 'medium',
    riskPoints: 15,
    description: 'Systematic port probing or gateway enumeration observed from external source IP address.',
    targetAsset: 'Internet Gateway (192.0.2.1)'
  },
  'RULE-005': {
    id: 'RULE-005',
    name: 'Internal Network Lateral Movement',
    severity: 'high',
    riskPoints: 20,
    description: 'Sequential pivot attempts detected traversing internal production network segments.',
    targetAsset: 'Production Application (192.0.2.10)'
  },
  'RULE-006': {
    id: 'RULE-006',
    name: 'Multi-Asset Deception Correlation',
    severity: 'critical',
    riskPoints: 40,
    description: 'High-confidence attack campaign identified: intruder interacted with multiple distinct deception traps in a single session.',
    targetAsset: 'Monitored Subnet / All Decoys'
  }
};

/**
 * Calculates risk score from incident events avoiding double counting rules
 */
export function calculateThreatScore(events: SecurityEvent[]): {
  score: number;
  severity: EventSeverity;
  triggeredRules: DetectionRule[];
} {
  const triggeredRuleMap = new Map<string, DetectionRule>();

  for (const ev of events) {
    if (ev.detectionRuleId && DETECTION_RULES[ev.detectionRuleId]) {
      triggeredRuleMap.set(ev.detectionRuleId, DETECTION_RULES[ev.detectionRuleId]);
    }
  }

  // Check RULE-006 if multiple deception assets triggered
  const deceptionCount = events.filter(e => e.detectionStatus === 'deception_triggered').length;
  if (deceptionCount >= 2 && !triggeredRuleMap.has('RULE-006')) {
    triggeredRuleMap.set('RULE-006', DETECTION_RULES['RULE-006']);
  }

  let totalScore = 0;
  triggeredRuleMap.forEach(rule => {
    totalScore += rule.riskPoints;
  });

  // Base score for reconnaissance events without explicit rule ID
  const reconCount = events.filter(e => e.category === 'reconnaissance').length;
  if (reconCount > 0 && !triggeredRuleMap.has('RULE-004')) {
    totalScore += 10;
  }

  const clampedScore = Math.min(100, Math.max(0, totalScore));
  let severity: EventSeverity = 'low';

  if (clampedScore >= 75) {
    severity = 'critical';
  } else if (clampedScore >= 50) {
    severity = 'high';
  } else if (clampedScore >= 25) {
    severity = 'medium';
  } else {
    severity = 'low';
  }

  return {
    score: clampedScore,
    severity,
    triggeredRules: Array.from(triggeredRuleMap.values())
  };
}

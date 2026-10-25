import { SecurityEvent } from '../types/decoynet';

/**
 * Creates a deterministic string representation of an event for cryptographic hashing
 */
function serializeEventForHash(
  eventId: string,
  incidentId: string,
  timestamp: string,
  sourceNodeId: string,
  destinationNodeId: string,
  action: string,
  severity: string,
  previousHash: string
): string {
  return `${eventId}|${incidentId}|${timestamp}|${sourceNodeId}|${destinationNodeId}|${action}|${severity}|${previousHash}`;
}

/**
 * Simple fast synchronous hash for simulation performance with SHA-256 format fallback
 */
export function computeFastHash(input: string): string {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const hex4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  
  return (hex1 + hex2 + hex3 + hex4 + hex1 + hex2 + hex3 + hex4).toLowerCase();
}

/**
 * Computes SHA-256 hash using Web Crypto API if available, or fast hash
 */
export async function computeSha256(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return computeFastHash(input);
    }
  }
  return computeFastHash(input);
}

/**
 * Calculate hash for a new security event chained to the previous hash
 */
export function generateEventHash(
  eventId: string,
  incidentId: string,
  timestamp: string,
  sourceNodeId: string,
  destinationNodeId: string,
  action: string,
  severity: string,
  previousHash: string
): string {
  const canonical = serializeEventForHash(
    eventId, incidentId, timestamp, sourceNodeId, destinationNodeId, action, severity, previousHash
  );
  return computeFastHash(canonical);
}

/**
 * Verifies the integrity of the audit log hash chain
 */
export function verifyAuditChainIntegrity(events: SecurityEvent[]): {
  isChainValid: boolean;
  totalBlocks: number;
  tamperedBlockIndex?: number;
  checkedAt: string;
} {
  if (!events || events.length === 0) {
    return {
      isChainValid: true,
      totalBlocks: 0,
      checkedAt: new Date().toISOString()
    };
  }

  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    // Verify previous hash link
    if (event.previousHash !== prevHash && i > 0) {
      return {
        isChainValid: false,
        totalBlocks: events.length,
        tamperedBlockIndex: i,
        checkedAt: new Date().toISOString()
      };
    }

    // Verify self hash calculation
    const computed = generateEventHash(
      event.id,
      event.incidentId,
      event.timestamp,
      event.sourceNodeId,
      event.destinationNodeId,
      event.action,
      event.severity,
      event.previousHash
    );

    if (computed !== event.hash) {
      return {
        isChainValid: false,
        totalBlocks: events.length,
        tamperedBlockIndex: i,
        checkedAt: new Date().toISOString()
      };
    }

    prevHash = event.hash;
  }

  return {
    isChainValid: true,
    totalBlocks: events.length,
    checkedAt: new Date().toISOString()
  };
}

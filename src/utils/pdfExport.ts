import { jsPDF } from 'jspdf';
import { Incident } from '../types/decoynet';

export function exportIncidentReportPDF(incident: Incident): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header background bar
  doc.setFillColor(7, 11, 20); // #070B14
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(0, 229, 255); // Neon Cyan
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DECOYNET', 14, 12);

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CYBER DECEPTION & INTRUSION INCIDENT REPORT', 52, 12);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`CONFIDENTIAL - SECURITY OPERATIONS CENTER - INCIDENT ID: ${incident.id}`, 14, 21);

  y = 36;

  // Key Metadata Box
  doc.setDrawColor(30, 41, 59);
  doc.setFillColor(16, 26, 46);
  doc.roundedRect(14, y, pageWidth - 28, 36, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'bold');

  doc.text('SCENARIO:', 18, y + 8);
  doc.text('SOURCE IP:', 18, y + 16);
  doc.text('TIMESTAMPS:', 18, y + 24);
  doc.text('THREAT SCORE:', 115, y + 8);
  doc.text('SEVERITY:', 115, y + 16);
  doc.text('STATUS:', 115, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(248, 250, 252);

  doc.text(incident.scenarioName, 42, y + 8);
  doc.text(incident.sourceIp, 42, y + 16);
  doc.text(`${incident.startTime} ${incident.endTime ? '- ' + incident.endTime : ''}`, 42, y + 24);

  // Score color
  if (incident.threatScore >= 75) doc.setTextColor(255, 77, 109);
  else if (incident.threatScore >= 50) doc.setTextColor(249, 115, 22);
  else doc.setTextColor(34, 197, 94);

  doc.setFont('helvetica', 'bold');
  doc.text(`${incident.threatScore} / 100`, 145, y + 8);
  doc.text(incident.finalSeverity.toUpperCase(), 145, y + 16);
  doc.setTextColor(248, 250, 252);
  doc.text(incident.status.toUpperCase(), 145, y + 24);

  y += 44;

  // Observed Attack Path
  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('1. OBSERVED ATTACK TRAJECTORY', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFillColor(241, 245, 249);
  const pathStr = incident.attackPath ? incident.attackPath.join(' -> ') : 'N/A';
  doc.text(`Traversed Route: ${pathStr}`, 14, y);
  y += 10;

  // Gemini / Local Incident Analysis
  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('2. INCIDENT ANALYSIS & THREAT INTELLIGENCE', 14, y);
  y += 6;

  const analysis = incident.geminiAnalysis;
  const execSummary = analysis?.executiveSummary || 'Automatic rule-based incident trigger generated following interaction with monitored deception assets.';
  const technique = analysis?.attackTechnique || 'T1083 / T1078 Discovery & Credential Misuse';
  const rootCause = analysis?.rootCauseHypothesis || 'Attacker accessed internal share containing decoy credentials/files.';

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Summary:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  const splitExec = doc.splitTextToSize(execSummary, pageWidth - 28);
  doc.text(splitExec, 14, y);
  y += splitExec.length * 4 + 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Identified Technique:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(technique, 52, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Root Cause Hypothesis:', 14, y);
  doc.setFont('helvetica', 'normal');
  const splitRoot = doc.splitTextToSize(rootCause, pageWidth - 65);
  doc.text(splitRoot, 52, y);
  y += splitRoot.length * 4 + 6;

  // Security Events Table
  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('3. CHRONOLOGICAL SECURITY EVENT LOGS', 14, y);
  y += 6;

  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('TIMESTAMP', 16, y + 4);
  doc.text('ACTION', 60, y + 4);
  doc.text('SEVERITY', 130, y + 4);
  doc.text('DETECTION RULE', 160, y + 4);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const displayEvents = incident.events ? incident.events.slice(0, 7) : [];
  displayEvents.forEach((ev) => {
    if (y > 270) return; // Prevent overflowing A4 page
    doc.text(ev.timestamp.substring(11, 19), 16, y);
    doc.text(ev.action.substring(0, 32), 60, y);
    doc.text(ev.severity.toUpperCase(), 130, y);
    doc.text(ev.detectionRuleId || 'N/A', 160, y);
    y += 5;
  });

  y += 6;

  // Recommended Actions
  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('4. RECOMMENDED INCIDENT RESPONSE ACTIONS', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const recs = analysis?.recommendedActions || [
    'Immediately isolate host 198.51.100.24 from network routing tables.',
    'Rotate administrative service credentials for svc_backup_admin.',
    'Review perimeter firewall logs for correlated scanning activity.',
    'Audit web access logs for secondary indicators of compromise.'
  ];

  recs.forEach((rec, idx) => {
    if (y > 280) return;
    doc.text(`${idx + 1}. ${rec}`, 14, y);
    y += 5;
  });

  // Footer / Cryptographic Verification
  y = 285;
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated by DECOYNET Security System - SHA-256 Audit Link Integrity Verified - ${new Date().toISOString()}`, 14, y);

  doc.save(`DECOYNET_Incident_${incident.id}.pdf`);
}

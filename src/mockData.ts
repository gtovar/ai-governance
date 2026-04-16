import { Workspace, Checkpoint, Obligation, Decision, PolicyPack, TelemetryTrace, Evidence } from './types';

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Core Banking API',
    owner: 'Architect Team',
    status: 'ACTIVE',
    type: 'API_SERVICE',
    activeCheckpointId: 'cp-1',
    lastDecisionOutcome: 'ALLOW',
    riskLevel: 'MEDIUM',
    description: 'Main API for core banking operations and transactions.',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ws-2',
    name: 'Auth Service',
    owner: 'Security Team',
    status: 'BLOCKED',
    type: 'IDENTITY_SERVICE',
    activeCheckpointId: 'cp-2',
    lastDecisionOutcome: 'DENY',
    riskLevel: 'CRITICAL',
    description: 'Identity and access management service.',
    blockedReason: 'Critical vulnerability in dependency lib-auth-v2. Missing SOC2 compliance evidence.',
    createdAt: '2024-01-20T11:30:00Z',
  },
  {
    id: 'ws-3',
    name: 'Payment Gateway',
    owner: 'Fintech Ops',
    status: 'ACTIVE',
    type: 'PAYMENT_PROCESSOR',
    activeCheckpointId: 'cp-3',
    lastDecisionOutcome: 'ALLOW',
    riskLevel: 'HIGH',
    description: 'External payment processing integration.',
    createdAt: '2024-02-05T09:15:00Z',
  },
  {
    id: 'ws-4',
    name: 'Data Warehouse',
    owner: 'Data Engineering',
    status: 'ACTIVE',
    type: 'DATA_STORAGE',
    activeCheckpointId: 'cp-4',
    lastDecisionOutcome: 'ALLOW',
    riskLevel: 'LOW',
    description: 'Centralized data storage for analytics.',
    createdAt: '2024-02-10T14:00:00Z',
  },
  {
    id: 'ws-5',
    name: 'Mobile App Backend',
    owner: 'Mobile Team',
    status: 'PENDING',
    type: 'BACKEND_SERVICE',
    activeCheckpointId: 'cp-5',
    lastDecisionOutcome: 'REQUIRE_EVIDENCE',
    riskLevel: 'MEDIUM',
    description: 'Backend services for iOS and Android applications.',
    createdAt: '2024-03-01T16:45:00Z',
  },
  {
    id: 'ws-6',
    name: 'Legacy CRM',
    owner: 'Maintenance Group',
    status: 'ACTIVE',
    type: 'LEGACY_SYSTEM',
    activeCheckpointId: 'cp-6',
    lastDecisionOutcome: 'WARNING',
    riskLevel: 'HIGH',
    description: 'Old customer relationship management system.',
    createdAt: '2023-11-12T08:00:00Z',
  },
  {
    id: 'ws-7',
    name: 'Notification Engine',
    owner: 'Platform Team',
    status: 'ACTIVE',
    type: 'INFRASTRUCTURE',
    activeCheckpointId: 'cp-7',
    lastDecisionOutcome: 'ALLOW',
    riskLevel: 'LOW',
    description: 'Service for sending push, email, and SMS notifications.',
    createdAt: '2024-03-15T10:20:00Z',
  },
  {
    id: 'ws-8',
    name: 'Inventory Sync',
    owner: 'Supply Chain',
    status: 'ACTIVE',
    type: 'INTEGRATION_SERVICE',
    activeCheckpointId: 'cp-8',
    lastDecisionOutcome: 'ADVISE',
    riskLevel: 'MEDIUM',
    description: 'Real-time inventory synchronization across warehouses.',
    createdAt: '2024-03-20T13:10:00Z',
  },
];

export const mockCheckpoints: Checkpoint[] = [
  {
    id: 'cp-1',
    workspaceId: 'ws-1',
    name: 'Production Readiness Review',
    status: 'OPEN',
    openedAt: '2024-04-01T09:00:00Z',
    responsible: 'Gilberto Tovar',
    evidenceRequired: ['Security Scan Report', 'Load Test Results'],
  },
  {
    id: 'cp-2',
    workspaceId: 'ws-2',
    name: 'Security Audit Q2',
    status: 'BLOCKED',
    openedAt: '2024-04-05T10:30:00Z',
    responsible: 'Sarah Connor',
    evidenceRequired: ['Penetration Test', 'Compliance Doc'],
  },
  // ... more checkpoints can be added if needed, but 15 requested
];

// Generate more checkpoints to reach 15
for (let i = 3; i <= 15; i++) {
  mockCheckpoints.push({
    id: `cp-${i}`,
    workspaceId: `ws-${(i % 8) + 1}`,
    name: `Checkpoint ${i} - Phase ${Math.ceil(i / 3)}`,
    status: i % 4 === 0 ? 'CLOSED' : 'OPEN',
    openedAt: `2024-03-${10 + i}T10:00:00Z`,
    closedAt: i % 4 === 0 ? `2024-04-${10 + i}T15:00:00Z` : undefined,
    responsible: ['Alice Smith', 'Bob Jones', 'Charlie Brown'][i % 3],
    evidenceRequired: ['Architecture Diagram', 'Test Coverage'],
  });
}

export const mockObligations: Obligation[] = [
  {
    id: 'ob-1',
    title: 'Update Security Patches',
    type: 'SECURITY',
    severity: 'HIGH',
    workspaceId: 'ws-1',
    checkpointId: 'cp-1',
    owner: 'DevOps Team',
    status: 'OPEN',
    evidenceRequired: ['Patch Log'],
    dueDate: '2024-04-30T23:59:59Z',
    description: 'Critical security patches must be applied to all base images.',
    reasonForOpening: 'Detected outdated libraries in container scan.',
  },
  {
    id: 'ob-2',
    title: 'Load Testing for 10k CCU',
    type: 'PERFORMANCE',
    severity: 'MEDIUM',
    workspaceId: 'ws-1',
    checkpointId: 'cp-1',
    owner: 'QA Team',
    status: 'SATISFIED',
    evidenceRequired: ['JMeter Report'],
    dueDate: '2024-04-25T23:59:59Z',
    description: 'Verify the system can handle 10,000 concurrent users.',
    reasonForOpening: 'Scaling requirement for upcoming marketing campaign.',
  },
];

// Generate more obligations to reach 25
for (let i = 3; i <= 25; i++) {
  mockObligations.push({
    id: `ob-${i}`,
    title: `Obligation ${i} - ${['Compliance', 'Quality', 'Security', 'Ops'][i % 4]}`,
    type: ['COMPLIANCE', 'QUALITY', 'SECURITY', 'OPERATIONAL'][i % 4],
    severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4] as any,
    workspaceId: `ws-${(i % 8) + 1}`,
    checkpointId: `cp-${(i % 15) + 1}`,
    owner: ['Team Alpha', 'Team Beta', 'Team Gamma'][i % 3],
    status: i % 3 === 0 ? 'SATISFIED' : i % 5 === 0 ? 'WAIVED' : 'OPEN',
    evidenceRequired: ['Document PDF', 'Screenshot'],
    dueDate: `2024-05-${(i % 28) + 1}T12:00:00Z`,
    description: `Standard requirement for ${['data privacy', 'code quality', 'infrastructure', 'monitoring'][i % 4]}.`,
    reasonForOpening: 'Automated governance rule trigger.',
  });
}

export const mockDecisions: Decision[] = [
  {
    id: 'dec-1',
    timestamp: '2024-04-10T14:20:00Z',
    intentId: 'int-101',
    workspaceId: 'ws-1',
    actor: 'system-kernel',
    outcome: 'ALLOW',
    reasonCodes: ['POLICY_PASSED', 'EVIDENCE_VALIDATED'],
    obligationIds: [],
    checkpointId: 'cp-1',
    policyRefs: ['pp-1', 'pp-3'],
    traceId: 'tr-1',
    payload: { action: 'DEPLOY', target: 'PROD' },
    context: { environment: 'production', branch: 'main' },
  },
  {
    id: 'dec-2',
    timestamp: '2024-04-12T09:15:00Z',
    intentId: 'int-102',
    workspaceId: 'ws-2',
    actor: 'admin-user',
    outcome: 'DENY',
    reasonCodes: ['MISSING_SECURITY_SCAN', 'CRITICAL_VULNERABILITY'],
    obligationIds: ['ob-3', 'ob-4'],
    checkpointId: 'cp-2',
    policyRefs: ['pp-1', 'pp-2'],
    traceId: 'tr-2',
    payload: { action: 'MERGE_PR', prId: '456' },
    context: { repository: 'auth-service', risk_score: 85 },
  },
];

// Generate more decisions to reach 40
for (let i = 3; i <= 40; i++) {
  const outcomes: any[] = ['ALLOW', 'DENY', 'REQUIRE_EVIDENCE', 'ADVISE', 'WARNING'];
  const wsId = `ws-${(i % 8) + 1}`;
  const ppId = `pp-${(i % 5) + 1}`;
  mockDecisions.push({
    id: `dec-${i}`,
    timestamp: `2024-04-${(i % 15) + 1}T${10 + (i % 12)}:00:00Z`,
    intentId: `int-${200 + i}`,
    workspaceId: wsId,
    actor: i % 2 === 0 ? 'system-kernel' : 'operator-x',
    outcome: outcomes[i % 5],
    reasonCodes: ['RULE_CHECK', 'CONTEXT_EVAL'],
    obligationIds: i % 5 === 2 ? [`ob-${i}`] : [],
    checkpointId: `cp-${(i % 15) + 1}`,
    policyRefs: [ppId],
    traceId: `tr-${i}`,
    payload: { action: 'UPDATE_CONFIG', key: 'max_retries' },
    context: { source: 'cli', version: '1.2.0' },
  });
}

export const mockPolicyPacks: PolicyPack[] = [
  {
    id: 'pp-1',
    name: 'Standard Security Baseline',
    version: '2.4.0',
    status: 'ACTIVE',
    scope: 'GLOBAL',
    lastUpdated: '2024-03-01T10:00:00Z',
    rules: [
      { id: 'r-1', name: 'No Public S3 Buckets', mode: 'BLOCKING', active: true, description: 'Prevents creation of publicly accessible storage.' },
      { id: 'r-2', name: 'MFA Required', mode: 'BLOCKING', active: true, description: 'All administrative actions require multi-factor authentication.' },
      { id: 'r-3', name: 'Log Retention > 90 Days', mode: 'WARNING', active: true, description: 'Ensures audit logs are kept for at least 3 months.' },
    ],
  },
  {
    id: 'pp-2',
    name: 'Fintech Compliance Pack',
    version: '1.1.2',
    status: 'ACTIVE',
    scope: 'FINANCE_WS',
    lastUpdated: '2024-03-15T14:30:00Z',
    rules: [
      { id: 'r-4', name: 'PCI-DSS Data Encryption', mode: 'BLOCKING', active: true, description: 'All cardholder data must be encrypted at rest.' },
      { id: 'r-5', name: 'Transaction Limit Check', mode: 'ADVISORY', active: true, description: 'Warns if transaction limits are set too high.' },
    ],
  },
  {
    id: 'pp-3',
    name: 'Cloud Native Best Practices',
    version: '3.0.1',
    status: 'ACTIVE',
    scope: 'K8S_WS',
    lastUpdated: '2024-04-01T08:00:00Z',
    rules: [
      { id: 'r-6', name: 'Resource Limits Defined', mode: 'WARNING', active: true, description: 'All containers must have CPU/Memory limits.' },
      { id: 'r-7', name: 'Read-Only Root Filesystem', mode: 'BLOCKING', active: false, description: 'Enforce immutable container filesystems.' },
    ],
  },
  {
    id: 'pp-4',
    name: 'Data Privacy (GDPR/LGPD)',
    version: '1.0.0',
    status: 'INACTIVE',
    scope: 'DATA_WS',
    lastUpdated: '2024-02-20T11:00:00Z',
    rules: [
      { id: 'r-8', name: 'PII Masking', mode: 'BLOCKING', active: true, description: 'Mask personally identifiable information in logs.' },
    ],
  },
  {
    id: 'pp-5',
    name: 'Experimental Governance',
    version: '0.5.0-beta',
    status: 'PENDING',
    scope: 'SANDBOX',
    lastUpdated: '2024-04-10T16:00:00Z',
    rules: [
      { id: 'r-9', name: 'AI Decision Audit', mode: 'ADVISORY', active: true, description: 'Audit all decisions made by AI models.' },
    ],
  },
];

export const mockTelemetry: TelemetryTrace[] = [];
for (let i = 1; i <= 40; i++) {
  const decision = mockDecisions.find(d => d.id === `dec-${i}`);
  if (decision) {
    mockTelemetry.push({
      id: decision.traceId,
      timestamp: decision.timestamp,
      decisionId: decision.id,
      latencyMs: 45 + Math.random() * 200,
      outcome: decision.outcome,
      workspaceId: decision.workspaceId,
      error: i % 10 === 0 ? 'Timeout evaluating policy' : undefined,
    });
  }
}

export const mockEvidence: Evidence[] = [
  {
    id: 'ev-1',
    obligationId: 'ob-1',
    title: 'Security Patch Log - April 2024',
    type: 'LOG',
    url: '#',
    uploadedAt: '2024-04-10T10:00:00Z',
    uploadedBy: 'DevOps Team',
  },
  {
    id: 'ev-2',
    obligationId: 'ob-2',
    title: 'Load Test Results - 10k CCU',
    type: 'REPORT',
    url: '#',
    uploadedAt: '2024-04-12T15:30:00Z',
    uploadedBy: 'QA Team',
  },
  {
    id: 'ev-3',
    obligationId: 'ob-3',
    title: 'Penetration Test Report Q2',
    type: 'REPORT',
    url: '#',
    uploadedAt: '2024-04-14T09:00:00Z',
    uploadedBy: 'Security Team',
  },
];

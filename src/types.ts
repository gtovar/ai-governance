export type DecisionOutcome = 'ALLOW' | 'DENY' | 'REQUIRE_EVIDENCE' | 'ADVISE' | 'WARNING';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED' | 'BLOCKED' | 'OPEN' | 'CLOSED' | 'SATISFIED' | 'WAIVED';

export interface Workspace {
  id: string;
  name: string;
  owner: string;
  status: Status;
  type: string;
  activeCheckpointId: string;
  lastDecisionOutcome: DecisionOutcome;
  riskLevel: Severity;
  description: string;
  blockedReason?: string;
  createdAt: string;
}

export interface Checkpoint {
  id: string;
  workspaceId: string;
  name: string;
  status: Status;
  openedAt: string;
  closedAt?: string;
  responsible: string;
  obligationIds: string[];
  evidenceRequired: string[];
  decisionIds: string[];
}

export interface Obligation {
  id: string;
  title: string;
  type: string;
  severity: Severity;
  workspaceId: string;
  checkpointId: string;
  owner: string;
  status: Status;
  evidenceRequired: string[];
  dueDate: string;
  description: string;
  reasonForOpening: string;
}

export interface Evidence {
  id: string;
  obligationId: string;
  title: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Decision {
  id: string;
  timestamp: string;
  intentId: string;
  workspaceId: string;
  actor: string;
  outcome: DecisionOutcome;
  reasonCodes: string[];
  obligationIds: string[];
  policyRefs: string[];
  traceId: string;
  payload: any;
  context: any;
}

export interface PolicyPack {
  id: string;
  name: string;
  version: string;
  status: Status;
  scope: string;
  lastUpdated: string;
  rules: PolicyRule[];
}

export interface PolicyRule {
  id: string;
  name: string;
  mode: 'BLOCKING' | 'WARNING' | 'ADVISORY';
  active: boolean;
  description: string;
}

export interface TelemetryTrace {
  id: string;
  timestamp: string;
  decisionId: string;
  latencyMs: number;
  outcome: DecisionOutcome;
  workspaceId: string;
  error?: string;
}

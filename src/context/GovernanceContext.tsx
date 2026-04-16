import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Workspace, 
  Checkpoint, 
  Obligation, 
  Decision, 
  PolicyPack, 
  TelemetryTrace, 
  Evidence,
  DecisionOutcome
} from '../types';
import { 
  mockWorkspaces, 
  mockCheckpoints, 
  mockObligations, 
  mockDecisions, 
  mockPolicyPacks, 
  mockTelemetry, 
  mockEvidence 
} from '../mockData';

interface GovernanceContextType {
  workspaces: Workspace[];
  checkpoints: Checkpoint[];
  obligations: Obligation[];
  decisions: Decision[];
  policyPacks: PolicyPack[];
  telemetry: TelemetryTrace[];
  evidence: Evidence[];
  
  // Actions
  satisfyObligation: (id: string) => void;
  waiveObligation: (id: string) => void;
  requestCheckpointClosure: (id: string) => void;
  runEvaluation: (workspaceId: string) => void;
  addEvidence: (obligationId: string, title: string, type: string) => void;
  createWorkspace: (workspace: Partial<Workspace>) => void;

  // Selectors
  getWorkspaceObligations: (workspaceId: string) => Obligation[];
  getWorkspaceCheckpoints: (workspaceId: string) => Checkpoint[];
  getWorkspaceDecisions: (workspaceId: string) => Decision[];
  getObligationEvidence: (obligationId: string) => Evidence[];
  getCheckpointReadiness: (checkpointId: string) => number;
  isCheckpointClosable: (checkpointId: string) => { closable: boolean; reasons: string[] };
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(mockCheckpoints);
  const [obligations, setObligations] = useState<Obligation[]>(mockObligations);
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);
  const [policyPacks, setPolicyPacks] = useState<PolicyPack[]>(mockPolicyPacks);
  const [telemetry, setTelemetry] = useState<TelemetryTrace[]>(mockTelemetry);
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence);

  // Selectors
  const getWorkspaceObligations = useCallback((workspaceId: string) => {
    return obligations.filter(o => o.workspaceId === workspaceId);
  }, [obligations]);

  const getWorkspaceCheckpoints = useCallback((workspaceId: string) => {
    return checkpoints.filter(c => c.workspaceId === workspaceId);
  }, [checkpoints]);

  const getWorkspaceDecisions = useCallback((workspaceId: string) => {
    return decisions.filter(d => d.workspaceId === workspaceId);
  }, [decisions]);

  const getObligationEvidence = useCallback((obligationId: string) => {
    return evidence.filter(e => e.obligationId === obligationId);
  }, [evidence]);

  const getCheckpointReadiness = useCallback((checkpointId: string) => {
    const cpObligations = obligations.filter(o => o.checkpointId === checkpointId);
    if (cpObligations.length === 0) return 100;
    const satisfied = cpObligations.filter(o => o.status === 'SATISFIED' || o.status === 'WAIVED').length;
    return Math.round((satisfied / cpObligations.length) * 100);
  }, [obligations]);

  const isCheckpointClosable = useCallback((checkpointId: string) => {
    const cp = checkpoints.find(c => c.id === checkpointId);
    if (!cp) return { closable: false, reasons: ['Checkpoint not found'] };

    const cpObligations = obligations.filter(o => o.checkpointId === checkpointId);
    const openObligations = cpObligations.filter(o => o.status === 'OPEN');
    
    const reasons: string[] = [];
    if (openObligations.length > 0) {
      reasons.push(`${openObligations.length} open obligations remain`);
    }

    // Check if all required evidence types are present across obligations
    const requiredEvidence = cp.evidenceRequired;
    const providedEvidenceTypes = new Set(
      evidence
        .filter(e => cpObligations.some(o => o.id === e.obligationId))
        .map(e => e.type)
    );

    const missingEvidence = requiredEvidence.filter(req => !providedEvidenceTypes.has(req));
    if (missingEvidence.length > 0) {
      reasons.push(`Missing evidence: ${missingEvidence.join(', ')}`);
    }

    return {
      closable: reasons.length === 0,
      reasons
    };
  }, [checkpoints, obligations, evidence]);

  const addDecision = useCallback((decision: Decision) => {
    setDecisions(prev => [decision, ...prev]);
    
    // Add telemetry for the decision
    const trace: TelemetryTrace = {
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: decision.timestamp,
      decisionId: decision.id,
      latencyMs: 50 + Math.random() * 150,
      outcome: decision.outcome,
      workspaceId: decision.workspaceId,
    };
    setTelemetry(prev => [trace, ...prev]);

    // Update workspace last decision outcome
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === decision.workspaceId) {
        return { ...ws, lastDecisionOutcome: decision.outcome };
      }
      return ws;
    }));
  }, []);

  const satisfyObligation = useCallback((id: string) => {
    const ob = obligations.find(o => o.id === id);
    if (!ob) return;

    setObligations(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: 'SATISFIED' };
      }
      return o;
    }));

    // Log a decision for satisfying obligation
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      intentId: `int-satisfy-${id}`,
      workspaceId: ob.workspaceId,
      actor: 'Current User',
      outcome: 'ALLOW',
      reasonCodes: ['OBLIGATION_SATISFIED'],
      obligationIds: [id],
      policyRefs: ['pp-1'],
      traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
      payload: { action: 'SATISFY_OBLIGATION', obligationId: id },
      context: { source: 'governance-ui' }
    };
    addDecision(newDecision);
  }, [obligations, addDecision]);

  const waiveObligation = useCallback((id: string) => {
    const ob = obligations.find(o => o.id === id);
    if (!ob) return;

    setObligations(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: 'WAIVED' };
      }
      return o;
    }));

    // Log a decision for waiving obligation
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      intentId: `int-waive-${id}`,
      workspaceId: ob.workspaceId,
      actor: 'Current User',
      outcome: 'WARNING',
      reasonCodes: ['OBLIGATION_WAIVED', 'RISK_ACCEPTED'],
      obligationIds: [id],
      policyRefs: ['pp-1'],
      traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
      payload: { action: 'WAIVE_OBLIGATION', obligationId: id },
      context: { source: 'governance-ui' }
    };
    addDecision(newDecision);
  }, [obligations, addDecision]);

  const requestCheckpointClosure = useCallback((id: string) => {
    const cp = checkpoints.find(c => c.id === id);
    if (!cp) return;

    const { closable, reasons } = isCheckpointClosable(id);

    if (closable) {
      setCheckpoints(prev => prev.map(c => {
        if (c.id === id) {
          return { ...c, status: 'CLOSED', closedAt: new Date().toISOString() };
        }
        return c;
      }));
      
      const newDecision: Decision = {
        id: `dec-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        intentId: `int-closure-${id}`,
        workspaceId: cp.workspaceId,
        actor: 'system-kernel',
        outcome: 'ALLOW',
        reasonCodes: ['CHECKPOINT_CLOSED', 'OBLIGATIONS_MET'],
        obligationIds: [],
        policyRefs: ['pp-1'],
        traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
        payload: { action: 'CLOSE_CHECKPOINT', checkpointId: id },
        context: { source: 'governance-ui' }
      };
      addDecision(newDecision);
    } else {
      // Create a DENY or REQUIRE_EVIDENCE decision if not closable
      const outcome: DecisionOutcome = reasons.some(r => r.includes('Missing evidence')) ? 'REQUIRE_EVIDENCE' : 'DENY';
      
      const newDecision: Decision = {
        id: `dec-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        intentId: `int-closure-fail-${id}`,
        workspaceId: cp.workspaceId,
        actor: 'system-kernel',
        outcome: outcome,
        reasonCodes: ['CHECKPOINT_CLOSURE_REJECTED', ...reasons.map(r => r.toUpperCase().replace(/ /g, '_'))],
        obligationIds: obligations.filter(o => o.checkpointId === id && o.status === 'OPEN').map(o => o.id),
        policyRefs: ['pp-1'],
        traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
        payload: { action: 'CLOSE_CHECKPOINT_REQUEST', checkpointId: id, failureReasons: reasons },
        context: { source: 'governance-ui' }
      };
      addDecision(newDecision);
    }
  }, [checkpoints, obligations, isCheckpointClosable, addDecision]);

  const runEvaluation = useCallback((workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (!ws) return;

    const wsObligations = obligations.filter(o => o.workspaceId === workspaceId);
    const openObligations = wsObligations.filter(o => o.status === 'OPEN');

    // Simulate an evaluation
    const outcome: DecisionOutcome = openObligations.length > 0 ? 'WARNING' : 'ALLOW';
    
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      intentId: `int-eval-${workspaceId}`,
      workspaceId: workspaceId,
      actor: 'system-kernel',
      outcome: outcome,
      reasonCodes: outcome === 'ALLOW' ? ['ALL_POLICIES_PASSED'] : ['OPEN_OBLIGATIONS_EXIST'],
      obligationIds: openObligations.map(o => o.id),
      policyRefs: ['pp-1', 'pp-2', 'pp-3'],
      traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
      payload: { action: 'MANUAL_EVALUATION' },
      context: { source: 'governance-ui' }
    };

    addDecision(newDecision);
    
    // Update workspace status if needed
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return { ...w, status: 'ACTIVE' };
      }
      return w;
    }));
  }, [workspaces, obligations, addDecision]);

  const addEvidence = useCallback((obligationId: string, title: string, type: string) => {
    const ob = obligations.find(o => o.id === obligationId);
    if (!ob) return;

    const newEvidence: Evidence = {
      id: `ev-${Math.random().toString(36).substr(2, 9)}`,
      obligationId,
      title,
      type,
      url: '#',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    };
    setEvidence(prev => [...prev, newEvidence]);

    // Log a decision for adding evidence
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      intentId: `int-evidence-${obligationId}`,
      workspaceId: ob.workspaceId,
      actor: 'Current User',
      outcome: 'ADVISE',
      reasonCodes: ['EVIDENCE_UPLOADED'],
      obligationIds: [obligationId],
      policyRefs: ['pp-1'],
      traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
      payload: { action: 'ADD_EVIDENCE', obligationId, evidenceTitle: title },
      context: { source: 'governance-ui' }
    };
    addDecision(newDecision);
  }, [obligations, addDecision]);

  const createWorkspace = useCallback((workspace: Partial<Workspace>) => {
    const newWs: Workspace = {
      id: `ws-${Math.random().toString(36).substr(2, 9)}`,
      name: workspace.name || 'New Workspace',
      owner: workspace.owner || 'Default Owner',
      status: 'PENDING',
      type: workspace.type || 'SERVICE',
      activeCheckpointId: '',
      lastDecisionOutcome: 'ADVISE',
      riskLevel: workspace.riskLevel || 'MEDIUM',
      description: workspace.description || '',
      createdAt: new Date().toISOString(),
    };
    setWorkspaces(prev => [newWs, ...prev]);
  }, []);

  return (
    <GovernanceContext.Provider value={{
      workspaces,
      checkpoints,
      obligations,
      decisions,
      policyPacks,
      telemetry,
      evidence,
      satisfyObligation,
      waiveObligation,
      requestCheckpointClosure,
      runEvaluation,
      addEvidence,
      createWorkspace,
      getWorkspaceObligations,
      getWorkspaceCheckpoints,
      getWorkspaceDecisions,
      getObligationEvidence,
      getCheckpointReadiness,
      isCheckpointClosable
    }}>
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
}

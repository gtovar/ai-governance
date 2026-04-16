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
  }, []);

  const satisfyObligation = useCallback((id: string) => {
    setObligations(prev => prev.map(ob => {
      if (ob.id === id) {
        return { ...ob, status: 'SATISFIED' };
      }
      return ob;
    }));

    // Update workspace counts
    const ob = obligations.find(o => o.id === id);
    if (ob) {
      setWorkspaces(prev => prev.map(ws => {
        if (ws.id === ob.workspaceId) {
          return { ...ws, openObligationsCount: Math.max(0, ws.openObligationsCount - 1) };
        }
        return ws;
      }));
    }
  }, [obligations]);

  const waiveObligation = useCallback((id: string) => {
    setObligations(prev => prev.map(ob => {
      if (ob.id === id) {
        return { ...ob, status: 'WAIVED' };
      }
      return ob;
    }));

    // Update workspace counts
    const ob = obligations.find(o => o.id === id);
    if (ob) {
      setWorkspaces(prev => prev.map(ws => {
        if (ws.id === ob.workspaceId) {
          return { ...ws, openObligationsCount: Math.max(0, ws.openObligationsCount - 1) };
        }
        return ws;
      }));
    }
  }, [obligations]);

  const requestCheckpointClosure = useCallback((id: string) => {
    setCheckpoints(prev => prev.map(cp => {
      if (cp.id === id) {
        return { ...cp, status: 'CLOSED', closedAt: new Date().toISOString() };
      }
      return cp;
    }));
    
    // Log a decision for closure
    const cp = checkpoints.find(c => c.id === id);
    if (cp) {
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
    }
  }, [checkpoints, addDecision]);

  const runEvaluation = useCallback((workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (!ws) return;

    // Simulate an evaluation
    const outcome: DecisionOutcome = ws.openObligationsCount > 0 ? 'WARNING' : 'ALLOW';
    
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      intentId: `int-eval-${workspaceId}`,
      workspaceId: workspaceId,
      actor: 'system-kernel',
      outcome: outcome,
      reasonCodes: outcome === 'ALLOW' ? ['ALL_POLICIES_PASSED'] : ['OPEN_OBLIGATIONS_EXIST'],
      obligationIds: obligations.filter(o => o.workspaceId === workspaceId && o.status === 'OPEN').map(o => o.id),
      policyRefs: ['pp-1', 'pp-2', 'pp-3'],
      traceId: `tr-${Math.random().toString(36).substr(2, 9)}`,
      payload: { action: 'MANUAL_EVALUATION' },
      context: { source: 'governance-ui' }
    };

    addDecision(newDecision);
    
    // Update workspace status if needed
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return { ...w, lastDecisionOutcome: outcome, status: 'ACTIVE' };
      }
      return w;
    }));
  }, [workspaces, obligations, addDecision]);

  const addEvidence = useCallback((obligationId: string, title: string, type: string) => {
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
  }, []);

  const createWorkspace = useCallback((workspace: Partial<Workspace>) => {
    const newWs: Workspace = {
      id: `ws-${Math.random().toString(36).substr(2, 9)}`,
      name: workspace.name || 'New Workspace',
      owner: workspace.owner || 'Default Owner',
      status: 'PENDING',
      type: workspace.type || 'SERVICE',
      activeCheckpointId: '',
      openObligationsCount: 0,
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
      createWorkspace
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

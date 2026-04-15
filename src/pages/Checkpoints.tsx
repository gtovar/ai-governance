import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockCheckpoints, mockWorkspaces, mockObligations, mockDecisions } from '../mockData';
import { StatusBadge, OutcomeBadge } from '../components/Badges';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  FileText, 
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export function Checkpoints() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<'SUCCESS' | 'FAILURE' | null>(null);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);

  const handleSimulateClose = (id: string) => {
    setIsSimulating(true);
    setSimulationResult(null);
    setSelectedCheckpointId(id);
    
    // Simulate system evaluation
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult(id === 'cp-1' ? 'SUCCESS' : 'FAILURE');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Checkpoints</h2>
          <p className="text-muted-foreground">Operational gates and readiness evaluations.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white text-xs h-9">
          Initiate New Checkpoint
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockCheckpoints.map((cp) => {
          const workspace = mockWorkspaces.find(w => w.id === cp.workspaceId);
          const obligations = mockObligations.filter(o => cp.obligationIds.includes(o.id));
          const satisfiedObligations = obligations.filter(o => o.status === 'SATISFIED').length;
          const progress = cp.status === 'CLOSED' ? 100 : Math.round((satisfiedObligations / obligations.length) * 100) || 30;

          return (
            <Card key={cp.id} className="bg-surface border-border hover:border-accent/30 transition-all duration-300 group overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                          {cp.name}
                        </CardTitle>
                        <StatusBadge status={cp.status} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-bold text-foreground/80">{workspace?.name}</span>
                        <span>•</span>
                        <span>ID: {cp.id}</span>
                        <span>•</span>
                        <span>Opened {new Date(cp.openedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Responsible</p>
                      <p className="text-xs font-medium text-foreground">{cp.responsible}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider">Operational Readiness</span>
                        <span className="text-foreground font-mono font-bold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-card" />
                      <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={cn("w-3 h-3", satisfiedObligations === obligations.length ? "text-success" : "text-muted-foreground")} />
                          <span className="text-[10px] text-muted-foreground">{satisfiedObligations}/{obligations.length} Obligations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">2/{cp.evidenceRequired.length} Evidence Items</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Required Evidence</p>
                      <ul className="space-y-1">
                        {cp.evidenceRequired.slice(0, 2).map((ev, i) => (
                          <li key={i} className="text-[10px] text-foreground/70 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent" />
                            {ev}
                          </li>
                        ))}
                        {cp.evidenceRequired.length > 2 && (
                          <li className="text-[10px] text-muted-foreground italic">+{cp.evidenceRequired.length - 2} more...</li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Latest Decision</p>
                      {cp.decisionIds.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <OutcomeBadge outcome={mockDecisions.find(d => d.id === cp.decisionIds[0])?.outcome || 'ALLOW'} />
                          <span className="text-[10px] font-mono text-muted-foreground">tr-eval-99</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No evaluations yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-card/30 border-l border-border p-6 flex flex-col justify-center gap-3 min-w-[220px]">
                  {cp.status === 'OPEN' ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-accent hover:bg-accent/90 text-white text-xs h-9 gap-2" 
                            onClick={() => handleSimulateClose(cp.id)}
                          >
                            Request Closure
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border text-foreground sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Governance Kernel Evaluation</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Evaluating operational readiness for <span className="text-accent font-mono">{cp.name}</span>
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-6 flex flex-col items-center justify-center space-y-6">
                            {isSimulating ? (
                              <div className="flex flex-col items-center gap-4 py-8">
                                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                                <div className="text-center">
                                  <p className="text-sm font-bold text-foreground">Running Policy Evaluation</p>
                                  <p className="text-xs text-muted-foreground mt-1">Checking obligations, evidence, and risk context...</p>
                                </div>
                              </div>
                            ) : simulationResult === 'SUCCESS' ? (
                              <div className="w-full space-y-6">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                                    <ShieldCheck className="w-8 h-8" />
                                  </div>
                                  <div className="text-center">
                                    <h4 className="text-xl font-bold text-success">Outcome: ALLOW</h4>
                                    <p className="text-sm text-muted-foreground">All governance requirements satisfied.</p>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Reason Code</span>
                                    <span className="text-success font-mono font-bold">GOVERNANCE_PASSED</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Evidence Validated</span>
                                    <span className="text-foreground/80 font-mono">100% (4/4)</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Trace ID</span>
                                    <span className="text-foreground/80 font-mono">tr-eval-9922</span>
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Recommended Next Action</p>
                                  <p className="text-xs text-foreground/80">Confirm closure to promote workspace to the next phase.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full space-y-6">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
                                    <XCircle className="w-8 h-8" />
                                  </div>
                                  <div className="text-center">
                                    <h4 className="text-xl font-bold text-error">Outcome: DENY</h4>
                                    <p className="text-sm text-muted-foreground">Governance requirements not met.</p>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-error font-bold">MISSING_EVIDENCE</span>
                                    <span className="text-foreground/80 font-mono">ob-3, ob-4</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Policy Violation</span>
                                    <span className="text-error font-mono">SEC-BLOCK-01</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Trace ID</span>
                                    <span className="text-foreground/80 font-mono">tr-eval-4411</span>
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                                  <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">Recommended Next Action</p>
                                  <p className="text-xs text-foreground/80">Satisfy pending obligations and upload required evidence before re-evaluating.</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <DialogFooter className="gap-2">
                            <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs" onClick={() => setSimulationResult(null)}>
                              Close
                            </Button>
                            {!isSimulating && simulationResult === 'SUCCESS' && (
                              <Button className="bg-success hover:bg-success/90 text-white text-xs">
                                Confirm Closure
                              </Button>
                            )}
                            {!isSimulating && simulationResult === 'FAILURE' && (
                              <Button className="bg-accent hover:bg-accent/90 text-white text-xs">
                                View Missing Evidence
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-card text-xs h-9">
                        View Operational Cockpit
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">Checkpoint Closed</p>
                        <p className="text-[10px] text-muted-foreground">Audit Trail Verified</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 text-[10px] h-auto p-0">
                        View Decision History
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGovernance } from '../context/GovernanceContext';
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
  XCircle,
  ArrowLeft,
  Activity,
  ExternalLink,
  Shield
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
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ComingSoon } from '../components/ComingSoon';

export function Checkpoints() {
  const navigate = useNavigate();
  const { checkpoints, workspaces, getCheckpointReadiness, getObligationsByCheckpoint, getDecisionsByCheckpoint } = useGovernance();
  const [comingSoon, setComingSoon] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Checkpoints</h2>
          <p className="text-muted-foreground">Operational gates and readiness evaluations.</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-white text-xs h-9"
          onClick={() => setComingSoon({ open: true, feature: 'Initiate New Checkpoint' })}
        >
          Initiate New Checkpoint
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {checkpoints.map((cp) => {
          const workspace = workspaces.find(w => w.id === cp.workspaceId);
          const progress = getCheckpointReadiness(cp.id);
          const cpObligations = getObligationsByCheckpoint(cp.id);
          const satisfiedObligationsCount = cpObligations.filter(o => o.status === 'SATISFIED' || o.status === 'WAIVED').length;

          return (
            <Card key={cp.id} className="bg-surface border-border hover:border-accent/30 transition-all duration-300 group overflow-hidden cursor-pointer" onClick={() => navigate(`/checkpoints/${cp.id}`)}>
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
                          <CheckCircle2 className={cn("w-3 h-3", satisfiedObligationsCount === cpObligations.length ? "text-success" : "text-muted-foreground")} />
                          <span className="text-[10px] text-muted-foreground">{satisfiedObligationsCount}/{cpObligations.length} Obligations</span>
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
                      {(() => {
                        const latestDecision = getDecisionsByCheckpoint(cp.id)
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                        return latestDecision ? (
                          <div className="flex items-center gap-2">
                            <OutcomeBadge outcome={latestDecision.outcome} />
                            <span className="text-[10px] font-mono text-muted-foreground">{latestDecision.id}</span>
                          </div>
                        ) : (
                        <span className="text-[10px] text-muted-foreground italic">No evaluations yet</span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="bg-card/30 border-l border-border p-6 flex flex-col justify-center gap-3 min-w-[220px]">
                   <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-card text-xs h-9">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <ComingSoon 
        isOpen={comingSoon.open} 
        onOpenChange={(open) => setComingSoon({ ...comingSoon, open })} 
        featureName={comingSoon.feature} 
      />
    </div>
  );
}

export function CheckpointDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    checkpoints, 
    workspaces, 
    obligations, 
    requestCheckpointClosure,
    getCheckpointReadiness,
    isCheckpointClosable,
    getWorkspaceObligations,
    getObligationEvidence,
    getObligationsByCheckpoint,
    getDecisionsByCheckpoint
  } = useGovernance();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{ outcome: 'ALLOW' | 'DENY' | 'REQUIRE_EVIDENCE'; reasons: string[] } | null>(null);
  const [comingSoon, setComingSoon] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  const cp = checkpoints.find(c => c.id === id);
  if (!cp) return <div className="p-8 text-center text-muted-foreground">Checkpoint not found</div>;

  const workspace = workspaces.find(w => w.id === cp.workspaceId);
  const cpObligations = getObligationsByCheckpoint(cp.id);
  const satisfiedObligationsCount = cpObligations.filter(o => o.status === 'SATISFIED' || o.status === 'WAIVED').length;
  const progress = getCheckpointReadiness(cp.id);

  const handleSimulateClose = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    // Simulate system evaluation using real logic
    setTimeout(() => {
      setIsSimulating(false);
      const { closable, reasons } = isCheckpointClosable(cp.id);
      const outcome = closable ? 'ALLOW' : (reasons.some(r => r.includes('Missing evidence')) ? 'REQUIRE_EVIDENCE' : 'DENY');
      setSimulationResult({ outcome, reasons });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="text-muted-foreground hover:text-foreground -ml-2 gap-2"
        onClick={() => navigate('/checkpoints')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Checkpoints
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground">{cp.name}</h2>
                <StatusBadge status={cp.status} />
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                ID: <span className="font-mono text-accent">{cp.id}</span> • 
                Responsible: <span className="text-foreground font-medium">{cp.responsible}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {cp.status === 'OPEN' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-accent hover:bg-accent/90 text-white text-xs h-9 gap-2" 
                      onClick={handleSimulateClose}
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
                      ) : simulationResult?.outcome === 'ALLOW' ? (
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
                              <span className="text-muted-foreground">Trace ID</span>
                              <span className="text-foreground/80 font-mono">tr-eval-{Math.floor(Math.random() * 9000) + 1000}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full space-y-6">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
                              <XCircle className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-error">Outcome: {simulationResult?.outcome}</h4>
                              <p className="text-sm text-muted-foreground">Governance requirements not met.</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase text-muted-foreground font-bold">Failure Reasons:</p>
                              <ul className="space-y-1">
                                {simulationResult?.reasons.map((reason, i) => (
                                  <li key={i} className="text-xs text-error flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" />
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                              <span className="text-muted-foreground">Trace ID</span>
                              <span className="text-foreground/80 font-mono">tr-eval-{Math.floor(Math.random() * 9000) + 1000}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
 
                    <DialogFooter className="gap-2">
                      <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs" onClick={() => setSimulationResult(null)}>
                        Close
                      </Button>
                      {!isSimulating && simulationResult?.outcome === 'ALLOW' && (
                        <Button 
                          className="bg-success hover:bg-success/90 text-white text-xs"
                          onClick={() => {
                            requestCheckpointClosure(cp.id);
                            navigate('/checkpoints');
                          }}
                        >
                          Confirm Closure
                        </Button>
                      )}
                      {!isSimulating && simulationResult?.outcome && simulationResult.outcome !== 'ALLOW' && (
                        <Button className="bg-accent hover:bg-accent/90 text-white text-xs" onClick={() => navigate('/obligations')}>
                          View Obligations
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Readiness Progress</p>
                  <span className="text-sm font-bold text-foreground font-mono">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-card" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">Obligations</p>
                    <p className="text-sm font-bold text-foreground">{satisfiedObligationsCount}/{cpObligations.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">Evidence</p>
                    <p className="text-sm font-bold text-foreground">2/{cp.evidenceRequired.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace Context</p>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/workspaces/${workspace?.id}`)}>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{workspace?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{workspace?.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Opened</span>
                    <span className="text-foreground font-medium">{new Date(cp.openedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={cp.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Required Obligations
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {cpObligations.map((ob) => (
                <Card key={ob.id} className="bg-surface border-border hover:border-accent/30 transition-colors cursor-pointer" onClick={() => navigate(`/obligations/${ob.id}`)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border",
                        ob.status === 'SATISFIED' ? "bg-success/10 border-success/20 text-success" : "bg-warning/10 border-warning/20 text-warning"
                      )}>
                        {ob.status === 'SATISFIED' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{ob.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ob.type}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Latest Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getDecisionsByCheckpoint(cp.id).length > 0 ? (
                getDecisionsByCheckpoint(cp.id)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((decision) => (
                    <div key={decision.id} className="p-3 rounded-lg bg-card border border-border space-y-2 cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/decision-log/${decision.id}`)}>
                      <div className="flex items-center justify-between">
                        <OutcomeBadge outcome={decision.outcome || 'ALLOW'} />
                        <span className="text-[10px] font-mono text-muted-foreground">{new Date(decision.timestamp || '').toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] font-mono text-foreground/80 truncate">{decision.id}</p>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">No evaluation history</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Evidence Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cp.evidenceRequired.map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-card border border-border">
                  <span className="text-[10px] text-foreground/80">{ev}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-border text-accent hover:text-accent/80 text-[10px] h-8 mt-2"
                onClick={() => setComingSoon({ open: true, feature: 'Upload Evidence' })}
              >
                Upload Evidence
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <ComingSoon 
        isOpen={comingSoon.open} 
        onOpenChange={(open) => setComingSoon({ ...comingSoon, open })} 
        featureName={comingSoon.feature} 
      />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

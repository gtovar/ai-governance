import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockCheckpoints, mockWorkspaces } from '../mockData';
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

  const handleSimulateClose = (id: string) => {
    setIsSimulating(true);
    setSimulationResult(null);
    
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
          <h2 className="text-2xl font-bold text-foreground">Active Checkpoints</h2>
          <p className="text-muted-foreground">Monitor and advance governance gates across workspaces.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white">
          New Checkpoint
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockCheckpoints.map((cp) => {
          const workspace = mockWorkspaces.find(w => w.id === cp.workspaceId);
          const progress = cp.status === 'CLOSED' ? 100 : 65; // Mock progress

          return (
            <Card key={cp.id} className="bg-surface border-border hover:border-accent/50 transition-all duration-300 group overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-foreground group-hover:text-accent transition-colors">
                          {cp.name}
                        </CardTitle>
                        <StatusBadge status={cp.status} />
                      </div>
                      <CardDescription className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium text-foreground/80">{workspace?.name}</span>
                        <span>•</span>
                        <span>Opened {new Date(cp.openedAt).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium uppercase tracking-wider">Completion</span>
                        <span className="text-foreground/80 font-mono">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-card rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            cp.status === 'CLOSED' ? 'bg-success' : 'bg-accent'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-card border border-border">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Responsible</p>
                        <p className="text-sm text-foreground font-medium">{cp.responsible}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-card border border-border">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Evidence</p>
                        <p className="text-sm text-foreground font-medium">{cp.evidenceRequired.length} Items Required</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card/50 border-l border-border p-6 flex flex-col justify-center gap-3 min-w-[200px]">
                  {cp.status === 'OPEN' ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2" onClick={() => handleSimulateClose(cp.id)}>
                            Request Close
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border text-foreground">
                          <DialogHeader>
                            <DialogTitle>Governance Kernel Evaluation</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Evaluating intent for checkpoint <span className="text-accent font-mono">{cp.id}</span>
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-8 flex flex-col items-center justify-center space-y-4">
                            {isSimulating ? (
                              <>
                                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                                <p className="text-sm text-muted-foreground animate-pulse">Running policy evaluation...</p>
                              </>
                            ) : simulationResult === 'SUCCESS' ? (
                              <>
                                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                                  <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="text-center space-y-1">
                                  <h4 className="text-xl font-bold text-success">Outcome: ALLOW</h4>
                                  <p className="text-sm text-muted-foreground">All obligations satisfied. Checkpoint can be closed.</p>
                                </div>
                                <div className="w-full p-4 rounded-lg bg-surface border border-border space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Reason Code</span>
                                    <span className="text-foreground/80 font-mono">POLICY_PASSED</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Trace ID</span>
                                    <span className="text-foreground/80 font-mono">tr-eval-9922</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
                                  <XCircle className="w-8 h-8" />
                                </div>
                                <div className="text-center space-y-1">
                                  <h4 className="text-xl font-bold text-error">Outcome: DENY</h4>
                                  <p className="text-sm text-muted-foreground">Missing evidence for security obligations.</p>
                                </div>
                                <div className="w-full p-4 rounded-lg bg-surface border border-border space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-error font-medium">MISSING_EVIDENCE</span>
                                    <span className="text-foreground/80 font-mono">ob-3, ob-4</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Trace ID</span>
                                    <span className="text-foreground/80 font-mono">tr-eval-4411</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <DialogFooter>
                            <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground" onClick={() => setSimulationResult(null)}>
                              Close
                            </Button>
                            {!isSimulating && simulationResult === 'SUCCESS' && (
                              <Button className="bg-success hover:bg-success/90 text-white">
                                Confirm Closure
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-card">
                        View Details
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">Checkpoint Closed</p>
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        View Audit Log
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

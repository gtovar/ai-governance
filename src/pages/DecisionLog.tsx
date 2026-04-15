import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDecisions, mockWorkspaces, mockCheckpoints, mockObligations, mockPolicyPacks } from '../mockData';
import { OutcomeBadge, SeverityBadge } from '../components/Badges';
import { 
  FileText, 
  Search, 
  Filter, 
  Terminal, 
  Code, 
  Link2, 
  Info,
  ChevronRight,
  Download,
  Activity,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  User,
  Layers
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';

export function DecisionLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string | null>(null);
  const [actorFilter, setActorFilter] = useState<string | null>(null);
  const [workspaceFilter, setWorkspaceFilter] = useState<string | null>(null);
  const [policyFilter, setPolicyFilter] = useState<string | null>(null);

  const filteredDecisions = mockDecisions.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.actor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOutcome = outcomeFilter ? d.outcome === outcomeFilter : true;
    const matchesActor = actorFilter ? d.actor === actorFilter : true;
    const matchesWorkspace = workspaceFilter ? d.workspaceId === workspaceFilter : true;
    const matchesPolicy = policyFilter ? d.policyRefs.includes(policyFilter) : true;
    
    return matchesSearch && matchesOutcome && matchesActor && matchesWorkspace && matchesPolicy;
  });

  const selectedDecision = mockDecisions.find(d => d.id === id);

  const outcomes = ['ALLOW', 'DENY', 'REQUIRE_EVIDENCE', 'ADVISE', 'WARNING'];
  const actors = Array.from(new Set(mockDecisions.map(d => d.actor)));
  const policyPackIds = Array.from(new Set(mockDecisions.flatMap(d => d.policyRefs)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search by Decision ID, Trace, or Actor..." 
              className="pl-10 bg-surface border-border text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2 text-xs">
              <Download className="w-3 h-3" />
              Export Log
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white text-xs">
              Manual Evaluation
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-2">Filters:</span>
          <Button 
            variant={outcomeFilter === null ? 'secondary' : 'outline'} 
            size="sm" 
            className="h-7 text-[10px] rounded-full"
            onClick={() => setOutcomeFilter(null)}
          >
            All Outcomes
          </Button>
          {outcomes.map(outcome => (
            <Button 
              key={outcome}
              variant={outcomeFilter === outcome ? 'secondary' : 'outline'} 
              size="sm" 
              className="h-7 text-[10px] rounded-full"
              onClick={() => setOutcomeFilter(outcome)}
            >
              {outcome.replace('_', ' ')}
            </Button>
          ))}
          <Separator orientation="vertical" className="h-4 bg-border mx-2" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={workspaceFilter ? 'secondary' : 'outline'} size="sm" className="h-7 text-[10px] rounded-full gap-1">
                <Layers className="w-3 h-3" />
                {workspaceFilter ? mockWorkspaces.find(w => w.id === workspaceFilter)?.name : 'Workspace'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border text-foreground">
              <DropdownMenuItem onClick={() => setWorkspaceFilter(null)}>All Workspaces</DropdownMenuItem>
              {mockWorkspaces.map(ws => (
                <DropdownMenuItem key={ws.id} onClick={() => setWorkspaceFilter(ws.id)}>{ws.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={policyFilter ? 'secondary' : 'outline'} size="sm" className="h-7 text-[10px] rounded-full gap-1">
                <Shield className="w-3 h-3" />
                {policyFilter ? mockPolicyPacks.find(p => p.id === policyFilter)?.name : 'Policy Pack'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border text-foreground">
              <DropdownMenuItem onClick={() => setPolicyFilter(null)}>All Policies</DropdownMenuItem>
              {policyPackIds.map(id => {
                const pack = mockPolicyPacks.find(p => p.id === id);
                return (
                  <DropdownMenuItem key={id} onClick={() => setPolicyFilter(id)}>
                    {pack?.name || id}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={actorFilter ? 'secondary' : 'outline'} size="sm" className="h-7 text-[10px] rounded-full gap-1">
                <User className="w-3 h-3" />
                {actorFilter || 'Actor'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border text-foreground">
              <DropdownMenuItem onClick={() => setActorFilter(null)}>All Actors</DropdownMenuItem>
              {actors.map(a => (
                <DropdownMenuItem key={a} onClick={() => setActorFilter(a)}>{a}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="bg-surface border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card/50 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Outcome</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Decision ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actor</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDecisions.map((decision) => {
                const workspace = mockWorkspaces.find(w => w.id === decision.workspaceId);
                return (
                  <tr 
                    key={decision.id} 
                    className="hover:bg-card/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/decision-log/${decision.id}`)}
                  >
                    <td className="py-4 px-6">
                      <OutcomeBadge outcome={decision.outcome} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-zinc-600" />
                        <span className="text-sm font-mono text-foreground/80 group-hover:text-accent transition-colors">
                          {decision.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-foreground hover:text-accent transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/workspaces/${decision.workspaceId}`); }}>
                      {workspace?.name}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-card flex items-center justify-center text-[10px] border border-border">
                          {decision.actor[0].toUpperCase()}
                        </div>
                        <span className="text-xs">{decision.actor}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-muted-foreground font-mono">
                      {new Date(decision.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6 text-xs text-muted-foreground text-right font-mono hover:text-accent transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/telemetry/${decision.traceId}`); }}>
                      {decision.traceId}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Decision Inspector Sheet */}
      <Sheet open={!!selectedDecision} onOpenChange={(open) => !open && navigate('/decision-log')}>
        <SheetContent className="w-full sm:max-w-xl bg-background border-l border-border text-foreground p-0">
          {selectedDecision && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 bg-surface border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Forensic Decision Inspector</span>
                  <OutcomeBadge outcome={selectedDecision.outcome} />
                </div>
                <SheetTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  {selectedDecision.id}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-mono text-xs flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Trace: {selectedDecision.traceId} • {new Date(selectedDecision.timestamp).toISOString()}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Human Readable Summary */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-3 h-3" />
                      Executive Summary
                    </h4>
                    <div className={cn(
                      "p-4 rounded-lg border",
                      selectedDecision.outcome === 'DENY' ? 'bg-error/5 border-error/20' : 'bg-surface border-border'
                    )}>
                      <p className="text-sm text-foreground leading-relaxed">
                        {selectedDecision.outcome === 'DENY' ? (
                          <>
                            Action <span className="font-bold">BLOCKED</span>. The request to <span className="text-error font-mono">{selectedDecision.payload.action}</span> was rejected because it violates critical security policies.
                          </>
                        ) : selectedDecision.outcome === 'ALLOW' ? (
                          <>
                            Action <span className="font-bold text-success">ALLOWED</span>. All policy checks passed successfully for the <span className="text-accent font-mono">{selectedDecision.payload.action}</span> intent.
                          </>
                        ) : (
                          <>
                            Action <span className="font-bold text-warning">PENDING</span>. Additional evidence or manual review is required to proceed with <span className="text-warning font-mono">{selectedDecision.payload.action}</span>.
                          </>
                        )}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedDecision.reasonCodes.map((code: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-card text-[10px] font-mono py-0 h-5 border-border">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Decision Context */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      Decision Context
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-surface border border-border space-y-1 cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/workspaces/${selectedDecision.workspaceId}`)}>
                        <p className="text-[9px] text-muted-foreground uppercase">Workspace</p>
                        <p className="text-xs font-bold text-foreground flex items-center gap-1">
                          {mockWorkspaces.find(w => w.id === selectedDecision.workspaceId)?.name}
                          <ExternalLink className="w-2 h-2 text-muted-foreground" />
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                        <p className="text-[9px] text-muted-foreground uppercase">Actor</p>
                        <p className="text-xs font-bold text-foreground">{selectedDecision.actor}</p>
                      </div>
                    </div>
                  </section>

                  {/* Required Evidence / Next Actions */}
                  {(selectedDecision.outcome === 'DENY' || selectedDecision.outcome === 'REQUIRE_EVIDENCE') && (
                    <section className="space-y-3">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-3 h-3 text-warning" />
                        Required Remediation
                      </h4>
                      <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 space-y-3">
                        <p className="text-xs font-bold text-warning">Next Recommended Action:</p>
                        <p className="text-xs text-foreground/80">
                          {selectedDecision.outcome === 'DENY' 
                            ? "Resolve critical vulnerabilities and re-submit the intent for evaluation."
                            : "Upload the missing evidence documents to satisfy the pending obligations."}
                        </p>
                        <div className="space-y-2 pt-2">
                          {selectedDecision.obligationIds.map((obId: string) => {
                            const ob = mockObligations.find(o => o.id === obId);
                            return (
                              <div key={obId} className="flex items-center justify-between p-2 rounded bg-card border border-border cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/obligations/${obId}`)}>
                                <span className="text-[10px] font-medium text-foreground">{ob?.title || obId}</span>
                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Intent Payload */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-3 h-3" />
                      Raw Write Intent
                    </h4>
                    <div className="p-4 rounded-lg bg-card border border-border font-mono text-[10px] text-accent overflow-x-auto">
                      <pre>{JSON.stringify(selectedDecision.payload, null, 2)}</pre>
                    </div>
                  </section>

                  {/* Policy References */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Link2 className="w-3 h-3" />
                      Policy Pack References
                    </h4>
                    <div className="space-y-2">
                      {selectedDecision.policyRefs.map((pId: string, i: number) => {
                        const pack = mockPolicyPacks.find(p => p.id === pId);
                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-accent/50 transition-colors cursor-pointer group" onClick={() => navigate(`/policies/${pId}`)}>
                            <div className="flex items-center gap-3">
                              <Shield className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                              <span className="text-xs font-medium text-foreground/80 group-hover:text-accent">{pack?.name || pId}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-700" />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-card/30 flex gap-3">
                <Button className="flex-1 bg-accent hover:bg-accent/90 text-white text-xs h-9" onClick={() => navigate(`/telemetry/${selectedDecision.traceId}`)}>
                  Correlate Telemetry Trace
                </Button>
                <Button variant="outline" className="flex-1 bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9" onClick={() => navigate(`/workspaces/${selectedDecision.workspaceId}`)}>
                  View Workspace Detail
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

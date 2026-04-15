import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockWorkspaces, mockCheckpoints, mockObligations, mockDecisions, mockTelemetry, mockEvidence } from '../mockData';
import { StatusBadge, SeverityBadge, OutcomeBadge } from '../components/Badges';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Users, 
  Shield,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  History,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export function Workspaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  const filteredWorkspaces = mockWorkspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedWorkspace = mockWorkspaces.find(ws => ws.id === selectedWorkspaceId);

  if (selectedWorkspace) {
    return <WorkspaceDetail workspace={selectedWorkspace} onBack={() => setSelectedWorkspaceId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search workspaces by name or owner..." 
            className="pl-10 bg-surface border-border text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white">
            Create Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkspaces.map((ws) => (
          <Card 
            key={ws.id} 
            className="bg-surface border-border hover:border-accent/50 transition-all duration-300 group cursor-pointer"
            onClick={() => setSelectedWorkspaceId(ws.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                    {ws.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-1">{ws.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Workspace</DropdownMenuItem>
                    <DropdownMenuItem className="text-error">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{ws.owner}</span>
                </div>
                <StatusBadge status={ws.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Risk Level</p>
                  <SeverityBadge severity={ws.riskLevel} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Last Decision</p>
                  <OutcomeBadge outcome={ws.lastDecisionOutcome} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">{ws.openObligationsCount}</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">Obligations</span>
                  </div>
                  <div className="h-8 w-[1px] bg-border" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">12</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">Decisions</span>
                  </div>
                </div>
                
                {ws.status === 'BLOCKED' && (
                  <div className="flex items-center gap-1.5 text-error">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Action Required</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WorkspaceDetail({ workspace, onBack }: { workspace: any, onBack: () => void }) {
  const activeCheckpoint = mockCheckpoints.find(c => c.id === workspace.activeCheckpointId);
  const obligations = mockObligations.filter(o => o.workspaceId === workspace.id);
  const decisions = mockDecisions.filter(d => d.workspaceId === workspace.id);
  const telemetry = mockTelemetry.filter(t => t.workspaceId === workspace.id);
  const evidence = mockEvidence.filter(e => obligations.some(o => o.id === e.obligationId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{workspace.name}</h2>
              <StatusBadge status={workspace.status} />
              <SeverityBadge severity={workspace.riskLevel} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{workspace.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-surface border-border text-foreground">
            Edit Workspace
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white">
            Run Evaluation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-surface border border-border p-1 h-auto gap-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Overview</TabsTrigger>
          <TabsTrigger value="checkpoints" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Checkpoints</TabsTrigger>
          <TabsTrigger value="obligations" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Obligations</TabsTrigger>
          <TabsTrigger value="evidence" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Evidence</TabsTrigger>
          <TabsTrigger value="decisions" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Decisions</TabsTrigger>
          <TabsTrigger value="telemetry" className="data-[state=active]:bg-accent data-[state=active]:text-white px-4 py-2 text-xs font-medium transition-all">Telemetry</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Operational Readiness */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Operational Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Evidence Coverage</p>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">65%</span>
                        <span className="text-[10px] text-warning">Needs Review</span>
                      </div>
                      <Progress value={65} className="h-1 bg-background" />
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Policy Compliance</p>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">92%</span>
                        <span className="text-[10px] text-success">Healthy</span>
                      </div>
                      <Progress value={92} className="h-1 bg-background" />
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Risk Exposure</p>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">Medium</span>
                        <span className="text-[10px] text-muted-foreground">Stable</span>
                      </div>
                      <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-1/2" />
                      </div>
                    </div>
                  </div>

                  {workspace.status === 'BLOCKED' && (
                    <div className="p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-error mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-error">Workspace Blocked by Policy</p>
                        <p className="text-xs text-error/80 mt-1">{workspace.blockedReason}</p>
                        <Button size="sm" variant="outline" className="mt-3 border-error/30 text-error hover:bg-error/10 h-7 text-[10px]">
                          View Policy Violation
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-accent" />
                    Recent Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {decisions.slice(0, 5).map((d) => (
                      <div key={d.id} className="p-4 flex items-center justify-between hover:bg-card/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <OutcomeBadge outcome={d.outcome} />
                          <div>
                            <p className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">{d.payload.action || 'System Evaluation'}</p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{d.traceId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">{new Date(d.timestamp).toLocaleString()}</p>
                          <p className="text-[10px] font-medium text-foreground/70 mt-0.5">{d.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Active Checkpoint */}
              <Card className="bg-surface border-border">
                <CardHeader className="bg-card/30 border-b border-border">
                  <CardTitle className="text-sm font-bold">Active Checkpoint</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {activeCheckpoint ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{activeCheckpoint.name}</p>
                        <p className="text-[10px] text-muted-foreground">Opened {new Date(activeCheckpoint.openedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Evidence Progress</span>
                          <span className="text-foreground font-bold">2 / {activeCheckpoint.evidenceRequired.length}</span>
                        </div>
                        <Progress value={40} className="h-1 bg-card" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Required Evidence</p>
                        <div className="space-y-1">
                          {activeCheckpoint.evidenceRequired.map((ev, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-foreground/80">
                              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                              {ev}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-white text-xs h-8">
                        Manage Checkpoint
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No active checkpoint</p>
                  )}
                </CardContent>
              </Card>

              {/* Workspace Info */}
              <Card className="bg-surface border-border">
                <CardHeader className="bg-card/30 border-b border-border">
                  <CardTitle className="text-sm font-bold">Workspace Context</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Owner</span>
                      <span className="text-xs font-medium text-foreground">{workspace.owner}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Created</span>
                      <span className="text-xs font-medium text-foreground">{new Date(workspace.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">ID</span>
                      <span className="text-xs font-mono text-muted-foreground">{workspace.id}</span>
                    </div>
                  </div>
                  <Separator className="bg-border" />
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Obligations</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 rounded bg-card border border-border text-[10px] text-foreground">Security: 2</div>
                      <div className="px-2 py-1 rounded bg-card border border-border text-[10px] text-foreground">Compliance: 1</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checkpoints">
          <Card className="bg-surface border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Checkpoint history and active gates for this workspace.</p>
              {/* Checkpoint list would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obligations">
          <Card className="bg-surface border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Detailed view of all compliance and security obligations.</p>
              {/* Obligations list would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card className="bg-surface border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Evidence repository for governance validation.</p>
              {/* Evidence list would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card className="bg-surface border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Full decision history for this workspace.</p>
              {/* Decisions list would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telemetry">
          <Card className="bg-surface border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Correlated telemetry traces for evaluation flows.</p>
              {/* Telemetry list would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

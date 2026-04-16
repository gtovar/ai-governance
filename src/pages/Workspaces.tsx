import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGovernance } from '../context/GovernanceContext';
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
  Info,
  ShieldAlert,
  Clock,
  Paperclip,
  Zap,
  AlertTriangle,
  ArrowRight,
  Download,
  Eye
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
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ComingSoon } from '../components/ComingSoon';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export function Workspaces() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspaces, decisions, obligations, createWorkspace } = useGovernance();
  const [searchQuery, setSearchQuery] = useState('');
  const [comingSoon, setComingSoon] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedWorkspace = workspaces.find(ws => ws.id === id);

  if (selectedWorkspace) {
    return <WorkspaceDetail workspace={selectedWorkspace} onBack={() => navigate('/workspaces')} />;
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
          <Button 
            variant="outline" 
            className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2"
            onClick={() => setComingSoon({ open: true, feature: 'Workspace Filtering' })}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => createWorkspace({ name: 'New Service API', owner: 'Platform Team', description: 'Automatically generated workspace for testing.' })}
          >
            Create Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkspaces.map((ws) => {
          const wsDecisions = decisions.filter(d => d.workspaceId === ws.id);
          const latestDecision = [...wsDecisions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          const wsObligations = obligations.filter(o => o.workspaceId === ws.id);
          const openObligationsCount = wsObligations.filter(o => o.status === 'OPEN').length;

          return (
            <Card 
              key={ws.id} 
              className="bg-surface border-border hover:border-accent/50 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/workspaces/${ws.id}`)}
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
                      <DropdownMenuItem onClick={() => navigate(`/workspaces/${ws.id}`)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setComingSoon({ open: true, feature: 'Edit Workspace' })}>Edit Workspace</DropdownMenuItem>
                      <DropdownMenuItem className="text-error" onClick={() => setComingSoon({ open: true, feature: 'Archive Workspace' })}>Archive</DropdownMenuItem>
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
                    <OutcomeBadge outcome={latestDecision?.outcome || 'ADVISE'} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">{openObligationsCount}</span>
                      <span className="text-[10px] uppercase text-muted-foreground font-medium">Obligations</span>
                    </div>
                    <div className="h-8 w-[1px] bg-border" />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">{wsDecisions.length}</span>
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

function WorkspaceDetail({ workspace, onBack }: { workspace: any, onBack: () => void }) {
  const navigate = useNavigate();
  const { checkpoints, obligations, decisions, telemetry, evidence, policyPacks, runEvaluation } = useGovernance();
  const [comingSoon, setComingSoon] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });
  
  const activeCheckpoint = checkpoints.find(c => c.id === workspace.activeCheckpointId);
  const workspaceCheckpoints = checkpoints.filter(c => c.workspaceId === workspace.id);
  const wsObligations = obligations.filter(o => o.workspaceId === workspace.id);
  const wsDecisions = decisions.filter(d => d.workspaceId === workspace.id);
  const wsTelemetry = telemetry.filter(t => t.workspaceId === workspace.id);
  const wsEvidence = evidence.filter(e => wsObligations.some(o => o.id === e.obligationId));

  const openObligations = wsObligations.filter(o => o.status === 'OPEN');
  const satisfiedObligations = wsObligations.filter(o => o.status === 'SATISFIED');
  const evidenceCoverage = wsObligations.length > 0 ? Math.round((satisfiedObligations.length / wsObligations.length) * 100) : 0;

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
          <Button 
            variant="outline" 
            className="bg-surface border-border text-foreground"
            onClick={() => setComingSoon({ open: true, feature: 'Edit Workspace' })}
          >
            Edit Workspace
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => runEvaluation(workspace.id)}
          >
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
                        <span className="text-2xl font-bold text-foreground">{evidenceCoverage}%</span>
                        <span className={cn("text-[10px]", evidenceCoverage < 80 ? "text-warning" : "text-success")}>
                          {evidenceCoverage < 80 ? "Needs Review" : "Healthy"}
                        </span>
                      </div>
                      <Progress value={evidenceCoverage} className="h-1 bg-background" />
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
                        <span className="text-2xl font-bold text-foreground">{workspace.riskLevel}</span>
                        <span className="text-[10px] text-muted-foreground">Stable</span>
                      </div>
                      <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                        <div className={cn(
                          "h-full w-1/2",
                          workspace.riskLevel === 'CRITICAL' ? 'bg-error' : workspace.riskLevel === 'HIGH' ? 'bg-error/70' : workspace.riskLevel === 'MEDIUM' ? 'bg-warning' : 'bg-success'
                        )} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workspace.status === 'BLOCKED' && (
                      <div className="p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-error mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-error">Blocked-by-Policy Summary</p>
                          <p className="text-xs text-error/80 mt-1">{workspace.blockedReason}</p>
                          <Button size="sm" variant="outline" className="mt-3 border-error/30 text-error hover:bg-error/10 h-7 text-[10px]" onClick={() => navigate('/policies')}>
                            View Policy Violation
                          </Button>
                        </div>
                      </div>
                    )}

                    {openObligations.length > 0 && (
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-warning">Missing Evidence Summary</p>
                          <p className="text-xs text-warning/80 mt-1">
                            {openObligations.length} obligations are missing required evidence items.
                          </p>
                          <Button size="sm" variant="outline" className="mt-3 border-warning/30 text-warning hover:bg-warning/10 h-7 text-[10px]" onClick={() => navigate('/obligations')}>
                            Review Obligations
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Next Recommended Action</p>
                        <p className="text-xs text-muted-foreground">
                          {workspace.status === 'BLOCKED' 
                            ? "Resolve policy violations to unblock workspace." 
                            : activeCheckpoint 
                              ? `Complete evidence for ${activeCheckpoint.name}.` 
                              : "Run a new governance evaluation."}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-accent hover:bg-accent/90 text-white h-8 text-xs gap-2"
                      onClick={() => setComingSoon({ open: true, feature: 'Take Recommended Action' })}
                    >
                      Take Action
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-surface border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-accent" />
                    Recent Decisions
                  </CardTitle>
                  <Button variant="ghost" className="text-accent text-[10px] h-6 p-0 hover:bg-transparent" onClick={() => navigate('/decision-log')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {decisions.slice(0, 5).map((d) => (
                      <div key={d.id} className="p-4 flex items-center justify-between hover:bg-card/30 transition-colors cursor-pointer group" onClick={() => navigate(`/decision-log/${d.id}`)}>
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
                <CardHeader className="bg-card/30 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold">Active Checkpoint</CardTitle>
                  {activeCheckpoint && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-accent" onClick={() => navigate(`/checkpoints/${activeCheckpoint.id}`)}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
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
                      <Button className="w-full bg-accent hover:bg-accent/90 text-white text-xs h-8" onClick={() => navigate(`/checkpoints/${activeCheckpoint.id}`)}>
                        Manage Checkpoint
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-xs text-muted-foreground italic">No active checkpoint</p>
                      <Button variant="outline" className="w-full border-border text-xs h-8" onClick={() => navigate('/checkpoints')}>
                        Open New Checkpoint
                      </Button>
                    </div>
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
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Type</span>
                      <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-tighter">{workspace.type}</Badge>
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
                      <div className="px-2 py-1 rounded bg-card border border-border text-[10px] text-foreground flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-accent" />
                        Security: {obligations.filter(o => o.type === 'SECURITY').length}
                      </div>
                      <div className="px-2 py-1 rounded bg-card border border-border text-[10px] text-foreground flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-accent" />
                        Compliance: {obligations.filter(o => o.type === 'COMPLIANCE').length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checkpoints">
          <Card className="bg-surface border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-card/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Checkpoint Name</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Readiness</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Responsible</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Opened At</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaceCheckpoints.map((cp) => {
                  const cpObligations = obligations.filter(o => cp.obligationIds.includes(o.id));
                  const satisfiedCount = cpObligations.filter(o => o.status === 'SATISFIED').length;
                  const readiness = cpObligations.length > 0 ? Math.round((satisfiedCount / cpObligations.length) * 100) : 0;

                  return (
                    <TableRow key={cp.id} className="border-border hover:bg-card/30 transition-colors group cursor-pointer" onClick={() => navigate(`/checkpoints/${cp.id}`)}>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">{cp.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{cp.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={cp.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-card rounded-full overflow-hidden">
                            <div className={cn("h-full", readiness === 100 ? "bg-success" : "bg-accent")} style={{ width: `${readiness}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-foreground">{readiness}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-foreground/80">{cp.responsible}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{new Date(cp.openedAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="obligations">
          <Card className="bg-surface border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-card/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Obligation</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Severity</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Evidence</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Owner</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Due Date</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wsObligations.map((ob) => {
                  const obEvidence = evidence.filter(e => e.obligationId === ob.id);
                  const isOverdue = new Date(ob.dueDate) < new Date() && ob.status === 'OPEN';

                  return (
                    <TableRow key={ob.id} className="border-border hover:bg-card/30 transition-colors group cursor-pointer" onClick={() => navigate(`/obligations/${ob.id}`)}>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">{ob.title}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{ob.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={ob.severity} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ob.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Paperclip className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-foreground/80">{obEvidence.length} items</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-foreground/80">{ob.owner}</span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-xs", isOverdue ? "text-error font-bold" : "text-muted-foreground")}>
                          {new Date(ob.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <div className="space-y-6">
            {wsObligations.map((ob) => {
              const obEvidence = evidence.filter(e => e.obligationId === ob.id);
              if (obEvidence.length === 0) return null;

              return (
                <Card key={ob.id} className="bg-surface border-border overflow-hidden">
                  <CardHeader className="bg-card/30 border-b border-border py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-accent" />
                        <CardTitle className="text-xs font-bold">{ob.title}</CardTitle>
                        <Badge variant="outline" className="text-[9px] font-mono">{ob.id}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-accent hover:text-accent/80" onClick={() => navigate(`/obligations/${ob.id}`)}>
                        View Obligation
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableBody>
                        {obEvidence.map((ev) => (
                          <TableRow key={ev.id} className="border-border hover:bg-card/20 transition-colors">
                            <TableCell className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-card border border-border flex items-center justify-center text-muted-foreground">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-foreground">{ev.title}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ev.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Uploaded By</span>
                                <span className="text-xs text-foreground/80">{ev.uploadedBy}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Date</span>
                                <span className="text-xs text-foreground/80">{new Date(ev.uploadedAt).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  onClick={() => setComingSoon({ open: true, feature: 'Download Evidence' })}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  onClick={() => setComingSoon({ open: true, feature: 'Preview Evidence' })}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
            {wsEvidence.length === 0 && (
              <Card className="bg-surface border-border border-dashed">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-muted-foreground border border-border">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">No Evidence Collected</p>
                    <p className="text-xs text-muted-foreground">This workspace has no evidence items uploaded yet.</p>
                  </div>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-white text-xs h-9"
                    onClick={() => setComingSoon({ open: true, feature: 'Upload Evidence' })}
                  >
                    Upload First Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="decisions">
          <Card className="bg-surface border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-card/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Outcome</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Action / Intent</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Actor</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Policies</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4 text-right">Inspector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wsDecisions.map((d) => (
                  <TableRow key={d.id} className="border-border hover:bg-card/30 transition-colors group cursor-pointer" onClick={() => navigate(`/decision-log/${d.id}`)}>
                    <TableCell className="py-4">
                      <OutcomeBadge outcome={d.outcome} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">{d.payload.action || 'System Eval'}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{d.intentId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-foreground/80">{d.actor}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {d.policyRefs.map((pId, i) => {
                          const pack = policyPacks.find(p => p.id === pId);
                          return (
                            <Badge key={i} variant="secondary" className="text-[8px] px-1 py-0 h-4">
                              {pack?.name || pId}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{new Date(d.timestamp).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="telemetry">
          <Card className="bg-surface border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-card/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Trace ID</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Outcome</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Latency</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wsTelemetry.map((t) => (
                  <TableRow key={t.id} className="border-border hover:bg-card/30 transition-colors group cursor-pointer" onClick={() => navigate(`/telemetry/${t.id}`)}>
                    <TableCell className="py-4">
                      <span className="text-xs font-mono text-foreground group-hover:text-accent transition-colors">{t.id}</span>
                    </TableCell>
                    <TableCell>
                      <OutcomeBadge outcome={t.outcome} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-card rounded-full overflow-hidden">
                          <div className={cn("h-full", t.latencyMs > 200 ? "bg-error" : t.latencyMs > 100 ? "bg-warning" : "bg-success")} style={{ width: `${Math.min(100, (t.latencyMs / 300) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-foreground">{Math.round(t.latencyMs)}ms</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {t.error ? (
                        <Badge variant="outline" className="text-[8px] border-error/30 text-error bg-error/5">ERROR</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[8px] border-success/30 text-success bg-success/5">SUCCESS</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{new Date(t.timestamp).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
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

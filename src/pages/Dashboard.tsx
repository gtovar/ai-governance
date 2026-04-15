import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  mockWorkspaces, 
  mockCheckpoints, 
  mockObligations, 
  mockDecisions, 
  mockTelemetry 
} from '../mockData';
import { 
  Briefcase, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Activity, 
  AlertTriangle,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { StatusBadge, SeverityBadge, OutcomeBadge } from '../components/Badges';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const blockedWorkspaces = mockWorkspaces.filter(w => w.status === 'BLOCKED');
  const openCheckpoints = mockCheckpoints.filter(c => c.status === 'OPEN');
  const pendingObligations = mockObligations.filter(o => o.status === 'OPEN');
  const criticalDecisions = mockDecisions.filter(d => d.outcome === 'DENY').slice(0, 5);

  const stats = [
    { label: 'Blocked Workspaces', value: blockedWorkspaces.length, icon: ShieldAlert, color: 'text-error', desc: 'Requires immediate intervention' },
    { label: 'Active Checkpoints', value: openCheckpoints.length, icon: CheckCircle2, color: 'text-accent', desc: 'Governance gates in progress' },
    { label: 'Pending Obligations', value: pendingObligations.length, icon: FileText, color: 'text-warning', desc: 'Evidence collection required' },
    { label: 'Critical Denials', value: criticalDecisions.length, icon: AlertTriangle, color: 'text-error', desc: 'Last 24 hours' },
  ];

  return (
    <div className="space-y-8">
      {/* Governance Status Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Governance Operational Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-surface border-border hover:border-accent/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2 rounded-lg bg-background border border-border", stat.color)}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-xs font-medium text-foreground/80">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Blocked Workspaces Panel */}
          <Card className="bg-surface border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-card/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-error" />
                    Blocked Workspaces
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">High-risk environments requiring policy resolution</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 text-xs">
                  View All Blocked
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {blockedWorkspaces.map((ws) => (
                  <div key={ws.id} className="p-4 hover:bg-card/30 transition-colors flex items-start justify-between group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{ws.name}</span>
                        <SeverityBadge severity={ws.riskLevel} />
                      </div>
                      <p className="text-xs text-error font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {ws.blockedReason || 'Blocked by policy violation'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Owner: {ws.owner}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Obligations: {ws.openObligationsCount}</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white text-xs">
                      Resolve Block
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Decisions Console */}
          <Card className="bg-surface border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-card/30">
              <div>
                <CardTitle className="text-foreground">Governance Decision Console</CardTitle>
                <CardDescription className="text-muted-foreground">Real-time evaluation stream from the Kernel</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:text-foreground text-xs">
                Open Full Log
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-card/10">
                      <th className="py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Outcome</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reason</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Trace</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {mockDecisions.slice(0, 6).map((decision) => (
                      <tr key={decision.id} className="hover:bg-card/30 transition-colors group cursor-pointer">
                        <td className="py-3 px-4">
                          <OutcomeBadge outcome={decision.outcome} />
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-foreground">{mockWorkspaces.find(w => w.id === decision.workspaceId)?.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px] block">
                            {decision.reasonCodes.join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[10px] text-muted-foreground text-right font-mono">
                          {decision.traceId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Recommended Next Actions */}
          <Card className="bg-surface border-border">
            <CardHeader className="bg-card/30 border-b border-border">
              <CardTitle className="text-foreground text-sm">Recommended Next Actions</CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground uppercase tracking-wider">Operational Guidance</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { title: 'Satisfy Security Patch Obligation', desc: 'Apply patches to Core Banking API to unblock deployment.', target: 'ws-1', type: 'ACTION' },
                { title: 'Upload SOC2 Evidence', desc: 'Required for Auth Service security audit checkpoint.', target: 'ws-2', type: 'EVIDENCE' },
                { title: 'Close Production Readiness', desc: 'All rules passed for Payment Gateway. Ready for closure.', target: 'ws-3', type: 'SUCCESS' },
                { title: 'Review Denied Intent tr-112233', desc: 'Analyze critical vulnerability block in Auth Service.', target: 'ws-2', type: 'ERROR' },
              ].map((action, i) => (
                <div key={i} className="p-3 rounded-lg bg-card border border-border flex flex-col gap-2 hover:border-accent/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      action.type === 'SUCCESS' ? 'bg-success/10 text-success' : action.type === 'ERROR' ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'
                    )}>
                      {action.type}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">{action.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{action.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Missing Evidence Summary */}
          <Card className="bg-surface border-border">
            <CardHeader className="bg-card/30 border-b border-border">
              <CardTitle className="text-foreground text-sm">Evidence Gaps</CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground uppercase tracking-wider">Blocking Checkpoints</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                {mockCheckpoints.filter(c => c.status === 'OPEN').slice(0, 3).map((cp) => (
                  <div key={cp.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium text-foreground/80">{cp.name}</span>
                      <span className="text-muted-foreground">{cp.evidenceRequired.length} missing</span>
                    </div>
                    <div className="h-1 w-full bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-1/3" />
                    </div>
                    <p className="text-[9px] text-muted-foreground italic">Required: {cp.evidenceRequired[0]}...</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-[10px] text-muted-foreground hover:text-foreground h-auto p-0 pt-2">
                View Evidence Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

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
  const stats = [
    { label: 'Total Workspaces', value: mockWorkspaces.length, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Active Checkpoints', value: mockCheckpoints.filter(c => c.status === 'OPEN').length, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Pending Obligations', value: mockObligations.filter(o => o.status === 'OPEN').length, icon: ShieldAlert, color: 'text-amber-500' },
    { label: 'Blocked Decisions', value: mockDecisions.filter(d => d.outcome === 'DENY').length, icon: AlertTriangle, color: 'text-rose-500' },
  ];

  const recentDecisions = mockDecisions.slice(0, 5);
  const chartData = [
    { name: 'Mon', decisions: 45, latency: 120 },
    { name: 'Tue', decisions: 52, latency: 145 },
    { name: 'Wed', decisions: 38, latency: 110 },
    { name: 'Thu', decisions: 65, latency: 180 },
    { name: 'Fri', decisions: 48, latency: 130 },
    { name: 'Sat', decisions: 24, latency: 95 },
    { name: 'Sun', decisions: 18, latency: 85 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border hover:border-zinc-700 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl bg-background border border-border group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-surface border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Decision Volume</CardTitle>
                <CardDescription className="text-muted-foreground">Weekly governance activity overview</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:text-foreground">
                Last 7 Days
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1aa" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid #2a2a2e', borderRadius: '8px' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Bar dataKey="decisions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Next Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Priority governance tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Close Checkpoint cp-1', desc: 'All obligations satisfied for Core Banking API', type: 'SUCCESS' },
              { title: 'Review Evidence ob-3', desc: 'New penetration test uploaded by Security Team', type: 'INFO' },
              { title: 'Resolve Block ws-2', desc: 'Auth Service blocked by critical policy violation', type: 'ERROR' },
            ].map((action, i) => (
              <div key={i} className="p-3 rounded-lg bg-card border border-border flex items-start gap-3 hover:border-zinc-700 transition-colors cursor-pointer group">
                <div className={cn(
                  "mt-1 w-2 h-2 rounded-full",
                  action.type === 'SUCCESS' ? 'bg-success' : action.type === 'ERROR' ? 'bg-error' : 'bg-accent'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400" />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-card/50 mt-2">
              View All Actions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Decisions Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Decisions</CardTitle>
            <CardDescription className="text-muted-foreground">Latest activity from the Governance Kernel</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:text-foreground">
            View Full Log
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Workspace</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actor</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Outcome</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Trace ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentDecisions.map((decision) => (
                  <tr key={decision.id} className="hover:bg-card/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                      {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-foreground">
                      {mockWorkspaces.find(w => w.id === decision.workspaceId)?.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-card flex items-center justify-center text-[10px] text-muted-foreground">
                        {decision.actor[0].toUpperCase()}
                      </div>
                      {decision.actor}
                    </td>
                    <td className="py-4 px-4">
                      <OutcomeBadge outcome={decision.outcome} />
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground text-right font-mono">
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
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

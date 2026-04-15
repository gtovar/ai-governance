import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockTelemetry, mockDecisions, mockWorkspaces } from '../mockData';
import { OutcomeBadge } from '../components/Badges';
import { 
  Activity, 
  Zap, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  Cpu,
  ArrowUpRight,
  RefreshCcw,
  Terminal,
  Search,
  Filter,
  ChevronRight,
  Shield,
  Layers,
  Code,
  Info,
  ExternalLink
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';

export function Telemetry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const avgLatency = Math.round(mockTelemetry.reduce((acc, t) => acc + t.latencyMs, 0) / mockTelemetry.length);
  const errorRate = (mockTelemetry.filter(t => t.error).length / mockTelemetry.length * 100).toFixed(1);

  const latencyData = mockTelemetry.map((t, i) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: Math.round(t.latencyMs),
    p95: Math.round(t.latencyMs * 1.2),
  }));

  const filteredTelemetry = mockTelemetry.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.decisionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTrace = mockTelemetry.find(t => t.id === id);
  const relatedDecision = selectedTrace ? mockDecisions.find(d => d.id === selectedTrace.decisionId) : null;
  const relatedWorkspace = selectedTrace ? mockWorkspaces.find(w => w.id === selectedTrace.workspaceId) : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Telemetry</h2>
          <p className="text-muted-foreground">Forensic observability of the Governance Kernel evaluation flows.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Kernel Live
          </div>
          <Button variant="outline" size="icon" className="bg-surface border-border text-muted-foreground hover:text-foreground h-9 w-9">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Evaluation Time</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{avgLatency}ms</h3>
                  <span className="text-xs text-success font-medium">-12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kernel Error Rate</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{errorRate}%</h3>
                  <span className="text-xs text-muted-foreground font-medium">Stable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Policy Engine Load</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">24%</h3>
                  <span className="text-xs text-success font-medium">Healthy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latency Chart */}
        <Card className="bg-surface border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Evaluation Latency (p95)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">End-to-end decision evaluation time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area type="monotone" dataKey="latency" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} />
                <Line type="monotone" dataKey="p95" stroke="var(--color-accent)" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              Collector Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-foreground">Langfuse</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-foreground">OpenTelemetry</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Datadog</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">DISABLED</span>
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trace Retention</p>
              <p className="text-xs text-foreground/80">30 days (Enterprise Policy)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Traces Table */}
      <Card className="bg-surface border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-card/30">
          <div>
            <CardTitle className="text-sm font-bold">Recent Evaluation Traces</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Correlated decision telemetry and forensic logs</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
            <Input 
              placeholder="Search Trace or Decision ID..." 
              className="pl-8 h-8 text-xs bg-surface border-border text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card/50 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trace ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Decision ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Outcome</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latency</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTelemetry.slice(0, 10).map((trace) => (
                <tr 
                  key={trace.id} 
                  className="hover:bg-card/30 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/telemetry/${trace.id}`)}
                >
                  <td className="py-4 px-6 text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors">
                    {trace.id}
                  </td>
                  <td className="py-4 px-6 text-xs text-foreground/80 font-mono">
                    {trace.decisionId}
                  </td>
                  <td className="py-4 px-6">
                    <OutcomeBadge outcome={trace.outcome} />
                  </td>
                  <td className="py-4 px-6 text-xs text-muted-foreground font-mono">
                    {Math.round(trace.latencyMs)}ms
                  </td>
                  <td className="py-4 px-6 text-right">
                    {trace.error ? (
                      <div className="flex items-center justify-end gap-1.5 text-error text-[10px] font-bold uppercase">
                        <AlertCircle className="w-3 h-3" />
                        Error
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5 text-success text-[10px] font-bold uppercase">
                        <div className="w-1 h-1 rounded-full bg-success" />
                        Success
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trace Inspector Sheet */}
      <Sheet open={!!selectedTrace} onOpenChange={(open) => !open && navigate('/telemetry')}>
        <SheetContent className="w-full sm:max-w-xl bg-background border-l border-border text-foreground p-0">
          {selectedTrace && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 bg-surface border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Trace Forensic Inspector</span>
                  <Badge variant={selectedTrace.error ? 'destructive' : 'outline'} className="text-[10px] font-mono h-5">
                    {selectedTrace.error ? 'ERROR' : 'SUCCESS'}
                  </Badge>
                </div>
                <SheetTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  {selectedTrace.id}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-mono text-xs flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedTrace.timestamp).toISOString()}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Performance Summary */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Execution Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                        <p className="text-[9px] text-muted-foreground uppercase">Total Latency</p>
                        <p className="text-sm font-bold text-foreground font-mono">{selectedTrace.latencyMs}ms</p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                        <p className="text-[9px] text-muted-foreground uppercase">Outcome</p>
                        <OutcomeBadge outcome={selectedTrace.outcome} />
                      </div>
                    </div>
                  </section>

                  {/* Correlated Entities */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      Correlated Entities
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-card border border-border flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/decision-log/${selectedTrace.decisionId}`)}>
                        <div className="flex items-center gap-3">
                          <Terminal className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase">Decision</p>
                            <p className="text-xs font-bold text-foreground font-mono">{selectedTrace.decisionId}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-accent" />
                      </div>
                      <div className="p-3 rounded-lg bg-card border border-border flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/workspaces/${selectedTrace.workspaceId}`)}>
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase">Workspace</p>
                            <p className="text-xs font-bold text-foreground">
                              {mockWorkspaces.find(w => w.id === selectedTrace.workspaceId)?.name || 'Unknown Workspace'}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-accent" />
                      </div>
                    </div>
                  </section>

                  {/* Evaluation Steps */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Kernel Evaluation Flow
                    </h4>
                    <div className="space-y-0 border-l border-border ml-2 pl-6">
                      {[
                        { step: "Intent Received", time: "0ms", status: "success", detail: `Intent ID: ${relatedDecision?.intentId || 'N/A'}` },
                        { step: "Context Hydration", time: "12ms", status: "success", detail: `Workspace: ${relatedWorkspace?.name || 'Unknown'}` },
                        { step: "Policy Pack Loading", time: "45ms", status: "success", detail: `Packs: ${relatedDecision?.policyRefs.join(', ') || 'None'}` },
                        { step: "Rule Evaluation", time: "128ms", status: "success", detail: `${relatedDecision?.policyRefs.length || 0} policy packs evaluated` },
                        { step: "Outcome Generation", time: "142ms", status: "success", detail: `Result: ${selectedTrace.outcome}` },
                        { step: "Log Persistence", time: "156ms", status: "success", detail: `Decision ID: ${selectedTrace.decisionId}` }
                      ].map((step, i) => (
                        <div key={i} className="relative pb-6 last:pb-0">
                          <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background" />
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-foreground">{step.step}</p>
                              <span className="text-[10px] font-mono text-muted-foreground">+{step.time}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Raw Trace Data */}
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-3 h-3" />
                      Raw Telemetry Data
                    </h4>
                    <div className="p-4 rounded-lg bg-card border border-border font-mono text-[10px] text-accent overflow-x-auto">
                      <pre>{JSON.stringify(selectedTrace, null, 2)}</pre>
                    </div>
                  </section>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-card/30 flex gap-3">
                <Button className="flex-1 bg-accent hover:bg-accent/90 text-white text-xs h-9" onClick={() => navigate('/decision-log')}>
                  View Full Decision Log
                </Button>
                <Button variant="outline" className="flex-1 bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9">
                  Export Trace (JSON)
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

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockTelemetry, mockDecisions } from '../mockData';
import { OutcomeBadge } from '../components/Badges';
import { 
  Activity, 
  Zap, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  Cpu,
  ArrowUpRight,
  RefreshCcw
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

export function Telemetry() {
  const avgLatency = Math.round(mockTelemetry.reduce((acc, t) => acc + t.latencyMs, 0) / mockTelemetry.length);
  const errorRate = (mockTelemetry.filter(t => t.error).length / mockTelemetry.length * 100).toFixed(1);

  const latencyData = mockTelemetry.map((t, i) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: Math.round(t.latencyMs),
    p95: Math.round(t.latencyMs * 1.2),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">System Telemetry</h2>
          <p className="text-muted-foreground">Real-time observability of the Governance Kernel performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live Stream Active
          </div>
          <Button variant="outline" size="icon" className="bg-surface border-border text-muted-foreground hover:text-foreground">
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Latency</p>
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Error Rate</p>
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kernel Load</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">24%</h3>
                  <span className="text-xs text-success font-medium">Healthy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latency Chart */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Decision Latency (p95)</CardTitle>
          <CardDescription className="text-muted-foreground">End-to-end evaluation time in milliseconds</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4">
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

      {/* Recent Traces Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Traces</CardTitle>
            <CardDescription className="text-muted-foreground">Correlated decision telemetry</CardDescription>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border text-[10px] font-mono text-muted-foreground">
            Langfuse / OpenTelemetry Integration Ready
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Trace ID</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Decision</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Outcome</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Latency</th>
                  <th className="py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mockTelemetry.slice(0, 10).map((trace) => (
                  <tr key={trace.id} className="hover:bg-card/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-4 text-sm font-mono text-muted-foreground">{trace.id}</td>
                    <td className="py-4 px-4 text-sm text-foreground/80 font-medium">{trace.decisionId}</td>
                    <td className="py-4 px-4">
                      <OutcomeBadge outcome={trace.outcome} />
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground font-mono">{Math.round(trace.latencyMs)}ms</td>
                    <td className="py-4 px-4 text-right">
                      {trace.error ? (
                        <div className="flex items-center justify-end gap-1.5 text-error text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Error
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5 text-success text-xs font-medium">
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
        </CardContent>
      </Card>
    </div>
  );
}

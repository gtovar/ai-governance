import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDecisions, mockWorkspaces } from '../mockData';
import { OutcomeBadge } from '../components/Badges';
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
  Activity
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function DecisionLog() {
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecisions = mockDecisions.filter(d => 
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.actor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
          <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
          <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-surface border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card/50 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Decision ID</th>
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Workspace</th>
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Outcome</th>
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Actor</th>
                <th className="py-4 px-6 text-[10px] font-medium text-muted-foreground uppercase tracking-wider text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDecisions.map((decision) => {
                const workspace = mockWorkspaces.find(w => w.id === decision.workspaceId);
                return (
                  <tr 
                    key={decision.id} 
                    className="hover:bg-card/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedDecision(decision)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-zinc-600" />
                        <span className="text-sm font-mono text-foreground/80 group-hover:text-accent transition-colors">
                          {decision.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground font-mono">
                      {new Date(decision.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-foreground">
                      {workspace?.name}
                    </td>
                    <td className="py-4 px-6">
                      <OutcomeBadge outcome={decision.outcome} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-5 h-5 rounded bg-card flex items-center justify-center text-[10px]">
                          {decision.actor[0].toUpperCase()}
                        </div>
                        {decision.actor}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground text-right font-mono">
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
      <Sheet open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-background border-l border-border text-foreground p-0">
          {selectedDecision && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 bg-surface border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Decision Inspector</span>
                  <OutcomeBadge outcome={selectedDecision.outcome} />
                </div>
                <SheetTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  {selectedDecision.id}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-mono text-xs">
                  Trace: {selectedDecision.traceId} • {new Date(selectedDecision.timestamp).toISOString()}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Summary Section */}
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-3 h-3" />
                      Decision Summary
                    </h4>
                    <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        The Governance Kernel evaluated a <span className="text-accent font-mono">{selectedDecision.payload.action}</span> intent 
                        from <span className="text-foreground font-medium">{selectedDecision.actor}</span>. 
                        The outcome was <span className="font-bold text-foreground">{selectedDecision.outcome}</span> based on {selectedDecision.reasonCodes.length} policy evaluations.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDecision.reasonCodes.map((code: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-card text-[10px] font-mono text-muted-foreground border border-border">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Intent Payload */}
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-3 h-3" />
                      Write Intent Payload
                    </h4>
                    <div className="p-4 rounded-lg bg-card border border-border font-mono text-xs text-accent overflow-x-auto">
                      <pre>{JSON.stringify(selectedDecision.payload, null, 2)}</pre>
                    </div>
                  </section>

                  {/* Policy References */}
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Link2 className="w-3 h-3" />
                      Policy References
                    </h4>
                    <div className="space-y-2">
                      {selectedDecision.policyRefs.map((ref: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-accent/50 transition-colors cursor-pointer group">
                          <span className="text-sm font-medium text-foreground/80 group-hover:text-accent">{ref}</span>
                          <ChevronRight className="w-4 h-4 text-zinc-700" />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Context */}
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Evaluation Context
                    </h4>
                    <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs text-muted-foreground">
                      <pre>{JSON.stringify(selectedDecision.context, null, 2)}</pre>
                    </div>
                  </section>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-card/30 flex gap-3">
                <Button className="flex-1 bg-accent hover:bg-accent/90 text-white">
                  Correlate Trace
                </Button>
                <Button variant="outline" className="flex-1 bg-surface border-border text-muted-foreground hover:text-foreground">
                  View Workspace
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGovernance } from '../context/GovernanceContext';
import { StatusBadge, OutcomeBadge } from '../components/Badges';
import { 
  ShieldCheck, 
  Layers, 
  History, 
  Globe, 
  Lock, 
  AlertTriangle,
  Info,
  Power,
  Settings2,
  Clock,
  ArrowLeft,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ComingSoon } from '../components/ComingSoon';

export function Policies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { policyPacks, decisions } = useGovernance();
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  if (id) return <PolicyDetail />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Policy Packs</h2>
          <p className="text-muted-foreground">Manage the rulesets that drive the Governance Kernel decisions.</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-white text-xs h-9"
          onClick={() => setComingSoon({ open: true, feature: 'Author New Policy Pack' })}
        >
          Author New Policy Pack
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {policyPacks.map((pack) => {
          const relatedDecisions = decisions.filter(d => d.policyRefs.includes(pack.id));
          const denialCount = relatedDecisions.filter(d => d.outcome === 'DENY').length;
          const complianceScore = relatedDecisions.length > 0 ? Math.round(((relatedDecisions.length - denialCount) / relatedDecisions.length) * 1000) / 10 : 100;

          return (
            <Card key={pack.id} className="bg-surface border-border hover:border-accent/30 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/policies/${pack.id}`)}>
              <CardHeader className="pb-4 border-b border-border bg-card/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">{pack.name}</CardTitle>
                      <StatusBadge status={pack.status} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <span className="font-mono text-accent">v{pack.version}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {pack.scope}
                      </span>
                      <span>•</span>
                      <span>{pack.rules.length} Rules</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setComingSoon({ open: true, feature: 'View Policy History' });
                      }}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setComingSoon({ open: true, feature: 'Policy Settings' });
                      }}
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Impact</p>
                    <p className="text-sm font-bold text-foreground">{relatedDecisions.length} Decisions</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Denials</p>
                    <p className="text-sm font-bold text-error">{denialCount}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Compliance</p>
                    <p className="text-sm font-bold text-success">{complianceScore}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Governance Rules</h4>
                  <div className="space-y-2">
                    {pack.rules.slice(0, 3).map((rule) => (
                      <div key={rule.id} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between group/rule">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-1 p-1.5 rounded bg-surface border border-border",
                            rule.mode === 'BLOCKING' ? 'text-error' : rule.mode === 'WARNING' ? 'text-warning' : 'text-accent'
                          )}>
                            {rule.mode === 'BLOCKING' ? <Lock className="w-3 h-3" /> : rule.mode === 'WARNING' ? <AlertTriangle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{rule.name}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{rule.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pack.rules.length > 3 && (
                      <p className="text-[10px] text-muted-foreground italic text-center">+{pack.rules.length - 3} more rules...</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Last updated {new Date(pack.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <Button variant="link" className="text-accent h-auto p-0 text-[10px] font-bold hover:text-accent/80">
                    View Full Policy Definition
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function PolicyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { policyPacks, decisions } = useGovernance();
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  const pack = policyPacks.find(p => p.id === id);
  if (!pack) return <div className="p-8 text-center text-muted-foreground">Policy Pack not found</div>;

  const relatedDecisions = decisions.filter(d => d.policyRefs.includes(pack.id));
  const blockingRules = pack.rules.filter(r => r.mode === 'BLOCKING').length;
  const warningRules = pack.rules.filter(r => r.mode === 'WARNING').length;
  const advisoryRules = pack.rules.filter(r => r.mode === 'ADVISORY').length;
  const denialCount = relatedDecisions.filter(d => d.outcome === 'DENY').length;
  const complianceScore = relatedDecisions.length > 0 ? Math.round(((relatedDecisions.length - denialCount) / relatedDecisions.length) * 1000) / 10 : 100;

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="text-muted-foreground hover:text-foreground -ml-2 gap-2"
        onClick={() => navigate('/policies')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Policies
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground">{pack.name}</h2>
                <StatusBadge status={pack.status} />
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                ID: <span className="font-mono text-accent">{pack.id}</span> • 
                Version: <span className="text-foreground font-medium">v{pack.version}</span> •
                Scope: <span className="text-foreground font-medium uppercase text-xs tracking-wider">{pack.scope}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9">
                View Version History
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-white text-xs h-9 gap-2">
                <Settings2 className="w-4 h-4" />
                Configure Pack
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Evaluations</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{relatedDecisions.length}</h3>
                  <span className="text-xs text-success font-medium">+8%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Denial Rate</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{relatedDecisions.length > 0 ? ((denialCount / relatedDecisions.length) * 100).toFixed(1) : 0}%</h3>
                  <span className="text-xs text-error font-medium">+0.2%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border">
              <CardContent className="p-6 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compliance Score</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">{complianceScore}%</h3>
                  <span className="text-xs text-success font-medium">Stable</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Policy Rules Definition
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {pack.rules.map((rule) => (
                <Card key={rule.id} className="bg-surface border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "mt-1 p-2 rounded-lg bg-card border border-border",
                        rule.mode === 'BLOCKING' ? 'text-error' : rule.mode === 'WARNING' ? 'text-warning' : 'text-accent'
                      )}>
                        {rule.mode === 'BLOCKING' ? <Lock className="w-4 h-4" /> : rule.mode === 'WARNING' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{rule.name}</p>
                          <Badge variant="outline" className={cn(
                            "text-[8px] uppercase font-bold px-1 py-0 h-4",
                            rule.mode === 'BLOCKING' ? 'border-error/20 text-error' : 'border-border text-muted-foreground'
                          )}>
                            {rule.mode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">842 Hits</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Avg 12ms</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-2">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold">Status</p>
                        <p className={cn("text-[10px] font-bold", rule.active ? "text-success" : "text-muted-foreground")}>
                          {rule.active ? "ACTIVE" : "INACTIVE"}
                        </p>
                      </div>
                      <Switch checked={rule.active} className="data-[state=checked]:bg-accent" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Rule Mode Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-error" />
                  <span className="text-xs text-foreground/80">Blocking</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-error/20 text-error">{blockingRules}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                  <span className="text-xs text-foreground/80">Warning</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-warning/20 text-warning">{warningRules}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3 text-accent" />
                  <span className="text-xs text-foreground/80">Advisory</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">{advisoryRules}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Pack Governance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Updated</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{new Date(pack.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Author</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-card flex items-center justify-center text-[10px] border border-border">G</div>
                  <p className="text-xs font-medium text-foreground">Governance Team</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scope</p>
                <Badge variant="secondary" className="text-[10px] font-mono">{pack.scope}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Recent Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatedDecisions.length > 0 ? (
                relatedDecisions.slice(0, 5).map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-card border border-border space-y-2 cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/decision-log/${d.id}`)}>
                    <div className="flex items-center justify-between">
                      <OutcomeBadge outcome={d.outcome} />
                      <span className="text-[10px] font-mono text-muted-foreground">{new Date(d.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] font-mono text-foreground/80 truncate">{d.id}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">No recent impact logs</p>
              )}
              <Button variant="ghost" className="w-full text-accent hover:text-accent/80 text-[10px] h-8" onClick={() => navigate('/decision-log')}>
                View All Impact Logs
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

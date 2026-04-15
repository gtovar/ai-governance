import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockPolicyPacks } from '../mockData';
import { StatusBadge } from '../components/Badges';
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function Policies() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Policy Packs</h2>
          <p className="text-muted-foreground">Manage the rulesets that drive the Governance Kernel decisions.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white text-xs h-9">
          Author New Policy Pack
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockPolicyPacks.map((pack) => (
          <Card key={pack.id} className="bg-surface border-border hover:border-accent/30 transition-all duration-300 group">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <History className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Impact</p>
                  <p className="text-sm font-bold text-foreground">1.2k Decisions</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Denials</p>
                  <p className="text-sm font-bold text-error">42</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Compliance</p>
                  <p className="text-sm font-bold text-success">98.2%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Governance Rules</h4>
                <div className="space-y-2">
                  {pack.rules.map((rule) => (
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
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn(
                          "text-[8px] uppercase font-bold px-1 py-0 h-4",
                          rule.mode === 'BLOCKING' ? 'border-error/20 text-error' : 'border-border text-muted-foreground'
                        )}>
                          {rule.mode}
                        </Badge>
                        <Switch checked={rule.active} className="data-[state=checked]:bg-accent scale-75" />
                      </div>
                    </div>
                  ))}
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
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Lock, 
  User,
  Eye,
  Terminal,
  Save,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

export function Settings() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Platform Settings</h2>
        <p className="text-muted-foreground">Configure your governance environment and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* Organization Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Building2 className="w-4 h-4 text-accent" />
            <h3>Organization</h3>
          </div>
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="text-muted-foreground">Organization Name</Label>
                  <Input id="org-name" defaultValue="Fintech Global Corp" className="bg-card border-border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain" className="text-muted-foreground">Primary Domain</Label>
                  <Input id="org-domain" defaultValue="fintech-global.com" className="bg-card border-border text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Governance Mode Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Shield className="w-4 h-4 text-accent" />
            <h3>Governance Mode</h3>
          </div>
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Audit-Only Mode</Label>
                  <p className="text-xs text-muted-foreground">Decisions will be logged but never block actions.</p>
                </div>
                <Switch className="data-[state=checked]:bg-accent" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Telemetry Export</Label>
                  <p className="text-xs text-muted-foreground">Enable OpenTelemetry and Langfuse data export.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-accent" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Strict Evidence Validation</Label>
                  <p className="text-xs text-muted-foreground">Require cryptographic proof for all evidence uploads.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-accent" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integrations Mock */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Database className="w-4 h-4 text-accent" />
            <h3>Integrations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'GitHub Enterprise', status: 'Connected', icon: Terminal },
              { name: 'Langfuse', status: 'Active', icon: Eye },
              { name: 'Datadog', status: 'Pending', icon: Activity },
              { name: 'Slack Notifications', status: 'Disabled', icon: Bell },
            ].map((int, i) => (
              <Card key={i} className="bg-surface border-border hover:border-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-card border border-border text-muted-foreground">
                      <int.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{int.name}</p>
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        int.status === 'Connected' || int.status === 'Active' ? 'text-success' : 'text-muted-foreground'
                      )}>{int.status}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Configure</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Discard Changes</Button>
          <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

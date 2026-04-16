import React from 'react';
import {
  Building2,
  Shield,
  Bell,
  Database,
  Eye,
  Terminal,
  Save,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ComingSoon } from '../components/ComingSoon';
import { PageHeader } from '../components/PageHeader';
import { cn } from '@/lib/utils';

const integrations = [
  { name: 'GitHub Enterprise', status: 'Connected', icon: Terminal },
  { name: 'Langfuse', status: 'Active', icon: Eye },
  { name: 'Datadog', status: 'Pending', icon: Activity },
  { name: 'Slack Notifications', status: 'Disabled', icon: Bell },
];

export function Settings() {
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Platform settings"
        description="Move the product toward a repeatable application shell: standardized form spacing, section hierarchy, and consistent action placement. This page is the first pass of that pattern."
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setComingSoon({ open: true, feature: 'Discard Changes' })}
            >
              Discard changes
            </Button>
            <Button
              className="gap-2"
              onClick={() => setComingSoon({ open: true, feature: 'Save Configuration' })}
            >
              <Save className="h-4 w-4" />
              Save configuration
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <Card className="surface-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Organization
              </CardTitle>
              <CardDescription>Base metadata used across governance workflows and reporting.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input id="org-name" defaultValue="Fintech Global Corp" className="h-11 bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-domain">Primary domain</Label>
                <Input id="org-domain" defaultValue="fintech-global.com" className="h-11 bg-background" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Governance mode
              </CardTitle>
              <CardDescription>Use consistent preference rows instead of ad hoc control groupings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <SettingRow
                title="Audit-only mode"
                description="Decisions are logged but never block actions. Useful for staged rollouts."
                control={<Switch />}
              />
              <Separator />
              <SettingRow
                title="Telemetry export"
                description="Enable OpenTelemetry and Langfuse export for runtime observability."
                control={<Switch defaultChecked />}
              />
              <Separator />
              <SettingRow
                title="Strict evidence validation"
                description="Require stronger proof and metadata before obligations can be closed."
                control={<Switch defaultChecked />}
              />
            </CardContent>
          </Card>

          <Card className="surface-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Integrations
              </CardTitle>
              <CardDescription>Standard card anatomy for external connections and operational state.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <button
                  key={integration.name}
                  type="button"
                  className="surface-2 flex items-center justify-between p-4 text-left transition-colors hover:border-primary/40"
                  onClick={() => setComingSoon({ open: true, feature: `Configure ${integration.name}` })}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <integration.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{integration.name}</p>
                      <p
                        className={cn(
                          'mt-1 text-xs font-medium',
                          integration.status === 'Connected' || integration.status === 'Active'
                            ? 'text-success'
                            : integration.status === 'Pending'
                              ? 'text-warning'
                              : 'text-muted-foreground'
                        )}
                      >
                        {integration.status}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="surface-1">
            <CardHeader>
              <CardTitle>Design standard adopted</CardTitle>
              <CardDescription>What changed in this pass.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Semantic page header with fixed action placement.</p>
              <p>Consistent card spacing, radii, and border treatment.</p>
              <p>Reusable preference rows for settings instead of one-off layouts.</p>
              <p>Neutral, framework-like tone based on shared tokens rather than isolated custom styles.</p>
            </CardContent>
          </Card>

          <Card className="surface-1">
            <CardHeader>
              <CardTitle>Next rollout</CardTitle>
              <CardDescription>Pages to migrate after this one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Dashboard KPI cards</p>
              <p>Workspace list filters and toolbar</p>
              <p>Decision log table header and empty states</p>
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

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="space-y-1">
        <Label className="text-sm font-medium text-foreground">{title}</Label>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="pt-1">{control}</div>
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  ShieldAlert,
  FileText,
  ShieldCheck,
  Activity,
  Settings,
  Search,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { ComingSoon } from './ComingSoon';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operations', path: '/dashboard' },
  { id: 'workspaces', label: 'Workspaces', icon: Briefcase, section: 'Operations', path: '/workspaces' },
  { id: 'checkpoints', label: 'Checkpoints', icon: CheckCircle2, section: 'Governance', path: '/checkpoints' },
  { id: 'obligations', label: 'Obligations', icon: ShieldAlert, section: 'Governance', path: '/obligations' },
  { id: 'decision-log', label: 'Decision Log', icon: FileText, section: 'Governance', path: '/decision-log' },
  { id: 'policies', label: 'Policies', icon: ShieldCheck, section: 'System', path: '/policies' },
  { id: 'telemetry', label: 'Telemetry', icon: Activity, section: 'System', path: '/telemetry' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System', path: '/settings' },
];

const headerMeta: Array<{ match: RegExp; title: string; subtitle: string }> = [
  { match: /^\/dashboard/, title: 'Operational overview', subtitle: 'Track workspace health, obligations, and governance activity.' },
  { match: /^\/workspaces/, title: 'Workspace management', subtitle: 'Review ownership, posture, and next actions for every workspace.' },
  { match: /^\/checkpoints/, title: 'Governance checkpoints', subtitle: 'Monitor readiness gates, missing evidence, and release blockers.' },
  { match: /^\/obligations/, title: 'Compliance obligations', subtitle: 'See open work, evidence requests, and resolution status.' },
  { match: /^\/decision-log/, title: 'Decision log', subtitle: 'Inspect evaluation outcomes, reasons, and traceability.' },
  { match: /^\/policies/, title: 'Policy packs', subtitle: 'Manage the rules and controls the kernel evaluates.' },
  { match: /^\/telemetry/, title: 'Telemetry', subtitle: 'Observe system health, throughput, and platform signals.' },
  { match: /^\/settings/, title: 'Platform settings', subtitle: 'Configure organization defaults, governance mode, and integrations.' },
];

function getHeaderContent(pathname: string) {
  return headerMeta.find((item) => item.match.test(pathname)) ?? {
    title: 'Portal',
    subtitle: 'Governance workspace',
  };
}

export function Sidebar() {
  const location = useLocation();
  const sections = ['Operations', 'Governance', 'System'];
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <Link to="/dashboard" className="border-b border-border px-6 py-5 transition-opacity hover:opacity-90">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            AI
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">AI Governance</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Standardized operations console</p>
          </div>
        </div>
      </Link>

      <ScrollArea className="flex-1 px-4 py-5">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section} className="space-y-2">
              <p className="px-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{section}</p>
              <nav className="space-y-1">
                {navItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'
                        )
                      }
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4',
                          location.pathname.startsWith(item.path) ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="surface-2 mb-4 p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Kernel health</span>
            <span className="font-semibold text-success">99.9%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[99.9%] rounded-full bg-success" />
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => setComingSoon({ open: true, feature: 'User Profile Settings' })}
        >
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GT</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Gilberto Tovar</p>
            <p className="truncate text-xs text-muted-foreground">Admin operator</p>
          </div>
        </button>
      </div>

      <ComingSoon
        isOpen={comingSoon.open}
        onOpenChange={(open) => setComingSoon({ ...comingSoon, open })}
        featureName={comingSoon.feature}
      />
    </aside>
  );
}

export function Header() {
  const location = useLocation();
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });
  const header = getHeaderContent(location.pathname);

  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Portal</span>
            <span>/</span>
            <span className="font-medium text-foreground">{header.title}</span>
          </div>
          <p className="truncate text-sm text-muted-foreground">{header.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden w-80 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search traces, decisions, or workspaces"
              className="h-10 rounded-xl bg-surface pl-9"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setComingSoon({ open: true, feature: 'Global Search' });
              }}
            />
          </div>

          <Badge variant="outline" className="hidden h-9 rounded-xl px-3 text-xs md:flex">
            PROD-US-WEST-2
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => setComingSoon({ open: true, feature: 'Notifications' })}
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="hidden h-10 rounded-xl md:inline-flex"
            onClick={() => setComingSoon({ open: true, feature: 'Kernel Health Diagnostics' })}
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-success" />
            Kernel online
          </Button>
        </div>
      </div>

      <ComingSoon
        isOpen={comingSoon.open}
        onOpenChange={(open) => setComingSoon({ ...comingSoon, open })}
        featureName={comingSoon.feature}
      />
    </header>
  );
}

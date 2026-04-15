import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Settings,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operations' },
  { id: 'workspaces', label: 'Workspaces', icon: Briefcase, section: 'Operations' },
  { id: 'checkpoints', label: 'Checkpoints', icon: CheckCircle2, section: 'Governance' },
  { id: 'obligations', label: 'Obligations', icon: ShieldAlert, section: 'Governance' },
  { id: 'decision-log', label: 'Decision Log', icon: FileText, section: 'Governance' },
  { id: 'policies', label: 'Policies', icon: ShieldCheck, section: 'System' },
  { id: 'telemetry', label: 'Telemetry', icon: Activity, section: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const sections = ['Operations', 'Governance', 'System'];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border w-[240px] text-muted-foreground">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-accent/20">
          G
        </div>
        <div className="flex flex-col">
          <span className="font-black text-foreground tracking-tighter text-sm uppercase leading-none">Governanza AI</span>
          <span className="text-[9px] font-bold text-accent tracking-widest uppercase mt-1">Kernel Portal</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          {sections.map(section => (
            <div key={section} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">{section}</h4>
              {navItems.filter(item => item.section === section).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200",
                    activeTab === item.id 
                      ? "bg-card text-foreground shadow-sm border border-border/50" 
                      : "hover:bg-card/50 hover:text-foreground border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-accent" : "text-muted-foreground")} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-4">
        <div className="px-2 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Kernel Health</span>
            <span className="text-success">99.9%</span>
          </div>
          <div className="h-1 w-full bg-card rounded-full overflow-hidden">
            <div className="h-full bg-success w-[99.9%]" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-card transition-colors cursor-pointer group">
          <Avatar className="w-8 h-8 border border-border group-hover:border-accent/50 transition-colors">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GT</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">Gilberto Tovar</p>
            <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">Admin Operator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Portal <span className="mx-2 text-border">/</span> <span className="text-foreground">{title}</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono border-accent/20 text-accent bg-accent/5 h-5">
          PROD-US-WEST-2
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search traces, decisions, workspaces..." 
            className="pl-9 bg-surface border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-accent h-9 text-xs"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-surface h-9 w-9">
          <Bell className="w-4 h-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-border mx-1" />
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-surface gap-2 h-9 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Kernel Online</span>
        </Button>
      </div>
    </header>
  );
}

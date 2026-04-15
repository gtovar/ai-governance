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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workspaces', label: 'Workspaces', icon: Briefcase },
  { id: 'checkpoints', label: 'Checkpoints', icon: CheckCircle2 },
  { id: 'obligations', label: 'Obligations', icon: ShieldAlert },
  { id: 'decision-log', label: 'Decision Log', icon: FileText },
  { id: 'policies', label: 'Policies', icon: ShieldCheck },
  { id: 'telemetry', label: 'Telemetry', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-surface border-r border-border w-[220px] text-muted-foreground">
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-white font-bold text-xs">
          G
        </div>
        <span className="font-bold text-foreground tracking-tight text-sm uppercase">Governanza AI</span>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-card text-foreground shadow-sm" 
                  : "hover:bg-card/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-accent" : "text-muted-foreground")} />
              {item.label}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-card transition-colors cursor-pointer">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GT</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Gilberto Tovar</p>
            <p className="text-xs text-muted-foreground truncate">Admin Operator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="text-[13px] text-muted-foreground">
        Portal / <span className="text-foreground font-semibold">{title}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search everything..." 
            className="pl-9 bg-surface border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-accent h-9"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-surface">
          <Bell className="w-4 h-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-border mx-1" />
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-surface gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium">Kernel Online</span>
        </Button>
      </div>
    </header>
  );
}

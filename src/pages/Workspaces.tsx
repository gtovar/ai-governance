import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockWorkspaces } from '../mockData';
import { StatusBadge, SeverityBadge, OutcomeBadge } from '../components/Badges';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Users, 
  Shield,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Workspaces() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkspaces = mockWorkspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search workspaces by name or owner..." 
            className="pl-10 bg-surface border-border text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white">
            Create Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkspaces.map((ws) => (
          <Card key={ws.id} className="bg-surface border-border hover:border-accent/50 transition-all duration-300 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                    {ws.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-1">{ws.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Workspace</DropdownMenuItem>
                    <DropdownMenuItem className="text-error">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{ws.owner}</span>
                </div>
                <StatusBadge status={ws.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Risk Level</p>
                  <SeverityBadge severity={ws.riskLevel} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Last Decision</p>
                  <OutcomeBadge outcome={ws.lastDecisionOutcome} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">{ws.openObligationsCount}</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">Obligations</span>
                  </div>
                  <div className="h-8 w-[1px] bg-border" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">12</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">Decisions</span>
                  </div>
                </div>
                
                {ws.status === 'BLOCKED' && (
                  <div className="flex items-center gap-1.5 text-error">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Action Required</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

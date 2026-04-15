import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockObligations, mockWorkspaces, mockEvidence } from '../mockData';
import { StatusBadge, SeverityBadge } from '../components/Badges';
import { 
  ShieldAlert, 
  Calendar, 
  User, 
  Paperclip, 
  ExternalLink,
  History,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export function Obligations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Obligations</h2>
          <p className="text-muted-foreground">Track and satisfy regulatory, security, and operational requirements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9">
            Export Audit Log
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white text-xs h-9">
            Create Obligation
          </Button>
        </div>
      </div>

      <Card className="bg-surface border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-card/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Obligation / Description</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Workspace</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Evidence Status</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Severity</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Status</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4">Due Date</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockObligations.map((ob) => {
              const workspace = mockWorkspaces.find(w => w.id === ob.workspaceId);
              const isOverdue = new Date(ob.dueDate) < new Date() && ob.status === 'OPEN';
              const evidenceCount = mockEvidence.filter(e => e.obligationId === ob.id).length;

              return (
                <TableRow key={ob.id} className="border-border hover:bg-card/30 transition-colors group">
                  <TableCell className="py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                        {ob.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{ob.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-foreground/80">{workspace?.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        evidenceCount > 0 ? "bg-success" : "bg-warning"
                      )} />
                      <span className="text-xs text-foreground/70">{evidenceCount} Items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={ob.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ob.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className={cn("w-3 h-3", isOverdue ? "text-error" : "text-muted-foreground")} />
                      <span className={cn("text-[10px] font-mono", isOverdue ? "text-error font-bold" : "text-muted-foreground")}>
                        {new Date(ob.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-success hover:bg-success/10" title="Mark Satisfied">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10" title="Upload Evidence">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card" title="View Details">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

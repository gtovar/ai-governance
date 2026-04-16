import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockObligations, mockWorkspaces, mockEvidence, mockDecisions } from '../mockData';
import { StatusBadge, SeverityBadge, OutcomeBadge } from '../components/Badges';
import { 
  ShieldAlert, 
  Calendar, 
  User, 
  Paperclip, 
  ExternalLink,
  History,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Shield,
  FileText,
  Clock,
  ChevronRight,
  Download,
  AlertTriangle
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
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ComingSoon } from '../components/ComingSoon';

export function Obligations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  if (id) return <ObligationDetail />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Governance Obligations</h2>
          <p className="text-muted-foreground">Track and satisfy regulatory, security, and operational requirements.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9"
            onClick={() => setComingSoon({ open: true, feature: 'Export Audit Log' })}
          >
            Export Audit Log
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white text-xs h-9"
            onClick={() => setComingSoon({ open: true, feature: 'Create Obligation' })}
          >
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
                <TableRow key={ob.id} className="border-border hover:bg-card/30 transition-colors group cursor-pointer" onClick={() => navigate(`/obligations/${ob.id}`)}>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-success hover:bg-success/10" 
                        title="Mark Satisfied" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setComingSoon({ open: true, feature: 'Mark Obligation Satisfied' });
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10" 
                        title="Upload Evidence" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setComingSoon({ open: true, feature: 'Upload Evidence' });
                        }}
                      >
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
      <ComingSoon 
        isOpen={comingSoon.open} 
        onOpenChange={(open) => setComingSoon({ ...comingSoon, open })} 
        featureName={comingSoon.feature} 
      />
    </div>
  );
}

export function ObligationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({ open: false, feature: '' });

  const ob = mockObligations.find(o => o.id === id);
  if (!ob) return <div className="p-8 text-center text-muted-foreground">Obligation not found</div>;

  const workspace = mockWorkspaces.find(w => w.id === ob.workspaceId);
  const evidence = mockEvidence.filter(e => e.obligationId === ob.id);
  const relatedDecisions = mockDecisions.filter(d => d.obligationIds.includes(ob.id));

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="text-muted-foreground hover:text-foreground -ml-2 gap-2"
        onClick={() => navigate('/obligations')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Obligations
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground">{ob.title}</h2>
                <StatusBadge status={ob.status} />
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                ID: <span className="font-mono text-accent">{ob.id}</span> • 
                Type: <span className="text-foreground font-medium uppercase text-xs tracking-wider">{ob.type}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-surface border-border text-muted-foreground hover:text-foreground text-xs h-9"
                onClick={() => setComingSoon({ open: true, feature: 'Request Waiver' })}
              >
                Request Waiver
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white text-xs h-9 gap-2"
                onClick={() => setComingSoon({ open: true, feature: 'Upload Evidence' })}
              >
                <Paperclip className="w-4 h-4" />
                Upload Evidence
              </Button>
            </div>
          </div>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                Obligation Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {ob.description}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-accent" />
              Evidence Audit Trail
            </h3>
            {evidence.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {evidence.map((ev) => (
                  <Card key={ev.id} className="bg-surface border-border hover:border-accent/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{ev.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {ev.type} • Uploaded {new Date(ev.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] bg-success/5 text-success border-success/20">VERIFIED</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setComingSoon({ open: true, feature: 'Download Evidence' })}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-surface border-border border-dashed">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">No Evidence Provided</p>
                    <p className="text-xs text-muted-foreground">This obligation requires evidence items to be satisfied.</p>
                  </div>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-white text-xs h-9"
                    onClick={() => setComingSoon({ open: true, feature: 'Upload Evidence' })}
                  >
                    Upload First Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Obligation Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Severity</p>
                <SeverityBadge severity={ob.severity} />
              </div>
              <Separator className="bg-border" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace</p>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/workspaces/${workspace?.id}`)}>
                  <p className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">{workspace?.name}</p>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent" />
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Due Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{new Date(ob.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Related Decisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatedDecisions.length > 0 ? (
                relatedDecisions.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-card border border-border space-y-2 cursor-pointer hover:border-accent/50 transition-colors" onClick={() => navigate(`/decision-log/${d.id}`)}>
                    <div className="flex items-center justify-between">
                      <OutcomeBadge outcome={d.outcome} />
                      <span className="text-[10px] font-mono text-muted-foreground">{new Date(d.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] font-mono text-foreground/80 truncate">{d.id}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">No related decisions</p>
              )}
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

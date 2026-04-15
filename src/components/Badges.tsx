import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DecisionOutcome, Severity, Status } from '@/src/types';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    ACTIVE: "bg-success/10 text-success border-success/20",
    INACTIVE: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    PENDING: "bg-warning/10 text-warning border-warning/20",
    COMPLETED: "bg-accent/10 text-accent border-accent/20",
    BLOCKED: "bg-error/10 text-error border-error/20",
    OPEN: "bg-accent/10 text-accent border-accent/20",
    CLOSED: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    SATISFIED: "bg-success/10 text-success border-success/20",
    WAIVED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <Badge variant="outline" className={cn("font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider", styles[status])}>
      {status}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    LOW: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    MEDIUM: "bg-accent/10 text-accent border-accent/20",
    HIGH: "bg-warning/10 text-warning border-warning/20",
    CRITICAL: "bg-error/10 text-error border-error/20 animate-pulse",
  };

  return (
    <Badge variant="outline" className={cn("font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider", styles[severity])}>
      {severity}
    </Badge>
  );
}

export function OutcomeBadge({ outcome }: { outcome: DecisionOutcome }) {
  const styles: Record<DecisionOutcome, string> = {
    ALLOW: "bg-success/10 text-success border-success/20",
    DENY: "bg-error/10 text-error border-error/20",
    REQUIRE_EVIDENCE: "bg-warning/10 text-warning border-warning/20",
    ADVISE: "bg-accent/10 text-accent border-accent/20",
    WARNING: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <Badge variant="outline" className={cn("font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider", styles[outcome])}>
      {outcome.replace('_', ' ')}
    </Badge>
  );
}

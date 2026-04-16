import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DecisionOutcome, Severity, Status } from '@/src/types';
import { cn } from '@/lib/utils';

const baseBadgeClass = 'rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]';

export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    ACTIVE: 'border-success/20 bg-success/10 text-success',
    INACTIVE: 'border-border bg-muted text-muted-foreground',
    PENDING: 'border-warning/20 bg-warning/10 text-warning',
    COMPLETED: 'border-primary/20 bg-primary/10 text-primary',
    BLOCKED: 'border-error/20 bg-error/10 text-error',
    OPEN: 'border-primary/20 bg-primary/10 text-primary',
    CLOSED: 'border-border bg-muted text-muted-foreground',
    SATISFIED: 'border-success/20 bg-success/10 text-success',
    WAIVED: 'border-border bg-muted text-muted-foreground',
  };

  return (
    <Badge variant="outline" className={cn(baseBadgeClass, styles[status])}>
      {status}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    LOW: 'border-border bg-muted text-muted-foreground',
    MEDIUM: 'border-primary/20 bg-primary/10 text-primary',
    HIGH: 'border-warning/20 bg-warning/10 text-warning',
    CRITICAL: 'border-error/20 bg-error/10 text-error',
  };

  return (
    <Badge variant="outline" className={cn(baseBadgeClass, styles[severity])}>
      {severity}
    </Badge>
  );
}

export function OutcomeBadge({ outcome }: { outcome: DecisionOutcome }) {
  const styles: Record<DecisionOutcome, string> = {
    ALLOW: 'border-success/20 bg-success/10 text-success',
    DENY: 'border-error/20 bg-error/10 text-error',
    REQUIRE_EVIDENCE: 'border-warning/20 bg-warning/10 text-warning',
    ADVISE: 'border-primary/20 bg-primary/10 text-primary',
    WARNING: 'border-warning/20 bg-warning/10 text-warning',
  };

  return (
    <Badge variant="outline" className={cn(baseBadgeClass, styles[outcome])}>
      {outcome.replace('_', ' ')}
    </Badge>
  );
}

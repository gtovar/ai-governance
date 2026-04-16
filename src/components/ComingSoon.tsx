import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Construction, Info } from 'lucide-react';

interface ComingSoonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export function ComingSoon({ isOpen, onOpenChange, featureName }: ComingSoonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Construction className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">Feature Unavailable</DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            The <span className="text-accent font-bold">"{featureName}"</span> capability is currently under development in the Governance Kernel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 px-6 bg-surface border border-border rounded-lg flex items-start gap-3">
          <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This prototype focuses on the <span className="text-foreground font-medium">operational visibility</span> and <span className="text-foreground font-medium">decision forensics</span> of the platform. Write operations and configuration changes are simulated in this version.
          </p>
        </div>

        <DialogFooter>
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white" 
            onClick={() => onOpenChange(false)}
          >
            Acknowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

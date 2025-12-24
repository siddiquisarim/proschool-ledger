import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  DollarSign,
  FileText,
  Eye,
} from 'lucide-react';
import { mockClosures } from '@/data/mockData';
import { DailyClosure } from '@/types';

export function VerificationPage() {
  const { currentUser, t } = useApp();
  const [selectedClosure, setSelectedClosure] = useState<DailyClosure | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'finalize' | 'deposit'>('approve');

  const isSupervisor = currentUser?.role === 'supervisor' || currentUser?.role === 'admin';
  const isAccountant = currentUser?.role === 'accountant' || currentUser?.role === 'admin';

  const pendingSupervisor = mockClosures.filter(c => c.status === 'pending');
  const pendingAccountant = mockClosures.filter(c => c.status === 'supervisor_approved');
  const finalized = mockClosures.filter(c => c.status === 'finalized' || c.status === 'deposited');

  const handleAction = (closure: DailyClosure, action: typeof actionType) => {
    setSelectedClosure(closure);
    setActionType(action);
    setVerifyNotes('');
    setIsDialogOpen(true);
  };

  const getActionLabel = () => {
    switch (actionType) {
      case 'approve': return 'Approve Closure';
      case 'reject': return 'Reject Closure';
      case 'finalize': return 'Finalize Closure';
      case 'deposit': return 'Mark as Deposited';
    }
  };

  const renderClosureCard = (closure: DailyClosure, showActions: boolean, actionLevel: 'supervisor' | 'accountant') => (
    <Card key={closure.id} className="overflow-hidden">
      <div className="data-card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded flex items-center justify-center",
            closure.status === 'pending' && "bg-amber/20 text-amber",
            closure.status === 'supervisor_approved' && "bg-status-partial/20 text-status-partial",
            closure.status === 'finalized' && "bg-accent/20 text-accent",
            closure.status === 'deposited' && "bg-accent/20 text-accent"
          )}>
            {closure.status === 'pending' && <Clock className="w-5 h-5" />}
            {closure.status === 'supervisor_approved' && <CheckCircle2 className="w-5 h-5" />}
            {(closure.status === 'finalized' || closure.status === 'deposited') && <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-medium">{closure.cashierName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(closure.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <span className={cn("status-badge", {
          "status-pending": closure.status === 'pending',
          "status-partial": closure.status === 'supervisor_approved',
          "status-paid": closure.status === 'finalized' || closure.status === 'deposited',
        })}>
          {closure.status === 'pending' && 'Pending Supervisor'}
          {closure.status === 'supervisor_approved' && 'Pending Accountant'}
          {closure.status === 'finalized' && 'Finalized'}
          {closure.status === 'deposited' && 'Deposited'}
        </span>
      </div>
      
      <div className="p-4">
        {/* Transaction Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cash</p>
            <p className="font-mono font-medium">AED {closure.totalCash.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Card</p>
            <p className="font-mono font-medium">AED {closure.totalCard.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Transfer</p>
            <p className="font-mono font-medium">AED {closure.totalBankTransfer.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Check</p>
            <p className="font-mono font-medium">AED {closure.totalCheck.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 bg-primary/10 rounded border-2 border-primary/20">
            <p className="text-xs text-primary font-medium uppercase tracking-wider">Total</p>
            <p className="font-mono font-semibold text-lg">AED {closure.grandTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{closure.transactionCount} transactions</span>
          <span>Submitted: {new Date(closure.createdAt).toLocaleTimeString()}</span>
        </div>

        {/* Notes from previous verifications */}
        {closure.supervisorNotes && (
          <div className="mb-3 p-2 bg-muted/30 rounded text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Supervisor Notes:</p>
            <p>{closure.supervisorNotes}</p>
          </div>
        )}
        {closure.accountantNotes && (
          <div className="mb-3 p-2 bg-muted/30 rounded text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Accountant Notes:</p>
            <p>{closure.accountantNotes}</p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
              View Details
            </Button>
            {actionLevel === 'supervisor' && isSupervisor && (
              <>
                <Button variant="success" size="sm" onClick={() => handleAction(closure, 'approve')}>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleAction(closure, 'reject')}>
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </>
            )}
            {actionLevel === 'accountant' && isAccountant && (
              <>
                <Button variant="success" size="sm" onClick={() => handleAction(closure, 'finalize')}>
                  <CheckCircle2 className="w-4 h-4" />
                  Finalize
                </Button>
                <Button variant="enterprise" size="sm" onClick={() => handleAction(closure, 'deposit')}>
                  <Building2 className="w-4 h-4" />
                  Mark Deposited
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.verification')}</h1>
          <p className="text-sm text-muted-foreground">
            Financial triple-check workflow: Cashier → Supervisor → Accountant
          </p>
        </div>
      </div>

      {/* Workflow Diagram */}
      <Card className="p-4">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber" />
            </div>
            <div>
              <p className="font-medium">Cashier</p>
              <p className="text-xs text-muted-foreground">Daily Closure</p>
            </div>
          </div>
          <div className="w-8 h-[2px] bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-status-partial/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-status-partial" />
            </div>
            <div>
              <p className="font-medium">Supervisor</p>
              <p className="text-xs text-muted-foreground">Verify & Approve</p>
            </div>
          </div>
          <div className="w-8 h-[2px] bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-medium">Accountant</p>
              <p className="text-xs text-muted-foreground">Finalize & Deposit</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Verification Queues */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending Supervisor
            {pendingSupervisor.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xxs bg-amber text-foreground rounded">
                {pendingSupervisor.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pending Accountant
            {pendingAccountant.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xxs bg-status-partial text-foreground rounded">
                {pendingAccountant.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="finalized" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Finalized
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSupervisor.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">No closures pending supervisor approval</p>
            </Card>
          ) : (
            pendingSupervisor.map(c => renderClosureCard(c, true, 'supervisor'))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {pendingAccountant.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">No closures pending accountant finalization</p>
            </Card>
          ) : (
            pendingAccountant.map(c => renderClosureCard(c, true, 'accountant'))
          )}
        </TabsContent>

        <TabsContent value="finalized" className="space-y-4">
          {finalized.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No finalized closures yet</p>
            </Card>
          ) : (
            finalized.map(c => renderClosureCard(c, false, 'accountant'))
          )}
        </TabsContent>
      </Tabs>

      {/* Verification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionLabel()}</DialogTitle>
          </DialogHeader>
          {selectedClosure && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedClosure.cashierName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(selectedClosure.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xl font-mono font-semibold">AED {selectedClosure.grandTotal.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Add verification notes..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'success'}
              onClick={() => setIsDialogOpen(false)}
            >
              {getActionLabel()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

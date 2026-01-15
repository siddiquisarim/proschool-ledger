import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  User,
  Calendar,
  History,
  Receipt,
} from 'lucide-react';
import { mockClosures, mockPayments, mockStudents } from '@/data/mockData';
import { DailyClosure, Payment } from '@/types';

export function VerificationPage() {
  const { currentUser, t } = useApp();
  const [selectedClosure, setSelectedClosure] = useState<DailyClosure | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'finalize' | 'deposit'>('approve');

  const isSupervisor = currentUser?.role === 'supervisor' || currentUser?.role === 'admin';
  const isAccountant = currentUser?.role === 'accountant' || currentUser?.role === 'admin';

  const pendingSupervisor = mockClosures.filter(c => c.status === 'pending');
  const pendingAccountant = mockClosures.filter(c => c.status === 'supervisor_approved');
  const finalized = mockClosures.filter(c => c.status === 'finalized' || c.status === 'deposited');

  // Get payments for a specific cashier on a specific date
  const getClosurePayments = (cashierId: string, date: string): Payment[] => {
    return mockPayments.filter(p => 
      p.cashierId === cashierId && 
      p.paymentDate === date
    );
  };

  // Get student name by ID
  const getStudentName = (studentId: string): string => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const handleAction = (closure: DailyClosure, action: typeof actionType) => {
    setSelectedClosure(closure);
    setActionType(action);
    setVerifyNotes('');
    setIsDialogOpen(true);
  };

  const handleViewDetails = (closure: DailyClosure) => {
    setSelectedClosure(closure);
    setIsDetailsDialogOpen(true);
  };

  const getActionLabel = () => {
    switch (actionType) {
      case 'approve': return 'Approve Closure';
      case 'reject': return 'Reject Closure';
      case 'finalize': return 'Finalize Closure';
      case 'deposit': return 'Mark as Deposited';
    }
  };

  const getPaymentMethodBadge = (method: Payment['paymentMethod']) => {
    const variants: Record<string, string> = {
      cash: 'bg-accent/20 text-accent',
      card: 'bg-primary/20 text-primary',
      bank_transfer: 'bg-status-partial/20 text-status-partial',
      check: 'bg-amber/20 text-amber',
    };
    return <Badge className={cn("text-xs", variants[method])}>{method.replace('_', ' ')}</Badge>;
  };

  const renderClosureCard = (closure: DailyClosure, showActions: boolean, actionLevel: 'supervisor' | 'accountant') => {
    const payments = getClosurePayments(closure.cashierId, closure.date);
    
    return (
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
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{closure.cashierName}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {new Date(closure.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
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
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Receipt className="w-4 h-4" />
                {closure.transactionCount} transactions
              </span>
              <span>•</span>
              <span>Submitted: {new Date(closure.createdAt).toLocaleTimeString()}</span>
            </div>
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
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => handleViewDetails(closure)}>
              <Eye className="w-4 h-4" />
              View Transactions
            </Button>
            {showActions && actionLevel === 'supervisor' && isSupervisor && (
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
            {showActions && actionLevel === 'accountant' && isAccountant && (
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
        </div>
      </Card>
    );
  };

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
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Deposit History
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
          {finalized.filter(c => c.status === 'finalized').length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No finalized closures awaiting deposit</p>
            </Card>
          ) : (
            finalized.filter(c => c.status === 'finalized').map(c => renderClosureCard(c, true, 'accountant'))
          )}
        </TabsContent>

        {/* Deposit History Tab */}
        <TabsContent value="history">
          <Card>
            <div className="data-card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <History className="w-4 h-4" />
                Completed Deposits
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead className="text-center">Transactions</TableHead>
                  <TableHead className="text-right">Cash</TableHead>
                  <TableHead className="text-right">Card</TableHead>
                  <TableHead className="text-right">Transfer</TableHead>
                  <TableHead className="text-right">Check</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finalized.filter(c => c.status === 'deposited').length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No completed deposits yet
                    </TableCell>
                  </TableRow>
                ) : (
                  finalized.filter(c => c.status === 'deposited').map(closure => (
                    <TableRow key={closure.id}>
                      <TableCell>
                        {new Date(closure.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="font-medium">{closure.cashierName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{closure.transactionCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">AED {closure.totalCash.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">AED {closure.totalCard.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">AED {closure.totalBankTransfer.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">AED {closure.totalCheck.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        AED {closure.grandTotal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-accent text-accent-foreground">Deposited</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(closure)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Action Dialog */}
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

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedClosure && (
            <div className="space-y-4">
              {/* Closure Summary */}
              <div className="p-4 bg-muted/50 rounded">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Cashier</p>
                    <p className="font-medium">{selectedClosure.cashierName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                    <p className="font-medium">{new Date(selectedClosure.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Transactions</p>
                    <p className="font-medium">{selectedClosure.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Total</p>
                    <p className="font-mono font-semibold text-lg">AED {selectedClosure.grandTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Transactions List */}
              <div>
                <h4 className="font-medium mb-3">All Transactions ({selectedClosure.transactionCount})</h4>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt #</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Original</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getClosurePayments(selectedClosure.cashierId, selectedClosure.date).map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.receiptNumber}</TableCell>
                          <TableCell className="font-medium">{getStudentName(payment.studentId)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.feeType}</Badge>
                          </TableCell>
                          <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                          <TableCell className="text-right font-mono">AED {payment.originalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-accent">
                            {payment.discountApplied > 0 ? `-AED ${payment.discountApplied.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">AED {payment.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {getClosurePayments(selectedClosure.cashierId, selectedClosure.date).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No transaction details available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {/* Verification Notes */}
              {(selectedClosure.supervisorNotes || selectedClosure.accountantNotes) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Verification Notes</h4>
                    {selectedClosure.supervisorNotes && (
                      <div className="p-3 bg-muted/30 rounded text-sm">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Supervisor:</p>
                        <p>{selectedClosure.supervisorNotes}</p>
                      </div>
                    )}
                    {selectedClosure.accountantNotes && (
                      <div className="p-3 bg-muted/30 rounded text-sm">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Accountant:</p>
                        <p>{selectedClosure.accountantNotes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

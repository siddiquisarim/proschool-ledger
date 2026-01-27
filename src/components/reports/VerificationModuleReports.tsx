import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  ClipboardList,
  Receipt,
  User,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { mockClosures, mockPayments } from '@/data/mockData';

interface VerificationModuleReportsProps {
  role: 'cashier' | 'supervisor' | 'accountant' | 'admin';
}

export function VerificationModuleReports({ role }: VerificationModuleReportsProps) {
  const { currentUser } = useApp();

  const isCashier = role === 'cashier';
  const isSupervisor = role === 'supervisor' || role === 'admin';
  const isAccountant = role === 'accountant' || role === 'admin';

  const getTabs = () => {
    const tabs = [];

    if (isCashier) {
      tabs.push(
        { value: 'pending-summary', label: 'Pending Summary', icon: <ClipboardList className="w-4 h-4" /> },
        { value: 'pending-details', label: 'Pending Details', icon: <Receipt className="w-4 h-4" /> },
      );
    }

    if (isSupervisor) {
      tabs.push(
        { value: 'supervisor-pending', label: 'Pending Receipts', icon: <ClipboardList className="w-4 h-4" /> },
        { value: 'cashier-receipts', label: 'Cashier Receipts', icon: <User className="w-4 h-4" /> },
      );
    }

    if (isAccountant) {
      tabs.push(
        { value: 'accountant-pending', label: 'Pending Finalization', icon: <ClipboardList className="w-4 h-4" /> },
        { value: 'cashier-summary', label: 'Cashier Summary', icon: <User className="w-4 h-4" /> },
      );
    }

    return tabs;
  };

  const tabs = getTabs();
  const pendingClosures = mockClosures.filter(c => c.status === 'pending');
  const supervisorApproved = mockClosures.filter(c => c.status === 'supervisor_approved');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');

  if (tabs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No reports available for your role</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <MobileTabs tabs={tabs} defaultValue={tabs[0].value}>
        {/* Cashier: Pending Summary */}
        {isCashier && (
          <TabsContent value="pending-summary" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export Excel</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Print</span>
                </Button>
              </div>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Transactions</TableHead>
                      <TableHead className="text-right">Total Cash</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingClosures.filter(c => c.cashierId === currentUser?.id).map(closure => (
                      <TableRow key={closure.id}>
                        <TableCell>{new Date(closure.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{closure.transactionCount}</TableCell>
                        <TableCell className="text-right font-mono">AED {closure.totalCash.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Cashier: Pending Details */}
        {isCashier && (
          <TabsContent value="pending-details" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.filter(p => p.cashierId === currentUser?.id).slice(0, 10).map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.receiptNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{payment.studentId}</TableCell>
                        <TableCell>{payment.feeType}</TableCell>
                        <TableCell className="text-right font-mono">AED {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Supervisor: Pending Receipts */}
        {isSupervisor && (
          <TabsContent value="supervisor-pending" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
              </div>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Transactions</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingClosures.map(closure => (
                      <TableRow key={closure.id}>
                        <TableCell className="font-medium">{closure.cashierName}</TableCell>
                        <TableCell>{new Date(closure.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{closure.transactionCount}</TableCell>
                        <TableCell className="text-right font-mono">AED {closure.grandTotal.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending Approval</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Supervisor: Cashier Receipts Summary */}
        {isSupervisor && (
          <TabsContent value="cashier-receipts" className="space-y-4">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cashier</TableHead>
                      <TableHead className="text-center">Pending</TableHead>
                      <TableHead className="text-center">Approved</TableHead>
                      <TableHead className="text-right">Total Pending Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Cashier</TableCell>
                      <TableCell className="text-center">3</TableCell>
                      <TableCell className="text-center">12</TableCell>
                      <TableCell className="text-right font-mono">AED 45,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Jane Cashier</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">8</TableCell>
                      <TableCell className="text-right font-mono">AED 18,500</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Accountant: Pending Finalization */}
        {isAccountant && (
          <TabsContent value="accountant-pending" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
              </div>
            </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supervisor ID</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supervisorApproved.map(closure => (
                    <TableRow key={closure.id}>
                      <TableCell className="font-medium">{closure.cashierName}</TableCell>
                      <TableCell>{new Date(closure.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-xs">{closure.supervisorId || '-'}</TableCell>
                      <TableCell className="text-right font-mono">AED {closure.grandTotal.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Pending Finalization</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Accountant: Cashier Summary */}
        {isAccountant && (
          <TabsContent value="cashier-summary" className="space-y-4">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cashier</TableHead>
                      <TableHead className="text-center">Pending</TableHead>
                      <TableHead className="text-center">Finalized</TableHead>
                      <TableHead className="text-center">Deposited</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Cashier</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">5</TableCell>
                      <TableCell className="text-center">10</TableCell>
                      <TableCell className="text-right font-mono">AED 125,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        )}
      </MobileTabs>
    </div>
  );
}

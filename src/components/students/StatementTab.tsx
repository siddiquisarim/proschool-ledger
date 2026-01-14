import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, X, Clock } from 'lucide-react';
import { mockAcademicYears } from '@/data/settingsData';
import { cn } from '@/lib/utils';

interface StatementTabProps {
  studentId?: string;
}

// Mock statement data
const mockStatements = [
  { id: '1', type: 'Registration Fee', amount: 500, status: 'paid', paidDate: '2024-08-15', month: null },
  { id: '2', type: 'Tuition Fee', amount: 3000, status: 'paid', paidDate: '2024-08-15', month: null },
  { id: '3', type: 'Books & Materials', amount: 800, status: 'paid', paidDate: '2024-08-20', month: null },
  { id: '4', type: 'Monthly Fee', amount: 250, status: 'paid', paidDate: '2024-09-10', month: 'September 2024' },
  { id: '5', type: 'Monthly Fee', amount: 250, status: 'paid', paidDate: '2024-10-08', month: 'October 2024' },
  { id: '6', type: 'Monthly Fee', amount: 250, status: 'paid', paidDate: '2024-11-10', month: 'November 2024' },
  { id: '7', type: 'Monthly Fee', amount: 250, status: 'partial', paidDate: null, month: 'December 2024', paidAmount: 100 },
  { id: '8', type: 'Monthly Fee', amount: 250, status: 'unpaid', paidDate: null, month: 'January 2025' },
  { id: '9', type: 'Monthly Fee', amount: 250, status: 'unpaid', paidDate: null, month: 'February 2025' },
  { id: '10', type: 'Monthly Fee', amount: 250, status: 'unpaid', paidDate: null, month: 'March 2025' },
];

export function StatementTab({ studentId }: StatementTabProps) {
  const totalPaid = mockStatements.reduce((sum, s) => 
    sum + (s.status === 'paid' ? s.amount : (s.paidAmount || 0)), 0);
  const totalDue = mockStatements.reduce((sum, s) => sum + s.amount, 0);
  const balance = totalDue - totalPaid;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Payment Statement</h3>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Academic Year:</Label>
          <Select defaultValue="ay-2024-25">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockAcademicYears.map(year => (
                <SelectItem key={year.id} value={year.id}>{year.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Due</p>
          <p className="text-2xl font-mono font-medium">AED {totalDue.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center bg-accent/10 border-accent/20">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-mono font-medium text-accent">AED {totalPaid.toLocaleString()}</p>
        </Card>
        <Card className={cn("p-4 text-center", balance > 0 ? "bg-destructive/10 border-destructive/20" : "bg-accent/10")}>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className={cn("text-2xl font-mono font-medium", balance > 0 ? "text-destructive" : "text-accent")}>
            AED {balance.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Statement Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Period</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Paid</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockStatements.map(statement => (
                <tr key={statement.id}>
                  <td className="font-medium">{statement.type}</td>
                  <td className="text-muted-foreground">{statement.month || '-'}</td>
                  <td className="text-right font-mono">AED {statement.amount.toLocaleString()}</td>
                  <td className="text-right font-mono">
                    AED {(statement.status === 'paid' ? statement.amount : (statement.paidAmount || 0)).toLocaleString()}
                  </td>
                  <td>
                    {statement.status === 'paid' && (
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        <Check className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                    )}
                    {statement.status === 'partial' && (
                      <Badge variant="secondary" className="bg-amber/20 text-amber-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Partial
                      </Badge>
                    )}
                    {statement.status === 'unpaid' && (
                      <Badge variant="destructive">
                        <X className="w-3 h-3 mr-1" />
                        Unpaid
                      </Badge>
                    )}
                  </td>
                  <td className="text-muted-foreground text-sm">
                    {statement.paidDate || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

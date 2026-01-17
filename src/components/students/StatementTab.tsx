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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-medium">Payment Statement</h3>
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">Academic Year:</Label>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Due</p>
          <p className="text-xl sm:text-2xl font-mono font-medium">AED {totalDue.toLocaleString()}</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center bg-accent/10 border-accent/20">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Paid</p>
          <p className="text-xl sm:text-2xl font-mono font-medium text-accent">AED {totalPaid.toLocaleString()}</p>
        </Card>
        <Card className={cn("p-3 sm:p-4 text-center", balance > 0 ? "bg-destructive/10 border-destructive/20" : "bg-accent/10")}>
          <p className="text-xs sm:text-sm text-muted-foreground">Balance</p>
          <p className={cn("text-xl sm:text-2xl font-mono font-medium", balance > 0 ? "text-destructive" : "text-accent")}>
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
                <th className="whitespace-nowrap">Fee Type</th>
                <th className="whitespace-nowrap hidden sm:table-cell">Period</th>
                <th className="text-right whitespace-nowrap">Amount</th>
                <th className="text-right whitespace-nowrap hidden md:table-cell">Paid</th>
                <th className="whitespace-nowrap">Status</th>
                <th className="whitespace-nowrap hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockStatements.map(statement => (
                <tr key={statement.id}>
                  <td className="font-medium text-sm">
                    <div>
                      {statement.type}
                      <span className="block sm:hidden text-xs text-muted-foreground">{statement.month || '-'}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground hidden sm:table-cell">{statement.month || '-'}</td>
                  <td className="text-right font-mono text-sm">AED {statement.amount.toLocaleString()}</td>
                  <td className="text-right font-mono text-sm hidden md:table-cell">
                    AED {(statement.status === 'paid' ? statement.amount : (statement.paidAmount || 0)).toLocaleString()}
                  </td>
                  <td>
                    {statement.status === 'paid' && (
                      <Badge variant="default" className="bg-accent text-accent-foreground text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Paid</span>
                      </Badge>
                    )}
                    {statement.status === 'partial' && (
                      <Badge variant="secondary" className="bg-amber/20 text-amber-foreground text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Partial</span>
                      </Badge>
                    )}
                    {statement.status === 'unpaid' && (
                      <Badge variant="destructive" className="text-xs">
                        <X className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Unpaid</span>
                      </Badge>
                    )}
                  </td>
                  <td className="text-muted-foreground text-sm hidden sm:table-cell">
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

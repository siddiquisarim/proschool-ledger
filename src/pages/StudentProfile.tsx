import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  User,
  Receipt,
  History,
  CreditCard,
  Edit,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { mockStudents, mockPayments, mockFeeStructures } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { DiscountType } from '@/types';

const months = [
  'September 2024', 'October 2024', 'November 2024', 'December 2024',
  'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025'
];

export function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useApp();
  
  const student = mockStudents.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Student not found</p>
        <Button variant="outline" onClick={() => navigate('/students')} className="mt-4">
          Back to Students
        </Button>
      </div>
    );
  }

  const studentPayments = mockPayments.filter(p => p.studentId === student.id);
  
  // Calculate fee breakdown
  const mandatoryFees = mockFeeStructures.filter(f => f.type === 'mandatory');
  const monthlyFee = mockFeeStructures.find(f => 
    f.type === 'monthly' && (f.grade === 'all' || f.grade.includes(student.grade))
  );
  
  const totalMandatory = mandatoryFees.reduce((sum, f) => sum + f.amount, 0);
  const paidMandatory = studentPayments
    .filter(p => p.feeType === 'mandatory' && p.status === 'finalized')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const paidMonths = studentPayments
    .filter(p => p.feeType === 'monthly' && p.status === 'finalized')
    .flatMap(p => p.monthsCovered || []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{student.firstName} {student.lastName}</h1>
          <p className="text-sm text-muted-foreground">{student.studentId}</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Student Info */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded bg-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">{student.firstName} {student.lastName}</h2>
                {student.arabicName && (
                  <p className="text-sm text-muted-foreground" dir="rtl">{student.arabicName}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "status-badge",
                    student.status === 'active' && "status-paid",
                    student.status === 'inactive' && "status-pending"
                  )}>
                    {student.status}
                  </span>
                  {student.discountType && student.discountType !== 'none' && (
                    <span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Tag className="w-3 h-3 mr-1" />
                      {student.discountValue}% {student.discountType}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{student.grade} - Section {student.section}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{student.parentName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{student.parentPhone}</span>
              </div>
              {student.parentEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{student.parentEmail}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Payment History */}
          <Card>
            <div className="data-card-header">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <History className="w-4 h-4" />
                Payment History
              </h3>
            </div>
            <div className="divide-y divide-border max-h-[300px] overflow-y-auto scrollbar-thin">
              {studentPayments.map((payment) => (
                <div key={payment.id} className="p-3 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{payment.receiptNumber}</p>
                      <p className="text-sm font-medium capitalize">{payment.feeType} Fee</p>
                      {payment.monthsCovered && (
                        <p className="text-xs text-muted-foreground">{payment.monthsCovered.join(', ')}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium">AED {payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {studentPayments.length === 0 && (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No payments recorded
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Fee Processor */}
        <div className="lg:col-span-2">
          <FeeProcessor 
            student={student} 
            mandatoryFees={mandatoryFees}
            monthlyFee={monthlyFee}
            paidMandatory={paidMandatory}
            paidMonths={paidMonths}
          />
        </div>
      </div>
    </div>
  );
}

interface FeeProcessorProps {
  student: typeof mockStudents[0];
  mandatoryFees: typeof mockFeeStructures;
  monthlyFee: typeof mockFeeStructures[0] | undefined;
  paidMandatory: number;
  paidMonths: string[];
}

function FeeProcessor({ student, mandatoryFees, monthlyFee, paidMandatory, paidMonths }: FeeProcessorProps) {
  const [selectedFeeType, setSelectedFeeType] = useState<'mandatory' | 'monthly'>('monthly');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [discountType, setDiscountType] = useState<DiscountType>(student.discountType || 'none');
  const [discountValue, setDiscountValue] = useState<number>(student.discountValue || 0);
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  const currentDay = new Date().getDate();
  const shouldPrepay = currentDay > 20;

  const totalMandatory = mandatoryFees.reduce((sum, f) => sum + f.amount, 0);
  const mandatoryRemaining = totalMandatory - paidMandatory;

  const monthlyRate = monthlyFee?.amount || 0;
  
  // Calculate selected amount
  let selectedAmount = 0;
  if (selectedFeeType === 'mandatory') {
    selectedAmount = mandatoryRemaining;
  } else {
    selectedAmount = selectedMonths.length * monthlyRate;
  }

  // Apply discount
  let effectiveDiscount = discountValue;
  if (discountType === 'custom') {
    effectiveDiscount = customDiscount;
  }
  const discountAmount = selectedAmount * (effectiveDiscount / 100);
  const finalAmount = selectedAmount - discountAmount;

  const handleMonthToggle = (month: string) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleSelectAllMonths = () => {
    const unpaidMonths = months.filter(m => !paidMonths.includes(m));
    setSelectedMonths(unpaidMonths);
  };

  return (
    <Card className="h-full">
      <Tabs defaultValue="payment" className="h-full flex flex-col">
        <div className="data-card-header">
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="payment" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              Process Payment
            </TabsTrigger>
            <TabsTrigger value="structure" className="text-xs">
              <Receipt className="w-3 h-3 mr-1" />
              Fee Structure
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="payment" className="flex-1 m-0">
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border h-full">
            {/* Left Pane - Selection */}
            <div className="md:col-span-3 p-4 space-y-4 overflow-y-auto">
              {/* Fee Type Selection */}
              <div>
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fee Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={selectedFeeType === 'mandatory' ? 'enterprise' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFeeType('mandatory')}
                    disabled={mandatoryRemaining <= 0}
                  >
                    Mandatory Fees
                    {mandatoryRemaining <= 0 && <CheckCircle2 className="w-3 h-3 ml-1 text-accent" />}
                  </Button>
                  <Button
                    variant={selectedFeeType === 'monthly' ? 'enterprise' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFeeType('monthly')}
                  >
                    Monthly Fees
                  </Button>
                </div>
              </div>

              {selectedFeeType === 'mandatory' ? (
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Mandatory Fees Breakdown</Label>
                  <div className="space-y-2">
                    {mandatoryFees.map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <span>{fee.name}</span>
                        <span className="font-mono">AED {fee.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-2 bg-secondary rounded text-sm font-medium">
                      <span>Total Mandatory</span>
                      <span className="font-mono">AED {totalMandatory.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded text-sm">
                      <span className="text-muted-foreground">Already Paid</span>
                      <span className="font-mono text-accent">- AED {paidMandatory.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Months</Label>
                    <Button variant="ghost" size="xs" onClick={handleSelectAllMonths}>
                      Select All Unpaid
                    </Button>
                  </div>
                  {shouldPrepay && (
                    <div className="flex items-center gap-2 p-2 bg-amber/10 border border-amber/30 rounded text-xs text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>After the 20th: Pre-pay next month rule applies</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {months.map((month) => {
                      const isPaid = paidMonths.includes(month);
                      const isSelected = selectedMonths.includes(month);
                      return (
                        <button
                          key={month}
                          onClick={() => !isPaid && handleMonthToggle(month)}
                          disabled={isPaid}
                          className={cn(
                            "flex items-center justify-between p-2 rounded border text-sm transition-colors text-left",
                            isPaid && "bg-accent/10 border-accent/30 text-accent cursor-not-allowed",
                            !isPaid && isSelected && "bg-navy/10 border-navy text-navy",
                            !isPaid && !isSelected && "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <span>{month}</span>
                          {isPaid ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isSelected ? (
                            <div className="w-4 h-4 rounded bg-navy flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded border border-border" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Monthly rate: <span className="font-mono">AED {monthlyRate.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Discount Section */}
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Apply Discount</Label>
                <div className="flex gap-2">
                  <Select value={discountType} onValueChange={(v) => setDiscountType(v as DiscountType)}>
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Discount</SelectItem>
                      <SelectItem value="sibling">Sibling (10%)</SelectItem>
                      <SelectItem value="staff">Staff (25%)</SelectItem>
                      <SelectItem value="scholarship">Scholarship (50%)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {discountType === 'custom' && (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={customDiscount}
                        onChange={(e) => setCustomDiscount(Number(e.target.value))}
                        className="w-20 h-9"
                        min={0}
                        max={100}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment Method</Label>
                <div className="flex gap-2">
                  {['cash', 'card', 'bank_transfer', 'check'].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'enterprise' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod(method)}
                      className="capitalize"
                    >
                      {method.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Pane - Summary */}
            <div className="md:col-span-2 p-4 bg-muted/30 flex flex-col">
              <h3 className="text-sm font-semibold mb-4">Financial Summary</h3>
              
              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">AED {selectedAmount.toLocaleString()}</span>
                </div>
                
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-sm text-accent">
                    <span>Discount ({effectiveDiscount}%)</span>
                    <span className="font-mono">- AED {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Due</span>
                  <span className="font-mono">AED {finalAmount.toLocaleString()}</span>
                </div>

                {selectedFeeType === 'monthly' && selectedMonths.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {selectedMonths.length} month(s) selected: {selectedMonths.join(', ')}
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <Button 
                  variant="success" 
                  className="w-full"
                  disabled={finalAmount <= 0}
                >
                  <DollarSign className="w-4 h-4" />
                  Process Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="flex-1 m-0 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Mandatory Fees (One-Time)</h4>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Fee Name</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mandatoryFees.map((fee) => (
                    <tr key={fee.id}>
                      <td className="font-medium">{fee.name}</td>
                      <td className="text-muted-foreground">{fee.description}</td>
                      <td className="text-right font-mono">AED {fee.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Monthly Fees</h4>
              <div className="p-4 bg-muted/50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{monthlyFee?.name || 'Monthly Tuition'}</p>
                    <p className="text-xs text-muted-foreground">Due on the 10th of each month</p>
                  </div>
                  <p className="text-xl font-mono font-semibold">AED {monthlyRate.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

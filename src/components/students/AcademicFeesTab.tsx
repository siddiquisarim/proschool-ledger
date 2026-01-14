import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Percent, CreditCard, Check } from 'lucide-react';
import { mockAcademicYears, mockAcademicClasses, mockFeeDiscounts, mockFeeTypes } from '@/data/settingsData';
import { cn } from '@/lib/utils';

interface AcademicFeesTabProps {
  levelId: string;
  selectedAcademicYear: string;
  selectedClassId: string;
  onAcademicYearChange: (yearId: string) => void;
  onClassChange: (classId: string) => void;
}

export function AcademicFeesTab({
  levelId,
  selectedAcademicYear,
  selectedClassId,
  onAcademicYearChange,
  onClassChange,
}: AcademicFeesTabProps) {
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedDiscountYear, setSelectedDiscountYear] = useState(selectedAcademicYear);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [appliedDiscounts, setAppliedDiscounts] = useState<{ discountId: string; feeId: string }[]>([]);

  const classesForLevel = mockAcademicClasses.filter(c => c.levelId === levelId && c.isActive);
  const activeDiscounts = mockFeeDiscounts.filter(d => d.isActive);
  const mandatoryFees = mockFeeTypes.filter(f => f.type === 'mandatory');
  const optionalFees = mockFeeTypes.filter(f => f.type === 'optional');
  const monthlyFees = mockFeeTypes.filter(f => f.type === 'monthly');

  const handleFeeSelect = (feeId: string, checked: boolean) => {
    if (checked) {
      setSelectedFees([...selectedFees, feeId]);
    } else {
      setSelectedFees(selectedFees.filter(id => id !== feeId));
    }
  };

  const calculateFeeAmount = (feeId: string, baseAmount: number) => {
    const appliedDiscount = appliedDiscounts.find(d => d.feeId === feeId);
    if (!appliedDiscount) return baseAmount;
    
    const discount = activeDiscounts.find(d => d.id === appliedDiscount.discountId);
    if (!discount) return baseAmount;

    if (discount.type === 'percentage') {
      return baseAmount * (1 - discount.value / 100);
    } else {
      return Math.max(0, baseAmount - discount.value);
    }
  };

  const getTotalSelected = () => {
    return selectedFees.reduce((sum, feeId) => {
      const fee = mockFeeTypes.find(f => f.id === feeId);
      if (!fee) return sum;
      return sum + calculateFeeAmount(feeId, fee.amount);
    }, 0);
  };

  const applyDiscount = () => {
    if (!selectedDiscountId) return;
    
    const discount = activeDiscounts.find(d => d.id === selectedDiscountId);
    if (!discount) return;

    // Apply discount to applicable fees
    const newDiscounts = discount.applicableFees.map(feeId => ({
      discountId: selectedDiscountId,
      feeId,
    }));

    setAppliedDiscounts([...appliedDiscounts.filter(d => !discount.applicableFees.includes(d.feeId)), ...newDiscounts]);
    setIsDiscountDialogOpen(false);
  };

  const getDiscountForFee = (feeId: string) => {
    const applied = appliedDiscounts.find(d => d.feeId === feeId);
    if (!applied) return null;
    return activeDiscounts.find(d => d.id === applied.discountId);
  };

  return (
    <div className="space-y-6">
      {/* Academic Year & Class Selection */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Academic Year *</Label>
            <Select value={selectedAcademicYear} onValueChange={onAcademicYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {mockAcademicYears.map(year => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name} {year.isCurrent && '(Current)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Class *</Label>
            <Select value={selectedClassId} onValueChange={onClassChange} disabled={!levelId}>
              <SelectTrigger>
                <SelectValue placeholder={levelId ? "Select class" : "Select level first"} />
              </SelectTrigger>
              <SelectContent>
                {classesForLevel.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Fee Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fees List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-3">Mandatory Fees</h4>
            <div className="space-y-2">
              {mandatoryFees.map(fee => {
                const discount = getDiscountForFee(fee.id);
                const finalAmount = calculateFeeAmount(fee.id, fee.amount);
                return (
                  <div key={fee.id} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={fee.id}
                        checked={selectedFees.includes(fee.id)}
                        onCheckedChange={(checked) => handleFeeSelect(fee.id, checked as boolean)}
                      />
                      <Label htmlFor={fee.id} className="cursor-pointer">
                        {fee.name}
                      </Label>
                      {discount && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                          {discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : `AED ${discount.value}`})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {discount ? (
                        <div>
                          <span className="text-sm text-muted-foreground line-through">AED {fee.amount}</span>
                          <span className="font-mono font-medium ml-2">AED {finalAmount.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="font-mono font-medium">AED {fee.amount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Monthly Fees</h4>
            <div className="space-y-2">
              {monthlyFees.map(fee => (
                <div key={fee.id} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={fee.id}
                      checked={selectedFees.includes(fee.id)}
                      onCheckedChange={(checked) => handleFeeSelect(fee.id, checked as boolean)}
                    />
                    <Label htmlFor={fee.id} className="cursor-pointer">{fee.name}</Label>
                  </div>
                  <span className="font-mono font-medium">AED {fee.amount.toLocaleString()} /month</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Optional Fees</h4>
            <div className="space-y-2">
              {optionalFees.map(fee => (
                <div key={fee.id} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={fee.id}
                      checked={selectedFees.includes(fee.id)}
                      onCheckedChange={(checked) => handleFeeSelect(fee.id, checked as boolean)}
                    />
                    <Label htmlFor={fee.id} className="cursor-pointer">{fee.name}</Label>
                  </div>
                  <span className="font-mono font-medium">{fee.amount > 0 ? `AED ${fee.amount.toLocaleString()}` : 'Variable'}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Summary */}
        <div>
          <Card className="p-4 sticky top-4">
            <h4 className="font-medium mb-4">Payment Summary</h4>
            <div className="space-y-3">
              {selectedFees.length === 0 ? (
                <p className="text-sm text-muted-foreground">Select fees to see summary</p>
              ) : (
                <>
                  {selectedFees.map(feeId => {
                    const fee = mockFeeTypes.find(f => f.id === feeId);
                    if (!fee) return null;
                    const finalAmount = calculateFeeAmount(feeId, fee.amount);
                    const discount = getDiscountForFee(feeId);
                    return (
                      <div key={feeId} className="flex justify-between text-sm">
                        <span>{fee.name}</span>
                        <div className="text-right">
                          {discount && (
                            <span className="text-xs text-muted-foreground line-through mr-1">
                              {fee.amount}
                            </span>
                          )}
                          <span className="font-mono">{finalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3 flex justify-between font-medium">
                    <span>Total Due</span>
                    <span className="font-mono text-lg">AED {getTotalSelected().toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setIsDiscountDialogOpen(true)}>
          <Percent className="w-4 h-4" />
          Apply Discount
        </Button>
        <Button variant="enterprise" onClick={() => setIsPayDialogOpen(true)} disabled={selectedFees.length === 0}>
          <CreditCard className="w-4 h-4" />
          Process Payment
        </Button>
      </div>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={selectedDiscountYear} onValueChange={setSelectedDiscountYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {mockAcademicYears.map(year => (
                    <SelectItem key={year.id} value={year.id}>{year.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={selectedDiscountId} onValueChange={setSelectedDiscountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount" />
                </SelectTrigger>
                <SelectContent>
                  {activeDiscounts.map(discount => (
                    <SelectItem key={discount.id} value={discount.id}>
                      {discount.name} - {discount.type === 'percentage' ? `${discount.value}%` : `AED ${discount.value}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDiscountId && (
              <Card className="p-3 bg-muted">
                <p className="text-sm text-muted-foreground">
                  {activeDiscounts.find(d => d.id === selectedDiscountId)?.description}
                </p>
                <p className="text-xs mt-2">
                  Applies to: {activeDiscounts.find(d => d.id === selectedDiscountId)?.applicableFees
                    .map(feeId => mockFeeTypes.find(f => f.id === feeId)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </Card>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>Cancel</Button>
              <Button variant="enterprise" onClick={applyDiscount} disabled={!selectedDiscountId}>
                <Check className="w-4 h-4" />
                Apply Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Selected Fees</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedFees.map(feeId => {
                  const fee = mockFeeTypes.find(f => f.id === feeId);
                  if (!fee) return null;
                  const finalAmount = calculateFeeAmount(feeId, fee.amount);
                  return (
                    <div key={feeId} className={cn("flex justify-between p-2 border rounded text-sm")}>
                      <span>{fee.name}</span>
                      <span className="font-mono">AED {finalAmount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      AED {selectedFees.reduce((sum, feeId) => {
                        const fee = mockFeeTypes.find(f => f.id === feeId);
                        return sum + (fee?.amount || 0);
                      }, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>Discount</span>
                    <span className="font-mono">
                      - AED {(selectedFees.reduce((sum, feeId) => {
                        const fee = mockFeeTypes.find(f => f.id === feeId);
                        if (!fee) return sum;
                        return sum + (fee.amount - calculateFeeAmount(feeId, fee.amount));
                      }, 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium text-lg">
                    <span>Total Due</span>
                    <span className="font-mono">AED {getTotalSelected().toLocaleString()}</span>
                  </div>
                </div>
              </Card>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>Cancel</Button>
                <Button variant="enterprise">
                  <CreditCard className="w-4 h-4" />
                  Confirm Payment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

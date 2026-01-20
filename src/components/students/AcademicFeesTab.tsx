import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { Percent, CreditCard, Check, Plus, AlertCircle, Lock, Calendar, X, Tag } from 'lucide-react';
import { mockAcademicYears, mockAcademicClasses, mockFeeDiscounts, mockFeeTypes, mockPredefinedExtraFees, calculateMonthlyFeesFromEnrollment } from '@/data/settingsData';
import { cn } from '@/lib/utils';
import { CustomFee } from '@/types/settings';
import { Badge } from '@/components/ui/badge';

interface AcademicFeesTabProps {
  levelId: string;
  selectedAcademicYear: string;
  selectedClassId: string;
  onAcademicYearChange: (yearId: string) => void;
  onClassChange: (classId: string) => void;
  allowReRegistration?: boolean;
  onAllowReRegistrationChange?: (allow: boolean) => void;
  isEditMode?: boolean;
  studentId?: string;
  enrollmentDate?: string;
}

export function AcademicFeesTab({
  levelId,
  selectedAcademicYear,
  selectedClassId,
  onAcademicYearChange,
  onClassChange,
  allowReRegistration = false,
  onAllowReRegistrationChange,
  isEditMode = false,
  studentId,
  enrollmentDate,
}: AcademicFeesTabProps) {
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isExtraFeeDialogOpen, setIsExtraFeeDialogOpen] = useState(false);
  const [selectedOptionalFees, setSelectedOptionalFees] = useState<string[]>([]);
  const [selectedDiscountYear, setSelectedDiscountYear] = useState(selectedAcademicYear);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [appliedDiscounts, setAppliedDiscounts] = useState<{ discountId: string; feeId: string }[]>([]);
  const [customFees, setCustomFees] = useState<CustomFee[]>([]);
  const [selectedExtraFeeId, setSelectedExtraFeeId] = useState('');
  const [advanceMonths, setAdvanceMonths] = useState<string[]>([]);

  const classesForLevel = mockAcademicClasses.filter(c => c.levelId === levelId && c.status === 'read_write');
  const readOnlyClasses = mockAcademicClasses.filter(c => c.levelId === levelId && c.status === 'read');
  const activeDiscounts = mockFeeDiscounts.filter(d => d.isActive);
  const mandatoryFees = mockFeeTypes.filter(f => f.category === 'mandatory' && f.isActive);
  const optionalFees = mockFeeTypes.filter(f => f.category === 'optional' && f.isActive);
  const monthlyFees = mockFeeTypes.filter(f => f.category === 'monthly' && f.isActive);
  const predefinedExtraFees = mockPredefinedExtraFees.filter(f => f.isActive);
  
  // Get current academic year for monthly fee calculation
  const currentAcademicYear = mockAcademicYears.find(y => y.id === selectedAcademicYear);
  
  // Calculate monthly fees based on enrollment date
  const monthlyFeeDetails = useMemo(() => {
    if (!enrollmentDate || !currentAcademicYear) {
      // Default: use today's date if no enrollment date
      const today = new Date().toISOString().split('T')[0];
      const yearEnd = currentAcademicYear?.endDate || '2025-06-30';
      const monthlyFee = monthlyFees[0];
      return calculateMonthlyFeesFromEnrollment(today, yearEnd, monthlyFee?.amount || 0);
    }
    const monthlyFee = monthlyFees[0];
    return calculateMonthlyFeesFromEnrollment(
      enrollmentDate,
      currentAcademicYear.endDate,
      monthlyFee?.amount || 0
    );
  }, [enrollmentDate, currentAcademicYear, monthlyFees]);

  // Auto-select all mandatory fees (locked)
  const mandatoryFeeIds = mandatoryFees.map(f => f.id);
  
  // Combined selected fees: mandatory (always) + optional (user selected)
  const allSelectedFees = [...mandatoryFeeIds, ...selectedOptionalFees];

  const handleOptionalFeeSelect = (feeId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptionalFees([...selectedOptionalFees, feeId]);
    } else {
      setSelectedOptionalFees(selectedOptionalFees.filter(id => id !== feeId));
    }
  };

  const handleAdvanceMonthToggle = (month: string, checked: boolean) => {
    if (checked) {
      setAdvanceMonths([...advanceMonths, month]);
    } else {
      setAdvanceMonths(advanceMonths.filter(m => m !== month));
    }
  };

  const calculateFeeAmount = (feeId: string, baseAmount: number) => {
    return calculateFeeAmountWithMultiple(feeId, baseAmount);
  };

  const getMonthlyTotal = () => {
    const monthlyFee = monthlyFees[0];
    if (!monthlyFee) return 0;
    
    // Current month (auto-applied) + advance months
    const totalMonths = 1 + advanceMonths.length;
    return calculateFeeAmount('fee-monthly', monthlyFee.amount) * totalMonths;
  };

  const getTotalSelected = () => {
    // Mandatory fees (always selected)
    const mandatoryTotal = mandatoryFees.reduce((sum, fee) => {
      return sum + calculateFeeAmount(fee.id, fee.amount);
    }, 0);
    
    // Optional fees
    const optionalTotal = selectedOptionalFees.reduce((sum, feeId) => {
      const fee = optionalFees.find(f => f.id === feeId);
      if (!fee) return sum;
      return sum + calculateFeeAmount(feeId, fee.amount);
    }, 0);
    
    // Monthly fees
    const monthlyTotal = getMonthlyTotal();
    
    // Custom fees
    const customTotal = customFees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
    
    return mandatoryTotal + optionalTotal + monthlyTotal + customTotal;
  };

  const applyDiscount = () => {
    if (!selectedDiscountId) return;
    
    const discount = activeDiscounts.find(d => d.id === selectedDiscountId);
    if (!discount) return;

    // Add new discounts without removing existing ones for same fee (allows multiple discounts)
    const newDiscounts = discount.applicableFees.map(feeId => ({
      discountId: selectedDiscountId,
      feeId,
    }));

    // Filter out duplicates (same discount on same fee)
    const existingPairs = appliedDiscounts.map(d => `${d.discountId}-${d.feeId}`);
    const uniqueNewDiscounts = newDiscounts.filter(
      d => !existingPairs.includes(`${d.discountId}-${d.feeId}`)
    );

    setAppliedDiscounts([...appliedDiscounts, ...uniqueNewDiscounts]);
    setSelectedDiscountId('');
    setIsDiscountDialogOpen(false);
  };

  const removeDiscount = (discountId: string) => {
    setAppliedDiscounts(appliedDiscounts.filter(d => d.discountId !== discountId));
  };

  const getDiscountsForFee = (feeId: string) => {
    const applied = appliedDiscounts.filter(d => d.feeId === feeId);
    return applied
      .map(a => activeDiscounts.find(d => d.id === a.discountId))
      .filter(Boolean) as typeof activeDiscounts;
  };

  const getDiscountForFee = (feeId: string) => {
    const discounts = getDiscountsForFee(feeId);
    return discounts.length > 0 ? discounts[0] : null;
  };

  // Get unique applied discounts for display
  const uniqueAppliedDiscounts = useMemo(() => {
    const discountIds = [...new Set(appliedDiscounts.map(d => d.discountId))];
    return discountIds
      .map(id => activeDiscounts.find(d => d.id === id))
      .filter(Boolean) as typeof activeDiscounts;
  }, [appliedDiscounts, activeDiscounts]);

  // Calculate fee amount with multiple discounts stacking
  const calculateFeeAmountWithMultiple = (feeId: string, baseAmount: number) => {
    const discounts = getDiscountsForFee(feeId);
    if (discounts.length === 0) return baseAmount;
    
    let amount = baseAmount;
    discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        amount = amount * (1 - discount.value / 100);
      } else {
        amount = Math.max(0, amount - discount.value);
      }
    });
    
    return Math.round(amount * 100) / 100;
  };

  const addExtraFee = () => {
    if (!selectedExtraFeeId) return;
    
    const predefinedFee = predefinedExtraFees.find(f => f.id === selectedExtraFeeId);
    if (!predefinedFee) return;
    
    const customFee: CustomFee = {
      id: `custom-fee-${Date.now()}`,
      studentId: studentId || '',
      name: predefinedFee.name,
      amount: predefinedFee.amount,
      description: predefinedFee.description,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    };
    
    setCustomFees([...customFees, customFee]);
    setSelectedExtraFeeId('');
    setIsExtraFeeDialogOpen(false);
  };

  const selectedClass = mockAcademicClasses.find(c => c.id === selectedClassId);
  const isClassFull = selectedClass && selectedClass.enrolledStudents >= selectedClass.maxStudents;

  // Get available months for advance payment (excluding current month which is auto-applied)
  const availableAdvanceMonths = monthlyFeeDetails.months.slice(1);

  return (
    <div className="space-y-6">
      {/* Re-registration Option */}
      {isEditMode && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium">Allow Re-Registration</p>
                <p className="text-sm text-muted-foreground">
                  Enable this to allow student to be registered for multiple academic years
                </p>
              </div>
            </div>
            <Switch
              checked={allowReRegistration}
              onCheckedChange={onAllowReRegistrationChange}
            />
          </div>
        </Card>
      )}

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
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.enrolledStudents}/{cls.maxStudents})
                    {cls.enrolledStudents >= cls.maxStudents && ' - FULL'}
                  </SelectItem>
                ))}
                {readOnlyClasses.length > 0 && (
                  <>
                    <SelectItem value="divider" disabled>── Read Only (No Enrollment) ──</SelectItem>
                    {readOnlyClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id} disabled>
                        {cls.name} (Read Only)
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {isClassFull && (
              <p className="text-xs text-destructive">This class has reached maximum capacity</p>
            )}
          </div>
        </div>
      </Card>

      {/* Fee Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fees List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Applied Discounts Display */}
          {uniqueAppliedDiscounts.length > 0 && (
            <Card className="p-4 bg-accent/5 border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-accent" />
                <h4 className="font-medium">Applied Discounts ({uniqueAppliedDiscounts.length})</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueAppliedDiscounts.map(discount => (
                  <Badge 
                    key={discount.id} 
                    variant="secondary" 
                    className="bg-accent/10 text-accent border-accent/20 pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    <span>{discount.name}</span>
                    <span className="text-xs opacity-75">
                      ({discount.type === 'percentage' ? `${discount.value}%` : `AED ${discount.value}`})
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-destructive/20 hover:text-destructive rounded-full"
                      onClick={() => removeDiscount(discount.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Mandatory Fees - Auto-applied & Locked */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium">Mandatory Fees</h4>
              <Badge variant="secondary" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Auto-applied
              </Badge>
            </div>
            <div className="space-y-2">
              {mandatoryFees.map(fee => {
                const discounts = getDiscountsForFee(fee.id);
                const finalAmount = calculateFeeAmount(fee.id, fee.amount);
                return (
                  <div key={fee.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded bg-muted/30 gap-2">
                    <div className="flex items-start sm:items-center gap-3">
                      <Checkbox
                        id={fee.id}
                        checked={true}
                        disabled={true}
                        className="mt-1 sm:mt-0"
                      />
                      <div className="flex flex-col gap-1">
                        <Label htmlFor={fee.id} className="cursor-default text-muted-foreground">
                          {fee.name}
                        </Label>
                        {discounts.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {discounts.map(discount => (
                              <span key={discount.id} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                                {discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : `AED ${discount.value}`})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-6 sm:ml-0">
                      {discounts.length > 0 ? (
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

          {/* Monthly Fees - Based on enrollment date */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Monthly Fees</h4>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {monthlyFeeDetails.months.length} months
                </Badge>
              </div>
            </div>
            
            {monthlyFees.map(fee => {
              const discounts = getDiscountsForFee(fee.id);
              const monthlyAmount = calculateFeeAmount(fee.id, fee.amount);
              const currentMonth = monthlyFeeDetails.months[0];
              
              return (
                <div key={fee.id} className="space-y-3">
                  {/* Current month - auto-applied */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded bg-primary/5 gap-2">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={true} disabled={true} />
                      <div>
                        <Label className="cursor-default">
                          {fee.name} - {currentMonth}
                        </Label>
                        <p className="text-xs text-muted-foreground">Current month (auto-applied)</p>
                        {discounts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {discounts.map(discount => (
                              <span key={discount.id} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                                {discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : `AED ${discount.value}`})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6 sm:ml-0">
                      {discounts.length > 0 && (
                        <span className="text-xs text-muted-foreground line-through">AED {fee.amount}</span>
                      )}
                      <span className="font-mono font-medium">AED {monthlyAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Advance months */}
                  {availableAdvanceMonths.length > 0 && (
                    <div className="ml-4 space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Pay in Advance (Optional):</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableAdvanceMonths.map(month => (
                          <div key={month} className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50">
                            <Checkbox
                              id={`advance-${month}`}
                              checked={advanceMonths.includes(month)}
                              onCheckedChange={(checked) => handleAdvanceMonthToggle(month, checked as boolean)}
                            />
                            <Label htmlFor={`advance-${month}`} className="text-sm cursor-pointer flex-1">
                              {month}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {advanceMonths.length > 0 && (
                        <p className="text-sm text-accent font-medium">
                          Advance payment: {advanceMonths.length} month(s) = AED {(advanceMonths.length * monthlyAmount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Optional Fees */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Optional Fees</h4>
            <div className="space-y-2">
              {optionalFees.map(fee => (
                <div key={fee.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded hover:bg-muted/50 gap-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={fee.id}
                      checked={selectedOptionalFees.includes(fee.id)}
                      onCheckedChange={(checked) => handleOptionalFeeSelect(fee.id, checked as boolean)}
                    />
                    <Label htmlFor={fee.id} className="cursor-pointer">{fee.name}</Label>
                  </div>
                  <span className="font-mono font-medium ml-6 sm:ml-0">{fee.amount > 0 ? `AED ${fee.amount.toLocaleString()}` : 'Variable'}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Extra Fees (Predefined by Admin) */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Extra Fees</h4>
              <Button variant="outline" size="sm" onClick={() => setIsExtraFeeDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Extra Fee
              </Button>
            </div>
            {customFees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No extra fees added. Click "Add Extra Fee" to select from predefined fees.</p>
            ) : (
              <div className="space-y-2">
                {customFees.map(fee => (
                  <div key={fee.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{fee.name}</p>
                      {fee.description && <p className="text-xs text-muted-foreground">{fee.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={fee.status === 'paid' ? 'default' : 'secondary'}>
                        {fee.status}
                      </Badge>
                      <span className="font-mono font-medium">AED {fee.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Payment Summary */}
        <div>
          <Card className="p-4 sticky top-4">
            <h4 className="font-medium mb-4">Payment Summary</h4>
            <div className="space-y-3">
              {/* Mandatory Fees */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Mandatory</p>
                {mandatoryFees.map(fee => {
                  const finalAmount = calculateFeeAmount(fee.id, fee.amount);
                  const discount = getDiscountForFee(fee.id);
                  return (
                    <div key={fee.id} className="flex justify-between text-sm">
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
              </div>
              
              {/* Monthly Fees */}
              {monthlyFees.length > 0 && (
                <div className="space-y-1 border-t pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Monthly ({1 + advanceMonths.length} month{advanceMonths.length > 0 ? 's' : ''})</p>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Fee</span>
                    <span className="font-mono">{getMonthlyTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              {/* Optional Fees */}
              {selectedOptionalFees.length > 0 && (
                <div className="space-y-1 border-t pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Optional</p>
                  {selectedOptionalFees.map(feeId => {
                    const fee = optionalFees.find(f => f.id === feeId);
                    if (!fee) return null;
                    return (
                      <div key={feeId} className="flex justify-between text-sm">
                        <span>{fee.name}</span>
                        <span className="font-mono">{fee.amount.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Custom/Extra Fees */}
              {customFees.filter(f => f.status === 'unpaid').length > 0 && (
                <div className="space-y-1 border-t pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Extra</p>
                  {customFees.filter(f => f.status === 'unpaid').map(fee => (
                    <div key={fee.id} className="flex justify-between text-sm">
                      <span>{fee.name}</span>
                      <span className="font-mono">{fee.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between font-medium">
                <span>Total Due</span>
                <span className="font-mono text-lg">AED {getTotalSelected().toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setIsDiscountDialogOpen(true)} className="w-full sm:w-auto">
          <Percent className="w-4 h-4" />
          Apply Discount
        </Button>
        <Button variant="enterprise" onClick={() => setIsPayDialogOpen(true)} className="w-full sm:w-auto">
          <CreditCard className="w-4 h-4" />
          Process Payment
        </Button>
      </div>

      {/* Extra Fee Dialog - Select from predefined list */}
      <Dialog open={isExtraFeeDialogOpen} onOpenChange={setIsExtraFeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Extra Fee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Extra Fee *</Label>
              <Select value={selectedExtraFeeId} onValueChange={setSelectedExtraFeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a predefined fee" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedExtraFees.map(fee => (
                    <SelectItem key={fee.id} value={fee.id}>
                      {fee.name} - AED {fee.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedExtraFeeId && (
              <Card className="p-3 bg-muted">
                <p className="text-sm font-medium">
                  {predefinedExtraFees.find(f => f.id === selectedExtraFeeId)?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {predefinedExtraFees.find(f => f.id === selectedExtraFeeId)?.description}
                </p>
                <p className="text-sm font-mono mt-2">
                  AED {predefinedExtraFees.find(f => f.id === selectedExtraFeeId)?.amount}
                </p>
              </Card>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsExtraFeeDialogOpen(false)}>Cancel</Button>
              <Button variant="enterprise" onClick={addExtraFee} disabled={!selectedExtraFeeId}>
                <Plus className="w-4 h-4" />
                Add Fee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
        <DialogContent className="max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Selected Fees</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mandatoryFees.map(fee => {
                  const finalAmount = calculateFeeAmount(fee.id, fee.amount);
                  return (
                    <div key={fee.id} className={cn("flex justify-between p-2 border rounded text-sm")}>
                      <span>{fee.name}</span>
                      <span className="font-mono">AED {finalAmount.toLocaleString()}</span>
                    </div>
                  );
                })}
                {monthlyFees.length > 0 && (
                  <div className="flex justify-between p-2 border rounded text-sm bg-primary/5">
                    <span>Monthly Fee ({1 + advanceMonths.length} month{advanceMonths.length > 0 ? 's' : ''})</span>
                    <span className="font-mono">AED {getMonthlyTotal().toLocaleString()}</span>
                  </div>
                )}
                {selectedOptionalFees.map(feeId => {
                  const fee = optionalFees.find(f => f.id === feeId);
                  if (!fee) return null;
                  return (
                    <div key={feeId} className="flex justify-between p-2 border rounded text-sm">
                      <span>{fee.name}</span>
                      <span className="font-mono">AED {fee.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
                {customFees.filter(f => f.status === 'unpaid').map(fee => (
                  <div key={fee.id} className="flex justify-between p-2 border rounded text-sm bg-amber-50 dark:bg-amber-950/20">
                    <span>{fee.name} (Extra)</span>
                    <span className="font-mono">AED {fee.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      AED {(
                        mandatoryFees.reduce((sum, f) => sum + f.amount, 0) +
                        (monthlyFees[0]?.amount || 0) * (1 + advanceMonths.length) +
                        selectedOptionalFees.reduce((sum, feeId) => {
                          const fee = optionalFees.find(f => f.id === feeId);
                          return sum + (fee?.amount || 0);
                        }, 0) +
                        customFees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>Discount</span>
                    <span className="font-mono">
                      - AED {(
                        mandatoryFees.reduce((sum, fee) => {
                          return sum + (fee.amount - calculateFeeAmount(fee.id, fee.amount));
                        }, 0) +
                        ((monthlyFees[0]?.amount || 0) - calculateFeeAmount('fee-monthly', monthlyFees[0]?.amount || 0)) * (1 + advanceMonths.length)
                      ).toLocaleString()}
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

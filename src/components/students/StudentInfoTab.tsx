import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockLevels, mockTransportLines } from '@/data/settingsData';

interface StudentInfoTabProps {
  formData: {
    firstName: string;
    lastName: string;
    arabicName: string;
    cprNumber: string;
    dateOfBirth: string;
    gender: string;
    enrollmentDate: string;
    levelId: string;
    address: string;
    returnAddress: string;
    transportLineId: string;
  };
  onChange: (field: string, value: string) => void;
}

export function StudentInfoTab({ formData, onChange }: StudentInfoTabProps) {
  const activeLevels = mockLevels.filter(l => l.isActive);
  const activeTransportLines = mockTransportLines.filter(t => t.isActive);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>First Name *</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name *</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
        <div className="space-y-2">
          <Label>Arabic Name</Label>
          <Input
            value={formData.arabicName}
            onChange={(e) => onChange('arabicName', e.target.value)}
            placeholder="الاسم بالعربية"
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>CPR Number *</Label>
          <Input
            value={formData.cprNumber}
            onChange={(e) => onChange('cprNumber', e.target.value)}
            placeholder="Enter CPR number"
            maxLength={9}
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={formData.gender} onValueChange={(v) => onChange('gender', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Enrollment Date *</Label>
          <Input
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => onChange('enrollmentDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Level *</Label>
          <Select value={formData.levelId} onValueChange={(v) => onChange('levelId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {activeLevels.map(level => (
                <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Home Address</Label>
          <Textarea
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Enter home address"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Return Address</Label>
          <Textarea
            value={formData.returnAddress}
            onChange={(e) => onChange('returnAddress', e.target.value)}
            placeholder="Enter return address (if different)"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Transport Line</Label>
        <Select value={formData.transportLineId} onValueChange={(v) => onChange('transportLineId', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select transport line (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Transport</SelectItem>
            {activeTransportLines.map(line => (
              <SelectItem key={line.id} value={line.id}>
                {line.name} ({line.startLocation} → {line.endLocation}) - AED {line.fee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

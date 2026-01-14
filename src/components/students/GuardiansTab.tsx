import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Guardian } from '@/types/settings';
import { cn } from '@/lib/utils';

interface GuardiansTabProps {
  guardians: Guardian[];
  onGuardiansChange: (guardians: Guardian[]) => void;
}

export function GuardiansTab({ guardians, onGuardiansChange }: GuardiansTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  const [formData, setFormData] = useState<Partial<Guardian>>({
    name: '',
    mobile: '',
    relationship: 'father',
    homeAddress: '',
    workAddress: '',
    email: '',
    isPrimary: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      relationship: 'father',
      homeAddress: '',
      workAddress: '',
      email: '',
      isPrimary: guardians.length === 0,
    });
    setEditingGuardian(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.mobile) return;

    const newGuardian: Guardian = {
      id: editingGuardian?.id || `guardian-${Date.now()}`,
      serialNumber: editingGuardian?.serialNumber || `G${String(guardians.length + 1).padStart(3, '0')}`,
      name: formData.name!,
      mobile: formData.mobile!,
      relationship: formData.relationship as Guardian['relationship'],
      homeAddress: formData.homeAddress || '',
      workAddress: formData.workAddress || '',
      email: formData.email,
      isPrimary: formData.isPrimary || false,
    };

    let updatedGuardians: Guardian[];
    if (editingGuardian) {
      updatedGuardians = guardians.map(g => g.id === editingGuardian.id ? newGuardian : g);
    } else {
      updatedGuardians = [...guardians, newGuardian];
    }

    // If this guardian is primary, unset others
    if (newGuardian.isPrimary) {
      updatedGuardians = updatedGuardians.map(g => ({
        ...g,
        isPrimary: g.id === newGuardian.id,
      }));
    }

    onGuardiansChange(updatedGuardians);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (guardian: Guardian) => {
    setFormData({
      name: guardian.name,
      mobile: guardian.mobile,
      relationship: guardian.relationship,
      homeAddress: guardian.homeAddress,
      workAddress: guardian.workAddress,
      email: guardian.email,
      isPrimary: guardian.isPrimary,
    });
    setEditingGuardian(guardian);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (guardianId: string) => {
    const updatedGuardians = guardians.filter(g => g.id !== guardianId);
    // If we deleted the primary, make the first one primary
    if (updatedGuardians.length > 0 && !updatedGuardians.some(g => g.isPrimary)) {
      updatedGuardians[0].isPrimary = true;
    }
    onGuardiansChange(updatedGuardians);
  };

  const handleSetPrimary = (guardianId: string) => {
    const updatedGuardians = guardians.map(g => ({
      ...g,
      isPrimary: g.id === guardianId,
    }));
    onGuardiansChange(updatedGuardians);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Guardian Information</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="enterprise" size="sm">
              <Plus className="w-4 h-4" />
              Add Guardian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGuardian ? 'Edit Guardian' : 'Add Guardian'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+973-XXXX-XXXX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(v) => setFormData({ ...formData, relationship: v as Guardian['relationship'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Home Address</Label>
                <Input
                  value={formData.homeAddress}
                  onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                  placeholder="Enter home address"
                />
              </div>
              <div className="space-y-2">
                <Label>Work Address</Label>
                <Input
                  value={formData.workAddress}
                  onChange={(e) => setFormData({ ...formData, workAddress: e.target.value })}
                  placeholder="Enter work address"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => { resetForm(); setIsAddDialogOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="enterprise" onClick={handleSave}>
                  {editingGuardian ? 'Update Guardian' : 'Add Guardian'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {guardians.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No guardians added yet. Click "Add Guardian" to add one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {guardians.map((guardian) => (
            <Card key={guardian.id} className={cn("p-4", guardian.isPrimary && "border-primary")}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{guardian.serialNumber}</span>
                    <span className="font-medium">{guardian.name}</span>
                    {guardian.isPrimary && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Primary</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="capitalize">{guardian.relationship}</span> • {guardian.mobile}
                    {guardian.email && ` • ${guardian.email}`}
                  </div>
                  {guardian.homeAddress && (
                    <p className="text-xs text-muted-foreground">Home: {guardian.homeAddress}</p>
                  )}
                  {guardian.workAddress && (
                    <p className="text-xs text-muted-foreground">Work: {guardian.workAddress}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetPrimary(guardian.id)}
                    title={guardian.isPrimary ? 'Primary contact' : 'Set as primary'}
                  >
                    {guardian.isPrimary ? (
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    ) : (
                      <StarOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(guardian)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(guardian.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
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
import { Plus, Edit, Trash2, Star, StarOff, Search, UserCheck, Link } from 'lucide-react';
import { Guardian } from '@/types/settings';
import { cn } from '@/lib/utils';
import { mockGlobalGuardians } from '@/data/settingsData';
import { Badge } from '@/components/ui/badge';

interface GuardiansTabProps {
  guardians: Guardian[];
  onGuardiansChange: (guardians: Guardian[]) => void;
}

export function GuardiansTab({ guardians, onGuardiansChange }: GuardiansTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Guardian>>({
    name: '',
    mobile: '',
    relationship: 'father',
    homeAddress: '',
    workAddress: '',
    email: '',
    isPrimary: false,
  });

  // Filter global guardians not already linked to this student
  const availableGlobalGuardians = useMemo(() => {
    const linkedMobiles = guardians.map(g => g.mobile);
    return mockGlobalGuardians.filter(g => 
      !linkedMobiles.includes(g.mobile) &&
      (g.name.toLowerCase().includes(linkSearchQuery.toLowerCase()) ||
       g.mobile.includes(linkSearchQuery) ||
       g.cpr?.includes(linkSearchQuery) ||
       g.serialNumber.toLowerCase().includes(linkSearchQuery.toLowerCase()))
    );
  }, [guardians, linkSearchQuery]);

  // Check if mobile exists in global guardians (for duplicate warning)
  const existingGuardianByMobile = useMemo(() => {
    if (!formData.mobile) return null;
    return mockGlobalGuardians.find(g => g.mobile === formData.mobile);
  }, [formData.mobile]);

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
    setSearchQuery('');
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

  const handleLinkExistingGuardian = (globalGuardian: typeof mockGlobalGuardians[0]) => {
    const newGuardian: Guardian = {
      id: `guardian-${Date.now()}`,
      serialNumber: globalGuardian.serialNumber,
      name: globalGuardian.name,
      mobile: globalGuardian.mobile,
      relationship: globalGuardian.relationship,
      homeAddress: globalGuardian.homeAddress,
      workAddress: globalGuardian.workAddress,
      email: globalGuardian.email,
      isPrimary: guardians.length === 0,
    };

    let updatedGuardians = [...guardians, newGuardian];
    
    // If this is the first guardian, make it primary
    if (guardians.length === 0) {
      updatedGuardians[0].isPrimary = true;
    }

    onGuardiansChange(updatedGuardians);
    setIsLinkDialogOpen(false);
    setLinkSearchQuery('');
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-medium">Guardian Information</h3>
        <div className="flex gap-2">
          {/* Link Existing Guardian Dialog */}
          <Dialog open={isLinkDialogOpen} onOpenChange={(open) => {
            setIsLinkDialogOpen(open);
            if (!open) setLinkSearchQuery('');
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4" />
                Link Existing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-[95vw]">
              <DialogHeader>
                <DialogTitle>Link Existing Guardian</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Guardian</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={linkSearchQuery}
                      onChange={(e) => setLinkSearchQuery(e.target.value)}
                      placeholder="Search by name, mobile, CPR, or serial..."
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableGlobalGuardians.length === 0 ? (
                    <Card className="p-4 text-center text-muted-foreground">
                      <p>No matching guardians found</p>
                      <p className="text-sm">Try a different search or add a new guardian</p>
                    </Card>
                  ) : (
                    availableGlobalGuardians.map(guardian => (
                      <Card key={guardian.id} className="p-3 hover:bg-muted/50 cursor-pointer" onClick={() => handleLinkExistingGuardian(guardian)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground">{guardian.serialNumber}</span>
                                <span className="font-medium">{guardian.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <span className="capitalize">{guardian.relationship}</span> • {guardian.mobile}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Linked to {guardian.studentIds.length} student(s)
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Link className="w-4 h-4" />
                            Link
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add New Guardian Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="enterprise" size="sm">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-[95vw]">
              <DialogHeader>
                <DialogTitle>{editingGuardian ? 'Edit Guardian' : 'Add New Guardian'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Duplicate warning */}
                {existingGuardianByMobile && !editingGuardian && (
                  <Card className="p-3 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Guardian already exists
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          {existingGuardianByMobile.name} ({existingGuardianByMobile.serialNumber}) has this mobile number.
                          Consider linking the existing guardian instead.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {guardians.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No guardians added yet.</p>
          <p className="text-sm">Click "Link Existing" to find and link an existing guardian, or "Add New" to create one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {guardians.map((guardian) => (
            <Card key={guardian.id} className={cn("p-4", guardian.isPrimary && "border-primary")}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{guardian.serialNumber}</span>
                    <span className="font-medium">{guardian.name}</span>
                    {guardian.isPrimary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
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

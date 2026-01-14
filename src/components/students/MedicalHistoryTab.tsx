import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { MedicalRecord } from '@/types/settings';

interface MedicalHistoryTabProps {
  medicalRecords: MedicalRecord[];
  onMedicalRecordsChange: (records: MedicalRecord[]) => void;
}

export function MedicalHistoryTab({ medicalRecords, onMedicalRecordsChange }: MedicalHistoryTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    condition: '',
    description: '',
    medications: '',
    allergies: '',
    emergencyContact: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      condition: '',
      description: '',
      medications: '',
      allergies: '',
      emergencyContact: '',
      notes: '',
    });
    setEditingRecord(null);
  };

  const handleSave = () => {
    if (!formData.condition) return;

    const newRecord: MedicalRecord = {
      id: editingRecord?.id || `medical-${Date.now()}`,
      condition: formData.condition!,
      description: formData.description || '',
      medications: formData.medications,
      allergies: formData.allergies,
      emergencyContact: formData.emergencyContact,
      notes: formData.notes,
      dateRecorded: editingRecord?.dateRecorded || new Date().toISOString().split('T')[0],
    };

    let updatedRecords: MedicalRecord[];
    if (editingRecord) {
      updatedRecords = medicalRecords.map(r => r.id === editingRecord.id ? newRecord : r);
    } else {
      updatedRecords = [...medicalRecords, newRecord];
    }

    onMedicalRecordsChange(updatedRecords);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (record: MedicalRecord) => {
    setFormData({
      condition: record.condition,
      description: record.description,
      medications: record.medications,
      allergies: record.allergies,
      emergencyContact: record.emergencyContact,
      notes: record.notes,
    });
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (recordId: string) => {
    onMedicalRecordsChange(medicalRecords.filter(r => r.id !== recordId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Medical History</h3>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="enterprise" size="sm">
              <Plus className="w-4 h-4" />
              Add Medical Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Condition / Diagnosis *</Label>
                <Input
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Asthma, Diabetes, Allergies"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the condition"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medications</Label>
                  <Input
                    value={formData.medications || ''}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="Current medications"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input
                    value={formData.allergies || ''}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Known allergies"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input
                  value={formData.emergencyContact || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Emergency contact number"
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes or instructions"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="enterprise" onClick={handleSave}>
                  {editingRecord ? 'Update Record' : 'Add Record'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {medicalRecords.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No medical records on file.</p>
          <p className="text-sm">Click "Add Medical Record" to add one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {medicalRecords.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber" />
                    <span className="font-medium">{record.condition}</span>
                    <span className="text-xs text-muted-foreground">Recorded: {record.dateRecorded}</span>
                  </div>
                  {record.description && (
                    <p className="text-sm text-muted-foreground">{record.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {record.medications && (
                      <div>
                        <span className="text-muted-foreground">Medications:</span> {record.medications}
                      </div>
                    )}
                    {record.allergies && (
                      <div>
                        <span className="text-muted-foreground">Allergies:</span> {record.allergies}
                      </div>
                    )}
                    {record.emergencyContact && (
                      <div>
                        <span className="text-muted-foreground">Emergency:</span> {record.emergencyContact}
                      </div>
                    )}
                  </div>
                  {record.notes && (
                    <p className="text-xs text-muted-foreground italic">Note: {record.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(record.id)}>
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

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
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { RelatedStudent } from '@/types/settings';
import { mockStudents } from '@/data/mockData';

interface RelatedStudentsTabProps {
  relatedStudents: RelatedStudent[];
  onRelatedStudentsChange: (students: RelatedStudent[]) => void;
  currentStudentId?: string;
}

export function RelatedStudentsTab({ 
  relatedStudents, 
  onRelatedStudentsChange, 
  currentStudentId 
}: RelatedStudentsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<RelatedStudent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<RelatedStudent>>({
    studentId: '',
    relationship: 'sibling',
    notes: '',
  });

  // Filter out current student and already related students
  const availableStudents = mockStudents.filter(s => 
    s.id !== currentStudentId && 
    !relatedStudents.some(r => r.studentId === s.id) &&
    (s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      studentId: '',
      relationship: 'sibling',
      notes: '',
    });
    setEditingRelation(null);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (!formData.studentId) return;

    const newRelation: RelatedStudent = {
      id: editingRelation?.id || `related-${Date.now()}`,
      studentId: formData.studentId!,
      relationship: formData.relationship as RelatedStudent['relationship'],
      notes: formData.notes,
    };

    let updatedRelations: RelatedStudent[];
    if (editingRelation) {
      updatedRelations = relatedStudents.map(r => r.id === editingRelation.id ? newRelation : r);
    } else {
      updatedRelations = [...relatedStudents, newRelation];
    }

    onRelatedStudentsChange(updatedRelations);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (relation: RelatedStudent) => {
    setFormData({
      studentId: relation.studentId,
      relationship: relation.relationship,
      notes: relation.notes,
    });
    setEditingRelation(relation);
    setIsDialogOpen(true);
  };

  const handleDelete = (relationId: string) => {
    onRelatedStudentsChange(relatedStudents.filter(r => r.id !== relationId));
  };

  const getStudentDetails = (studentId: string) => {
    return mockStudents.find(s => s.id === studentId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Related Students</h3>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="enterprise" size="sm">
              <Plus className="w-4 h-4" />
              Add Related Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRelation ? 'Edit Relation' : 'Add Related Student'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Search Student</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Student *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentId})
                      </SelectItem>
                    ))}
                    {availableStudents.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No students found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(v) => setFormData({ ...formData, relationship: v as RelatedStudent['relationship'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes (optional)"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="enterprise" onClick={handleSave} disabled={!formData.studentId}>
                  {editingRelation ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {relatedStudents.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No related students linked.</p>
          <p className="text-sm">Click "Add Related Student" to link siblings or relatives.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {relatedStudents.map((relation) => {
            const student = getStudentDetails(relation.studentId);
            if (!student) return null;
            
            return (
              <Card key={relation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.firstName} {student.lastName}</span>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{relation.relationship}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId} • {student.grade} - {student.section}
                      </p>
                      {relation.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{relation.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(relation)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(relation.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

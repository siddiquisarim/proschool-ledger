import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockOvertimeRequests, mockEmployees } from '@/data/mockData';
import { OvertimeRequest, OvertimeStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Check, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig: Record<OvertimeStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  supervisor_confirmed: { label: 'Supervisor Confirmed', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export function HROvertimePage() {
  const { currentUser } = useApp();
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    hours: 1,
    reason: '',
  });

  const isAdmin = currentUser?.role === 'admin';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isAccountant = currentUser?.role === 'accountant';
  const canApprove = isAdmin || isAccountant;
  const canConfirm = isSupervisor || isAdmin;

  const filteredRequests = overtimeRequests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'payroll') return req.addedToPayroll;
    return req.status === activeTab;
  });

  const handleSubmit = () => {
    const employee = mockEmployees.find(e => e.id === formData.employeeId);
    
    const newRequest: OvertimeRequest = {
      id: `o${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: employee ? `Employee ${employee.employeeCode}` : 'Unknown',
      date: formData.date,
      hours: formData.hours,
      reason: formData.reason,
      status: 'pending',
      addedToPayroll: false,
      createdAt: new Date().toISOString(),
    };
    
    setOvertimeRequests([newRequest, ...overtimeRequests]);
    setShowSubmitDialog(false);
    setFormData({ employeeId: '', date: '', hours: 1, reason: '' });
  };

  const handleConfirm = (request: OvertimeRequest) => {
    setOvertimeRequests(overtimeRequests.map(r => 
      r.id === request.id 
        ? { ...r, status: 'supervisor_confirmed' as OvertimeStatus, supervisorConfirmedBy: currentUser?.name } 
        : r
    ));
  };

  const handleApprove = (request: OvertimeRequest) => {
    const now = new Date();
    const payrollMonth = format(now, 'MMMM yyyy');
    
    setOvertimeRequests(overtimeRequests.map(r => 
      r.id === request.id 
        ? { 
            ...r, 
            status: 'approved' as OvertimeStatus, 
            approvedBy: currentUser?.name,
            addedToPayroll: true,
            payrollMonth,
          } 
        : r
    ));
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    setOvertimeRequests(overtimeRequests.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: 'rejected' as OvertimeStatus, rejectionReason } 
        : r
    ));
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const stats = {
    pending: overtimeRequests.filter(r => r.status === 'pending').length,
    confirmed: overtimeRequests.filter(r => r.status === 'supervisor_confirmed').length,
    approved: overtimeRequests.filter(r => r.status === 'approved').length,
    totalHours: overtimeRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.hours, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Overtime Management</h1>
          <p className="text-sm text-muted-foreground">Submit and approve overtime requests</p>
        </div>
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Overtime
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Overtime Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={formData.employeeId} onValueChange={(v) => setFormData({ ...formData, employeeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.employeeCode} - {emp.occupation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Hours</Label>
                  <Input type="number" min="1" max="12" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea 
                  value={formData.reason} 
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Reason for overtime..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.employeeId || !formData.date || formData.hours < 1}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Awaiting Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalHours}h</p>
              <p className="text-sm text-muted-foreground">Total Approved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="supervisor_confirmed">Awaiting Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="payroll">Added to Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payroll</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.employeeName}</TableCell>
                      <TableCell>{format(new Date(req.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{req.hours}h</TableCell>
                      <TableCell className="max-w-[200px] truncate">{req.reason}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[req.status].variant}>
                          {statusConfig[req.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {req.addedToPayroll ? (
                          <Badge variant="outline" className="text-emerald-600">
                            {req.payrollMonth}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {canConfirm && req.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleConfirm(req)}>
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {canApprove && req.status === 'supervisor_confirmed' && (
                            <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => handleApprove(req)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {(canConfirm || canApprove) && (req.status === 'pending' || req.status === 'supervisor_confirmed') && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => { setSelectedRequest(req); setShowRejectDialog(true); }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No overtime requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Overtime Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea 
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
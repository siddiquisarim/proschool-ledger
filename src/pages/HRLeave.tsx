import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockLeaveRequests, mockEmployees } from '@/data/mockData';
import { LeaveRequest, LeaveStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Check, X, Calendar, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const statusConfig: Record<LeaveStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export function HRLeavePage() {
  const { currentUser } = useApp();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const isAdmin = currentUser?.role === 'admin';

  // Role-based filtering: users see only their own records
  const userRecords = leaveRequests.filter(req => {
    // Admin sees all
    if (isAdmin) return true;
    // Other users see only their own submissions
    const employee = mockEmployees.find(e => e.id === req.employeeId);
    return employee?.id === currentUser?.id;
  });

  const filteredRequests = userRecords.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const handleApply = () => {
    const employee = mockEmployees.find(e => e.id === formData.employeeId);
    const daysCount = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
    
    const newRequest: LeaveRequest = {
      id: `l${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: employee ? `Employee ${employee.employeeCode}` : 'Unknown',
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      daysCount,
      createdAt: new Date().toISOString(),
    };
    
    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowApplyDialog(false);
    setFormData({ employeeId: '', startDate: '', endDate: '', reason: '' });
  };

  const handleApprove = (request: LeaveRequest) => {
    setLeaveRequests(leaveRequests.map(r => 
      r.id === request.id 
        ? { ...r, status: 'approved' as LeaveStatus, approvedBy: currentUser?.name } 
        : r
    ));
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    setLeaveRequests(leaveRequests.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: 'rejected' as LeaveStatus, rejectionReason } 
        : r
    ));
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const stats = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leave Management</h1>
          <p className="text-sm text-muted-foreground">Apply for and manage leave requests</p>
        </div>
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
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
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea 
                  value={formData.reason} 
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Reason for leave..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
              <Button onClick={handleApply} disabled={!formData.employeeId || !formData.startDate || !formData.endDate}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.employeeName}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(req.startDate), 'MMM d')} - {format(new Date(req.endDate), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>{req.daysCount}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{req.reason}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[req.status].variant}>
                          {statusConfig[req.status].label}
                        </Badge>
                        {req.rejectionReason && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={req.rejectionReason}>
                            {req.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isAdmin && req.status === 'pending' && (
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => handleApprove(req)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => { setSelectedRequest(req); setShowRejectDialog(true); }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No leave requests found
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
            <DialogTitle>Reject Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason (Required)</Label>
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
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
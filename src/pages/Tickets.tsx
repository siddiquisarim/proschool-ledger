import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockTickets, mockUserGroups } from '@/data/mockData';
import { Ticket, TicketStatus, TicketCategory } from '@/types';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Eye, CheckCircle, XCircle, Clock, History, Users, User } from 'lucide-react';
import { format } from 'date-fns';

const categories: { value: TicketCategory; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'academic', label: 'Academic' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' },
];

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  solved: { label: 'Solved', variant: 'outline' },
  closed: { label: 'Closed', variant: 'destructive' },
};

export function TicketsPage() {
  const { currentUser, t } = useApp();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolveReason, setResolveReason] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '' as TicketCategory,
    assignType: 'user' as 'user' | 'group',
    assignedToUserId: '',
    assignedToGroupId: '',
  });

  const isAdmin = currentUser?.role === 'admin';

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my') {
      return ticket.assignedToUserId === currentUser?.id || 
             mockUserGroups.find(g => g.id === ticket.assignedToGroupId)?.memberIds.includes(currentUser?.id || '');
    }
    return ticket.status === activeTab;
  });

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `t${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      status: 'pending',
      assignedToUserId: newTicket.assignType === 'user' ? newTicket.assignedToUserId : undefined,
      assignedToGroupId: newTicket.assignType === 'group' ? newTicket.assignedToGroupId : undefined,
      createdBy: currentUser?.id || '',
      createdByName: currentUser?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{
        id: `h${Date.now()}`,
        ticketId: `t${Date.now()}`,
        action: 'Created',
        userId: currentUser?.id || '',
        userName: currentUser?.name || '',
        timestamp: new Date().toISOString(),
      }]
    };
    setTickets([ticket, ...tickets]);
    setShowCreateDialog(false);
    setNewTicket({ title: '', description: '', category: '' as TicketCategory, assignType: 'user', assignedToUserId: '', assignedToGroupId: '' });
  };

  const handleStatusChange = (ticket: Ticket, newStatus: TicketStatus, notes?: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticket.id) {
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          resolvedReason: newStatus === 'solved' ? notes : t.resolvedReason,
          history: [...t.history, {
            id: `h${Date.now()}`,
            ticketId: t.id,
            action: 'Status Changed',
            fromStatus: t.status,
            toStatus: newStatus,
            userId: currentUser?.id || '',
            userName: currentUser?.name || '',
            notes,
            timestamp: new Date().toISOString(),
          }]
        };
      }
      return t;
    });
    setTickets(updated);
    setShowResolveDialog(false);
    setResolveReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ticket Management</h1>
          <p className="text-sm text-muted-foreground">Create, assign, and track support tickets</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={newTicket.title} 
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newTicket.description} 
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v as TicketCategory })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <div className="flex gap-2 mb-2">
                  <Button 
                    type="button" 
                    variant={newTicket.assignType === 'user' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setNewTicket({ ...newTicket, assignType: 'user' })}
                  >
                    <User className="w-4 h-4 mr-1" /> User
                  </Button>
                  <Button 
                    type="button" 
                    variant={newTicket.assignType === 'group' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setNewTicket({ ...newTicket, assignType: 'group' })}
                  >
                    <Users className="w-4 h-4 mr-1" /> Group
                  </Button>
                </div>
                {newTicket.assignType === 'user' ? (
                  <Select value={newTicket.assignedToUserId} onValueChange={(v) => setNewTicket({ ...newTicket, assignedToUserId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin User</SelectItem>
                      <SelectItem value="2">Cashier User</SelectItem>
                      <SelectItem value="3">Supervisor User</SelectItem>
                      <SelectItem value="4">Accountant User</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={newTicket.assignedToGroupId} onValueChange={(v) => setNewTicket({ ...newTicket, assignedToGroupId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUserGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateTicket} disabled={!newTicket.title || !newTicket.category}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="my">My Assigned</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="solved">Solved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-xs">{ticket.id.toUpperCase()}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.assignedToUserId ? (
                          <span className="flex items-center gap-1 text-sm">
                            <User className="w-3 h-3" /> User #{ticket.assignedToUserId}
                          </span>
                        ) : ticket.assignedToGroupId ? (
                          <span className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" /> {mockUserGroups.find(g => g.id === ticket.assignedToGroupId)?.name}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[ticket.status].variant}>
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedTicket(ticket); setShowDetailDialog(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {isAdmin && ticket.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(ticket, 'approved')}
                              className="text-emerald-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {ticket.status === 'approved' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => { setSelectedTicket(ticket); setShowResolveDialog(true); }}
                              className="text-blue-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {isAdmin && ticket.status === 'solved' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(ticket, 'closed')}
                              className="text-muted-foreground"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTickets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No tickets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedTicket?.id.toUpperCase()}</span>
              {selectedTicket?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={statusConfig[selectedTicket.status].variant}>
                  {statusConfig[selectedTicket.status].label}
                </Badge>
                <Badge variant="outline" className="capitalize">{selectedTicket.category}</Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedTicket.description}</p>
              </div>
              {selectedTicket.resolvedReason && (
                <div className="p-3 bg-muted rounded-md">
                  <Label className="text-xs text-muted-foreground">Resolution</Label>
                  <p className="text-sm mt-1">{selectedTicket.resolvedReason}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <History className="w-3 h-3" /> History
                </Label>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="space-y-3">
                    {selectedTicket.history.map(entry => (
                      <div key={entry.id} className="flex items-start gap-3 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p><span className="font-medium">{entry.userName}</span> - {entry.action}</p>
                          {entry.notes && <p className="text-muted-foreground">{entry.notes}</p>}
                          <p className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Solved</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea 
                value={resolveReason} 
                onChange={(e) => setResolveReason(e.target.value)}
                placeholder="Explain how the issue was resolved..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
            <Button onClick={() => selectedTicket && handleStatusChange(selectedTicket, 'solved', resolveReason)}>
              Mark as Solved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
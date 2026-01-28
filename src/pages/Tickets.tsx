import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockTickets, mockUserGroups } from '@/data/mockData';
import { Ticket, TicketStatus, TicketCategory } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Eye, CheckCircle, XCircle, Clock, History, Users, User, BarChart3, Ticket as TicketIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TicketsModuleReports } from '@/components/reports/TicketsModuleReports';
import { cn } from '@/lib/utils';

export function TicketsPage() {
  const { currentUser, t, isRTL } = useApp();
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

  const categories: { value: TicketCategory; label: string }[] = [
    { value: 'technical', label: t('tickets.technical') },
    { value: 'financial', label: t('tickets.financial') },
    { value: 'administrative', label: t('tickets.administrative') },
    { value: 'academic', label: t('tickets.academic') },
    { value: 'maintenance', label: t('tickets.maintenance') },
    { value: 'other', label: t('tickets.other') },
  ];

  const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    pending: { label: t('common.pending'), variant: 'secondary' },
    approved: { label: t('common.approved'), variant: 'default' },
    solved: { label: t('tickets.solved'), variant: 'outline' },
    closed: { label: t('tickets.closed'), variant: 'destructive' },
  };

  const isAdmin = currentUser?.role === 'admin';

  // Role-based filtering: non-admins see only tickets they created or are assigned to
  const userTickets = tickets.filter(ticket => {
    if (isAdmin) return true;
    if (ticket.createdBy === currentUser?.id) return true;
    if (ticket.assignedToUserId === currentUser?.id) return true;
    if (ticket.assignedToGroupId) {
      const group = mockUserGroups.find(g => g.id === ticket.assignedToGroupId);
      if (group?.memberIds.includes(currentUser?.id || '')) return true;
    }
    return false;
  });

  const filteredTickets = userTickets.filter(ticket => {
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

  const mainTabs = [
    { value: 'list', label: t('tickets.all'), icon: <TicketIcon className="w-4 h-4" /> },
    { value: 'reports', label: t('common.reports'), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl font-semibold text-foreground">{t('tickets.management')}</h1>
          <p className="text-sm text-muted-foreground">{t('tickets.createAssignTrack')}</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('tickets.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('tickets.new')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('common.title')}</Label>
                <Input 
                  value={newTicket.title} 
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder={t('tickets.briefDescription')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.description')}</Label>
                <Textarea 
                  value={newTicket.description} 
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder={t('tickets.detailedDescription')}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.category')}</Label>
                <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v as TicketCategory })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('tickets.assignTo')}</Label>
                <div className={cn("flex gap-2 mb-2", isRTL && "flex-row-reverse")}>
                  <Button 
                    type="button" 
                    variant={newTicket.assignType === 'user' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setNewTicket({ ...newTicket, assignType: 'user' })}
                  >
                    <User className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} /> {t('tickets.user')}
                  </Button>
                  <Button 
                    type="button" 
                    variant={newTicket.assignType === 'group' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setNewTicket({ ...newTicket, assignType: 'group' })}
                  >
                    <Users className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} /> {t('tickets.group')}
                  </Button>
                </div>
                {newTicket.assignType === 'user' ? (
                  <Select value={newTicket.assignedToUserId} onValueChange={(v) => setNewTicket({ ...newTicket, assignedToUserId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('tickets.selectUser')} />
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
                      <SelectValue placeholder={t('tickets.selectGroup')} />
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
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleCreateTicket} disabled={!newTicket.title || !newTicket.category}>{t('tickets.create')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <MobileTabs tabs={mainTabs} defaultValue="list">
        <TabsContent value="list" className="mt-4">
          {/* Filter tabs for ticket status */}
          <div className={cn("flex flex-wrap gap-2 mb-4", isRTL && "flex-row-reverse")}>
            {['all', 'my', 'pending', 'approved', 'solved'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === 'my' ? t('tickets.myAssigned') : 
                 tab === 'all' ? t('common.all') : 
                 tab === 'pending' ? t('common.pending') :
                 tab === 'approved' ? t('common.approved') :
                 t('tickets.solved')}
              </Button>
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t('common.title')}</TableHead>
                    <TableHead>{t('common.category')}</TableHead>
                    <TableHead>{t('tickets.assignTo')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.created')}</TableHead>
                    <TableHead className={cn(isRTL ? "text-left" : "text-right")}>{t('common.actions')}</TableHead>
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
                          <span className={cn("flex items-center gap-1 text-sm", isRTL && "flex-row-reverse")}>
                            <User className="w-3 h-3" /> User #{ticket.assignedToUserId}
                          </span>
                        ) : ticket.assignedToGroupId ? (
                          <span className={cn("flex items-center gap-1 text-sm", isRTL && "flex-row-reverse")}>
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
                      <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                        <div className={cn("flex gap-1", isRTL ? "justify-start" : "justify-end")}>
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
                        {t('tickets.noTickets')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <TicketsModuleReports />
        </TabsContent>
      </MobileTabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <span className="font-mono text-sm text-muted-foreground">{selectedTicket?.id.toUpperCase()}</span>
              {selectedTicket?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Badge variant={statusConfig[selectedTicket.status].variant}>
                  {statusConfig[selectedTicket.status].label}
                </Badge>
                <Badge variant="outline" className="capitalize">{selectedTicket.category}</Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('common.description')}</Label>
                <p className="text-sm mt-1">{selectedTicket.description}</p>
              </div>
              {selectedTicket.resolvedReason && (
                <div className="p-3 bg-muted rounded-md">
                  <Label className="text-xs text-muted-foreground">{t('tickets.resolution')}</Label>
                  <p className="text-sm mt-1">{selectedTicket.resolvedReason}</p>
                </div>
              )}
              <div>
                <Label className={cn("text-xs text-muted-foreground flex items-center gap-1 mb-2", isRTL && "flex-row-reverse")}>
                  <History className="w-3 h-3" /> {t('tickets.history')}
                </Label>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="space-y-3">
                    {selectedTicket.history.map(entry => (
                      <div key={entry.id} className={cn("flex items-start gap-3 text-sm", isRTL && "flex-row-reverse")}>
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.userName} • {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                          </p>
                          {entry.notes && <p className="text-xs mt-1">{entry.notes}</p>}
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
            <DialogTitle>{t('tickets.resolution')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('tickets.resolution')}</Label>
              <Textarea 
                value={resolveReason} 
                onChange={(e) => setResolveReason(e.target.value)}
                placeholder={t('tickets.detailedDescription')}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>{t('common.cancel')}</Button>
            <Button onClick={() => selectedTicket && handleStatusChange(selectedTicket, 'solved', resolveReason)}>
              {t('tickets.solved')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

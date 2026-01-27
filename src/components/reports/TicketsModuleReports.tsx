import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileSpreadsheet,
  Printer,
  ClipboardList,
  FileText,
  Search,
} from 'lucide-react';
import { mockTickets } from '@/data/mockData';
import { format } from 'date-fns';

const reportTabs = [
  { value: 'summary', label: 'Tickets Summary', icon: <ClipboardList className="w-4 h-4" /> },
  { value: 'details', label: 'Ticket Details', icon: <FileText className="w-4 h-4" /> },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  solved: { label: 'Solved', variant: 'outline' },
  closed: { label: 'Closed', variant: 'destructive' },
};

export function TicketsModuleReports() {
  // Calculate summary stats
  const stats = {
    total: mockTickets.length,
    pending: mockTickets.filter(t => t.status === 'pending').length,
    approved: mockTickets.filter(t => t.status === 'approved').length,
    solved: mockTickets.filter(t => t.status === 'solved').length,
    closed: mockTickets.filter(t => t.status === 'closed').length,
  };

  return (
    <div className="space-y-4">
      <MobileTabs tabs={reportTabs} defaultValue="summary">
        {/* Tickets Summary */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Export Excel</span>
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Print</span>
              </Button>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-amber">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-semibold text-amber mt-1">{stats.pending}</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-primary">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-semibold text-primary mt-1">{stats.approved}</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-accent">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Solved</p>
              <p className="text-2xl font-semibold text-accent mt-1">{stats.solved}</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-muted-foreground">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Closed</p>
              <p className="text-2xl font-semibold mt-1">{stats.closed}</p>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-center">Approved</TableHead>
                    <TableHead className="text-center">Solved</TableHead>
                    <TableHead className="text-center">Closed</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['technical', 'financial', 'administrative', 'academic', 'maintenance', 'other'].map(category => {
                    const categoryTickets = mockTickets.filter(t => t.category === category);
                    return (
                      <TableRow key={category}>
                        <TableCell className="font-medium capitalize">{category}</TableCell>
                        <TableCell className="text-center">{categoryTickets.filter(t => t.status === 'pending').length}</TableCell>
                        <TableCell className="text-center">{categoryTickets.filter(t => t.status === 'approved').length}</TableCell>
                        <TableCell className="text-center">{categoryTickets.filter(t => t.status === 'solved').length}</TableCell>
                        <TableCell className="text-center">{categoryTickets.filter(t => t.status === 'closed').length}</TableCell>
                        <TableCell className="text-center font-medium">{categoryTickets.length}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Ticket Details */}
        <TabsContent value="details" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search tickets..." className="pl-9 h-9" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-xs">{ticket.id.toUpperCase()}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>{ticket.createdByName}</TableCell>
                      <TableCell>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[ticket.status].variant}>
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </MobileTabs>
    </div>
  );
}

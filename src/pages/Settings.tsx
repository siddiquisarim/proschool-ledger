import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Save,
  AlertCircle,
  RefreshCw,
  Layers,
  Bus,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { mockSettings, mockFeeStructures } from '@/data/mockData';
import { mockLevels, mockAcademicClasses, mockTransportLines, mockAcademicYears, mockFeeDiscounts } from '@/data/settingsData';

export function SettingsPage() {
  const { t } = useApp();
  const [settings, setSettings] = useState(mockSettings);
  const [feeStructures, setFeeStructures] = useState(mockFeeStructures);
  const [levels, setLevels] = useState(mockLevels);
  const [classes, setClasses] = useState(mockAcademicClasses);
  const [transportLines, setTransportLines] = useState(mockTransportLines);
  const [discounts, setDiscounts] = useState(mockFeeDiscounts);

  const handleSettingChange = (key: keyof typeof settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.settings')}</h1>
          <p className="text-sm text-muted-foreground">Configure school settings, levels, transport, and fee structures</p>
        </div>
        <Button variant="enterprise" size="sm"><Save className="w-4 h-4" />Save Changes</Button>
      </div>

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="school"><Building2 className="w-4 h-4 mr-2" />School Info</TabsTrigger>
          <TabsTrigger value="academic"><Calendar className="w-4 h-4 mr-2" />Academic Year</TabsTrigger>
          <TabsTrigger value="levels"><Layers className="w-4 h-4 mr-2" />Levels & Classes</TabsTrigger>
          <TabsTrigger value="transport"><Bus className="w-4 h-4 mr-2" />Transport</TabsTrigger>
          <TabsTrigger value="fees"><DollarSign className="w-4 h-4 mr-2" />Fee Structures</TabsTrigger>
          <TabsTrigger value="discounts"><Percent className="w-4 h-4 mr-2" />Discounts</TabsTrigger>
        </TabsList>

        {/* School Info */}
        <TabsContent value="school">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>School Name (English)</Label>
                <Input value={settings.schoolName} onChange={(e) => handleSettingChange('schoolName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>School Name (Arabic)</Label>
                <Input value={settings.schoolNameArabic} onChange={(e) => handleSettingChange('schoolNameArabic', e.target.value)} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>School Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Academic Year */}
        <TabsContent value="academic">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Academic Year Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Current School Year</Label>
                <Input value={settings.schoolYear} onChange={(e) => handleSettingChange('schoolYear', e.target.value)} placeholder="2024-2025" />
              </div>
              <div className="space-y-2">
                <Label>Year Start Date</Label>
                <Input type="date" value={settings.yearStartDate} onChange={(e) => handleSettingChange('yearStartDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Year End Date</Label>
                <Input type="date" value={settings.yearEndDate} onChange={(e) => handleSettingChange('yearEndDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Due Day</Label>
                <Select value={settings.monthlyDueDay.toString()} onValueChange={(v) => handleSettingChange('monthlyDueDay', parseInt(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 5, 10, 15, 20, 25].map(d => (<SelectItem key={d} value={d.toString()}>{d}th of month</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-between p-4 bg-amber/10 border border-amber/30 rounded">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber" />
                <div>
                  <p className="font-medium">Year Rollover</p>
                  <p className="text-sm text-muted-foreground">Update fee structures for new academic year</p>
                </div>
              </div>
              <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4" />Initiate Rollover</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Levels & Classes */}
        <TabsContent value="levels">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Levels</h3>
                <Button variant="enterprise" size="sm"><Plus className="w-4 h-4" />Add Level</Button>
              </div>
              <div className="space-y-2">
                {levels.map(level => (
                  <div key={level.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Switch checked={level.isActive} />
                      <span className="font-medium">{level.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Classes</h3>
                <Button variant="enterprise" size="sm"><Plus className="w-4 h-4" />Add Class</Button>
              </div>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Level</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => {
                    const level = levels.find(l => l.id === cls.levelId);
                    return (
                      <tr key={cls.id}>
                        <td className="font-medium">{cls.name}</td>
                        <td>{level?.name}</td>
                        <td>{cls.capacity}</td>
                        <td><Switch checked={cls.isActive} /></td>
                        <td>
                          <Button variant="ghost" size="xs">Edit</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        </TabsContent>

        {/* Transport */}
        <TabsContent value="transport">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Transport Lines</h3>
              <Button variant="enterprise" size="sm"><Plus className="w-4 h-4" />Add Transport Line</Button>
            </div>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Start Location</th>
                  <th>End Location</th>
                  <th className="text-right">Fee (AED)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transportLines.map(line => (
                  <tr key={line.id}>
                    <td className="font-medium">{line.name}</td>
                    <td>{line.startLocation}</td>
                    <td>{line.endLocation}</td>
                    <td className="text-right font-mono">{line.fee.toLocaleString()}</td>
                    <td><Switch checked={line.isActive} /></td>
                    <td><Button variant="ghost" size="xs">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        {/* Fee Structures */}
        <TabsContent value="fees">
          <Card>
            <div className="data-card-header flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fee Structures</h3>
              <Button variant="enterprise" size="sm">Add Fee Type</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Fee Name</th>
                    <th>Type</th>
                    <th>Applicable Levels</th>
                    <th>Due Day</th>
                    <th className="text-right">Amount (AED)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructures.map((fee) => (
                    <tr key={fee.id}>
                      <td className="font-medium">{fee.name}</td>
                      <td>
                        <span className={`status-badge ${fee.type === 'mandatory' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          {fee.type}
                        </span>
                      </td>
                      <td>{fee.grade === 'all' ? 'All Levels' : fee.grade}</td>
                      <td>{fee.dueDay ? `${fee.dueDay}th` : '-'}</td>
                      <td className="text-right font-mono">{fee.amount.toLocaleString()}</td>
                      <td><Button variant="ghost" size="xs">Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Discount Types</h3>
              <Button variant="enterprise" size="sm"><Plus className="w-4 h-4" />Add Discount</Button>
            </div>
            <div className="space-y-4">
              {discounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-4 border border-border rounded">
                  <div className="flex items-center gap-4">
                    <Switch checked={discount.isActive} />
                    <div>
                      <p className="font-medium">{discount.name}</p>
                      <p className="text-sm text-muted-foreground">{discount.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applies to: {discount.applicableFees.length} fee type(s) • 
                        Type: <span className="capitalize">{discount.type}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={discount.value}
                      className="w-20 h-8 text-right font-mono"
                    />
                    <span className="text-sm text-muted-foreground">{discount.type === 'percentage' ? '%' : 'AED'}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

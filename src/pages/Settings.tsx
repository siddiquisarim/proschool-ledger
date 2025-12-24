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
} from 'lucide-react';
import { mockSettings, mockFeeStructures } from '@/data/mockData';

export function SettingsPage() {
  const { t } = useApp();
  const [settings, setSettings] = useState(mockSettings);
  const [feeStructures, setFeeStructures] = useState(mockFeeStructures);

  const handleSettingChange = (key: keyof typeof settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.settings')}</h1>
          <p className="text-sm text-muted-foreground">
            Configure school settings, fee structures, and system preferences
          </p>
        </div>
        <Button variant="enterprise" size="sm">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school">
            <Building2 className="w-4 h-4 mr-2" />
            School Info
          </TabsTrigger>
          <TabsTrigger value="academic">
            <Calendar className="w-4 h-4 mr-2" />
            Academic Year
          </TabsTrigger>
          <TabsTrigger value="fees">
            <DollarSign className="w-4 h-4 mr-2" />
            Fee Structures
          </TabsTrigger>
          <TabsTrigger value="discounts">
            <Percent className="w-4 h-4 mr-2" />
            Discount Types
          </TabsTrigger>
        </TabsList>

        {/* School Info */}
        <TabsContent value="school">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>School Name (English)</Label>
                <Input
                  value={settings.schoolName}
                  onChange={(e) => handleSettingChange('schoolName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>School Name (Arabic)</Label>
                <Input
                  value={settings.schoolNameArabic}
                  onChange={(e) => handleSettingChange('schoolNameArabic', e.target.value)}
                  dir="rtl"
                />
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
                <Input
                  value={settings.schoolYear}
                  onChange={(e) => handleSettingChange('schoolYear', e.target.value)}
                  placeholder="2024-2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Year Start Date</Label>
                <Input
                  type="date"
                  value={settings.yearStartDate}
                  onChange={(e) => handleSettingChange('yearStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Year End Date</Label>
                <Input
                  type="date"
                  value={settings.yearEndDate}
                  onChange={(e) => handleSettingChange('yearEndDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Due Day</Label>
                <Select
                  value={settings.monthlyDueDay.toString()}
                  onValueChange={(v) => handleSettingChange('monthlyDueDay', parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 5, 10, 15, 20, 25].map(d => (
                      <SelectItem key={d} value={d.toString()}>{d}th of month</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pre-pay Threshold Day</Label>
                <Select
                  value={settings.prepayThreshold.toString()}
                  onValueChange={(v) => handleSettingChange('prepayThreshold', parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25].map(d => (
                      <SelectItem key={d} value={d.toString()}>After {d}th</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Payments made after this day will pre-pay next month's fee
                </p>
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
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
                Initiate Rollover
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Fee Structures */}
        <TabsContent value="fees">
          <Card>
            <div className="data-card-header flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fee Structures</h3>
              <Button variant="enterprise" size="sm">
                Add Fee Type
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Fee Name</th>
                    <th>Type</th>
                    <th>Applicable Grades</th>
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
                      <td>{fee.grade === 'all' ? 'All Grades' : fee.grade}</td>
                      <td>{fee.dueDay ? `${fee.dueDay}th` : '-'}</td>
                      <td className="text-right font-mono">{fee.amount.toLocaleString()}</td>
                      <td>
                        <Button variant="ghost" size="xs">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Discount Types */}
        <TabsContent value="discounts">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Discount Types</h3>
            <div className="space-y-4">
              {[
                { id: 'sibling', name: 'Sibling Discount', value: 10, description: 'Applied to second child and beyond' },
                { id: 'staff', name: 'Staff Discount', value: 25, description: 'For children of school employees' },
                { id: 'scholarship', name: 'Scholarship', value: 50, description: 'Merit-based financial aid' },
              ].map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-4 border border-border rounded">
                  <div className="flex items-center gap-4">
                    <Switch defaultChecked />
                    <div>
                      <p className="font-medium">{discount.name}</p>
                      <p className="text-sm text-muted-foreground">{discount.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={discount.value}
                      className="w-20 h-8 text-right font-mono"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Add Custom Discount Type
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

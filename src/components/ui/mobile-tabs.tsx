import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TabOption {
  value: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface MobileTabsProps {
  tabs: TabOption[];
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function MobileTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: MobileTabsProps) {
  const isMobile = useIsMobile();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  
  const currentValue = value ?? internalValue;
  
  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue>
              {(() => {
                const tab = tabs.find(t => t.value === currentValue);
                return tab ? (
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge}
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                <span className="flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Render children and find matching TabsContent */}
        <div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === TabsContent) {
              if (child.props.value === currentValue) {
                return child.props.children;
              }
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={defaultValue}
      value={currentValue}
      onValueChange={handleChange}
      className={cn("space-y-4", className)}
    >
      <TabsList className="inline-flex w-auto gap-1 flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-2 text-sm"
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent } from "@/components/ui/tabs";

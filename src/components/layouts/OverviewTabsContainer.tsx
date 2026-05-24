import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface OverviewTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: ReactNode;
  description?: string;
}

interface OverviewTabsContainerProps {
  tabs: OverviewTab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function OverviewTabsContainer({
  tabs,
  defaultTab,
  onTabChange,
  className = '',
}: OverviewTabsContainerProps) {
  const defaultTabId = defaultTab || tabs[0]?.id || 'overview';

  return (
    <Tabs
      defaultValue={defaultTabId}
      onValueChange={(value) => onTabChange?.(value)}
      className={`w-full ${className}`}
    >
      <TabsList className="grid w-full gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="relative flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 hover:text-slate-900"
          >
            {tab.icon && <span className="inline-block">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6 space-y-4">
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="outline-none"
          >
            {tab.description && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">{tab.description}</p>
              </div>
            )}
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

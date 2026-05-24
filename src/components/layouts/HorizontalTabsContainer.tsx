import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface HorizontalTab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  description?: string;
  content: ReactNode;
}

interface HorizontalTabsContainerProps {
  tabs: HorizontalTab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'compact';
}

export const HorizontalTabsContainer: React.FC<HorizontalTabsContainerProps> = ({
  tabs,
  defaultTab = tabs[0]?.id,
  onTabChange,
  variant = 'default',
}) => {
  return (
    <div className="w-full">
      <Tabs 
        defaultValue={defaultTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        {/* Tab List - Horizontal Row Layout */}
        <TabsList 
          className={`grid w-full gap-0 bg-transparent border-b border-slate-200 rounded-none h-auto p-0 ${
            variant === 'compact' ? 'gap-2' : 'gap-4'
          }`}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-none
                border-b-2 border-transparent
                text-slate-600 hover:text-slate-900 hover:bg-slate-50/50
                data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-indigo-50/30
                transition-all duration-200 font-medium text-sm
                ${variant === 'compact' ? 'px-3 py-2 text-xs' : ''}
              `}
            >
              {tab.icon && (
                <span className={`${variant === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  bg-indigo-100 text-indigo-700
                  ${variant === 'compact' ? 'px-1.5 py-0 text-[10px]' : ''}
                `}>
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        <div className="w-full pt-6">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="outline-none mt-0 animate-in fade-in duration-200"
            >
              <div className="space-y-6">
                {tab.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tab.description}
                  </p>
                )}
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface HorizontalTab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  description?: string;
  content: ReactNode;
  tone?: 'indigo' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'teal' | 'slate';
}

interface HorizontalTabsContainerProps {
  tabs: HorizontalTab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'compact';
}

const tabToneClasses: Record<NonNullable<HorizontalTab['tone']>, { active: string; badge: string }> = {
  indigo: {
    active: 'data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-indigo-50/40',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  blue: {
    active: 'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50/50',
    badge: 'bg-blue-100 text-blue-700',
  },
  emerald: {
    active: 'data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:bg-emerald-50/50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  amber: {
    active: 'data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50/60',
    badge: 'bg-amber-100 text-amber-700',
  },
  rose: {
    active: 'data-[state=active]:border-rose-500 data-[state=active]:text-rose-700 data-[state=active]:bg-rose-50/50',
    badge: 'bg-rose-100 text-rose-700',
  },
  violet: {
    active: 'data-[state=active]:border-violet-600 data-[state=active]:text-violet-700 data-[state=active]:bg-violet-50/50',
    badge: 'bg-violet-100 text-violet-700',
  },
  teal: {
    active: 'data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:bg-teal-50/50',
    badge: 'bg-teal-100 text-teal-700',
  },
  slate: {
    active: 'data-[state=active]:border-slate-700 data-[state=active]:text-slate-800 data-[state=active]:bg-slate-100/70',
    badge: 'bg-slate-200 text-slate-700',
  },
};

export const HorizontalTabsContainer: React.FC<HorizontalTabsContainerProps> = ({
  tabs,
  defaultTab = tabs[0]?.id,
  activeTab,
  onTabChange,
  variant = 'default',
}) => {
  return (
    <div className="w-full">
      <Tabs 
        value={activeTab}
        defaultValue={activeTab ? undefined : defaultTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        {/* Tab List - Horizontal Row Layout */}
        <TabsList 
          className={`flex w-full items-center justify-start overflow-x-auto bg-transparent border-b border-slate-200 rounded-none h-auto p-0 ${
            variant === 'compact' ? 'gap-2' : 'gap-4'
          }`}
        >
          {tabs.map((tab) => {
            const tone = tabToneClasses[tab.tone || 'indigo'];

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`
                  flex shrink-0 items-center gap-2 px-4 py-3 rounded-none
                  border-b-2 border-transparent
                  text-slate-600 hover:text-slate-900 hover:bg-slate-50/50
                  ${tone.active}
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
                    ${tone.badge}
                    ${variant === 'compact' ? 'px-1.5 py-0 text-[10px]' : ''}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
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

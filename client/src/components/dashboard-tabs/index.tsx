'use client';

import type React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User } from '@/types/dashboard';
import { coachTabs, parentTabs } from '@/constants/dashboard';

interface DesktopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  children: React.ReactNode;
}

export function DesktopTabs({
  activeTab,
  onTabChange,
  user,
  children,
}: DesktopTabsProps) {
  const tabs = user.role === 'coach' ? coachTabs : parentTabs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="space-y-6 pt-5"
      >
        <TabsList className="hidden md:grid w-full grid-cols-5 bg-white">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
            !bg-white gap-2 mx-1 border-1 !border-primary
            data-[state=active]:!bg-primary 
            data-[state=active]:text-white 
            data-[state=active]:shadow-md
          "
            >
              <h6>{tab.label}</h6>
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}

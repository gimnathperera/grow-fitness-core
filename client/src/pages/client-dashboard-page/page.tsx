'use client';

import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsGrid } from '@/components/stat-grid';
import { DesktopTabs } from '@/components/dashboard-tabs/index.tsx';
import { MobileTabNav } from '@/components/footer-tab-navbar';
import {
  OverviewTab,
  ScheduleTab,
  ProgressTab,
  AchievementsTab,
  MessagesTab,
} from './components';
import type { User as UserType, DashboardStats } from '@/types/dashboard';
import type { ChildData } from './types';

const user: UserType = { name: 'Emma Johnson', role: 'parent' };

const childData: ChildData = {
  name: 'Emma Johnson',
  age: 8,
  coach: 'Coach Sarah',
  totalSessions: 24,
  achievements: 5,
  progress: 75,
};

const stats: DashboardStats = {
  totalChildren: 1,
  todaySessions: 1,
  upcomingSessions: 2,
  weeklyProgress: 75,
  avgProgress: 75,
};

const tabsConfig = [
  {
    value: 'overview',
    component: <OverviewTab childData={childData} />,
  },
  {
    value: 'schedule',
    component: <ScheduleTab />,
  },
  {
    value: 'progress',
    component: <ProgressTab />,
  },
  {
    value: 'achievements',
    component: <AchievementsTab />,
  },
  {
    value: 'messages',
    component: <MessagesTab />,
  },
];

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <StatsGrid stats={stats} user={user} />

      <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} user={user}>
        <Tabs value={activeTab}>
          {tabsConfig.map(({ value, component }) => (
            <TabsContent
              key={value}
              value={value}
              className="space-y-6 pb-20 md:pb-6"
            >
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </DesktopTabs>

      <MobileTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      />
    </div>
  );
}

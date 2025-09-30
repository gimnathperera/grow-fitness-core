import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsGrid } from '@/components/stat-grid';
import { DesktopTabs } from '@/components/dashboard-tabs/index.tsx';
import { OverviewTab } from '@/pages/coach-dashboard/components/overview-tab';
import { MobileTabNav } from '@/components/footer-tab-navbar';
import StudentsTab from './students-tab';
import ScheduleTab from './schedule-tab';
import ProgressTab from './progress-tab';
import MessagesTab from './message-tab';
import { sessions, stats, students } from '@/data/coach/coach-dashboard';
import type { User } from '@/types/dashboard';

const user: User = { name: 'Sarah Johnson', role: 'coach' };

const tabsConfig = [
  {
    value: 'overview',
    component: <OverviewTab user={user} sessions={sessions} />,
  },
  { value: 'students', component: <StudentsTab students={students} /> },
  { value: 'schedule', component: <ScheduleTab /> },
  { value: 'progress', component: <ProgressTab students={students} /> },
  { value: 'messages', component: <MessagesTab /> },
];

export default function CoachDashboard() {
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

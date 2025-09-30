'use client';

import type { User as UserType } from '@/types/dashboard';
import { coachTabs, parentTabs } from '@/constants/dashboard';
import { FloatingDock } from '@/components/ui/floating-dock';

interface MobileTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserType;
}

export function MobileTabNav({
  activeTab,
  onTabChange,
  user,
}: MobileTabNavProps) {
  const tabs = user.role === 'coach' ? coachTabs : parentTabs;

  // Convert tabs to the format expected by Floating Dock
  const dockItems = tabs.map(tab => ({
    title: tab.label,
    icon: <tab.icon className="h-5 w-5" />,
    href: `#${tab.id}`,
    id: tab.id,
  }));

  // Handle tab changes
  const handleItemClick = (item: {
    title: string;
    href?: string;
    id?: string;
  }) => {
    if (item.id) {
      onTabChange(item.id);
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock
        items={dockItems}
        mobileClassName=""
        desktopClassName=""
        onItemClick={handleItemClick}
        activeTab={activeTab}
      />
    </div>
  );
}
